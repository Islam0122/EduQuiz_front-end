import './HeroBlock.scss'
import Carousel from "../Carousel/Carousel";

const HeroBlock = () => {
  return (
      <div className="container">
<<<<<<< HEAD
          <div className="HeroBlock-main">
              <div className="nusoiba">
                  <div className="HeroBlock1">
                      <h1 className={"HeroBlock2"}>Добро пожаловать в систему викторин DevTrivia
                      </h1>
                      <p className={"p"}>Создавайте, проводите и анализируйте викторины в удобном формате. Наша
                          платформа поможет вам проверять знания студентов, оценивать прогресс и делать обучение более
                          интерактивным.
                      </p>
                      <div className="HeroButton">
                          <button className={"HeroBtn1"}>Начать тестирование</button>
                          <button className={"HeroBtn2"}>Читать далее</button>
                      </div>
                  </div>
=======
          <div className="Greeting">
              <div className="greeting-description">
                  <h1 className={"text-box"}>Добро пожаловать в систему викторин DevTrivia
                  </h1>
                   <p className={"p"}>Создавайте, проводите и анализируйте викторины в удобном формате. Наша платформа поможет вам проверять знания студентов, оценивать прогресс и делать обучение более интерактивным.
                   </p>
              <div className="Button">
                  <button className={"start-test"}>Начать тестирование</button>
                  <button className={"read-more"}>Читать далее</button>
>>>>>>> master
              </div>
              <div className="nusoiba-left">
                  <Carousel/>
              </div>
          </div>

      </div>
  )
}

export default HeroBlock