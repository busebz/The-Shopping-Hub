import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./LoginRegister.module.css";
import { useAuthContext } from "../context/AuthProvider";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://theshoppinghubstore.azurewebsites.net";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { loginUser } = useAuthContext(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const { email, password, confirmPassword } = form;

    if (!email.includes("@")) newErrors.email = "Please enter a valid email";
    if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!isLogin && password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

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
      const endpoint = `${API_URL}/api/auth/${isLogin ? "login" : "register"}`;
      const body = isLogin
        ? { email: form.email, password: form.password }
        : { username: form.email.split("@")[0], email: form.email, password: form.password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        const field = data.message?.toLowerCase().includes("email") ? "email" : "password";
        setErrors({ [field]: data.message });
        return;
      }

      if (isLogin) {
        loginUser(data.data.user, data.data.token); 
        navigate("/");
      } else {
        setIsLogin(true);
        navigate("/login");
      }
    } catch {
      setErrors({ general: "Server error. Please try again." });
    }
  };

  return (
    <div className={classes.authContainer}>
      <h2 className={classes.authTitle}>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div className={classes.formGroup}>
          <input type="email" name="email" placeholder="Email" className={`${classes.authInput} ${errors.email ? classes.inputError : ""}`} value={form.email} onChange={handleChange} required />
          {errors.email && <p className={classes.errorText}>{errors.email}</p>}
        </div>
        <div className={classes.formGroup}>
          <input type="password" name="password" placeholder="Password" className={`${classes.authInput} ${errors.password ? classes.inputError : ""}`} value={form.password} onChange={handleChange} required />
          {errors.password && <p className={classes.errorText}>{errors.password}</p>}
        </div>
        {!isLogin && (
          <div className={classes.formGroup}>
            <input type="password" name="confirmPassword" placeholder="Confirm Password" className={`${classes.authInput} ${errors.confirmPassword ? classes.inputError : ""}`} value={form.confirmPassword} onChange={handleChange} required />
            {errors.confirmPassword && <p className={classes.errorText}>{errors.confirmPassword}</p>}
          </div>
        )}
        {errors.general && <p className={classes.errorText}>{errors.general}</p>}
        <div className={classes.buttonWrapper}>
          <button className={classes.authButton} type="submit">{isLogin ? "Login" : "Register"}</button>
        </div>
      </form>
      <p className={classes.toggleText}>
        {isLogin ? (
          <>Don’t have an account? <span onClick={() => setIsLogin(false)}>Register here</span></>
        ) : (
          <>Already have an account? <span onClick={() => setIsLogin(true)}>Login here</span></>
        )}
      </p>
    </div>
  );
};

export default LoginRegister;
