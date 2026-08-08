import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Visitors from "./pages/Visitors";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import Activity from "./pages/Activity";

export default function App(){return <AuthProvider><BrowserRouter><Routes><Route path="/login" element={<Login/>}/><Route element={<ProtectedRoute/>}><Route element={<Layout/>}><Route path="/" element={<Dashboard/>}/><Route path="/visitors" element={<Visitors/>}/><Route element={<ProtectedRoute roles={["receptionist"]}/>}><Route path="/register" element={<Register/>}/></Route><Route element={<ProtectedRoute roles={["admin"]}/>}><Route path="/users" element={<Users/>}/><Route path="/reports" element={<Reports/>}/><Route path="/activity" element={<Activity/>}/></Route></Route></Route></Routes></BrowserRouter></AuthProvider>}
