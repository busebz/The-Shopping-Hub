import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import classes from "./Login.module.css";

import {
  FiBox,
  FiFileText,
  FiUsers,
  FiBarChart2,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShield,
  FiShoppingBag,
  FiArrowRight,
  FiAlertCircle,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { loginAdmin } = useAuthContext();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message ||
            "Invalid email or password."
        );
      }

      if (
        result.data.user.role !== "ADMIN"
      ) {
        throw new Error(
          "This account does not have admin access."
        );
      }

      loginAdmin(
        result.data.user,
        result.data.token
      );

      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (error: any) {
      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={classes.page}>
      <header className={classes.header}>
        <button
          type="button"
          className={classes.logo}
          onClick={() => navigate("/")}
        >
          <FiShoppingBag />

          <span>
            TheShopping<strong>Hub</strong>
          </span>
        </button>
      </header>

      <div className={classes.content}>
        <section className={classes.intro}>
          <div className={classes.adminLabel}>
            <span />
            ADMIN ACCESS
          </div>

          <h1>
            Manage
            <br />
            The Shopping Hub
          </h1>

          <p className={classes.description}>
            Sign in to your admin panel to manage
            products, orders, users and more.
          </p>

          <div className={classes.features}>
            <div className={classes.feature}>
              <div
                className={classes.featureIcon}
              >
                <FiBox />
              </div>

              <div>
                <strong>
                  Manage Products
                </strong>

                <span>
                  Add, edit and organize products
                </span>
              </div>
            </div>

            <div className={classes.feature}>
              <div
                className={classes.featureIcon}
              >
                <FiFileText />
              </div>

              <div>
                <strong>
                  Track Orders
                </strong>

                <span>
                  View and process orders
                </span>
              </div>
            </div>

            <div className={classes.feature}>
              <div
                className={classes.featureIcon}
              >
                <FiUsers />
              </div>

              <div>
                <strong>
                  Manage Users
                </strong>

                <span>
                  Control user accounts
                </span>
              </div>
            </div>

            <div className={classes.feature}>
              <div
                className={classes.featureIcon}
              >
                <FiBarChart2 />
              </div>

              <div>
                <strong>
                  View Analytics
                </strong>

                <span>
                  Monitor store performance
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className={classes.card}>
          <div className={classes.shieldIcon}>
            <FiShield />
          </div>

          <h2 className={classes.title}>
            Admin Panel
          </h2>

          <p className={classes.subtitle}>
            Sign in to continue
          </p>

          <form
            onSubmit={handleSubmit}
            className={classes.form}
          >
            {error && (
              <div
                className={classes.errorMessage}
                role="alert"
              >
                <div
                  className={classes.errorIcon}
                >
                  <FiAlertCircle />
                </div>

                <div
                  className={classes.errorContent}
                >
                  <strong>
                    Unable to sign in
                  </strong>

                  <span>{error}</span>
                </div>
              </div>
            )}

            <div
              className={`${classes.inputWrapper} ${
                error
                  ? classes.inputError
                  : ""
              }`}
            >
              <FiMail />

              <input
                type="email"
                name="email"
                placeholder="Admin Email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div
              className={`${classes.inputWrapper} ${
                error
                  ? classes.inputError
                  : ""
              }`}
            >
              <FiLock />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className={classes.eyeButton}
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showPassword ? (
                  <FiEyeOff />
                ) : (
                  <FiEye />
                )}
              </button>
            </div>

            <button
              className={classes.loginButton}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Login
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div
            className={classes.securityText}
          >
            <FiLock />

            <span>
              Only authorized administrators can
              access this area.
            </span>
          </div>
        </section>
      </div>

      <div
        className={classes.decorCircle}
      />
    </main>
  );
};

export default AdminLogin;