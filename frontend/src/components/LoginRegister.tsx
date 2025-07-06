import { useState } from "react";
import classes from "./LoginRegister.module.css";

const LoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className={classes.authContainer}>
      <h2 className={classes.authTitle}>{isLogin ? "Login" : "Register"}</h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <input
          className={classes.authInput}
          type="email"
          placeholder="Email"
          required
        />

        <input
          className={classes.authInput}
          type="password"
          placeholder="Password"
          required
        />

        {!isLogin && (
          <input
            className={classes.authInput}
            type="password"
            placeholder="Confirm Password"
            required
          />
        )}

        <button className={classes.authButton} type="submit">
          {isLogin ? "Login" : "Register"}
        </button>
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
