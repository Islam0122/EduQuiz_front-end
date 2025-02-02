import HeroBlock from './HeroBlock/HeroBlock'
import Login from "../Login/Login";
import HeroGreenting from "./HeroGreenting/HeroGreenting";
import Section3 from './HomeAdvantages/HomeAdvantages';

const Home = () => {
  return (
     <div>
     <HeroBlock/>
     <HeroGreenting/>
     <Section3/>
     </div>
  )
}

export default Home