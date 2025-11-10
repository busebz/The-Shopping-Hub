import { useState } from "react";
import classes from "./UserInfoSettings.module.css";
import { useAuthContext } from "../context/AuthProvider";

const API_URL =
  import.meta.env.API_URL ||
  "https://theshoppinghubstore.azurewebsites.net";

const UserInfo = () => {
  const { user, token, updateUser } = useAuthContext();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRequest = async (
    url: string,
    method: "PUT" | "POST",
    body: object,
    onSuccess?: (data: any) => void
  ) => {
    setStatus({ loading: true, success: "", error: "" });
    try {
      const response = await fetch(`${API_URL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Request failed");

      onSuccess?.(data);
      setStatus({ loading: false, success: "Updated successfully!", error: "" });
    } catch (err) {
      setStatus({
        loading: false,
        success: "",
        error: (err as Error).message,
      });
    }
  };

  const handleUpdateInfo = (e: React.FormEvent) => {
    e.preventDefault();
    handleRequest("/api/user/update-user", "PUT", { email: formData.email }, (data) =>
      updateUser(data.user)
    );
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setStatus({ loading: false, success: "", error: "Passwords do not match!" });
      return;
    }
    handleRequest("/api/user/change-password", "POST", {
      oldPassword: formData.oldPassword,
      newPassword: formData.newPassword,
    });
    setFormData((prev) => ({
      ...prev,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    }));
  };

  if (!user) return <p className={classes.message}>No user info available</p>;

  return (
    <div className={classes.userInfoContainer}>
      <h2 className={classes.title}>User Information</h2>

      {status.success && (
        <p className={`${classes.message} ${classes.success}`}>{status.success}</p>
      )}
      {status.error && (
        <p className={`${classes.message} ${classes.error}`}>{status.error}</p>
      )}

      <div className={classes.card}>
        <div className={classes.formsWrapper}>
          {/* User Info Update */}
          <form onSubmit={handleUpdateInfo} className={classes.formSection} noValidate>
            <label>
              Username
              <input type="text" value={user?.username || ""} readOnly />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </label>
            <button
              type="submit"
              className={classes.submitButton}
              disabled={status.loading}
            >
              {status.loading ? "Updating..." : "Update Info"}
            </button>
          </form>

          {/* Password Update */}
          <form onSubmit={handlePasswordChange} className={classes.formSection} noValidate>
            <label>
              Current Password
              <input
                name="oldPassword"
                type="password"
                value={formData.oldPassword}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              New Password
              <input
                name="newPassword"
                type="password"
                value={formData.newPassword}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Confirm New Password
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </label>
            <button
              type="submit"
              className={classes.submitButton}
              disabled={status.loading}
            >
              {status.loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
