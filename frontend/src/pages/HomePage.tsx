import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import HeroBanner from "../components/HomepageUser/HeroBanner";
import ProductList from "../components/ProductList";
import Features from "../components/HomepageUser/Features"
import Categories from "../components/HomepageUser/Categories"
import PromoBanner from "../components/HomepageUser/PromoBanner";
// import Categories from "../components/Home/Categories";
// import PromotionalBanners from "../components/Home/PromotionalBanners";


const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;

      if (location.search) {
        navigate("/", { replace: true });
        return;
      }
    }

    const sectionId = location.hash.slice(1);

    requestAnimationFrame(() => {
      if (sectionId) {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 0 });
      }
    });
  }, [location.hash, location.search, navigate]);

  return (
    <>
      <HeroBanner />

      <Features />

      <Categories /> 

      <ProductList />

      <PromoBanner />
    </>
  );
};

export default HomePage;
