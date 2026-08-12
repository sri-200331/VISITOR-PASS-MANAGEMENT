import { useEffect, useState } from "react";
import { ArrowRight, UserRoundPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const nav=useNavigate(); 
  const [employees,setEmployees]=useState([]); 
  const [msg,setMsg]=useState("");
   const [error,setError]=useState("");
  const [form,setForm]=useState(
    {name:"",email:"",phone:"",company:"",employee:"",visitDate:"",expectedArrival:"",purpose:""}
  );

  useEffect(()=>{
    api.get("/users")
    .catch(()=>{})
    .then(r=>r && setEmployees(r.data||[]))
  },[]);
  const change=e=>
    setForm(
     {...form,[e.target.name]:e.target.value});
  async function submit(e){
    e.preventDefault();
    setError("");
    setMsg("");
    try{
      await api.post("/visitors",form);
      setMsg("Visitor request created successfully.");
      setForm(
        {name:"",email:"",phone:"",company:"",employee:"",visitDate:"",expectedArrival:"",purpose:""}
      );
    }catch(err){
      setError(err.response?.data?.message||"Unable to register visitor");
    }
  }
  return(
   <div className="form-page">
    <div className="page-intro">
      <div className="page-icon">
        <UserRoundPlus/>
      </div>
      <div>
        <span className="eyebrow">NEW VISITOR</span>
        <h2>Create a visit request</h2>
        <p>Capture visitor details and route the request to an employee for approval.</p>
      </div>
    </div>
    <form className="panel form-panel" onSubmit={submit}>
      <div className="form-grid">

      {["name","email","phone","company"].map((x)=>
      <label key={x}>{x==="name"?"Visitor name":x[0].toUpperCase()+x.slice(1)}{x==="email"?"":""}
         <input required={x!=="email"} name={x} value={form[x]} onChange={change} placeholder={x==="phone"?"10-digit phone":`Enter ${x}`}/>
      </label>)}
      <label>
        Employee to visit
        <select required name="employee" value={form.employee} onChange={change}>
          <option value="">Select employee</option>
          {employees.filter(x=>x.role==="employee").map(x=>
          <option key={x._id} value={x._id}>{x.name} — {x.department}</option>)}
        </select>
      </label>

      <label>
        Visit date
        <input required type="date" name="visitDate" value={form.visitDate} onChange={change}/>
      </label>
      <label>
        Expected arrival
        <input required type="time" name="expectedArrival" value={form.expectedArrival} onChange={change}/>
      </label>
      <label className="full">
        Purpose of visit<textarea required name="purpose" value={form.purpose} onChange={change} placeholder="Briefly describe the purpose"></textarea>
      </label>
    </div>
    {error&&<div className="error-box">{error}</div>}
    {msg&&<div className="success-box">{msg}</div>}
    <div className="form-actions">
      <button type="button" className="secondary-btn" onClick={()=>nav("/visitors")}>View history</button>
      <button className="primary-btn">Create request <ArrowRight size={17}/></button>
    </div>
  </form>
  </div>
  )
}
