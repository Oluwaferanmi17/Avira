import HeroSection from "./components/HeroSection";
import PopularDestinations from "./components/PopularDestinations";
import WhatToDo from "./components/WhatToDo";
import Events from "./components/Events";
import Experiences from "./components/Experiences";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
const page = () => {
  return (
    <>
      <NavBar />
      <HeroSection />
      <WhatToDo />
      <PopularDestinations />
      <Events />
      <Experiences />
      <Footer />
    </>
  );
};
export default page;
