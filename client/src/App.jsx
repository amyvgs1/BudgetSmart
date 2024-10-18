import { useState, useEffect } from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { AboutUs, FAQ } from './pages/BarExtras';
import Calculator from './components/calculator';



// conditional rendering between regular navbar and user navbar

// this section represents all routes for webpage, the path means the path represented in the url and the element leads to a jsx file that 
// represents the page

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false); // State to manage calculator visibility
  const toggleCalculator = () => {
    setShowCalculator(!showCalculator); // Function to toggle calculator visibility
  };

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login setLoggedIn={setLoggedIn}/>}/>
        <Route path='/create' element={<CreateAccount/>}/>
        <Route path='/faq' element={<FAQ/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route element={<PrivateRoute isLoggedIn={isLoggedIn}/>}>
          <Route path="/dashboard" element={<Dashboard toggleCalculator={toggleCalculator} />}/>
        </Route>
        <Route path='*' element={<h1>Error page : implement later</h1>}/>
      </Routes>
      {/* Add a button to toggle the calculator anywhere you want */}
      <button onClick={toggleCalculator} style={{ position: 'fixed', bottom: '10px', right: '10px' }}>
        {showCalculator ? 'Hide Calculator' : 'Show Calculator'}
      </button>
      {/* Conditionally render the Calculator component */}
      {showCalculator && <Calculator />}
    </>
  )
}

export default App
