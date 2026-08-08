import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, UserPlus, ClipboardList, 
  BarChart3, Activity, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard, roles: ["admin", "receptionist", "employee"] },
    { to: "/visitors", label: "Visitors", icon: Users, roles: ["admin", "receptionist", "employee"] },
    { to: "/register", label: "Register Visitor", icon: UserPlus, roles: ["receptionist"] },
    { to: "/users", label: "User Accounts", icon: ShieldCheck, roles: ["admin"] },
    { to: "/reports", label: "Reports", icon: BarChart3, roles: ["admin"] },
    { to: "/activity", label: "Activity History", icon: Activity, roles: ["admin"] }
  ].filter(x => x.roles.includes(user.role));

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">VP</div>
        <div>
          <strong>VisitorPass</strong><small>Smart access suite</small>
        </div>
      </div>
      <nav>
        {links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === "/"}>
        <Icon size={18}/>
        <span>{label}</span>
        </NavLink>)}
      </nav>
      <div className="sidebar-bottom">
        <div className="secure">
          <ShieldCheck size={16}/>
          <span>Secure workspace</span>
        </div>
      </div>
    </aside>
    <main className="main">
      <header className="topbar">
        <div>
          <div className="eyebrow">Visitor operations</div>
          <h1>{links.find(l => location.pathname === l.to)?.label || "Dashboard"}</h1>
        </div>
        <div className="profile">
          <div className="avatar">{user.name.slice(0,1)}</div>
          <div>
            <strong>{user.name}</strong>
            <small>{user.role}</small>
          </div>
          <button className="icon-btn" title="Logout" onClick={() => { logout(); navigate("/login"); }}>
            <LogOut size={18}/>
          </button>
        </div>
      </header>
      <div className="content"><Outlet /></div>
    </main>
  </div>
}
