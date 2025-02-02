import React from 'react'
import HeroBlock from './HeroBlock/HeroBlock'
import Header from '../../UI/Header/Header'
import Login from "../Login/Login";
import HeroGreenting from "./HeroGreenting/HeroGreenting";

const Home = () => {
  return (
     <div>
     <Header/>
     <HeroBlock/>
     <HeroGreenting/>
     </div>
  )
}

export default Home