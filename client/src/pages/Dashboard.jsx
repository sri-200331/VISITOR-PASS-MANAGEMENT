import { useEffect, useState } from "react";
import { Clock3, Users, UserCheck, CalendarDays, ArrowUpRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth(); 
  const [d,setD]=useState({pending:0,todayVisitors:0,inside:0,employees:0,scheduled:0});
  useEffect(()=>{
    api.get("/dashboard")
    .then(r=>setD(r.data))
    .catch(console.error)},[]);
  const cards = [
    ["Pending Requests", d.pending, "Awaiting approval", Clock3],
    ["Today's Visitors", d.todayVisitors, "Visits scheduled today", CalendarDays],
    ["Currently Inside", d.inside, "Active checked-in", UserCheck],
    ["Total Employees", d.employees, "Active employee accounts", Users]
  ];
  return (
  <div>
    <div className="welcome">
      <div>
        <span className="pill soft">LIVE OVERVIEW</span>
        <h2>Good day, {user.name.split(" ")[0]} <span>✦</span></h2>
        <p>Here’s what’s happening across your visitor operations today.</p>
      </div>
      <Link className="primary-btn compact" to={user.role==="receptionist"?"/register":"/visitors"}>
        {user.role==="receptionist"?"Register visitor":"View visitors"} <ArrowUpRight size={17}/>
      </Link>
    </div>
    <div className="stats-grid">
      {cards.map(([title,val,sub,Icon])=>
         <div className="stat-card" key={title}>
          <div className="stat-icon">
            <Icon size={20}/>
          </div>
          <span>{title}</span>
          <strong>{val}</strong><small>{sub}</small>
          </div>)}
    </div>
    <div className="dashboard-grid">
      <div className="panel hero-panel">
        <div className="panel-head">
          <div>
            <span className="eyebrow">WORKFLOW</span>
            <h3>Visitor journey</h3>
          </div>
        </div>
        <div className="timeline">
          <div>
            <b>01</b>
            <span><strong>Request registered</strong><small>Reception creates the visit request.</small></span>
          </div>
          <div>
            <b>02</b>
            <span><strong>Employee decision</strong><small>Approve, reject or add remarks.</small></span>
          </div>
          <div>
            <b>03</b>
            <span><strong>Front desk check-in</strong><small>Only approved guests enter.</small></span>
          </div>
          <div>
            <b>04</b>
            <span><strong>Check-out & history</strong><small>Every action is audited.</small></span>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="panel-head">
          <div>
            <span className="eyebrow">QUICK STATS</span>
            <h3>Scheduled visits</h3>
          </div>
        </div>
        <div className="big-number">{d.scheduled}</div>
         <p className="muted">Approved visits from today onward.</p>
         <div className="mini-callout"><span>Access control</span><strong>Role protected</strong></div>
        </div>
    </div>
  </div>
  )
}
