import React, { act, useState ,useEffect} from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as XLSX from "xlsx"; // Import xlsx library
import axios from "axios";
import "./AdminHome.css"; // Import the custom CSS
import { User, UserCircle } from "lucide-react";

const AdminHome = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm();
  const [msg, setMsg] = useState("");
  const [ownersList, setOwnersList] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);


  // Close sidebar when clicking outside on small screens
  useEffect(() => {
    const handleResize = () => {
      const largeScreen = window.innerWidth >= 992;
      setIsLargeScreen(largeScreen);
      
      // If transitioning to large screen, ensure sidebar is open
      if (largeScreen) {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on initial load
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleOverlayClick = () => {
    if (!isLargeScreen) {
      setIsSidebarOpen(false);
    }
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
      return <h2 className="ml-5">Welcome to the Admin Dashboard!</h2>;
    }
    if (activeTab === "registration") {
      return (
        <form className="mt-3 w-50 m-auto" onSubmit={handleSubmit(onRegistration)}>
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
                </tr>
              </thead>

              <tbody>
                {ownersList.map((owner, index) => (
                  <tr key={index}>
                    <td>{owner.name}</td>
                    <td>{owner.id}</td>
                    <td>{owner.email}</td>
                    
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
    <div className="d-flex position-relative" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* Toggle Button - only visible on small screens when sidebar is closed */}
      {!isLargeScreen && !isSidebarOpen && (
        <button
          className="btn btn-light position-absolute m-2"
          onClick={() => setIsSidebarOpen(true)}
          style={{ zIndex: 1100 }}
          aria-label="Open navigation"
        >
          ☰
        </button>
      )}

      {/* Overlay for mobile - closes sidebar when clicking outside */}
      {isSidebarOpen && !isLargeScreen && (
        <div 
          className="position-fixed" 
          style={{ 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            backgroundColor: 'rgba(0,0,0,0.4)', 
            zIndex: 900 
          }}
          onClick={handleOverlayClick}
        />
      )}

      {/* Sidebar - fixed height to fit between existing header and footer */}
      <div
        id="sidebar"
        className={`bg-light shadow ${isLargeScreen ? 'd-block' : 'd-block position-fixed'}`}
        style={{
          width: '300px',
          height: isLargeScreen ? '100%' : '100vh',
          zIndex: 1000,
          top: isLargeScreen ? 'auto' : '0',
          left: 0,
          transition: 'transform 0.3s ease-in-out',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          overflowY: 'auto'
        }}
      >
        <div className="p-3 d-flex flex-column min-vh-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="text-dark m-0"><UserCircle size={32} className="mb-2" />Admin Panel</h4>
            
            {/* Close Button - only visible on small screens when sidebar is open */}
            {!isLargeScreen && (
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => setIsSidebarOpen(false)}
                aria-label="Close navigation"
              >
                ✕
              </button>
            )}
          </div>
          
          <div className="mb-auto">
            <button
              className={`btn text-start w-100 mb-2 ${activeTab === "dashboard" ? "btn-primary" : "btn-light"}`}
              onClick={() => setActiveTab("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`btn text-start w-100 mb-2 ${activeTab === "registration" ? "btn-primary" : "btn-light"}`}
              onClick={() => setActiveTab("registration")}
            >
              Registration
            </button>
            <button
              className={`btn text-start w-100 mb-2 ${activeTab === "owners" ? "btn-primary" : "btn-light"}`}
              onClick={() => setActiveTab("owners")}
            >
              Owners
            </button>
            <button
              className={`btn text-start w-100 mb-2 ${activeTab === "employeeRegistration" ? "btn-primary" : "btn-light"}`}
              onClick={() => navigate("/employeeRegistration")}
            >
              Employee Registration
            </button>
            <button
              className={`btn text-start w-100 mb-2 ${activeTab === "employeeDetails" ? "btn-primary" : "btn-light"}`}
              onClick={() => navigate("/employeeDetails")}
            >
              Employee Details
            </button>
          </div>
          
          <button className="btn btn-danger mt-auto" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div 
        className="flex-grow-1 p-4" 
        style={{ 
          marginLeft: isLargeScreen ? '10px' : '10px',
          width: isLargeScreen ? 'calc(100% - 300px)' : '100%',
          transition: 'margin 0.3s ease-in-out'
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminHome;
