import HeroBlock from './HeroBlock/HeroBlock'
import Header from '../../UI/Header/Header'
import Login from "../Login/Login";
import HeroGreenting from "./HeroGreenting/HeroGreenting";
import Footer from '../../UI/Footer/Footer'

const Home = () => {
  return (
     <div>
     <Header/>
     <HeroBlock/>
     <HeroGreenting/>
<Footer/>
     </div>
  )
}

export default Home