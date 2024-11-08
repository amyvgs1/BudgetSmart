import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import CreateAccount from "./pages/CreateAccount";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import { AboutUs, FAQ } from "./pages/BarExtras";
import Calculator from "./components/calculator";
import NavBar from "./components/NavBar";
import UserNavBar from "./components/UserNavBar";
import Profile from "./pages/Profile";
import { UserBudgets } from "./pages/UserBudgets";
import LeaderBoard from "./pages/LeaderBoard";
import CurrencyConverter from "./pages/CurrencyConverter";
import AddFriends from "./pages/AddFriends";
import ArticlesPage from "./pages/ArticlesPage";

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
        setAuth(false);
      }
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user_id");
    }
  }, [auth]);

  const handleLogin = (user_id, token) => {
    localStorage.setItem("user_id", user_id);
    localStorage.setItem("authToken", token);
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
          <Route path="/articles" element={<ArticlesPage />} />
          <Route path="/addfriends" element={<AddFriends />} />
          <Route path="/mybudgets" element={<UserBudgets />} />
          <Route path="/leader" element={<LeaderBoard />} />
          <Route path="/currency" element={<CurrencyConverter />} />
          <Route path="/calculator" element={<Calculator />} />
        </Route>
        <Route path="*" element={<h1>Error page: implement later</h1>} />
      </Routes>
    </>
  );
}

export default App;