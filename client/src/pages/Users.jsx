import { useEffect, useState } from "react";
import StatusBadge from "../components/StatusBadge";
import api from "../services/api";

export default function Users(){
 const [rows,setRows]=useState([]);
 const [form,setForm]=useState({
    name:"",
    email:"",
    password:"" ,
    role:"employee",
    department:""});
    const [msg,setMsg]=useState("");
    const [error,setError]=useState("");
 async function load(){
    const r=await api.get("/users");
    setRows(r.data)}
    
useEffect(()=>{load()},[]);
 async function submit(e){
    e.preventDefault();
    setMsg("");
    setError("");
    try{
        await api.post("/users",form);
    setMsg("User account created.");
    setForm({name:"",email:"",password:"",role:"employee",department:""});
    load()}catch(e){
        setError(e.response?.data?.message||"Unable to create user")
    }}
 return (
 <div>
    <div className="toolbar">
        <div>
         <span className="eyebrow">ADMINISTRATION</span>
         <h2>User accounts</h2>
         <p className="muted">Manage the people who can access VisitorPass.</p>
        </div>
    </div>
    <div className="admin-grid">
        <form className="panel form-panel" onSubmit={submit}>
            <h3>Create account</h3>
            <label>Name
                <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            </label>
            <label>Email
                <input required type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
            </label>
            <label>Temporary password
                <input required value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
            </label>
            <label>Role
                <select value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                <option value="employee">Employee</option>
                <option value="receptionist">Receptionist</option>
                <option value="admin">Administrator</option>
                </select>
            </label>
            <label>Department
                <input value={form.department} onChange={e=>setForm({...form,department:e.target.value})}/>
                
            </label>
                {error&&<div className="error-box">{error}</div>}
                {msg&&<div className="success-box">{msg}</div>}
                <button className="primary-btn">Create account</button>
        </form>
             <div className="panel table-wrap">
                    <h3>Active directory</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th>Department</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map(x=><tr key={x._id}>
                                <td><strong>{x.name}</strong><small>{x.email}</small></td>
                                <td>
                                  <StatusBadge status={x.role}/>
                                </td>
                                <td>{x.department||"—"}</td></tr>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
)
}
