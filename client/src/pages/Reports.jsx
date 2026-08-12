import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../services/api";
export default function Reports(){
 const today=new Date().toISOString().slice(0,10);
 const [from,setFrom]=useState(today);
 const [to,setTo]=useState(today);
 const [data,setData]=useState({stats:{},rows:[]});

 async function load(){
    const r=await api.get("/reports",{params:{from,to}});
    setData(r.data)} useEffect(()=>{load()

    },[]);
 const chart=Object.entries(data.stats).map(([name,value])=>({name,value}));
 return (
 <div>
    <div className="toolbar"><div>
        <span className="eyebrow">INSIGHTS</span>
        <h2>Visitor reports</h2>
        <p className="muted">Understand visit volume and outcomes for any date range.</p>
    </div>
 </div>
 <div className="filters panel">
    <label>From
        <input type="date" value={from} onChange={e=>setFrom(e.target.value)}/>
    </label>
    <label>To
        <input type="date" value={to} onChange={e=>setTo(e.target.value)}/>
    </label>
    <button className="primary-btn compact" onClick={load}>Generate report</button>
    
 </div>
 <div className="report-grid">
    <div className="panel chart-panel">
        <h3>Visit outcomes</h3>
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chart}>
                <XAxis dataKey="name"/>
                <YAxis allowDecimals={false}/>
                <Tooltip/><Bar dataKey="value"/>
            </BarChart>
        </ResponsiveContainer>
    </div>
    <div className="panel stat-report">
        <h3>Summary</h3>
        {Object.entries(data.stats).map(([k,v])=>
        <div key={k}>
            <span>{k.replace(/([A-Z])/g," $1")}</span>
            <strong>{v}</strong></div>)}
        </div>
    </div>
</div>

)
}
