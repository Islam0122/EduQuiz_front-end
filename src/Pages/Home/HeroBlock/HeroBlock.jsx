import './HeroBlock.scss';
import Carousel from '../Carousel/Carousel';
import { useState, useRef } from 'react';
import Modal from './Modal';
import {useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";

const HeroBlock = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const nextSectionRef = useRef(null);
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/test");
    };
    const scrollToNextSection = () => {
        if (nextSectionRef.current) {
            nextSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };
    const isAuthenticated = useSelector((state) => !!state.auth.token);
    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container">
            <div className="hero-block">
                <div className="Greeting">
                    <div className="greeting-description">
                        <h1 className="text-box">Добро пожаловать в систему викторин EduQuiz</h1>
                        <p className="p">Создавайте, проводите и анализируйте викторины в удобном формате. Наша платформа поможет вам проверять знания студентов, оценивать прогресс и делать обучение более интерактивным.</p>
                        <div className="Button">
                            {isAuthenticated ? (
                                <button className="read-more" onClick={openModal}>Начать тестирование</button>
                            ): (
                                <button className="read-more" onClick={handleClick}>
                                    Пройти тесты
                                </button>
                            )}
                            <button className="read-more" onClick={scrollToNextSection}>Читать далее</button>
                        </div>
                    </div>
                </div>
                <div>
                    <Carousel/>
                </div>
            </div>
            <div ref={nextSectionRef} className="next-section">
            </div>
            <Modal isOpen={isModalOpen} onClose={closeModal} />

        </div>
    );
};

export default HeroBlock;
