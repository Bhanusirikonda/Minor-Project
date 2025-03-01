import { useForm } from 'react-hook-form';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx"; // Import xlsx library
import { useNavigate, Link } from "react-router-dom";


const EmployeeRegistration = () => {
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
  const registrationForm = useForm();
    const navigate = useNavigate();
  
  const { register, handleSubmit, formState: { errors }, reset , watch } = useForm();
 const [serviceCenters, setServiceCenters] = useState([]);
  const [selectedCluster,setCluster]=useState('')
  const clusterData = Object.keys(data)
  useEffect(() => {
    if (selectedCluster) {
       setServiceCenters(data[selectedCluster])
    }
  }, [selectedCluster]);


  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const onRegistration = async (empObj) => {
    try {
      const res = await axios.post('http://localhost:4000/owner-api/addemployee', empObj, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (res.data.message === 'Employee registration success') {
         // Refresh the employee list
        reset(); // Reset form fields
      }
      alert(res.data.message)
    } catch (error) {
      alert('Error registering employee:', error);
    }
  };

  async function handleFileUpload() {
    if (!file){
      alert("Please select a file");
      return;
    } 
  
    const reader = new FileReader();
  
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
  
        // Read the first sheet
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
  
        // Convert sheet to array (first row as header)
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  
        if (rows.length < 2) {
          console.warn("Empty or invalid file structure.");
          return;
        }
  
        // Extract headers from the first row
        const headers = rows[0];
  
        // Map rows to objects using headers as keys
        const formattedData = rows.slice(1).map((row) => {
          let obj = {};
          headers.forEach((key, index) => {
            obj[key] = row[index] || "";
          });
          obj['status']="Active";
          return obj;
        });
  
        // Send data to the API
        const result = await axios.post(
          "http://localhost:4000/admin-api/employees",
          formattedData
        );
        alert(result.data.message);
      } catch (error) {
        console.error("Error processing file:", error);
      }
    };
  
    reader.readAsArrayBuffer(file);
  }

  return (
    < div className='  bg-secondary-subtle'>
        <div className=" d-flex justify-content-center align-items-center min-vh-100 ">
        <div className="card shadow-lg p-4 border-0 rounded">
      <form onSubmit={registrationForm.handleSubmit(onRegistration)} className="bg-blue p-4 rounded shadow-lg w-100">
      <div className="d-flex justify-content-between align-items-center mb-4">
             <h2 className="text-center mb-4">Register a New Employee</h2>
            
              <button
                className="btn btn-danger"
                onClick={() => navigate(-1)}
              >
                ✕
              </button>
          </div>
        
        {/* Employee Details */}
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Employee ID</label>
            <input type="text" className="form-control" placeholder="Enter Employee ID" {...registrationForm.register("id", { required: "Employee ID is required" })} />
            {errors.id && <div className="text-danger">{errors.id.message}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Employee Name</label>
            <input type="text" className="form-control" placeholder="Enter Employee Name" {...registrationForm.register("name", { required: "Employee name is required" })} />
            {errors.name && <div className="text-danger">{errors.name.message}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter Email" {...registrationForm.register("email", { required: "Email is required" })} />
            {errors.email && <div className="text-danger">{errors.email.message}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Date of Joining</label>
            <input type="date" className="form-control" {...registrationForm.register("dateOfJoining", { required: "Date of joining is required" })} />
            {errors.dateOfJoining && <div className="text-danger">{errors.dateOfJoining.message}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Aadhar Number</label>
            <input type="number" className="form-control" placeholder="Enter Aadhar Number" maxLength={12}  {...registrationForm.register("aadhar", { required: "Aadhar number is required" ,pattern: {
                value: /^[0-9]{12}$/,
                 message: "Aadhar number must be exactly 12 digits"
              }
              })} />
            {errors.aadhar && <div className="text-danger">{errors.aadhar.message}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">PAN Number</label>
            <input type="text" className="form-control" placeholder="Enter PAN Number" {...registrationForm.register("pan", { required: "PAN number is required" })} />
            {errors.pan && <div className="text-danger">{errors.pan.message}</div>}
          </div>
        </div>
        
        {/* Account Details */}
        <fieldset className="border p-3 mt-4 rounded">
          <legend className="w-auto px-2">Account Details</legend>
          <div className="row g-3">
            <div className="col-md-4">
              <label className="form-label">Account Number</label>
              <input type="text" className="form-control" placeholder="Enter Account Number" {...registrationForm.register("accountNumber", { required: "Account number is required" })} />
              {errors.accountNumber && <div className="text-danger">{errors.accountNumber.message}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">Bank Name</label>
              <input type="text" className="form-control" placeholder="Enter Bank Name" {...registrationForm.register("bankName", { required: "Bank name is required" })} />
              {errors.bankName && <div className="text-danger">{errors.bankName.message}</div>}
            </div>
            <div className="col-md-4">
              <label className="form-label">IFSC Code</label>
              <input type="text" className="form-control" placeholder="Enter IFSC Code" {...registrationForm.register("ifsc", { required: "IFSC code is required" })} />
              {errors.ifsc && <div className="text-danger">{errors.ifsc.message}</div>}
            </div>
          </div>
        </fieldset>
        
        {/* Dropdowns */}
        <div className="row g-3 mt-3">

          <div className="col-md-6">
          <label className="form-label">Select Cluster:</label>
                <select className="form-select" {...registrationForm.register("cluster")} onChange={(e) => setCluster(e.target.value)} required
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

          <div className="col-md-6">
          <label className="form-label">Select Service Center:</label>
                <select className="form-select" {...registrationForm.register("serviceCenter")} required disabled={!serviceCenters.length}>
                  <option value="" selected disabled>-- Select a Service Center --</option>
                  {serviceCenters.map((serviceCenter, index) => (
                    <option key={index} value={serviceCenter}>
                      {serviceCenter}
                    </option>
                  ))}
                </select>
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Type</label>
            <select className="form-select" {...registrationForm.register("type", { required: "Type is required" })}>
              <option value="" disabled selected>Select Type</option>
              <option value="hk">HK</option>
              <option value="dlv">DLV</option>
              <option value="deo">DEO</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Daily wage</label>
            <input type="number" className="form-control" placeholder="Enter Daily wage" {...registrationForm.register("dailyWage", { required: "Daily wage is required" })} />
            {errors.dailyWage && <div className="text-danger">{errors.dailyWage.message}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Basic Salary</label>
            <input type="number" className="form-control" placeholder="Enter Basic" {...registrationForm.register("basic", { required: "Basic Salary is required" })} />
            {errors.basic && <div className="text-danger">{errors.basic.message}</div>}
          </div>
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="btn btn-primary w-100  m-auto mt-4 ">Register</button>
      </form>
    </div>
    </div>
    <div className="d-flex justify-content-center align-items-center vh-100" >
            <div
          className="border border-dashed p-4 text-center bg-white rounded-lg shadow-sm d-flex flex-column align-items-center justify-content-center"
          style={{ width: "400px", Height: "250px", borderColor: "#6c757d" }}
        >
          <h4 className="mb-3 text-secondary">Upload File</h4>

          <label
            className="btn btn-outline-primary btn-lg rounded-pill px-4 py-2 mb-3"
            style={{ cursor: "pointer", transition: "0.3s" }}
          >
            📂 Select File
            <input type="file" accept=".xlsx, .xls" className="d-none" onChange={handleFileChange} />
          </label>

          <button
            className="btn btn-primary rounded-pill px-4 py-2"
            onClick={handleFileUpload}
            style={{ transition: "0.3s" }}
          >
            🚀 Upload
          </button>
        </div>
      
    </div>
    </div>
  )
}

export default EmployeeRegistration