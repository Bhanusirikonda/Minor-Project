import React, { useState  } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
const OperatorRegister = () => {
  let [msg, setMsg] = useState("");
  let {
        register,handleSubmit,
        formState: { errors },
      } = useForm();

  const navigate = useNavigate();

  async function onRegister(operatorCred){

    let result= await axios.post("https://ashrmservices.onrender.com/operator-api/register",operatorCred)
    if(result.data.message==="register success"){
      navigate('/operatorLogin');
    }else{
    setMsg(result.data.message)
    }
  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: '24rem' }}>
        <h3 className="text-center mb-4">Operator Register</h3>
        <form onSubmit={handleSubmit(onRegister)}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              required
              {...register("name")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="id" className="form-label">Employee ID</label>
            <input
              type="text"
              id="id"
              className="form-control"
              required
              {...register("id")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              required
              {...register("password")}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="form-control"
              required
              {...register("confirmPassword")}
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
        {<p className='text-danger'>{msg}</p>}
        <div className="mt-3 text-center">
          <p>
            Already have an account? <a href="/operatorLogin">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OperatorRegister;
