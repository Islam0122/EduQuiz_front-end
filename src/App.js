import React from 'react';
import { Routes, Route, } from 'react-router-dom';
import Home from './Pages/Home/Home';
import Login from './Pages/Login/Login';
import Quiz from './Pages/Quiz/Quiz';
import Layout from './Layout/Layout';
import Questions from './Pages/Questions/Questions';
import Groups from './Pages/Groups/Groups';
import NotFound from "./Pages/NotFound/NotFound";
import Students from "./Pages/Groups/Students";
import QuestionsDetail from "./Pages/Questions/Questions_detail";
import Video from "./Pages/Video/Video";

const App = () => {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Layout />}>

                <Route path="" element={<Home />} />
                <Route path="/quiz/:groupId/:questionId/:mode/:studentId?" element={<Quiz />} />  {/* Викторина */}

                <Route path="questions" element={<Questions />} />
                <Route path="questions/:id" element={<QuestionsDetail />} />

                <Route path="groups" element={<Groups />} />
                <Route path="groups/:id" element={<Students />} />

                <Route path="video" element={<Video />} />
                {/* 404: редирект на главную или login */}
                <Route path="*" element={<NotFound />} />
            </Route>

        </Routes>
    );
};

export default App;
