from fastapi import FastAPI, HTTPException
from datetime import timedelta
import redis
import uuid

app = FastAPI()
r = redis.Redis()

HOLD_TTL = 300  # 5 minutes


from fastapi import FastAPI
import redis

app = FastAPI()
r = redis.Redis()


@app.get("/shows/{show_id}/availability")
def get_availability(show_id: str):

    # 1. Get seats from database
    all_seats = db.query("""
        SELECT id, seat_number
        FROM seats
        WHERE show_id = :show_id
    """)

    # 2. Get BOOKED seats from database
    booked = db.query("""
        SELECT seat_id
        FROM tickets
        WHERE show_id = :show_id
    """)

    booked_ids = {row.seat_id for row in booked}

    # 3. Get HELD seats from Redis
    held_keys = r.keys(f"seat:{show_id}:*")
    held_ids = {
        key.decode().split(":")[2]
        for key in held_keys
    }

    # 4. get AVAILABLE seats
    available = []
    for seat in all_seats:
        if seat.id not in booked_ids and seat.id not in held_ids:
            available.append(seat)

    # 5. Return seat map
    return {
        "show_id": show_id,
        "available_seats": available
    }


@app.post("/seats/hold")
def hold_seats(request: HoldRequest):
    # request: {show_id, seat_ids, user_id}

    hold_id = str(uuid.uuid4())
    redis_key = f"hold:{hold_id}"

    # 1. Try lock each seat atomically
    for seat_id in request.seat_ids:
        seat_key = f"seat:{request.show_id}:{seat_id}"

        # SETNX = set if not exists
        success = r.set(seat_key, hold_id, nx=True, ex=HOLD_TTL)

        if not success:
            # rollback already held seats
            for seat_id in seat_ids:
                seat_key = f"seat:{show_id}:{seat_id}"
                if r.get(seat_key) == hold_id:
                    r.delete(seat_key)
            raise HTTPException(409, "Seat not available")

    # 2. Store hold metadata
    r.hset(redis_key, mapping={
        "user_id": request.user_id,
        "show_id": request.show_id
    })
    r.expire(redis_key, HOLD_TTL)

    # 3. Return hold info
    return {
        "hold_id": hold_id,
        "expires_in": HOLD_TTL
    }


@app.post("/seats/confirm")
def confirm_seats(hold_id: str, order_id: str):

    redis_key = f"hold:{hold_id}"
    if not r.exists(redis_key):
        raise HTTPException(410, "Hold expired")

    show_id = r.hget(redis_key, "show_id")

    # 1. Write to database (final booking)
    db.transaction():
        seats = db.query("SELECT * FROM seats FOR UPDATE ...")
        mark seats as BOOKED with order_id

    # 2. Remove redis locks
    seat_keys = r.keys(f"seat:{show_id}:*")
    for k in seat_keys:
        if r.get(k) == hold_id:
            r.delete(k)

    r.delete(redis_key)

    return {"status": "confirmed"}
