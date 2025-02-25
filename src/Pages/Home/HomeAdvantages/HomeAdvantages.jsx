import "./HomeAdvantages.scss";
import '../../../App.scss'
import logo from "./icons/Block3.png"
import logo1 from "./icons/monitor.svg"
import logo2 from "./icons/Security.svg"
import logo3 from "./icons/decision.svg"
import logo4 from "./icons/analytics.svg"

const cardsData = [
  {
    icon: logo1,
    title: "Удобство",
    description: "Создавайте и редактируйте викторины в несколько кликов",
  },
  {
    icon: logo2,
    title: "Безопасность",
    description: "Данные учеников надежно защищены",
  },
  {
    icon: logo3,
    title: "Гибкость",
    description: "Настраивайте тесты под свои задачи",
  },
  {
    icon: logo4,
    title: "Аналитика",
    description: "Отслеживайте результаты студентов и выявляйте проблемные темы",
  },
];

function HomeAdvantages() {
  return (
    <section className="home__advantages">
      <div className="container">
        <h1>Наше преимущество</h1>
        <div className="content">
          <img src={logo} alt="Преимущества" />
          <div className="cards">
            {cardsData.map((card, index) => (
              <div className="card" key={index}>
                <img src={card.icon} alt={card.title} />
                <div className="text">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HomeAdvantages;