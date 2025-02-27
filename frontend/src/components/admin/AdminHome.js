import React, { act, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx"; // Import xlsx library
import axios from "axios";
import "./AdminHome.css"; // Import the custom CSS

const AdminHome = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [msg, setMsg] = useState("");
  const [ownersList, setOwnersList] = useState([]);
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };
  // Handle form submission
  async function onRegistration(ownerObj) {
    let result = await axios.post(
      "http://localhost:4000/admin-api/ownerregistration",
      ownerObj
    );

    if (result.data.message === "owner created") {
      alert("Owner created successfully");
      reset();
    } else {
      setMsg(result.data.message);
    }
  }

  async function getOwners() {
    let res = await axios.get("http://localhost:4000/admin-api/owners");
    setOwnersList(res.data.payload);
  }

  const handleLogout = () => {
    navigate("/");
  };

  

  const renderContent = () => {
    if (activeTab === "dashboard") {
      return <h2>Welcome to the Admin Dashboard!</h2>;
    }
    if (activeTab === "registration") {
      return (
        <form className="mt-3" onSubmit={handleSubmit(onRegistration)}>
          <h4>Register a New Owner</h4>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input type="text" id="name" className="form-control" placeholder="Enter Ownername" required {...register("name")} />
          </div>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">ID</label>
            <input type="text" id="id" className="form-control" placeholder="Enter id" required {...register("id")} />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input type="email" id="email" className="form-control" placeholder="Enter email" required {...register("email")} />
          </div>
          <div className="mb-3">
            <label className="form-label">Cluster</label>
            <select className="form-select" {...register("cluster", { required: "Cluster is required" })}>
              <option value="" disabled selected>Select Cluster</option>
              <option value="cluster 1">1</option>
              <option value="cluster 2">2</option>
              <option value="cluster 3">3</option>
            </select>
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input type="password" id="password" className="form-control" placeholder="Enter password" required {...register("password")} />
          </div>
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
      );
    }
    if(activeTab==="owners"){
      getOwners();
      return (
        <div className="table-responsive-sm">
          {
            <table className="table table-stripped table-hover table-light text-center">
              <thead>
                <tr className="table-primary">
                  <th>Name</th>
                  <th>Id</th>
                  <th>Email</th>
                  <th>Cluster</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {ownersList.map((owner, index) => (
                  <tr key={index}>
                    <td>{owner.name}</td>
                    <td>{owner.id}</td>
                    <td>{owner.email}</td>
                    <td>{owner.cluster}</td>
                    <td>
                      <button className="btn btn-danger p-2">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
        </div>
      );
    }

  };

  return (
    <div className="container mt-4">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid text-dark">
          <a className="navbar-brand" href="#!">Admin Panel</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className={`nav-link btn ${activeTab === "dashboard" ? "active" : ""}`} onClick={() => setActiveTab("dashboard")}>Dashboard</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn ${activeTab === "registration" ? "active" : ""}`} onClick={() => setActiveTab("registration")}>Registration</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn ${activeTab === "owners" ? "active" : ""}`} onClick={() => setActiveTab("owners")}>Owners</button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link btn ${activeTab === 'registration' ? 'active' : ''}`}
                  onClick={() => navigate('/employeeRegistration')}
                >
                  Employee Registration
                </button>
              </li>
            </ul>
            <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>

      <div className="dynamic-content">{renderContent()}</div>
    </div>
  );
};

export default AdminHome;
