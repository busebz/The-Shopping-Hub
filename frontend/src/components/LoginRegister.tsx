import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingBag } from "react-icons/fi";
import classes from "./LoginRegister.module.css";
import { useAuthContext } from "../context/AuthProvider";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

type FormState = {
  email: string;
  password: string;
  confirmPassword: string;
};

type FormErrors = Partial<
  Record<"email" | "password" | "confirmPassword" | "general", string>
>;

type PasswordInputProps = {
  id: "password" | "confirmPassword";
  placeholder: string;
  value: string;
  error?: string;
  showPassword: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTogglePassword: () => void;
};

const LockIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="4"
      y="10"
      width="16"
      height="10"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 10V7.5C8 5.57 9.57 4 11.5 4H12.5C14.43 4 16 5.57 16 7.5V10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M2.5 12S6 6.5 12 6.5S21.5 12 21.5 12S18 17.5 12 17.5S2.5 12 2.5 12Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <circle
      cx="12"
      cy="12"
      r="2.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M3 3L21 21"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M10.5 6.8C11 6.6 11.5 6.5 12 6.5C18 6.5 21.5 12 21.5 12C20.7 13.2 19.6 14.5 18.3 15.5M6.2 6.2C4.5 7.5 3.3 9.1 2.5 12C2.5 12 6 17.5 12 17.5C13.2 17.5 14.3 17.3 15.3 16.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EmailIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect
      x="3"
      y="5"
      width="18"
      height="14"
      rx="2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M3.5 7L12 13L20.5 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PasswordInput = ({
  id,
  placeholder,
  value,
  error,
  showPassword,
  onChange,
  onTogglePassword,
}: PasswordInputProps) => (
  <div className={classes.formGroup}>
    <label htmlFor={id}>
      {id === "password" ? "Password" : "Confirm Password"}
    </label>

    <div
      className={`${classes.inputWrapper} ${
        error ? classes.inputError : ""
      }`}
    >
      <span className={classes.inputIcon}>
        <LockIcon />
      </span>

      <input
        id={id}
        type={showPassword ? "text" : "password"}
        name={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />

      <button
        type="button"
        className={classes.eyeIcon}
        onClick={onTogglePassword}
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>

    {error && <span className={classes.errorText}>{error}</span>}
  </div>
);

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState<FormState>({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();
  const { loginUser } = useAuthContext();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      general: "",
    }));
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    const { email, password, confirmPassword } = form;

    if (!email.includes("@")) {
      newErrors.email = "Please enter a valid email";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const endpoint = `${API_URL}/api/auth/${
        isLogin ? "login" : "register"
      }`;

      const body = isLogin
        ? {
            email: form.email,
            password: form.password,
          }
        : {
            username: form.email.split("@")[0],
            email: form.email,
            password: form.password,
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        const field: "email" | "password" = data.message
          ?.toLowerCase()
          .includes("email")
          ? "email"
          : "password";

        setErrors({
          [field]: data.message,
        });

        return;
      }

      if (isLogin) {
        loginUser(data.data.user, data.data.token);
        navigate("/");
      } else {
        setIsLogin(true);

        setForm({
          email: form.email,
          password: "",
          confirmPassword: "",
        });

        navigate("/login");
      }
    } catch {
      setErrors({
        general: "Server error. Please try again.",
      });
    }
  };

  const switchMode = (login: boolean) => {
    setIsLogin(login);
    setErrors({});
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className={classes.page}>
      <div className={classes.leftSide}>
        <div
          className={classes.logo}
          onClick={() => navigate("/")}
          role="button"
          tabIndex={0}
        >
          <FiShoppingBag aria-hidden="true" />

          <span>
            TheShopping<span>Hub</span>
          </span>
        </div>
      </div>

      <div className={classes.rightSide}>
        <div className={classes.authCard}>
          <div className={classes.cardHeader}>
            <h1>{isLogin ? "Welcome Back" : "Create Account"}</h1>

            <p>
              {isLogin
                ? "Sign in to continue to The Shopping Hub"
                : "Create your account to get started"}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label htmlFor="email">Email</label>

              <div
                className={`${classes.inputWrapper} ${
                  errors.email ? classes.inputError : ""
                }`}
              >
                <span className={classes.inputIcon}>
                  <EmailIcon />
                </span>

                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {errors.email && (
                <span className={classes.errorText}>{errors.email}</span>
              )}
            </div>

            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={form.password}
              error={errors.password}
              showPassword={showPassword}
              onChange={handleChange}
              onTogglePassword={() =>
                setShowPassword((prev) => !prev)
              }
            />

            {!isLogin && (
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                error={errors.confirmPassword}
                showPassword={showConfirmPassword}
                onChange={handleChange}
                onTogglePassword={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
              />
            )}

            {isLogin && (
              <div className={classes.loginOptions}>
                <label className={classes.rememberMe}>
                  <input type="checkbox" />
                  <span>Remember me</span>
                </label>
              </div>
            )}

            {errors.general && (
              <div className={classes.generalError}>
                {errors.general}
              </div>
            )}

            <button type="submit" className={classes.authButton}>
              {isLogin ? "Login" : "Register"}
            </button>
          </form>

          <div className={classes.toggleText}>
            {isLogin ? (
              <>
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode(false)}
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => switchMode(true)}
                >
                  Login here
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;