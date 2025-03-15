import Nav from "./Nav";
import classes from "./Header.module.css";
import useCart from "../hooks/useCart";

type PropsType = {
  viewCart: boolean;
  setViewCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ viewCart, setViewCart }: PropsType) => {
  const { totalItems} = useCart();

  const content = (
    <header className={classes.header}>
      <div className={classes.header_titlebar}>
        <a href="/" className={classes.logo}>TheShoppingHub</a>
        <div className={classes.header_pricebox}>
          <Nav viewCart={viewCart} setViewCart={setViewCart} totalItems = {totalItems}/>
        </div>
      </div>
    </header>
  );

  return content;
};

export default Header;
