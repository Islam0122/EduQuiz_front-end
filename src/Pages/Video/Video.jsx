import React from 'react';
import './Video.scss';
import img1 from './img.png';
import { useGetVideosQuery } from "../../redux/videoApi";

const Video = () => {
    const { data, error, isLoading, refetch } = useGetVideosQuery();

    const getEmbedUrl = (url) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:[^/]+\/[^/]+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=))([^"&?\/\s]{11})/);
        return match ? `https://www.youtube.com/embed/${match[1]}` : url;
    };

    return (
        <section className="Video">
            <div className="container">
                <div className="header">
                    <div>
                        <h2>Полезные видеоматериалы</h2>
                        <p>В нашей подборке вы найдете видео, которые помогут вам разобраться в важных технических вопросах. Эти материалы охватывают ключевые темы и подходят как для начинающих, так и для опытных специалистов.</p>
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
                        data.map((video) => {
                            const videoUrl = video.video_url || video.title;
                            return (
                                <div key={video.id} className="video_item">
                                    <iframe
                                        src={`${getEmbedUrl(videoUrl)}?modestbranding=1&rel=0&iv_load_policy=3&cc_load_policy=0&fs=1&playsinline=1`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>

                                    <h5>{video.title}</h5>

                                </div>
                            );
                        })
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
