import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import classes from "./Nav.module.css";
import { useAuth } from "../hooks/useAuth";

type PropsType = {
  totalItems: number;
};

type SearchProduct = {
  id: string;
  name: string;
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Nav = ({ totalItems }: PropsType) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<SearchProduct[]>([]);

  const {
    isUserAuthenticated,
    logoutUser,
  } = useAuth();

  useEffect(() => {
    const controller = new AbortController();

    fetch(`${API_URL}/api/products`, {
      signal: controller.signal,
    })
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        if (error.name !== "AbortError") {
          setProducts([]);
        }
      });

    return () => controller.abort();
  }, []);

  const suggestions = useMemo(() => {
    const query = searchTerm
      .trim()
      .toLocaleLowerCase();

    if (!query) return [];

    return products
      .filter((product) =>
        product.name
          .toLocaleLowerCase()
          .includes(query)
      )
      .slice(0, 5);
  }, [products, searchTerm]);

  const goToSection = (sectionId: string) => {
    if (
      location.pathname === "/" &&
      !location.search
    ) {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({
          behavior: "smooth",
        });

      return;
    }

    navigate(`/#${sectionId}`);
  };

  const goHome = () => {
    if (
      location.pathname === "/" &&
      !location.search &&
      !location.hash
    ) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    navigate("/");
  };

  const searchProducts = () => {
    const query = searchTerm.trim();

    navigate(
      query
        ? `/?search=${encodeURIComponent(
            query
          )}#products`
        : "/#products"
    );
  };

  const selectSuggestion = (
    productName: string
  ) => {
    setSearchTerm(productName);

    navigate(
      `/?search=${encodeURIComponent(
        productName
      )}#products`
    );
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/");
  };

  return (
    <nav className={classes.nav}>
      <div className={classes.menu}>
        <button
          onClick={goHome}
          className={
            location.pathname === "/" &&
            !location.hash
              ? classes.active
              : ""
          }
        >
          Home
        </button>

        <button
          onClick={() =>
            goToSection("products")
          }
          className={
            location.hash === "#products"
              ? classes.active
              : ""
          }
        >
          Products
        </button>

        <button
          onClick={() =>
            goToSection("categories")
          }
          className={
            location.hash === "#categories"
              ? classes.active
              : ""
          }
        >
          Categories
        </button>

        <button
          onClick={() =>
            goToSection("about-us")
          }
          className={
            location.hash === "#about-us"
              ? classes.active
              : ""
          }
        >
          About Us
        </button>
      </div>

      <div className={classes.actions}>
        <div className={classes.search}>
          <input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                searchProducts();
              }
            }}
          />

          <i
            className="fa-solid fa-magnifying-glass"
            onClick={searchProducts}
            role="button"
            aria-label="Search products"
          />

          {suggestions.length > 0 && (
            <div
              className={
                classes.suggestions
              }
            >
              {suggestions.map(
                (product) => (
                  <button
                    key={product.id}
                    type="button"
                    className={
                      classes.suggestion
                    }
                    onClick={() =>
                      selectSuggestion(
                        product.name
                      )
                    }
                  >
                    {product.name}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        <div
          className={
            classes.profileWrapper
          }
        >
          <button
            className={classes.login}
            onClick={() =>
              navigate(
                isUserAuthenticated
                  ? "/userinfo"
                  : "/login"
              )
            }
          >
            <i className="fa-regular fa-user" />

            {isUserAuthenticated
              ? "Profile"
              : "Login"}
          </button>

          {isUserAuthenticated && (
            <div
              className={
                classes.profileDropdown
              }
            >
              <button
                type="button"
                onClick={() =>
                  navigate("/orders")
                }
              >
                My Orders
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate("/userinfo")
                }
              >
                User Info Settings
              </button>

              <button
                type="button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          className={classes.cart}
          onClick={() =>
            navigate("/cart")
          }
        >
          <i className="fa-solid fa-cart-shopping" />

          {totalItems > 0 && (
            <span
              className={classes.badge}
            >
              {totalItems}
            </span>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Nav;