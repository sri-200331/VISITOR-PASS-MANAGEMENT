import { useEffect,useState } from "react";
import api from "../services/api";
export default function Activity(){
    const [rows,setRows]=useState([]);
    useEffect(()=>{
        api.get("/activity")
        .then(r=>setRows(r.data))
    },[]);
    return(
     <div>
        <div className="toolbar">
            <div>
                <span className="eyebrow">AUDIT TRAIL</span>
                <h2>Activity history</h2>
                <p className="muted">Every visitor workflow action is recorded with its actor and timestamp.</p>
            </div>
        </div>
        <div className="panel table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Visitor</th>
                        <th>Performed by</th>
                        <th>Date & time</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(x=><tr key={x._id}>
                    <td>
                        <StatusBadge status={x.action.toLowerCase().replaceAll(" ","-")}/>
                    </td>
                    <td>{x.visitor?.name}<small>{x.visitor?.visitDate}</small></td>
                    <td>{x.performedBy?.name}<small>{x.performedBy?.role}</small></td>
                    <td>{new Date(x.createdAt).toLocaleString()}</td>
                    <td>{x.details||"—"}</td>
                    </tr>)}
                </tbody>
            </table>
        </div>
    </div>
)    
}
