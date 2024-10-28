// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import HomePage from "./Home";
import AboutUs from "./AboutUs/AboutUs";
import Navbar from "./components/Navbar";
import Pricing from "./PricingPage/Pricing";
import Contact from "./ContactPage/Contact";
import SignIn from "./Registeration/Sign";
import SignUp from "./Registeration/Signup";
import Articles from "./Articles/Articles";
import Dashboard from "./ProfileDashboard/ProfileDashboard";
import AdminDashboard from "./Admin/AdminDashboard";

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
            <Route path="pricing" element={<Pricing />} />
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="contact" element={<Contact />} />
            <Route path="dashboard" element={<Dashboard />} />

            {/* Nested Routes for Articles */}
            <Route path="articles/*" element={<Articles />} />

            {/* Redirect any unknown routes to the HomePage */}
            <Route path="*" element={<Navigate to="/" replace />} />

            {/*/Admin Route*/}
            <Route path="admin" element={<AdminDashboard/>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
