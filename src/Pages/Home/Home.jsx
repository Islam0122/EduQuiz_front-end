import HeroBlock from './HeroBlock/HeroBlock'
import HeroGreenting from "./HeroGreenting/HeroGreenting";
import HomeAdvantages from './HomeAdvantages/HomeAdvantages';
import VideoGretting from "./VideoGretting/VideoGretting";
import Typing from "./Typing/Typing";

const Home = () => {
  return (
     <>
     <HeroBlock/>
     <HeroGreenting/>
     <VideoGretting/>
         <Typing/>
     <HomeAdvantages/>

     </>
  )
}

export default Home