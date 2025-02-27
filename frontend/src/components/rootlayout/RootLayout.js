import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './RootLayout.css';

const RootLayout = () => {
  return (
    <div className="body min-vh-100 d-flex flex-column">
      {/* Header */}
      <header className="py-4  text-white mb-4">
        <div className="container">
          <h1 className="text-center display-4 fw-bold mb-2">AS HRM SERVICES</h1>
          <p className="text-center lead mb-0">BLUE DART EXPRESS LTD-HYDERABAD</p>
        </div>
      </header>

      {/* Navigation */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow mb-4">
        <div className="">
          <button 
            className="navbar-toggler mx-auto"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav gap-3">
              <li className="nav-item">
                <Link className="nav-link" to="/ownerLogin">
                  <button className="btn btn-primary opacity-75 btn-lg px-4 shadow-sm">
                    Owner Portal
                  </button>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/operatorLogin">
                  <button className="btn btn-danger opacity-75 btn-lg px-4 shadow-sm">
                    Operator Portal
                  </button>
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/adminLogin">
                  <button className="btn btn-success opacity-75 btn-lg px-4 shadow-sm">
                    Admin Portal
                  </button>
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
      <footer className="py-3  text-white mt-auto">
        <div className="container">
          <p className="text-center mb-0">© 2025 AS HRM Services. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;