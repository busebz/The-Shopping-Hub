import { useNavigate, useLocation } from "react-router-dom";
import classes from "./Nav.module.css";
import { useAuth } from "../hooks/useAuth";

type PropsType = {
  totalItems: number;
};

const Nav = ({ totalItems }: PropsType) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, isAuthenticated } = useAuth();

  const isCartPage = location.pathname === "/cart";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

  return (
    <nav className={classes.nav}>
      {isAuthenticated ? (
        <div className={classes.profileMenuWrapper}>
          <button className={`${classes.navButton} ${classes.logoutButton}`}>
            My Profile
          </button>
          <div className={classes.profileDropdown}>
            <button
              className={classes.profileItem}
              onClick={() => navigate("/orders")}
            >
              My Orders
            </button>
            <button
              className={classes.profileItem}
              onClick={() => navigate("/orders")}
            >
              User Info Settings
            </button>
            <button className={classes.profileItem} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className={classes.navButton}
        >
          Login
        </button>
      )}
      {button}
    </nav>
  );
};

export default Nav;
