import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { resetState } from '../redux/slices/operatorSlice';
import { User, UserCircle } from "lucide-react";

const OperatorHome = () => {

  const { currentOperator, loginOperatorStatus } = useSelector((state) => state.operatorLoginReducer);
  
  const [activeTab, setActiveTab] = useState(localStorage.getItem('activeTab') || 'dashboard');
  const [empList, setEmpList] = useState(
    JSON.parse(localStorage.getItem('empList')) || []
  );
   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  
  const [attendance, setAttendance] = useState({});
  const [AttendanceSummary,setAttendanceSummary]=useState({})
  const [selectedEmployee, setSelectedEmployee] = useState(
    JSON.parse(localStorage.getItem('selectedEmployee')) || null
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Function to fetch attendance
 
  useEffect(() => {
      if (!loginOperatorStatus) {
        navigate('/'); // Redirect to login if user is not authenticated
      }
    }, [loginOperatorStatus, navigate]);
  

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
    if (activeTab === 'attendance' && empList.length === 0) {
      fetchEmployees();
    }
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('empList', JSON.stringify(empList));
  }, [empList]);

  useEffect(() => {
    localStorage.setItem('selectedEmployee', JSON.stringify(selectedEmployee));
  }, [selectedEmployee]);


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

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`https://ashrmservices.onrender.com/operator-api/employeedetails/${currentOperator.serviceCenter
      }`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass token for authentication
        },
      });
      setEmpList(res.data.payload);
    } catch (error) {
      console.error("Error fetching employee data", error);
    }
  };

  const handleAttendanceChange = (id, value) => {
    // If checkbox is checked, status is "present", otherwise "absent"
    setAttendance({ ...attendance, [id]:value});
  };

  const submitAttendance = () => {
    const attendanceData = Object.keys(attendance).map((id) => ({
      id: id,
      month:parseInt(month, 10),
      year:parseInt(year, 10),
      noOfPresentDays: attendance[id],
    }));
    axios.post('https://ashrmservices.onrender.com/operator-api/employeeAttendance', attendanceData).then((res) => {
      alert(res.data.message);
      window.location.reload();
     });

    console.log(attendanceData)
  };

 
  const handleLogout = () => {
       
    localStorage.removeItem('token');
    localStorage.removeItem('activeTab');
    localStorage.removeItem('empList');
    localStorage.removeItem('selectedEmployee') // Clear data on logout
    dispatch(resetState());
    navigate('/operatorLogin');
  };

  const renderContent = () => {
    if (activeTab === 'dashboard') {
      return <h2>Welcome {currentOperator.name}</h2>;
    }

    if (activeTab === 'attendance') {
      return (
        <div className=" mt-4">
      
      <div className="d-flex align-items-center mb-3">
        <label className="me-2 fw-bold">Select Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="form-control me-3"
          style={{ width: "120px" }}
        />

        <label className="me-2 fw-bold">Select Month:</label>
        <select
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="form-select"
          style={{ width: "150px" }}
        >
          {[...Array(12)].map((_, index) => (
            <option key={index + 1} value={index + 1}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

        <div className='table-responsive-sm' style={{ maxHeight: '500px', overflowX: 'auto' }}>
          <table className='table table-stripped table-hover table-light text-center'>
            <thead style={{ position: 'sticky', top: 0 ,zIndex: 2 }}>
              <tr className='table-primary'>
                <th>Name</th>
                <th>Id</th>
                <th>Type</th>
                <th>Attendance</th>
                <th></th>
              </tr>
            </thead>
            <tbody className='text-center'>
              {empList.map((emp) => (
                <tr key={emp.id}>
                  <td>{emp.name}</td>
                  <td>{emp.id}</td>
                  <td>{emp.type}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control m-auto"
                      min="0"
                      value={attendance[emp.id] || ""}
                      onChange={(e) => handleAttendanceChange(emp.id, e.target.value)}
                      placeholder="Enter attendance"
                      style={{ width: "200px" }}
                    />
                  </td>
                  <td>
                    <button
                      className='btn btn-primary'
                      onClick={() => setSelectedEmployee(emp)}
                      style={{ cursor: 'pointer' }}
                    >
                      profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button onClick={submitAttendance} className="btn btn-primary m-auto mt-4">
            Submit Attendance
          </button>
        {selectedEmployee && (
            <div className='card mt-4'>
              <div className='card-header bg-primary text-white'>Employee Details</div>
              <div className='card-body'>
                <p><strong>Name:</strong> {selectedEmployee.name}</p>
                <p><strong>Id:</strong> {selectedEmployee.id}</p>
                <p><strong>Email:</strong> {selectedEmployee.email}</p>
                <p><strong>Cluster:</strong> {selectedEmployee.cluster}</p>
                <p><strong>Service Center:</strong> {selectedEmployee.serviceCenter}</p>
                <p><strong>Type:</strong> {selectedEmployee.type}</p>
              </div>
              <div className='card-footer'>
                <button className='btn btn-secondary' onClick={() => setSelectedEmployee(null)}>Close</button>
              </div>
            </div>
          )}
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
                <h4 className="m-0"><UserCircle size={32} className="mb-2" />Operator Panel</h4>
                
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
                    className={`nav-link btn text-start w-100 ${activeTab === 'attendance' ? 'active bg-primary text-white' : ''}`}
                    onClick={() => setActiveTab('attendance')}
                  >
                    Employee Attendance
                  </button>
                </li>
                <li>
                  <button className="btn btn-danger mt-auto" onClick={handleLogout}>
                  Logout
                </button>
                </li>
                
              </ul>
              
              {/* Logout Button at Bottom */}
              
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

export default OperatorHome;
