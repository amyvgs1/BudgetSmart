import { useState, useEffect } from 'react'
import './App.css'
import {Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import CreateAccount from './pages/CreateAccount';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import { AboutUs, FAQ } from './pages/BarExtras';



// conditional rendering between regular navbar and user navbar

// this section represents all routes for webpage, the path means the path represented in the url and the element leads to a jsx file that 
// represents the page

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login setLoggedIn={setLoggedIn}/>}/>
        <Route path='/create' element={<CreateAccount/>}/>
        <Route path='/faq' element={<FAQ/>}/>
        <Route path='/about' element={<AboutUs/>}/>
        <Route element={<PrivateRoute isLoggedIn={isLoggedIn}/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
        </Route>
        <Route path='*' element={<h1>Error page : implement later</h1>}/>
      </Routes>
    </>
  )
}

export default App
