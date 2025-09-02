import { useState } from "react";
import classes from "./UserInfoSettings.module.css";
import { useAuthContext } from "../context/AuthProvider";

const UserInfo = () => {
  const { user, token, updateUser} = useAuthContext();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleUpdateInfo = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    const response = await fetch("https://the-shopping-hub-backend-production.up.railway.app/api/user/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) throw new Error("Update failed!");
    const data = await response.json();
    updateUser(data.user);
    setMessage("User info updated successfully!");
  } catch (error) {
    setMessage("Error: " + (error as Error).message);
  }
};

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match!");
      return;
    }
    try {
      const response = await fetch(
        "https://the-shopping-hub-backend-production.up.railway.app/api/user/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      if (!response.ok) throw new Error("Password update failed!");
      setMessage("Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setMessage("Error: " + (error as Error).message);
    }
  };

  if (!user) return <p className={classes.message}>No user info available</p>;

  return (
    <div className={classes.userInfoContainer}>
      <h2 className={classes.title}>User Information</h2>

      {message && <p className={classes.message}>{message}</p>}

      <div className={classes.card}>
        <div className={classes.formsWrapper}>
          {/* Username & Email */}
          <form
            onSubmit={handleUpdateInfo}
            className={classes.formSection}
            noValidate
          >
            <label>
              Username
              <input type="text" value={username} readOnly />
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <button type="submit" className={classes.submitButton}>
              Update Info
            </button>
          </form>

          {/* Password */}
          <form
            onSubmit={handlePasswordChange}
            className={classes.formSection}
            noValidate
          >
            <label>
              Current Password
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </label>
            <label>
              New Password
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </label>
            <label>
              Confirm New Password
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </label>
            <button type="submit" className={classes.submitButton}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserInfo;
