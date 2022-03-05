import React from "react";
import { useParams } from "react-router-dom";
import Navigation from "./Navigation";

export default function Employee() {
  const { id } = useParams();
  const [employeeData, setEmployeeData] = React.useState<any>(null);

  React.useEffect(() => {
    fetch('http://localhost:3000/employee.json')
      .then(res => res.json())
      .then(data => {
        const employee = data.filter((item: any) => item.id == id);
        setEmployeeData(employee[0]);
      });
  }, []);

  return (
    <>
      <Navigation />
      <main className="container mt-3">
        {employeeData && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div>
              <img src={employeeData.image} alt="" />
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <h3>Name: {employeeData.first_name} {employeeData.last_name}</h3>
              <h3>Email: {employeeData.email}</h3>
              <h3>Gender: {employeeData.gender}</h3>
            </div>
          </div>
        )}
      </main>
    </>
  )
}