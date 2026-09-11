import Nav from "./Nav";
import classes from "./Header.module.css";
import useCart from "../hooks/useCart";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";

const Header = () => {
  const { totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <header className={classes.header}>
      <div className={classes.container}>
        <div
          className={classes.logo}
          onClick={() => navigate("/")}
        >
          <FiShoppingBag aria-hidden="true" />

          <span>
            TheShopping
            <span className={classes.hub}>
              Hub
            </span>
          </span>
        </div>

        <Nav totalItems={totalItems} />
      </div>
    </header>
  );
};

export default Header;
