import classes from "./Footer.module.css";

const Footer = () => {
  const year: number = new Date().getFullYear();

  const content = (
    <footer className={classes.footer}>
      <p>Shopping Cart &copy; {year} </p>
    </footer>
  );

  return content;
};

export default Footer;
