import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsInstagram } from 'react-icons/bs';
import { FaTelegram } from 'react-icons/fa';
import { FiYoutube } from "react-icons/fi";
import { AiFillTikTok } from "react-icons/ai";
import './Footer.scss';
import '../../App.scss'

const Footer = () => {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleClick = (path) => {
    setActiveLink(path);
  };

  return (
    <footer>
      <div className="container">
      <div className="Footerin">
        <div className="Footer-top">
          <div className="FooterTopIn">
            <div className="icon-foot">
              <img src="/icons/Union.svg" alt="Logo" />
              <h1>EDUQUIZ</h1>
            </div>
          </div>

          <div className="Footer-nav">
            <h2>Навигация</h2>
            <p className={activeLink === '/home' ? 'active' : ''} onClick={() => handleClick('/home')}>
              <Link to="/home">Главная</Link>
            </p>
            <p className={activeLink === '/Quizzes' ? 'active' : ''} onClick={() => handleClick('/Quizzes')}>
              <Link to="/Quizzes">Викторины</Link>
            </p>
            <p className={activeLink === '/students' ? 'active' : ''} onClick={() => handleClick('/students')}>
              <Link to="/students">Группы</Link>
            </p>
            <p className={activeLink === '/createaquiz' ? 'active' : ''} onClick={() => handleClick('/createaquiz')}>
              <Link to="/createaquiz">Создать викторину</Link>
            </p>
          </div>

          <div className="contact">
            <h1>Поддержка</h1>
            <p>
              Если у вас возникли вопросы или предложения, свяжитесь с нами через социальные сети:
            </p>
            <div className="Lil-text">
              <a 
                href="https://www.instagram.com/clubofprogg?igsh=MWZrYnFybHVidHV1aA==" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <BsInstagram className="ic" />
              </a>
              <FaTelegram className="ic" />
              <FiYoutube className="ic" />
              <AiFillTikTok className="ic" />
            </div>
          </div>
          
        </div>
      </div>
      <div className="Footer-bottom">
        <p>
          © 2025 EduQuiz. Система управления викторинами. Все права защищены.
        </p>
      </div>
      </div>
    </footer>
  );
};

export default Footer;


