import YouTube from "react-youtube";
import { useNavigate, useParams } from "react-router-dom";
import { useGetVideoByIdQuery, useGetVideosByCategoryQuery } from "../../redux/videoApi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./VideoDetail.scss";

const VideoDetail = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { data, error, isLoading } = useGetVideoByIdQuery(id);
    const category = data?.video_category_info?.title;
    const { data: relatedVideos, error: videosError, isLoading: videosLoading } =
        useGetVideosByCategoryQuery(category, { skip: !category });

    if (isLoading || videosLoading) return <div className="loading-spinner">⏳ Загрузка...</div>;
    if (error || videosError) return (
        <div className="error-message">
            <p>❌ Ошибка при загрузке данных.</p>
            <button onClick={() => window.location.reload()}>Попробовать снова</button>
        </div>
    );
    if (!data) return <p>Видео не найдено.</p>;

    const extractVideoId = (url) => {
        const match = url?.match(/(?:youtube\.com\/.*v=|youtu\.be\/)([^"&?/ ]{11})/);
        return match ? match[1] : null;
    };

    const videoId = data.videoId || extractVideoId(data.video_url);
    if (!videoId) return <p>Ошибка загрузки видео</p>;

    return (
        <section className="VideoDetail">
            <div className="container">
                <div className="video">
                    <YouTube className="youtube" videoId={videoId} />
                    <div className="description">
                        <h2>{data.title}</h2>
                        <p>{data.description}</p>
                    </div>
                </div>
                {category && relatedVideos?.length > 0 && (
                    <div className="category-video">
                        <h3>Видео по категории {category}</h3>
                        <Swiper
                            spaceBetween={100}
                            slidesPerView={3}
                            loop={true}
                            autoplay={{
                                delay: 3000,
                                disableOnInteraction: false,
                            }}
                        >
                            {relatedVideos.map((video) => (
                                <SwiperSlide key={video.id}>
                                    <div className="video-item" onClick={() => navigate(`/video/${video.id}`)}>
                                        <div>
                                            <img
                                                className="video-img"
                                                src={`https://img.youtube.com/vi/${extractVideoId(video.video_url)}/hqdefault.jpg`}
                                                alt={video.title}
                                                loading="lazy"
                                            />
                                        </div>
                                        <h2>{video.title}</h2>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VideoDetail;