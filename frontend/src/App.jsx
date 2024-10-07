import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Home";
import AboutUs from "./AboutUs/AboutUs";
import Navbar from "./components/Navbar";
import Pricing from "./PricingPage/Pricing";
import Contact from "./ContactPage/Contact";
import SignIn from "./Registeration/Sign";
import ProfilePage from "./Profile/Profile";
import FinanceTracker from "./FinanceTracker/FinanceTracker";
import SignUp from "./Registeration/Signup";
import Articles from "./Articles/Articles";
import CreatePost from "./Articles/CreatePost";
import EditPost from "./Articles/EditPost";
import AdminDashboard from "./admin/homePage";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="signin" element={<SignIn />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="finance" element={<FinanceTracker />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="articles" element={<Articles />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="edit-post/:id" element={<EditPost />} />

          <Route path="/dashboard" element={<AdminDashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
