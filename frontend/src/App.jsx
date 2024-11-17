// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from "./context/authContext";
import HomePage from "./Home";
import AboutUs from "./AboutUs/AboutUs";
import Navbar from "./components/Navbar";
import Contact from "./ContactPage/Contact";
import SignIn from "./Registeration/Sign";
import SignUp from "./Registeration/Signup";
import Articles from "./Articles/Articles";
import AdminDashboard from "./Admin/AdminDashboard";
import Dashboard from "./ProfileDashboard/Dashboard/Dashboard";
import Feedback from "./Feedback/Feedback";

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* Top-Level Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="about" element={<AboutUs />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="contact" element={<Contact />} />
            <Route path="dashboard" element={<Dashboard/>} />
            <Route path="feedback" element={<Feedback/>} />

            {/* Nested Routes for Articles */}
            <Route path="articles/*" element={<Articles />} />

            {/* Admin Route */}
            <Route path="admin" element={<AdminDashboard/>}/>

            {/* Redirect any unknown routes to the HomePage */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <ToastContainer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;