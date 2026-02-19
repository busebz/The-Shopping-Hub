import Nav from "./Nav";
import classes from "./Header.module.css";
import useCart from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Header = () => {
  const {totalItems} = useCart();
  const navigate = useNavigate();
  const { isUserAuthenticated } = useAuth();

  const handleLogoClick = () => {
    if (isUserAuthenticated) {
      navigate("/");
    }
  };

  const content = (
    <header className={classes.header}>
      <div className={classes.header_titlebar}>
        <span
          onClick={handleLogoClick}
          className={classes.logo}
          style={{ cursor: isUserAuthenticated ? "pointer" : "default" }}
        >
          TheShoppingHub
        </span>
          <div className={classes.header_pricebox}>
            <Nav totalItems={totalItems} />
          </div>
        
      </div>
    </header>
  );

  return content;
};

export default Header;  