import './HeroBlock.scss'

const HeroBlock = () => {
  return (
      <div className="container">
          <div className="nusoiba">
              <div className="HeroBlock1">
                  <h1 className={"HeroBlock2"}>Добро пожаловать в систему викторин DevTrivia
                  </h1>
                   <p className={"p"}>Создавайте, проводите и анализируйте викторины в удобном формате. Наша платформа поможет вам проверять знания студентов, оценивать прогресс и делать обучение более интерактивным.
                   </p>
              <div className="HeroButton">
                  <button className={"HeroBtn1"}>Начать тестирование</button>
                  <button className={"HeroBtn2"}>Читать далее</button>
              </div>
              </div>
        </div>

      </div>
  )
}

export default HeroBlock