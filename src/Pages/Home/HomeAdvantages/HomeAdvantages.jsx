import "./HomeAdvantages.scss";
import '../../../App.scss'
import logo from "./icons/Block3.png"
const cardsData = [
  {
    icon: "./icons/monitor.svg",
    title: "Удобство",
    description: "Создавайте и редактируйте викторины в несколько кликов",
  },
  {
    icon: "./icons/Security.svg",
    title: "Безопасность",
    description: "Данные учеников надежно защищены",
  },
  {
    icon: "./icons/decision.svg",
    title: "Гибкость",
    description: "Настраивайте тесты под свои задачи",
  },
  {
    icon: "./icons/analytics.svg",
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