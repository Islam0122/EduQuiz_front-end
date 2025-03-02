import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsInstagram } from 'react-icons/bs';
import { FaTelegram } from 'react-icons/fa';
import { FiYoutube } from "react-icons/fi";
import { AiFillTikTok } from "react-icons/ai";
import logo from '../Union.svg';
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
                  <img src={logo} alt="Logo" />
                  <h1>EDUQUIZ</h1>
                </div>
              </div>

              <div className="Footer-nav">
                <h2>Навигация</h2>
                <p  onClick={() => handleClick('/')}>
                  <Link to="/">Главная</Link>
                </p>
                <p onClick={() => handleClick('/test')}>
                  <Link to="/test">Тесты</Link>
                </p>
                <p onClick={() => handleClick('/groups')}>
                  <Link to="/groups">Группы</Link>
                </p>
                <p  onClick={() => handleClick('/video')}>
                  <Link to="/video">Видео-уроки</Link>
                </p>
              </div>

              <div className="contact">
                <h1>Поддержка</h1>
                <p>
                  Если у вас возникли вопросы или предложения, свяжитесь с нами через социальные сети:
                </p>
                <div className="Lil-text">
                  <a
                      href="https://www.instagram.com/duishobaevislam01?igsh=ZHIyM2k4dWI2ZDhr"
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


