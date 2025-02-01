import React from 'react';
import { BsInstagram } from 'react-icons/bs';
import { FaTelegram } from 'react-icons/fa';
import { FiYoutube } from "react-icons/fi";
import { AiFillTikTok } from "react-icons/ai";
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="Footer">
      <div className="Footerin">
        <div className="Footer-top">
          <div className="FooterTopIn">
            <div className="icon-foot">
              <img src="/icons/Brain.svg" alt="Logo" />
              <h1>EDUQUIZ</h1>
            </div>
          </div>
          <div className="contact">
            <h1>Поддержка</h1>
            <p>Если у вас возникли вопросы или предложения, свяжитесь с нами через социальные сети:</p>
            <div className="Lil-text">
              <a href="https://www.instagram.com/clubofprogg?igsh=MWZrYnFybHVidHV1aA==" target="_blank" rel="noopener noreferrer">
                <BsInstagram className="ic" />
              </a>
              <FaTelegram className="ic" />
              <FiYoutube className="ic" />
              <AiFillTikTok className="ic" />
              <a href="https://www.instagram.com/clubofprogg?igsh=MWZrYnFybHVidHV1aA==" target="_blank" rel="noopener noreferrer">
              </a>
            </div>
          </div>
          <div className='Us'>
            <div className='company'>
              <h2>О компании </h2>
              <h1>ClugOfProgg</h1>
            </div>
            <p>Мы — команда профессионалов, создающая инновационные IT-решения для бизнеса. Мы предлагаем разработку программного обеспечения, поддержку и оптимизацию IT-систем.</p>
            <h2>Наши услуги:</h2>
            <p>Разработка ПО, создание сайтов и мобильных приложений, автоматизация бизнес-процессов и IT-консалтинг.
            </p>
            <h2>Наши преимущества:</h2>
            <p>Мы объединяем опыт, современные технологии и внимание к каждому проекту, чтобы предложить вам лучшие решения для вашего бизнеса.</p>
          </div>
        </div>
      </div>
      <div className='Footer-bottom'>
        <p>© 2025 ClubOfProgg. Система управления викторинами. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;
