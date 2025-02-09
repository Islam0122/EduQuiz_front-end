import React, { useState, useEffect } from 'react';
import './Carousel.scss';
import react from './Carousel-img/Carousel-React.png';
import python from './Carousel-img/Python.png';
import java from './Carousel-img/Java.png';
import Csharp from './Carousel-img/C sharp.png';
import cPlus from './Carousel-img/cPlus.png';
import ts from './Carousel-img/ts.png';
import js from './Carousel-img/JavaScript.png';

const languages = [
    { img: python },
    { img: react },
    { img: Csharp },
    { img: java },
    { img: cPlus },
    { img: ts },
    { img: js },
];

const Carousel = () => {
    const [angle, setAngle] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setAngle((prev) => prev + 0.3);
        }, 50); // Частота вращения
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="carousel">
            <div
                className="carousel-container"
                style={{
                    transform: `rotate(${angle}deg)`,
                }}
            >
                {languages.map((lang, index) => {
                    const theta = (index / languages.length) * 2 * Math.PI;
                    const x = Math.cos(theta) * 300; // Радиус вращения
                    const y = Math.sin(theta) * 300;

                    return (
                        <div
                            key={index}
                            className="carousel-item"
                            style={{
                                position: 'absolute',
                                top: `calc(50% + ${y}px)`,
                                left: `calc(50% + ${x}px)`,
                                transform: `translate(-50%, -50%) rotate(${-angle}deg)`, // Компенсация вращения
                            }}
                        >
                            <img
                                src={lang.img}
                                alt={`language-${index}`}
                                className="carousel-img"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Carousel;