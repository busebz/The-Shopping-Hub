import Nav from "./Nav";
import classes from "./Header.module.css";
import useCart from "../hooks/useCart";
import { useLocation } from "react-router-dom";

const Header = () => {
  const {totalItems} = useCart();
  const location = useLocation();

  const showNav = location.pathname !== "/login";

  const content = (
    <header className={classes.header}>
      <div className={classes.header_titlebar}>
        <a href="/" className={classes.logo}>TheShoppingHub</a>
        {showNav && (
          <div className={classes.header_pricebox}>
            <Nav totalItems={totalItems} />
          </div>
        )}
      </div>
    </header>
  );

  return content;
};

export default Header;
