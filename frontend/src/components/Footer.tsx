import classes from "./Footer.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaInstagram,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal,
  FaCcAmex
} from "react-icons/fa";


const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer id="about-us" className={classes.footer}>

      <div className={classes.container}>

        <div className={classes.brand}>
          <div className={classes.logo}>
            <span>The Shopping</span>
            <span className={classes.hub}>Hub</span>
          </div>

          <p>
            Your one-stop shop for premium tech products and accessories.
          </p>

          <div className={classes.social}>
            <div><FaFacebookF /></div>
            <div><FaTwitter /></div>
            <div><FaYoutube /></div>
            <div><FaInstagram /></div>
          </div>
        </div>


        <div className={classes.column}>
          <h3>Shop</h3>
          <a>Laptops</a>
          <a>Smartphones</a>
          <a>Accessories</a>
          <a>Gaming</a>
        </div>


        <div className={classes.column}>
          <h3>Customer Service</h3>
          <a>Contact Us</a>
          <a>FAQ</a>
          <a>Shipping</a>
          <a>Returns</a>
        </div>


        <div className={classes.column}>
          <h3>Company</h3>
          <a>About Us</a>
          <a>Careers</a>
          <a>Blog</a>
          <a>Privacy Policy</a>
        </div>


        <div className={classes.subscribe}>
          <h3>Stay Updated</h3>

          <p>
            Subscribe the latest news, offers and updates.
          </p>

          <div className={classes.emailBox}>
            <input
              type="email"
              placeholder="Enter your email"
            />

            <button>
              Subscribe
            </button>
          </div>
        </div>

      </div>


      <div className={classes.bottom}>

        <div className={classes.copyright}>
          © {year} The Shopping Hub. All rights reserved.
        </div>


        <div className={classes.payment}>
          <span>We accept:</span>

          <div className={classes.paymentCards}>

            <div className={classes.card}>
              <FaCcVisa />
            </div>

            <div className={classes.card}>
              <FaCcMastercard />
            </div>

            <div className={classes.card}>
              <FaCcPaypal />
            </div>

            <div className={classes.card}>
              <FaCcAmex />
            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;
