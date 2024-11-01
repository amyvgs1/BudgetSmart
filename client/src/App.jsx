import { useState, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
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


// this section represents all routes for webpage, the path means the path represented in the url and the element leads to a jsx file that 
// represents the page
function App() {
  const [auth, setAuth] = useState(() => {
    const savedAuth = localStorage.getItem("auth");
    return savedAuth === "true"; // Convert back to boolean
  });

  useEffect(() => {
    localStorage.setItem("auth", auth);
  }, [auth]);

  return (
    <>
      {auth ? <UserNavBar /> : <NavBar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/create" element={<CreateAccount setAuth={setAuth} />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/about" element={<AboutUs />} />
        <Route element={<PrivateRoute auth={auth} />}>
          <Route path="/dashboard/" element={<Dashboard />} />
          <Route path="/profile" element={<Profile setAuth={setAuth} />} />
          <Route
            path="/articles"
            element={<h1>This is the articles page</h1>}
          />
          <Route
            path="/addfriends"
            element={<h1>This is the friend adder page</h1>}
          />
          <Route path="/mybudgets" element={<UserBudgets />} />
          <Route
            path="/leader"
            element={<h1>This is the leaderboard page</h1>}
          />
        </Route>
        <Route path="*" element={<h1>Error page : implement later</h1>} />
      </Routes>
    </>
  );
}

export default App;
