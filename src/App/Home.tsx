import React from "react";
import { Link } from "react-router-dom";

export default function App() {
  const [companyList, setCompanyList] = React.useState([]);
  const [searchList, setSearchList] = React.useState([]);
  const [searchText, setSearchText] = React.useState('');

  React.useEffect(() => {
    fetch('http://localhost:3000/company.json')
      .then(res => res.json())
      .then(data => {
        setCompanyList(data);
        setSearchList(data);
      });
  }, []);

  const handleSearch = (e: any) => {
    e.preventDefault();
    const searchResult = companyList.filter((item: any) => {
      return item.name.toLowerCase().includes(searchText) || item.from.toLowerCase().includes(searchText);
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
        <h1>Company list</h1>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Address</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {searchList.map((item: any) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>
                  <Link to={`/company/${item.id}`}>{item.name}</Link>
                </td>
                <td>{item.from}</td>
                <td>{item.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  )
}