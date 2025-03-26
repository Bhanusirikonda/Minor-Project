import React, { useState, useEffect ,useRef} from 'react';
import { useNavigate, Link, redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

function EmployeeDetails() {
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
      const [empList, setEmpList] = useState(
          JSON.parse(localStorage.getItem('empList')) || []
        );

        const detailsForm = useForm();
            const tableRef = useRef(null); // ✅ Define the table reference
            
            
            const { register, handleSubmit, formState: { errors }, reset , watch } = useForm();
            const [serviceCenters, setServiceCenters] = useState([]);
            const [selectedCluster,setCluster]=useState('')
            const clusterData = Object.keys(data)
            useEffect(() => {
                if (selectedCluster) {
                setServiceCenters(data[selectedCluster])
                }
            }, [selectedCluster]);
            
        useEffect(() => {
          localStorage.setItem('empList', JSON.stringify(empList));
          }, [empList]);


    const fetchEmployees = async (data) => {
    try {
      const res = await axios.post('http://localhost:4000/owner-api/employeedetails/',data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Pass token for authentication
        },
      });
      setEmpList(res.data.payload);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // const exportToExcel = () => {
  //     const table = tableRef.current;
  //     if (!table) return; // Ensure the table exists
    
  //     // Clone the table and remove the last column (Profile column)
  //     const tableClone = table.cloneNode(true);
  //     const rows = tableClone.querySelectorAll('tr');
      
  //     rows.forEach(row => {
  //       const lastCell = row.querySelector('td:last-child, th:last-child');
  //       if (lastCell) {
  //         lastCell.remove(); // Remove last column (Profile column)
  //       }
  //     });
    
  //     // Convert the modified table to worksheet
  //     const ws = XLSX.utils.table_to_sheet(tableClone);
    
  //     // Create a new workbook and append the worksheet
  //     const wb = XLSX.utils.book_new();
  //     XLSX.utils.book_append_sheet(wb, ws, "Employee Data");
    
  //     // Write the Excel file as a binary string
  //     const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    
  //     // Convert it to a Blob and trigger download
  //     const dataBlob = new Blob([excelBuffer], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });
    
  //     saveAs(dataBlob, "employee_data.xlsx");
  //   };
  
  //   // Function to Export to PDF
  //   const exportToPDF = () => {
  //     const doc = new jsPDF({
  //       orientation: "landscape", // Use landscape for better width
  //       unit: "mm",
  //       format: "a2", // Use A2 for a bigger page size (Can change to 'a1' if needed)
  //     });
  //     doc.text("Employee Details", 20, 10);
  
  //     const tableColumn = [
  //       "Name", "ID", "Cluster", "Service Center", "Daily Wage", "No of Days Present", "Total Wages",
  //       "Basic", "Others", "Gross Wages", "PF", "ESIC", "Net Wages", "PF Emper", "ESIC Emp", "Total Cost",
  //       "Service Charge", "Total Charges"
  //     ];
  
  //     const tableRows = empList.map(emp => {
  //       // Calculations
  //       const total_wages = Math.round(emp.dailyWage * emp.daysPresent);
  //       const basic = Math.round((emp.basic / 30) * emp.daysPresent);
  //       const others = Math.round(total_wages - basic);
  //       const pf = Math.round((basic * 12) / 100);
  //       const esic = Math.round((total_wages * 0.75) / 100);
  //       const net_wages = Math.round(total_wages - pf - esic);
  //       const pf_emper = Math.round((basic * 13) / 100);
  //       const esic_emp = Math.round((total_wages * 3.25) / 100);
  //       const total_cost = Math.round(total_wages + pf_emper + esic_emp);
  //       const service_charge = Math.round((total_cost * 6) / 100);
  //       const total_charges = Math.round(total_cost + service_charge);
  
  //       return [
  //         emp.name, emp.id, emp.cluster, emp.serviceCenter, emp.dailyWage, emp.daysPresent, total_wages,
  //         basic, others, total_wages, pf, esic, net_wages, pf_emper, esic_emp, total_cost,
  //         service_charge, total_charges
  //       ];
  //     });
  
  //     doc.autoTable({
  //       head: [tableColumn],
  //       body: tableRows,
  //       startY: 20,
  //     });
  
  
  //     doc.save("employees.pdf");
  //   };

  return (
    <div className="container p-4 min-vh-100" >
        <div className="d-flex justify-content-between align-items-center mb-4">
             <h2 className="text-center mb-4">Employee Details </h2>
            
              <button
                className="btn btn-danger"
                onClick={() => navigate(-1)}
              >
                ✕
              </button>
          </div>
          <form onSubmit={detailsForm.handleSubmit(fetchEmployees)} >
            <div className="row g-3 align-items-center">
              <div className="col-md-3">
                <label className="form-label">Select Cluster:</label>
                <select className="form-select" {...detailsForm.register("cluster")} onChange={(e) => setCluster(e.target.value)}
                > 
                  <option value="" selected disabled>-- Select a Cluster --</option>
                  {clusterData.map((clusterName, index) => {
                    return (
                      <option key={index} value={clusterName}>
                        {clusterName}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Select Service Center:</label>
                <select className="form-select" {...detailsForm.register("serviceCenter")} disabled={!serviceCenters.length}>
                  <option value="" selected disabled>-- Select a Service Center --</option>
                  {serviceCenters.map((serviceCenter, index) => (
                    <option key={index} value={serviceCenter}>
                      {serviceCenter}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label">Select Type:</label>
                <select className="form-select" {...detailsForm.register("type")}>
                  <option value="" selected disabled>-- Select a Type --</option>
                  <option value="dlv">DLV</option>
                  <option value="deo">DEO</option>
                  <option value="hk">HK</option>
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Status:</label>
                <select className="form-select" {...detailsForm.register("status")}>
                  <option value="Active" selected>Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="all">All</option>
                </select>
              </div>

              {/* Input Box for Year */}
              
            </div>

            <div className="text-center mt-5">
              <button type="submit" className="btn btn-primary">Fetch Details</button>
            </div>
         </form>
        {empList.length>0 && (<div >
              <div className="mt-3" style={{ maxHeight: '600px', overflowX: 'auto' }}>
                <table ref={tableRef} className="table table-responsive table-striped table-hover table-light border-dark text-center" style={{ tableLayout: "fixed", width: "100%" }}>
                  {/* Sticky Table Header */}
                  <thead className="table-primary" style={{ position: 'sticky', top: 0 ,zIndex: 2 }}>
                    <tr>
                      <th style={{ width: "150px" }}>Name</th>
                      <th style={{ width: "150px" }}>ID</th>
                      <th style={{ width: "150px" }}>Cluster</th>
                      <th style={{ width: "150px" }}>Service Center</th>
                      <th style={{ width: "150px" }}>Type</th>
                      <th className="sticky-col" style={{ position: 'sticky', right: 0, width: "150px"}}>Profile</th> {/* Sticky last column */}
                    </tr>
                  </thead>

                  {/* Scrollable Table Body */}
                  <tbody >
                    {empList.map((emp) => {

                      return (
                        <tr key={emp.id} >
                          <td style={{ width: "150px" }}>{emp.name}</td>
                          <td style={{ width: "150px" }}>{emp.id}</td>
                          <td style={{ width: "150px" }}>{emp.cluster}</td>
                          <td style={{ width: "150px" }}>{emp.serviceCenter}</td>
                          <td style={{ width: "150px" }}>{emp.type}</td>

                          {/* Sticky Last Column (Profile Button) */}
                          <td className="sticky-col" style={{ position: 'sticky', right: 0}}>
                            <button
                              className="btn btn-primary"
                              onClick={() => navigate(`/employee/${emp.id}`, { state: emp })}
                              style={{ cursor: 'pointer' }}
                            >
                              Profile
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
                  {/* <button onClick={exportToExcel} style={{ margin: "10px", padding: "10px", cursor: "pointer" }} className='bg-success'>
                    Download Excel
                  </button>
                  <button onClick={exportToPDF} style={{ margin: "10px", padding: "10px", cursor: "pointer" }} className='bg-danger'>
                    Download PDF
                  </button> */}
              </div>
      )}
        </div>
  )
}

export default EmployeeDetails