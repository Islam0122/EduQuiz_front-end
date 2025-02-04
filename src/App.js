import React, { use } from 'react';
import { Routes, Route } from 'react-router-dom';  
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import AboutUs from './Pages/AboutUs/AboutUs';
import Students from './Pages/Students/Students';
import Createaquiz from './Pages/Createaquiz/Createaquiz';
import Layout from './Layout/Layout';
import { useLocation } from 'react-router-dom';
import Questions from './Pages/Questions/Questions';

const App = () => {

  const location = useLocation();
  const hideLayout = location.pathname === '/login'

  return (
      <Routes>
        <Route path="login" element={<Login />} />  
        <Route path="/" element={<Layout />}>
          <Route path="" element={<Home />} />
          <Route path="aboutUs" element={<AboutUs />} />
          <Route path="home" element={<Home />} />
          <Route path="students" element={<Students />} />
          <Route path="createaquiz" element={<Createaquiz />} />
          <Route path="questions" element={<Questions/>} />
        </Route>
      </Routes>
  );
};

export default App;