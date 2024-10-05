import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './Home';
import AboutUs from './AboutUs/AboutUs';
import Navbar from './components/Navbar';
import Pricing from './PricingPage/Pricing';
import Contact from './ContactPage/Contact';
import SignIn from './Registeration/Sign'; 
import ProfilePage from './Profile/Profile';
import FinanceTracker from './FinanceTracker/FinanceTracker';
import SignUp from './Registeration/Signup';
import Dashboard from './dashboard/Dashboard';
import AddExpense from './dashboard/addExpense';
import AddGoal from './dashboard/addGoal';

function App() {
  const [count, setCount] = useState(0);

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
          <Route path='profile' element={<ProfilePage />} />
          <Route path='finance' element ={<FinanceTracker/>} />
          <Route path='signup' element={<SignUp />} />
          <Route path='dashboard' element={<Dashboard />} />
          <Route path='addexpense' element={<AddExpense />} />
          <Route path='addGoal' element={<AddGoal />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
