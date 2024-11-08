// /src/App.js

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AboutUs, FAQ } from "./pages/BarExtras";
import NavBar from "./components/NavBar";
import UserNavBar from "./components/UserNavBar";
import Profile from "./pages/Profile";
import { UserBudgets } from "./pages/UserBudgets";
import PlanDisplay from "./pages/PlanDisplay";
import ArticlesPage from "./pages/ArticlesPage";

// this section represents all routes for webpage, the path means the path represented in the url and the element leads to a jsx file that 
// represents the page

function App() {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("authToken");
    return token ? true : false;
  });

  useEffect(() => {
    if (auth) {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setAuth(false); // Reset auth if token is missing
      }
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user_id"); // Clean up user_id if not authenticated
    }
  }, [auth]);

  const handleLogin = (user_id, token) => {
    localStorage.setItem("user_id", user_id); // Store user_id
    localStorage.setItem("authToken", token); // Store token for verification
    setAuth(true);
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user_id");
    setAuth(false);
    navigate("/login");
  };

  return (
    <>
      {auth ? <UserNavBar onLogout={handleLogout} /> : <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={handleLogin} />} />
        <Route path="/create" element={<CreateAccount setAuth={handleLogin} />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<AboutUs />} />
        <Route element={<PrivateRoute auth={auth} />}>
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/articles" element={<ArticlesPage/>} />
          <Route path="/addfriends" element={<h1>This is the friend adder page</h1>} />
          <Route path="/mybudgets" element={<UserBudgets />} />
          <Route path="/leader" element={<h1>This is the leaderboard page</h1>} />
          <Route path="/budgetdisplay/:budgetId" element={<PlanDisplay />} />
        </Route>
        <Route path="*" element={<h1>Error page: implement later</h1>} />
      </Routes>
    </>
  );
}

export default App;
