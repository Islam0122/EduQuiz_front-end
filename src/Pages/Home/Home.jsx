import HeroBlock from './HeroBlock/HeroBlock'
import Header from '../../UI/Header/Header'
import Login from "../Login/Login";
import HeroGreenting from "./HeroGreenting/HeroGreenting";
import Footer from '../../UI/Footer/Footer'
import Section3 from './Section3/Section3';

const Home = () => {
  return (
     <div>
     <Header/>
     <HeroBlock/>
     <HeroGreenting/>
     <Section3/>
<Footer/>
     </div>
  )
}

export default Home