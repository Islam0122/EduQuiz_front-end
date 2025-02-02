import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.scss'


const Header = () => {

  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  const handleClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className='Header-container'>
     <div className='Header-block'>
        <div className='Header-logo'>
            <img src="/icons/Logo (1).svg" alt="" />
        </div>
        <div className='Header-div-button-text'>
       <div className='Header-text'>
       <div className='Header-text'>
      <p
        className={activeLink === '/home' ? 'active' : ''}
        onClick={() => handleClick('/home')}
      >
        <Link to="/home">Главная</Link>
      </p>
      <p
        className={activeLink === '/Quizzes' ? 'active' : ''}
        onClick={() => handleClick('/Quizzes')}
      >
        <Link to="/Quizzes">Викторины</Link>
      </p>
      <p
        className={activeLink === '/students' ? 'active' : ''}
        onClick={() => handleClick('/students')}
>
        <Link to="/students">Студенты</Link></p>
    </div>
       </div>
       <div>
        <button className='Header-Botton'><Link to="/createaquiz" className='Header-Botton-Link'>Создать викторину</Link></button>
       </div>
        </div>
     </div>
    </div>
  )
}

export default Header