import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EmployeeProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state;

  const [formData, setFormData] = useState({ ...employee });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!employee) {
    return <p className="text-center text-danger">Employee not found</p>;
  }

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save updated employee details to database
  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await axios.put(
        `http://localhost:4000/owner-api/employees/${formData.id}`, // API Endpoint
        formData
      );
      setMessage("Employee details updated successfully!");
      setIsEditing(false);
    } catch (error) {
      setMessage("Error updating employee details. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="m-2">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h3>Employee Profile</h3>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}

          {/* Personal Details */}
          <h5 className="text-primary">Personal Details</h5>
          <div className="row">
            <div className="col-md-6">
              <strong>Name:</strong>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <strong>Email:</strong>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <strong>Aadhar:</strong>
              <input
                type="text"
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <strong>PAN:</strong>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
          <hr />

          {/* Employment Details */}
          <h5 className="text-primary">Employment Details</h5>
          <div className="row">
            <div className="col-md-6">
              <strong>Cluster:</strong>
              <input
                type="text"
                name="cluster"
                value={formData.cluster}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <strong>Service Center:</strong>
              <input
                type="text"
                name="serviceCenter"
                value={formData.serviceCenter}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <strong>Daily Wage:</strong>
              <input
                type="number"
                name="dailyWage"
                value={formData.dailyWage}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <strong>Status:</strong>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <hr />

          {/* Bank Details */}
          <h5 className="text-primary">Bank Details</h5>
          <div className="row">
            <div className="col-md-6">
              <strong>Account Number:</strong>
              <input
                type="text"
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <strong>Bank Name:</strong>
              <input
                type="text"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
            <div className="col-md-6">
              <strong>IFSC Code:</strong>
              <input
                type="text"
                name="ifsc"
                value={formData.ifsc}
                onChange={handleChange}
                className="form-control"
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        <div className="card-footer text-center">
          {!isEditing ? (
            <button className="btn btn-warning" onClick={() => setIsEditing(true)}>Edit</button>
          ) : (
            <>
              <button className="btn btn-success" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button className="btn btn-secondary ms-2" onClick={() => setIsEditing(false)}>Cancel</button>
            </>
          )}
          <button className="btn btn-danger ms-3" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
