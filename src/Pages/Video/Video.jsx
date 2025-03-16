import React, {useState, useRef} from "react";
import "./Video.scss";
import img1 from "./img.png";
import img2 from "./image.png";
import {useGetVideosQuery} from "../../redux/videoApi";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {Navigation} from "swiper/modules";
import {useNavigate} from "react-router-dom";
import {FaThList} from "react-icons/fa";

// Компонент для кнопок категорий
// components/CategoryButtons.jsx

const CategoryButtons = ({ categories, selectedCategory, handleCategoryClick }) => (
    <Swiper
        spaceBetween={10}
        loop={true}
        autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
        }}
        className="category-swiper"
    >
        {categories.map((category) => (
            <SwiperSlide key={category}>
                <button
                    className={selectedCategory === category ? "active" : ""}
                    onClick={() => handleCategoryClick(category)}
                >
                    {category}
                </button>
            </SwiperSlide>
        ))}
    </Swiper>
);

// Компонент для списка видео
const VideoList = ({groupedVideos, categories, categoryRefs, navigate, getVideoId}) => (
    <div className="category_list">
        {categories.map((category) => (
            <div key={category} ref={categoryRefs.current[category]} className="category_block">
                <h2 className="category_title"> <FaThList
                                style={{
                                    marginRight: '15px',
                                    color: '#FFD700',
                                    transition: 'color 0.3s ease'
                                }}
                                onMouseEnter={(e) => e.target.style.color = '#FF6347'} // Цвет при наведении
                                onMouseLeave={(e) => e.target.style.color = '#FFD700'} // Вернуться к изначальному цвету
                            />{category}</h2>
                <Swiper
                    spaceBetween={20}
                    slidesPerView={3}
                    loop={true}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                    }}
                    className="mySwiper"
                >
                    {groupedVideos[category].map((video) => {
                        const videoId = getVideoId(video.video_url);
                        return (
                            <SwiperSlide key={video.id}>
                                <div className="video_item" onClick={() => navigate(`/video/${video.id}`)}>
                                    <div>
                                        <img
                                            src={videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : img2}
                                            alt={video.title}
                                            className="video-thumbnail"
                                            loading="lazy"
                                        />
                                    </div>
                                    <h5>{video.title}</h5>
                                </div>
                            </SwiperSlide>
                        );
                    })}
                </Swiper>
            </div>
        ))}
    </div>
);

const Video = () => {
    const {data, error, isLoading} = useGetVideosQuery();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState(null);
    const categoryRefs = useRef({});

    const getVideoId = (url) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^/]+\/[^/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?/\s]{11})/);
        return match ? match[1] : null;
    };

    const groupedVideos = {};
    if (data) {
        data.forEach((video) => {
            const category = video.video_category_info.title;
            if (!groupedVideos[category]) {
                groupedVideos[category] = [];
                categoryRefs.current[category] = React.createRef();
            }
            groupedVideos[category].push(video);
        });
    }

    const categories = Object.keys(groupedVideos);
    const filteredVideos = selectedCategory ? groupedVideos[selectedCategory] : data;

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        const categoryElement = categoryRefs.current[category]?.current;
        if (categoryElement) {
            categoryElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    return (
        <section className="Video">
            <div className="container">
                <div className="header">
                    <div>
                        <h2>Полезные видеоматериалы</h2>
                        <p>
                            В нашей подборке вы найдете видео, которые помогут вам разобраться в важных технических
                            вопросах. Эти материалы охватывают ключевые темы и подходят как для начинающих, так и для
                            опытных специалистов.
                        </p>
                        <div className="video-button">
                            <CategoryButtons
                                categories={categories}
                                selectedCategory={selectedCategory}
                                handleCategoryClick={handleCategoryClick}
                            />
                        </div>
                    </div>
                    <img src={img1} alt="img1"/>
                </div>


                {isLoading ? (
                    <div className="status-message loading">
                        <p>⏳ Загрузка видео...</p>
                    </div>
                ) : error ? (
                    <div className="status-message error">
                        <p>❌ Ошибка загрузки видео. Попробуйте еще раз.</p>
                        <button onClick={() => window.location.reload()}>Обновить страницу</button>
                    </div>
                ) : filteredVideos && filteredVideos.length > 0 ? (
                    <VideoList
                        groupedVideos={groupedVideos}
                        categories={categories}
                        categoryRefs={categoryRefs}
                        navigate={navigate}
                        getVideoId={getVideoId} // Передаем функцию getVideoId
                    />
                ) : (
                    <div className="status-message error">
                        <p>Нет доступных видео.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Video;