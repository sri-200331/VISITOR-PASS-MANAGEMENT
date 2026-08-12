import { useState } from "react";
import { Navigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, UsersRound, Clock3, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { user, login } = useAuth();
  const [email, setEmail] = useState("admin@visitorpass.com");
  const [password, setPassword] = useState("Admin@123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault(); setError(""); setLoading(true);
    try {
       await login(email, password);
   } catch (err) {
     setError(err.response?.data?.message || "Unable to sign in");
   }
    finally { setLoading(false); }
  }

  return(
   <div className="login-page">
    <section className="login-visual">
      <div className="visual-orb orb-one"></div>
      <div className="visual-orb orb-two"></div>
      <div className="visual-inner">
        <div className="brand light">
          <div className="brand-mark">VP</div>
          <div><strong>VisitorPass</strong><small>Smart access suite</small></div>
        </div>
        <div className="hero-copy">
           <span className="pill">NEXT-GEN VISITOR CONTROL</span>
           <h2>Welcome guests.<br/><em>Protect what matters.</em></h2>
           <p>A streamlined visitor journey from request to approval, check-in and checkout — all in one elegant workspace.</p>
        </div>
        <div className="feature-row">
          <span><CheckCircle2/> Approval workflow</span>
          <span><Clock3/> Live visit status</span>
          <span><UsersRound/> Role-based access</span>
        </div>
      </div>
    </section>
    <section className="login-panel">
      <form onSubmit={submit} className="login-card">
        <div className="mobile-logo">
          <ShieldCheck size={30}/>
        </div>
        <div className="eyebrow">SECURE PORTAL</div>
          <h1>Sign in to your workspace</h1>
          <p className="muted">Use your account to continue.</p>
        <label>
          Email
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@company.com"/>
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
        </label>
        {error && <div className="error-box">{error}</div>}
        <button className="primary-btn" disabled={loading}>
          {loading ? "Signing in..." : <>Continue <ArrowRight size={18}/></>}
        </button>
        <div className="demo-box">
          <strong>Assessment demo</strong>
          <span>admin@visitorpass.com / Admin@123</span>
          <span>reception@visitorpass.com / Reception@123</span>
          <span>employee@visitorpass.com / Employee@123</span>
        </div>
      </form>
    </section>
  </div>
  )
}
