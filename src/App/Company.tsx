import React from "react";
import { Link, useParams } from "react-router-dom";

export default function Company() {
  const { id } = useParams();
  const [employeeList, setEmployeeList] = React.useState([]);
  const [searchList, setSearchList] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    fetch('http://localhost:3000/employee.json')
      .then(res => res.json())
      .then(data => {
        const employeeData = data.filter((item: any) => item.companyId == id);
        setEmployeeList(employeeData);
        setSearchList(employeeData);
      });
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    const searchResult = employeeList.filter((item: any) => {
      return item.first_name.toLowerCase().includes(searchText) || item.email.toLowerCase().includes(searchText);
    });
    setSearchList(searchResult);
  }

  return (
    <>
      <nav className="navbar navbar-expand-sm bg-dark navbar-dark">
        <a className="navbar-brand" href="/">Cong ty TNHH Van Khanh</a>

        <form onSubmit={handleSearch}>
          <input type="text" onChange={(e) => setSearchText(e.target.value)} />
          <button type="submit">Search</button>
        </form>
      </nav>

      <main className="container mt-3">
        <h1>Employee list</h1>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Email</th>
              <th>Gender</th>
            </tr>
          </thead>
          <tbody>
            {searchList.map((item: any) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    <Link to={`/employee/${item.id}`}>{item.first_name}</Link>
                  </td>
                  <td>{item.email}</td>
                  <td>{item.gender}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </main>
    </>
  )
}