import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Импортируем useSelector
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import AboutUs from './Pages/AboutUs/AboutUs';
import Createaquiz from './Pages/Createaquiz/Createaquiz';
import Layout from './Layout/Layout';
import Questions from './Pages/Questions/Questions';
import Groups from './Pages/Groups/Groups';
import PrivateRoute from './Pages/Login/PrivateRoute';
import NotFound from "./Pages/NotFound/NotFound";
import Students from "./Pages/Groups/Students"; // Импортируем PrivateRoute

const App = () => {
    const isAuthenticated = useSelector((state) => !!state.auth.token);

    return (
        <Routes>
            {/* Если уже авторизован, редирект с login на / */}
            <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />

            {/* Защищённые маршруты */}
            <Route element={<PrivateRoute />}>
                <Route path="/" element={<Layout />}>
                    <Route path="" element={<Home />} />
                    <Route path="aboutUs" element={<AboutUs />} />
                    <Route path="groups" element={<Groups />} />
                    <Route path="createaquiz" element={<Createaquiz />} />
                    <Route path="questions" element={<Questions />} />
                    <Route path="groups/:id" element={<Students />} />

                    {/* 404: редирект на главную или login */}
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default App;
