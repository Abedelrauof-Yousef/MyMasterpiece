import React, { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  FileCheck,
  BarChart2,
  LogOut,
  Menu,
  X,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import UserManagement from "../Admin/UserManagement";
import PostApproval from "../Admin/PostApproval";
import ContactMessages from "../Admin/AdminContact";

// Custom Card Component
const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-md ${className}`}>{children}</div>
);

// Sample Data
const monthlyData = [
  { month: "Jan", expenses: 28000, income: 35000, profit: 7000 },
  { month: "Feb", expenses: 32000, income: 38000, profit: 6000 },
  { month: "Mar", expenses: 25000, income: 42000, profit: 17000 },
  { month: "Apr", expenses: 30000, income: 45000, profit: 15000 },
  { month: "May", expenses: 27000, income: 39000, profit: 12000 },
  { month: "Jun", expenses: 29000, income: 41000, profit: 12000 },
];

const categoryData = [
  { name: "Marketing", value: 35000, color: "#4f46e5" },
  { name: "Operations", value: 25000, color: "#06b6d4" },
  { name: "Development", value: 30000, color: "#8b5cf6" },
  { name: "Support", value: 15000, color: "#6366f1" },
];

const userActivityData = [
  { day: "Mon", active: 1200 },
  { day: "Tue", active: 1400 },
  { day: "Wed", active: 1800 },
  { day: "Thu", active: 1600 },
  { day: "Fri", active: 2000 },
  { day: "Sat", active: 1700 },
  { day: "Sun", active: 1300 },
];

const AdminDashboard = () => {
  const [activeMenu, setActiveMenu] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const StatCard = ({ title, value, change, icon: Icon, trend }) => (
    <Card className={`transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold">${value.toLocaleString()}</p>
            <div className="flex items-center space-x-1">
              {trend === 'up' ? (
                <ArrowUp className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-500" />
              )}
              <span className={`text-sm ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                {change}%
              </span>
            </div>
          </div>
          <div className="p-4 bg-blue-50 rounded-full">
            <Icon className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>
    </Card>
  );

  const Overview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={240000}
          change={12.5}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Total Expenses"
          value={171000}
          change={8.2}
          icon={Activity}
          trend="up"
        />
        <StatCard
          title="Net Profit"
          value={69000}
          change={15.3}
          icon={DollarSign}
          trend="up"
        />
        <StatCard
          title="Active Users"
          value={2845}
          change={4.1}
          icon={Users}
          trend="down"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className={`transition-all duration-500 delay-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Revenue vs Expenses</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="income" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.2} name="Revenue" />
                  <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} name="Expenses" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Budget Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className={`transition-all duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Monthly Profit Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="profit" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        <Card className={`transition-all duration-500 delay-400 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Daily User Activity</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={userActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="active" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const menuItems = [
    { id: "overview", label: "Overview", icon: <BarChart2 size={20} /> },
    { id: "users", label: "Users", icon: <Users size={20} /> },
    {
      id: "approvePosts",
      label: "Approve User's Posts",
      icon: <FileCheck size={20} />,
    },
    { id: "contactUs", label: "Contact Us", icon: <MessageSquare size={20} /> },
  ];

  const renderContent = () => {
    switch (activeMenu) {
      case "overview":
        return <Overview />;
      case "users":
        return <UserManagement />;
      case "approvePosts":
        return <PostApproval />;
      case "contactUs":
        return <ContactMessages />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white ${
          sidebarOpen ? "w-64" : "w-20"
        } transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between">
          <h2 className={`text-xl font-bold ${!sidebarOpen && "hidden"}`}>
            Admin Panel
          </h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-6 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveMenu(item.id)}
              className={`w-full flex items-center px-4 py-3 transition-colors duration-200
                ${activeMenu === item.id ? "bg-blue-600" : "hover:bg-gray-800"}`}
            >
              <span className="mr-4">{item.icon}</span>
              <span className={`${!sidebarOpen && "hidden"}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>

        <button className="w-full flex items-center px-4 py-3 mt-auto text-red-400 hover:bg-gray-800 transition-colors duration-200">
          <span className="mr-4">
            <LogOut size={20} />
          </span>
          <span className={`${!sidebarOpen && "hidden"}`}>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto">
        <header className="bg-white shadow-md p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-900"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <MessageSquare size={20} />
              </button>
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;