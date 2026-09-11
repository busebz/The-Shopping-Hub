import classes from "./PromoBanner.module.css";
import footer1 from "../../images/footer1.png";
import footer2 from "../../images/footer2.png";

const PromoBanner = () => {
    return (
        <section className={classes.container}>
            <div className={classes.banner}>
                <img
                    src={footer1}
                    alt="Promo Banner 1"
                />
            </div>

            <div className={classes.banner}>
                <img
                    src={footer2}
                    alt="Promo Banner 2"
                />
            </div>
        </section>
    );
};

export default PromoBanner;