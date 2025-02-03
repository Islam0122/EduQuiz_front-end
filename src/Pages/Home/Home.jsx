import HeroBlock from './HeroBlock/HeroBlock'
import Login from "../Login/Login";
import HeroGreenting from "./HeroGreenting/HeroGreenting";
import Section3 from './HomeAdvantages/HomeAdvantages';
import HomeAdvantages from './HomeAdvantages/HomeAdvantages';

const Home = () => {
  return (
     <>
     <HeroBlock/>
     <HeroGreenting/>
     <HomeAdvantages/>
     </>
  )
}

export default Home