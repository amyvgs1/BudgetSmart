// /src/App.js

import { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "./config/supabase";
import { checkAuth } from "./utils/auth";
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
import LeaderBoard from "./pages/Leaderboard";
import CurrencyConverter from "./pages/CurrencyConverter";
import AddFriends from "./pages/AddFriends";
import ArticlesPage from "./pages/ArticlesPage";
import PlanDisplay from "./pages/PlanDisplay";
import Calculator from "./components/calculator";
import VerifyEmail from './pages/VerifyEmail';

// this section represents all routes for webpage, the path means the path represented in the url and the element leads to a jsx file that 
// represents the page

function App() {
  const [auth, setAuth] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [session, setSession] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log("1. Starting initialization...");
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          const { data, error: userError } = await supabase
            .from('users')
            .select('username, first_name, last_name')
            .eq('user_id', currentSession.user.id)
            .maybeSingle();

          if (userError) throw userError;

          if (data) {
            localStorage.setItem('user_id', currentSession.user.id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_name', `${data.first_name} ${data.last_name}`);
            localStorage.setItem('session', JSON.stringify(currentSession));
            setAuth(true);
          }
        }
      } catch (error) {
        console.error("Init Error:", error);
        localStorage.clear();
        setAuth(false);
      } finally {
        setInitializing(false);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (initializing) return;
      
      console.log("Auth Event:", event);
      setSession(newSession);

      if (event === 'SIGNED_IN' && newSession?.user) {
        try {
          const { data, error: userError } = await supabase
            .from('users')
            .select('username, first_name, last_name')
            .eq('user_id', newSession.user.id)
            .maybeSingle();

          if (userError) throw userError;

          if (data) {
            localStorage.setItem('user_id', newSession.user.id);
            localStorage.setItem('username', data.username);
            localStorage.setItem('user_name', `${data.first_name} ${data.last_name}`);
            localStorage.setItem('session', JSON.stringify(newSession));
            setAuth(true);
            navigate('/dashboard', { replace: true });
          }
        } catch (error) {
          console.error("Sign in Error:", error);
          handleSignOut();
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        handleSignOut();
      }
    });

    return () => {
      if (authListener?.subscription?.unsubscribe) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, initializing]);

  const handleSignOut = () => {
    localStorage.clear();
    setAuth(false);
    setSession(null);
    navigate('/login', { replace: true });
  };

  if (initializing) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <>
      {auth ? <UserNavBar setAuth={setAuth} /> : <NavBar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login setAuth={setAuth} />} />
        <Route path="/create" element={<CreateAccount />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/dashboard" element={auth ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={auth ? <Profile setAuth={setAuth} /> : <Navigate to="/login" />} />
        <Route path="/mybudgets" element={auth ? <UserBudgets /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={auth ? <LeaderBoard /> : <Navigate to="/login" />} />
        <Route path="/converter" element={auth ? <CurrencyConverter /> : <Navigate to="/login" />} />
        <Route path="/friends" element={auth ? <AddFriends /> : <Navigate to="/login" />} />
        <Route path="/articles" element={auth ? <ArticlesPage /> : <Navigate to="/login" />} />
        <Route path="/plan" element={auth ? <PlanDisplay /> : <Navigate to="/login" />} />
        <Route path="/calculator" element={auth ? <Calculator /> : <Navigate to="/login" />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/budgetdisplay/:budgetId" element={auth ? <PlanDisplay /> : <Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;