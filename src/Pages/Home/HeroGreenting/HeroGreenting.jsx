import './HeroGreenting.scss'
import '../../../App.scss'

const HeroGreenting = () => {
    return (
        <section className='home__greenting'>
            <div className="container">
                <div className="Greenting-flex">
                    <div className="Greenting-images">
                        <img className="Greenting-img" src="/images/fullstack.png" alt="" />
                    </div>
                    <div className="Greenting-text">
                        <h2 className="text1">
                            Мы делаем обучение проще, а  тестирование — <span>удобнее</span>
                        </h2>
                        <p className="text2">
                            Наша цель — сделать тестирование доступным, понятным и полезным. Мы
                            хотим, чтобы ученики не боялись контрольных, а видели в них
                            возможность проверить себя, а преподаватели могли тратить меньше
                            времени на проверки и больше — на развитие своих учеников.
                        </p>
                        <p className="text3">
                            С <span className="highlight">DevTrivia</span> тестирование становится
                            инструментом для прогресса, а не стрессом для учеников и
                            преподавателей.
                        </p>
                    </div>
                </div>
            </div>
        </section>

    );
};

export default HeroGreenting;