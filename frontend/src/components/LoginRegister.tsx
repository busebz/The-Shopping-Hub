import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./LoginRegister.module.css";
import { useAuth } from "../hooks/useAuth";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string; confirm?: string }>({});

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: typeof errors = {};

    if (!email.includes("@")) newErrors.email = "Please enter a valid email";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!isLogin && password !== confirmPassword) {
      newErrors.password = "Passwords do not match";
      newErrors.confirm = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await fetch(`https://the-shopping-hub-backend-production.up.railway.app/api/auth/${isLogin ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? { email, password }
            : { username: email.split("@")[0], email, password }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message?.toLowerCase().includes("email")) {
          setErrors({ email: data.message });
        } else {
          setErrors({ password: data.message });
        }
        return;
      }

      if (isLogin) {
        login(data.user, data.token);
        navigate("/");
      } else {
        navigate("/login");
        setIsLogin(true);
      }
    } catch {
      setErrors({ email: "Server error. Please try again." });
    }
  };

  return (
    <div className={classes.authContainer}>
      <h2 className={classes.authTitle}>{isLogin ? "Login" : "Register"}</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div className={classes.formGroup}>
          <input
            type="email"
            placeholder="Email"
            className={`${classes.authInput} ${errors.email ? classes.inputError : ""}`}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            required
          />
          {errors.email && <p className={classes.errorText}>{errors.email}</p>}
        </div>

        <div className={classes.formGroup}>
          <input
            type="password"
            placeholder="Password"
            className={`${classes.authInput} ${errors.password ? classes.inputError : ""}`}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: "" }));
            }}
            required
          />
          {errors.password && <p className={classes.errorText}>{errors.password}</p>}
        </div>

        {!isLogin && (
          <div className={classes.formGroup}>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`${classes.authInput} ${errors.confirm ? classes.inputError : ""}`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setErrors((prev) => ({ ...prev, confirm: "" }));
              }}
              required
            />
            {errors.confirm && <p className={classes.errorText}>{errors.confirm}</p>}
          </div>
        )}

        <div className={classes.buttonWrapper}>
          <button className={classes.authButton} type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </div>
      </form>

      <p className={classes.toggleText}>
        {isLogin ? (
          <>
            Don't have an account?{" "}
            <span onClick={() => setIsLogin(false)}>Register here</span>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <span onClick={() => setIsLogin(true)}>Login here</span>
          </>
        )}
      </p>
    </div>
  );
};

export default LoginRegister;
