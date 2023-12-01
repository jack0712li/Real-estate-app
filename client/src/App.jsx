import React from 'react'
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import About from './pages/About';
import Profile from './pages/Profile';
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Headers from './components/Header';
export default function App() {
  return <BrowserRouter>
  <Headers />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/sign-in" element={<LogIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/about" element={<About />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  </BrowserRouter>
}
