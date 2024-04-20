import React from "react";
import BackToTopButton from "../components/BackToTopButton";
import Hero from "../components/Hero";
import NewProduct from "../components/NewProduct";
import Offer from "../components/Offer";
import PopularProduct from "../components/PopularProduct";

const Home = () => {
  return (
    <div>
      <Hero />
      <PopularProduct />
      <Offer />
      <NewProduct />
      <BackToTopButton />
    </div>
  );
};

export default Home;
