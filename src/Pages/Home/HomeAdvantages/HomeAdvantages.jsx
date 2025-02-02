import "./HomeAdvantages.scss";

const cardsData = [
  {
    icon: "/icons/monitor.svg",
    title: "Удобство",
    description: "Создавайте и редактируйте викторины в несколько кликов",
  },
  {
    icon: "/icons/Security.svg",
    title: "Безопасность",
    description: "Данные учеников надежно защищены",
  },
  {
    icon: "/icons/decision.svg",
    title: "Гибкость",
    description: "Настраивайте тесты под свои задачи",
  },
  {
    icon: "/icons/analytics.svg",
    title: "Аналитика",
    description: "Отслеживайте результаты студентов и выявляйте проблемные темы",
  },
];

function HomeAdvantages() {
  return (
    <section>
      <div className="containerBlock3">
        <h1>Наше преимущество</h1>
        <div className="content">
          <img src="/images/Block3.png" alt="Преимущества" />
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