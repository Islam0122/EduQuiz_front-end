import React from 'react'
import './Header.scss'



const Header = () => {
  return (
    <div className='Header-container'>
     <div>
        <div className='Header-logo'>
            <img src="./EduQuiz/public/icons/Logo (1).svg" alt="" />
        </div>
       <div>
        <p>Главная</p>
        <p>Викторины</p>
        <p>Студенты</p>
       </div>
       <div>
        <button className='Header-Botton'>Создать викторину</button>
       </div>
     </div>
    </div>
  )
}

export default Header