import classes from "./OrdersSuccess.module.css";
import { useNavigate } from "react-router-dom";

import {
  FiCheck,
  FiClipboard,
  FiTruck,
  FiShield,
  FiRefreshCcw,
  FiHeadphones,
} from "react-icons/fi";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <main className={classes.page}>
      <div className={classes.successCard}>
        <div className={classes.checkIcon}>
          <FiCheck />
        </div>

        <h1>Thank you for your order!</h1>

        <p className={classes.subtitle}>
          Your order has been placed successfully.
        </p>

        <div className={classes.divider} />

        <div className={classes.orderBox}>
          <div className={classes.orderIcon}>
            <FiClipboard />
          </div>

          <div className={classes.orderInfo}>
            <span>Order Number</span>
            <strong>#TSH-2026-09-10-1234</strong>
          </div>
        </div>

        <p className={classes.confirmationText}>
          Your order is now being prepared. You can check its status anytime
          from your orders page.
        </p>

        <div className={classes.buttons}>
          <button
            type="button"
            className={classes.ordersButton}
            onClick={() => navigate("/orders")}
          >
            View Orders
          </button>

          <button
            type="button"
            className={classes.shoppingButton}
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>
        </div>
      </div>

      <div className={classes.features}>
        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <FiTruck />
          </div>

          <div className={classes.featureText}>
            <strong>Free Shipping</strong>
            <span>On orders over $50</span>
          </div>
        </div>

        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <FiShield />
          </div>

          <div className={classes.featureText}>
            <strong>Secure Payment</strong>
            <span>100% secure checkout</span>
          </div>
        </div>

        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <FiRefreshCcw />
          </div>

          <div className={classes.featureText}>
            <strong>Easy Returns</strong>
            <span>30-day return policy</span>
          </div>
        </div>

        <div className={classes.feature}>
          <div className={classes.featureIcon}>
            <FiHeadphones />
          </div>

          <div className={classes.featureText}>
            <strong>24/7 Support</strong>
            <span>We're here to help</span>
          </div>
        </div>
      </div>
    </main>
  );
};

export default OrderSuccess;