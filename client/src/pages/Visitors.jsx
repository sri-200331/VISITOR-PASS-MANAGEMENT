import { useEffect, useState } from "react";
import { Search, RefreshCcw, Check, X, LogIn, LogOut, Ban, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import StatusBadge from "../components/StatusBadge";

export default function Visitors(){
  const {user}=useAuth();
   const [rows,setRows]=useState([]);
    const [search,setSearch]=useState(""); 
    const [status,setStatus]=useState("");
    const [date,setDate]=useState(""); 
    const [error,setError]=useState("");
    const [showForm, setShowForm] = useState(false);

const [employees, setEmployees] = useState([]);

const [form, setForm] = useState({
  name: "",
  email: "",
  phone: "",
  company: "",
  employee: "",
  visitDate: "",
  expectedArrival: "",
  purpose: ""
});

  async function loadEmployees() {
  try {
    const response = await api.get("/users");

    const employeeUsers = response.data.filter(
      user => user.role === "employee"
    );

    setEmployees(employeeUsers);
  } catch (error) {
    console.error("Employee loading error:", error);
  }
}

  async function load(){
    try{
      const r=await api.get("/visitors",{params:{search,status,date}});
      setRows(r.data)
    }catch(e){
      setError(e.response?.data?.message||"Unable to load visitors")
    }
  
  }
  useEffect(()=>{
    load();
    loadEmployees();
  },[status,date]);

  async function action(id,type){
    setError("");
    try{
      await api.patch(`/visitors/${id}/${type}`,
         type==="reject"||type==="approve"?{remarks: type==="reject"?"Not approved at this time":"Approved"}:{});
        load()
    }catch(e)
    {setError(
      e.response?.data?.message||"Action failed")
    }
  }
function handleChange(e) {
  setForm({
    ...form,
    [e.target.name]: e.target.value
  });
}

async function createVisitor(e) {
  e.preventDefault();

  setError("");

  try {
    await api.post("/visitors", form);

    alert("Visitor registered successfully!");

    setForm({
      name: "",
      email: "",
      phone: "",
      company: "",
      employee: "",
      visitDate: "",
      expectedArrival: "",
      purpose: ""
    });

    setShowForm(false);

    load();

  } catch (error) {
    console.error("Create visitor error:", error);

    setError(
      error.response?.data?.message ||
      "Unable to register visitor"
    );
  }
}

  return (
  <div>
    <div className="toolbar">
      <div>
      <span className="eyebrow">VISITOR DIRECTORY</span>
      <h2>{user.role==="employee"?"Requests awaiting your decision":"Visitor records"}</h2>
      </div>
      
        <div className="action-row">

  {user.role === "receptionist" && (
    <button
      className="primary-btn"
      onClick={() => setShowForm(!showForm)}
    >
      <Plus size={17} />
      Add Visitor
    </button>
  )}

  <button className="secondary-btn" onClick={load}>
    <RefreshCcw size={17}/>
    Refresh
  </button>

</div>
  </div>
  {showForm && user.role === "receptionist" && (
  <div className="panel visitor-form">

    <h3>Register New Visitor</h3>

    <form onSubmit={createVisitor}>

      <div className="form-grid">

        <div>
          <label>Visitor Name *</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter visitor name"
            required
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter email"
          />
        </div>

        <div>
          <label>Phone *</label>

          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            required
          />
        </div>

      

        <div>
          <label>Visit Date *</label>

          <input
            type="date"
            name="visitDate"
            value={form.visitDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Expected Arrival *</label>

          <input
            type="time"
            name="expectedArrival"
            value={form.expectedArrival}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Purpose *</label>

          <input
            type="text"
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            placeholder="Meeting / Interview / Delivery..."
            required
          />
        </div>

      </div>

      <div className="form-buttons">

        <button
          type="button"
          className="secondary-btn"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-btn"
        >
          Register Visitor
        </button>

      </div>

    </form>

  </div>
)}
    <div className="filters panel">
      <div className="search">
        <Search size={18}/>
        <input placeholder="Search visitor, phone or employee..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&load()}/>
      </div>
      
      <select value={status} onChange={e=>setStatus(e.target.value)}>
        <option value="">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="checked-in">Checked In</option>
        <option value="checked-out">Checked Out</option>
        <option value="rejected">Rejected</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <input type="date" value={date} onChange={e=>setDate(e.target.value)}/>
      <button className="primary-btn compact" onClick={load}>Search</button>
    </div>
    {error&&<div className="error-box">{error}</div>}

    <div className="panel table-wrap">
      <table>
        <thead>
          <tr>
            <th>Visitor</th>
            <th>Employee</th>
            <th>Schedule</th>
            <th>Purpose</th>
            <th>Status</th>
            <th>Actions</th>
            </tr>
        </thead>
        <tbody>
          {rows.map(v=><tr key={v._id}>
            <td>
              <strong>{v.name}</strong><small>{v.phone}{v.company&&` · ${v.company}`}</small>
            </td>
            <td>{v.employee?.name}<small>{v.employee?.department}</small></td>
            <td>{v.visitDate}<small>{v.expectedArrival}</small></td>
            <td className="purpose">{v.purpose}</td>
            <td><StatusBadge status={v.status}/></td>
            <td>
              <div className="action-row">
                {user.role==="employee"&&v.status==="pending"&&
                <>
                <button className="action approve" title="Approve" onClick={()=>action(v._id,"approve")}><Check/></button>
                <button className="action reject" title="Reject" onClick={()=>action(v._id,"reject")}><X/></button>
                </>
                }
                {user.role==="receptionist"&&v.status==="approved"&&
                <button className="action approve" title="Check in" onClick={()=>action(v._id,"check-in")}><LogIn/></button>
                }
                {user.role==="receptionist"&&v.status==="checked-in"&&
                <button className="action warn" title="Check out" onClick={()=>action(v._id,"check-out")}><LogOut/></button>
                }
                {(user.role==="receptionist"||user.role==="admin")&&["pending","approved"].includes(v.status)&&
                <button className="action reject" title="Cancel" onClick={()=>action(v._id,"cancel")}><Ban/></button>
                }
    </div>
    </td>
    </tr>)}
   </tbody>
</table>
 {rows.length===0&&
 <div className="empty">No visitor records match your filters.</div>}
</div>
</div>
)
}
