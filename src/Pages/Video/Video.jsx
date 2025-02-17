import React from 'react';
import './Video.scss';
import img1 from './img.png';
import { useGetVideosQuery } from "../../redux/videoApi";

const Video = () => {
    const { data, error, isLoading } = useGetVideosQuery();
    console.log(useGetVideosQuery());



    return (
        <section className="Video">
            <div className="container">
                <div className="header">
                    <div>
                        <h2>Полезные видео</h2>
                        <p>Мы собрали для вас подборку полезных видео, которые помогут разобраться в ключевых технических вопросах. Удобные категории и фильтры помогут быстро найти нужный материал и освоить важные темы.</p>
                    </div>
                    <img src={img1} alt="img1" />
                </div>

                <div className="video_list">
                    {isLoading ? (
                        <div className="status-message loading">
                            <p>⏳ Загрузка видео...</p>
                        </div>
                    ) : error ? (
                        <div className="status-message error">
                            <p>❌ Ошибка загрузки видео. Попробуйте еще раз.</p>
                        </div>
                    ) : data && data.length > 0 ? (
                        data.map((video) => (
                            <div key={video.id} className="video_item">
                                <h3>{video.title}</h3>
                                <iframe
                                    width="560"
                                    height="315"
                                    src={video.video_url}  // Преобразуем URL в embed формат
                                    title={video.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ))
                    ) : (
                        <div className="status-message error">
                            <p>Нет доступных видео.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Video;
