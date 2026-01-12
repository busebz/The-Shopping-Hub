import { useState } from "react";
import classes from "./Login.module.css";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Login failed");
      }

      if (result.data.user.role !== "ADMIN") {
        throw new Error("Admin access only");
      }
      localStorage.setItem("adminToken", result.data.token);
      console.log("Admin logged in:", result.data.user);
    } catch (error: any) {
      console.error("Admin login error:", error.message);
      alert(error.message);
    }
  };

  return (
    <div className={classes.container}>
      <div className={classes.card}>
        <h2 className={classes.title}>Admin Panel</h2>
        <p className={classes.subtitle}>Sign in to continue</p>

        <form onSubmit={handleSubmit}>
          <div className={classes.formGroup}>
            <input
              type="email"
              name="email"
              placeholder="Admin Email"
              value={form.email}
              onChange={handleChange}
              className={classes.input}
            />
          </div>

          <div className={classes.formGroup}>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className={classes.input}
            />
          </div>

          <button className={classes.button} type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
