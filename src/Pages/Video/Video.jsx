import React, {useState} from "react";
import "./Video.scss";
import img1 from "./img.png";
import {useGetVideosQuery} from "../../redux/videoApi";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import {Navigation} from "swiper/modules";
import {useNavigate} from "react-router-dom";

const Video = () => {
    const {data, error, isLoading} = useGetVideosQuery();
    const navigate = useNavigate();

    // Функция для извлечения ID из ссылки YouTube
    const getVideoId = (url) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^/]+\/[^/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
        return match ? match[1] : null;
    };

    const groupedVideos = {};
    if (data) {
        data.forEach((video) => {
            const category = video.video_category_info.title;
            if (!groupedVideos[category]) {
                groupedVideos[category] = [];
            }
            groupedVideos[category].push(video);
        });
    }

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
                    </div>
                ) : data && data.length > 0 ? (
                    <div className="category_list">
                        {Object.entries(groupedVideos).map(([category, videos]) => (
                            <div key={category} className="category_block">
                                <h2 className="category_title">{category}</h2>

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
                                    {videos.map((video) => {
                                        const videoId = getVideoId(video.video_url);
                                        return (
                                            <SwiperSlide key={video.id}>
                                                <div className="video_item"
                                                     onClick={() => navigate(`/video/${video.id}`)}>
                                                    <div>
                                                        <img
                                                            src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                                            alt={video.title}
                                                            className="video-thumbnail"
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
