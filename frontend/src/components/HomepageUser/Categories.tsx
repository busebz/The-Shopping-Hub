// Categories.tsx

import classes from "./Categories.module.css";
import { useNavigate } from "react-router-dom";

import {
  FaHeadphones,
  FaMobileAlt,
  FaGamepad,
  FaClock,
  FaHome,
  FaLaptop,
} from "react-icons/fa";

const categories = [
  {
    title: "Audio",
    icon: <FaHeadphones />,
  },
  {
    title: "Mobiles",
    icon: <FaMobileAlt />,
  },
  {
    title: "Accessories",
    icon: <FaGamepad />,
  },
  {
    title: "Wearables",
    icon: <FaClock />,
  },
  {
    title: "Smart Home",
    icon: <FaHome />,
  },
  {
    title: "Laptops",
    icon: <FaLaptop />,
  },
];

const Categories = () => {
  const navigate = useNavigate();

  const goToProducts = (category: string) => {
    navigate(`/?category=${encodeURIComponent(category)}#products`);
  };

  return (
    <section id="categories" className={classes.categories}>
      <div className={classes.list}>
        {categories.map((category) => (
          <button
            key={category.title}
            className={classes.card}
            onClick={() => goToProducts(category.title)}
          >
            <div className={classes.icon}>
              {category.icon}
            </div>

            <div>
              <h3>{category.title}</h3>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
