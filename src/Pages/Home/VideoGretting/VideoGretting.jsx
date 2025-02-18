import "./VideoGretting.scss";
import '../../../App.scss'
import React from "react";
import {useNavigate} from "react-router-dom";

function VideoGretting() {
  const navigate = useNavigate();
  return (
    <section className="VideoGretting">
      <div className="container">
        <div className="content">
          <div className="text">
            <h1>Полезные видео для вас!</h1>
            <p>
              Откройте для себя подборку лучших видео, которые помогут вам разобраться в новых темах, освоить полезные навыки и найти вдохновение. Учитесь, развивайтесь и становитесь лучше каждый день!
            </p>
            <button onClick={() => navigate('/video')}>
              Перейти в “Видео-уроки”
            </button>

          </div>
          <img src="/images/img.png" alt="Преимущества" />
        </div>
      </div>
    </section>
  );
}

export default VideoGretting;