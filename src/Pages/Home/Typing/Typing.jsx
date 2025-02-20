import React from 'react';
import "./Typing.scss"
import {useNavigate} from "react-router-dom";

const Typing = () => {
    const navigate = useNavigate();
    return (
        <section className={'home__Typing'}>
            <div className={"container"}>
                <div className="Typing-flex">
                    <div className={"Typing-images"}>
                        <img className={"typing-img"} src="/images/typing.png" alt=""/>
                    </div>
                    <div className={'Typing-text'}>
                        <h2 className={"text1"}>
                            Быстрая и точная печать — ваш ключ к продуктивности!
                        </h2>
                        <p className={"text2"}>
                            Освойте слепую печать — лучший метод набора текста без взгляда на клавиатуру. Это сэкономит время и повысит вашу эффективность.
                            📈 Регулярные тренировки помогут развить скорость и точность. Используйте специальные тренажёры, практикуйтесь каждый день — и печать станет лёгкой и естественной!
                        </p>
                        <button onClick={() => navigate('/typing')} className={"btn"}>
                            Перейти  в “Typing”
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Typing;