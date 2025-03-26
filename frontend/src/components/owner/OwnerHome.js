import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { resetState } from '../redux/slices/ownerSlice';

import { User, UserCircle } from "lucide-react";

const OwnerHome = () => {
  const data={
    "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam"],
    "Bihar": ["Araria", "Aurangabad", "Begusarai", "Bhagalpur", "Bhojpur", "Darbhanga", "Gaya", "Muzaffarpur", "Patna", "Purnia"],
    "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Banaskantha", "Bharuch", "Bhavnagar", "Dahod", "Gandhinagar", "Jamnagar", "Junagadh"],
    "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikballapur", "Chikkamagaluru", "Dakshina Kannada"],
    "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad"],
    "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur"],
    "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Chandrapur", "Dhule", "Gadchiroli", "Gondia"],
    "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam"],
    "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram"],
    "Uttar Pradesh": ["Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich"]
  }
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentOwner, loginOwnerStatus } = useSelector((state) => state.ownerLoginReducer);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

  const [activeTab, setActiveTab] = useState(
    localStorage.getItem('activeTab') || 'dashboard'
  );
  const [empList, setEmpList] = useState(
    JSON.parse(localStorage.getItem('empList')) || []
  );

 
  

  useEffect(() => {
    if (!loginOwnerStatus) {
      navigate('/'); // Redirect to login if user is not authenticated
    }
  }, [loginOwnerStatus, navigate]);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('empList', JSON.stringify(empList));
  }, [empList]);

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


  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('activeTab');
    localStorage.removeItem('empList');
    localStorage.removeItem('selectedEmployee')
    dispatch(resetState());
    navigate('/ownerLogin');
  };

 

  

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return (
        <div>
          <h2>Welcome, {currentOwner.name}!</h2>
          <p className="text-muted">Here is your dashboard overview.</p>
        </div>
      );
    }
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Toggle Button for Sidebar - only visible on small screens when sidebar is closed */}
      {!isLargeScreen && !isSidebarOpen && (
        <button
          className="btn btn-light position-absolute m-2"
          onClick={() => setIsSidebarOpen(true)}
          style={{ zIndex: 1050 }}
          aria-label="Open navigation"
        >
          ☰
        </button>
      )}

      {/* Sidebar */}
      <div
        id="sidebar"
        className={`bg-light min-vh-100 shadow ${isLargeScreen ? 'd-block' : 'd-block position-fixed'}`}
        style={{
          width: '300px',
          zIndex: 1000,
          top: isLargeScreen ? 'auto' : '0',
          left: 0,
          transition: 'transform 0.3s ease-in-out',
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          overflowY: 'auto'
        }}
      >
        <div className="p-3 d-flex flex-column h-100">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="m-0"><UserCircle size={32} className="mb-2" />Owner Panel</h4>
            
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

          {/* User Profile */}
          
          {/* Navigation Links */}
          <ul className="nav flex-column mb-auto">
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn text-start w-100 ${activeTab === 'dashboard' ? 'active bg-primary text-white' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn text-start w-100 ${activeTab === 'registration' ? 'active bg-primary text-white' : ''}`}
                onClick={() => navigate('/employeeRegistration')}
              >
                Employee Registration
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn text-start w-100 ${activeTab === 'employeesalarydetails' ? 'active bg-primary text-white' : ''}`}
                onClick={() => navigate('/employeesalaryDetails')}
              >
                Employee Salary Details
              </button>
            </li>
            <li className="nav-item mb-2">
              <button
                className={`nav-link btn text-start w-100 ${activeTab === 'employeedetails' ? 'active bg-primary text-white' : ''}`}
                onClick={() => navigate('/employeeDetails')}
              >
                Employee Details
              </button>
            </li>
          </ul>
          
          {/* Logout Button at Bottom */}
          <button className="btn btn-danger mt-auto" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile - only when sidebar is open */}
      {!isLargeScreen && isSidebarOpen && (
        <div 
          className="position-fixed" 
          style={{ 
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.4)', 
            zIndex: 999 
          }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

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

export default OwnerHome;
