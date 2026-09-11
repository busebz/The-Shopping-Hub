import classes from "./Features.module.css";

import {
  FaTruck,
  FaShieldAlt,
  FaUndo,
  FaHeadset
} from "react-icons/fa";

const Features = () => {
  return (
    <section className={classes.features}>
      <div className={classes.item}>
        <div className={classes.icon}>
          <FaTruck />
        </div>

        <div>
          <h3>Free Shipping</h3>
          <p>On Orders Over $500</p>
        </div>
      </div>

      <div className={classes.divider}></div>

      <div className={classes.item}>
        <div
          className={`${classes.icon} ${classes.pinkIcon}`}
        >
          <FaShieldAlt />
        </div>

        <div>
          <h3>Secure Payment</h3>
          <p>100% Protected Checkout</p>
        </div>
      </div>

      <div className={classes.divider}></div>

      <div className={classes.item}>
        <div className={classes.icon}>
          <FaUndo />
        </div>

        <div>
          <h3>Easy Returns</h3>
          <p>30 Days Money Back</p>
        </div>
      </div>

      <div className={classes.divider}></div>

      <div className={classes.item}>
        <div className={classes.icon}>
          <FaHeadset />
        </div>

        <div>
          <h3>24/7 Support</h3>
          <p>Always Here To Help</p>
        </div>
      </div>
    </section>
  );
};

export default Features;