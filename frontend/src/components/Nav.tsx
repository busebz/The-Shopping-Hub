import { useNavigate, useLocation } from "react-router-dom";
import classes from "./Nav.module.css";

type PropsType = {
  totalItems: number;
};

const Nav = ({totalItems} : PropsType) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isCartPage = location.pathname === "/cart";

  const button = isCartPage ? (
    <button onClick={() => navigate("/")} className={classes.navButton}>
      View Products
    </button>
  ) : (
    <button onClick={() => navigate("/cart")} className={classes.navButton}>
      <i className="fa-solid fa-cart-shopping"></i> Confirm Cart
      {totalItems > 0 && (
        <span className={classes.itemCount}>{totalItems}</span>
      )}
    </button>
  );

  const content = <nav className={classes.nav}>{button}</nav>;
  return content;
};

export default Nav;
