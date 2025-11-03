import HeroSection from "./components/Home/HeroSection";
import PopularDestinations from "./components/Home/PopularDestinations";
import WhatToDo from "./components/Home/WhatToDo";
import Events from "./components/Home/Events";
import Experiences from "./components/Home/Experiences";
import Footer from "./components/Home/Footer";
import NavBar from "./components/Home/NavBar";
import BecomeAHost from "./components/Home/BecomeAHost";
const page = () => {
  return (
    <>
      <NavBar />
      <HeroSection />
      <WhatToDo />
      <PopularDestinations />
      <Events />
      <Experiences />
      <BecomeAHost />
      <Footer />
    </>
  );
};
export default page;
