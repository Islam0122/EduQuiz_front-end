import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';  
import Home from '../Pages/Home/Home';
import Login from '../Pages/Login/Login';
import AboutUs from '../Pages/AboutUs/AboutUs';
import Quizzes from '../Pages/Quizzes/Quizzes';
import Students from '../Pages/Groups/Students';
import Createaquiz from '../Pages/Createaquiz/Createaquiz';
import '../App.scss'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/home" element={<Home />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/students" element={<Students />} />
        <Route path="/createaquiz" element={<Createaquiz />} />
        <Route path="/student" element={<Students />} />
      </Routes>
    </Router>
  );
};

export default App;
