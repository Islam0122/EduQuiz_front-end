import './HeroBlock.scss'
import Carousel from "../Carousel/Carousel";
import {useState} from "react";

const HeroBlock = () => {
    return (
      <div className="container">
          <div className="Greeting">
              <div className="greeting-description">
                  <h1 className="text-box">Добро пожаловать в систему викторин EduQuiz
                  </h1>
                   <p className={"p"}>Создавайте, проводите и анализируйте викторины в удобном формате. Наша платформа поможет вам проверять знания студентов, оценивать прогресс и делать обучение более интерактивным.
                   </p>
                  <div className="Button">
                      <button className="read-more">Начать тестирование</button>
                      <button className="read-more">Читать далее</button>
                  </div>
              </div>
              <div className="">
                  <Carousel />
              </div>
        </div>
      </div>
  )
}

export default HeroBlock