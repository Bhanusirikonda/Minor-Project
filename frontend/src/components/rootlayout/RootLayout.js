import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './RootLayout.css';

const RootLayout = () => {
  return (
    <div className="body min-vh-100 d-flex flex-column">
      {/* Header */}
     

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
      <div className="container-fluid">
        {/* Branding */}
        <Link className="navbar-brand fw-bold" to="/">
          Employee Management
        </Link>

        {/* Toggler Button for Mobile */}
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

        {/* Navbar Links */}
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav d-flex align-items-center gap-3">
            <li className="nav-item">
              <Link className="nav-link" to="/ownerLogin">
                <button className="btn  btn-lg px-4 shadow-sm">Owner Portal</button>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/operatorLogin">
                <button className="btn  btn-lg px-4 shadow-sm">Operator Portal</button>
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/adminLogin">
                <button className="btn  btn-lg px-4 shadow-sm">Admin Portal</button>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>

      {/* Main Content */}
      <main className=" flex-grow-1 mb-4">
          <Outlet />
      </main>

      {/* Footer */}
      
    </div>
  );
};

export default RootLayout;