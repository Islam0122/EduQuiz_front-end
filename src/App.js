import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Createaquiz from './Pages/Createaquiz/Createaquiz';
import Layout from './Layout/Layout';
import Questions from './Pages/Questions/Questions';
import Groups from './Pages/Groups/Groups';
import NotFound from "./Pages/NotFound/NotFound";
import Students from "./Pages/Groups/Students";
import QuestionsDetail from "./Pages/Questions/Questions_detail";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>

                <Route path="" element={<Home />} />
                <Route path="createaquiz" element={<Createaquiz />} />

                <Route path="questions" element={<Questions />} />
                <Route path="questions/:id" element={<QuestionsDetail />} />

                <Route path="groups" element={<Groups />} />
                <Route path="groups/:id" element={<Students />} />

                {/* 404: редирект на главную или login */}
                <Route path="*" element={<NotFound />} />
            </Route>

        </Routes>
    );
};

export default App;
