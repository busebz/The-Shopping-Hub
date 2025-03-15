import classes from "./Nav.module.css";

type PropsType = {
  viewCart: boolean;
  setViewCart: React.Dispatch<React.SetStateAction<boolean>>;
  totalItems: number;
};

const Nav = ({ viewCart, setViewCart, totalItems }: PropsType) => {
  const button = viewCart ? (
    <button onClick={() => setViewCart(false)} className={classes.navButton}>
      View Products
    </button>
  ) : (
    <button onClick={() => setViewCart(true)} className={classes.navButton}>
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
