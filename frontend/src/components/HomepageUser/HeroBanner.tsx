import classes from "./HeroBanner.module.css";
import { FaArrowRight, FaStar, FaTag } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const goToProducts = () => {
    if (location.pathname === "/" && !location.search) {
      document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    navigate("/#products");
  };

  return (
    <section className={classes.hero}>

      <div className={classes.content}>

        <div className={classes.badge}>
          <FaStar aria-hidden="true" />
          <span>NEW ARRIVALS</span>
        </div>


        <h1>
          Tech that moves 
          <br />
          with <span>you</span>
        </h1>


        <p>
          Discover premium gadgets and accessories
          built to elevate your everyday.
        </p>


        <div className={classes.buttons}>
          <button className={classes.primary} onClick={goToProducts}>
            Shop Now
            <FaArrowRight aria-hidden="true" />
          </button>

          <button className={classes.secondary} onClick={goToProducts}>
            Explore Products
          </button>
        </div>


        

      </div>



      <div className={classes.offer}>

        <div className={classes.offerIcon}>
          <FaTag />
        </div>


        <h4>
          Special Offer
        </h4>


        <p>
          Up to
        </p>


        <h2>
          30% Off
        </h2>


        <span className={classes.limited}>
          Limited time only
        </span>


        <button onClick={goToProducts}>
          Shop Products
        </button>

      </div>


    </section>
  );
};


export default HeroBanner;
