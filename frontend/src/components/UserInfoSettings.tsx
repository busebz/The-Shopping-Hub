import { useState } from "react";
import classes from "./UserInfoSettings.module.css";
import { useAuthContext } from "../context/AuthProvider";

import {
  FiUser,
  FiLock,
  FiEye,
  FiEyeOff,
  FiTruck,
  FiShield,
  FiRefreshCcw,
  FiHeadphones,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://the-shopping-hub-backend.onrender.com";

const UserInfo = () => {
  const { user, userToken, updateUser } = useAuthContext();

  const [formData, setFormData] = useState({
    email: user?.email || "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [status, setStatus] = useState({
    loading: false,
    success: "",
    error: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRequest = async (
    url: string,
    method: "PUT" | "POST",
    body: object,
    onSuccess?: (data: any) => void
  ) => {
    setStatus({
      loading: true,
      success: "",
      error: "",
    });

    try {
      const response = await fetch(`${API_URL}${url}`, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }

      onSuccess?.(data);

      setStatus({
        loading: false,
        success: "Updated successfully!",
        error: "",
      });

      return true;
    } catch (err) {
      setStatus({
        loading: false,
        success: "",
        error: (err as Error).message,
      });

      return false;
    }
  };

  const handleUpdateInfo = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    handleRequest(
      "/api/user/update-user",
      "PUT",
      {
        email: formData.email,
      },
      (data) => updateUser(data.user)
    );
  };

  const handlePasswordChange = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      setStatus({
        loading: false,
        success: "",
        error: "Passwords do not match!",
      });

      return;
    }

    const success = await handleRequest(
      "/api/user/change-password",
      "POST",
      {
        oldPassword: formData.oldPassword,
        newPassword: formData.newPassword,
      }
    );

    if (success) {
      setFormData((prev) => ({
        ...prev,
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  if (!user) {
    return (
      <p className={classes.message}>
        No user info available
      </p>
    );
  }

  return (
    <main className={classes.page}>
      <div className={classes.userInfoContainer}>
        <div className={classes.pageHeader}>
          <h1 className={classes.title}>
            User Information
          </h1>

          <p className={classes.subtitle}>
            Manage your account details and keep your information up to date.
          </p>
        </div>

        {status.success && (
          <p
            className={`${classes.message} ${classes.success}`}
          >
            {status.success}
          </p>
        )}

        {status.error && (
          <p
            className={`${classes.message} ${classes.error}`}
          >
            {status.error}
          </p>
        )}

        <div className={classes.card}>
          <div className={classes.formsWrapper}>
            <form
              onSubmit={handleUpdateInfo}
              className={classes.formSection}
              noValidate
            >
              <div className={classes.sectionHeader}>
                <div className={classes.sectionIcon}>
                  <FiUser />
                </div>

                <div>
                  <h2>Personal Information</h2>

                  <p>
                    Update your personal details.
                  </p>
                </div>
              </div>

              <label>
                Username

                <input
                  type="text"
                  value={
                    user?.username ||
                    user?.email?.split("@")[0] ||
                    ""
                  }
                  readOnly
                />
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

              <p className={classes.inputHint}>
                Your email address is used for account updates and order information.
              </p>

              <button
                type="submit"
                className={classes.submitButton}
                disabled={status.loading}
              >
                {status.loading
                  ? "Updating..."
                  : "Update Info"}
              </button>
            </form>

            <div className={classes.divider} />

            <form
              onSubmit={handlePasswordChange}
              className={classes.formSection}
              noValidate
            >
              <div className={classes.sectionHeader}>
                <div className={classes.sectionIcon}>
                  <FiLock />
                </div>

                <div>
                  <h2>Change Password</h2>

                  <p>
                    Set a new password for your account.
                  </p>
                </div>
              </div>

              <label>
                Current Password

                <div className={classes.passwordInput}>
                  <input
                    name="oldPassword"
                    type={
                      showOldPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.oldPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowOldPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showOldPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </label>

              <label>
                New Password

                <div className={classes.passwordInput}>
                  <input
                    name="newPassword"
                    type={
                      showNewPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.newPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowNewPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showNewPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </label>

              <label>
                Confirm New Password

                <div className={classes.passwordInput}>
                  <input
                    name="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (prev) => !prev
                      )
                    }
                  >
                    {showConfirmPassword ? (
                      <FiEyeOff />
                    ) : (
                      <FiEye />
                    )}
                  </button>
                </div>
              </label>

              <button
                type="submit"
                className={classes.submitButton}
                disabled={status.loading}
              >
                {status.loading
                  ? "Updating..."
                  : "Update Password"}
              </button>
            </form>
          </div>
        </div>

        <div className={classes.features}>
          <div className={classes.feature}>
            <div className={classes.featureIcon}>
              <FiTruck />
            </div>

            <div className={classes.featureText}>
              <strong>Free Shipping</strong>
              <span>On orders over $50</span>
            </div>
          </div>

          <div className={classes.feature}>
            <div className={classes.featureIcon}>
              <FiShield />
            </div>

            <div className={classes.featureText}>
              <strong>Secure Payment</strong>
              <span>100% secure checkout</span>
            </div>
          </div>

          <div className={classes.feature}>
            <div className={classes.featureIcon}>
              <FiRefreshCcw />
            </div>

            <div className={classes.featureText}>
              <strong>Easy Returns</strong>
              <span>30-day return policy</span>
            </div>
          </div>

          <div className={classes.feature}>
            <div className={classes.featureIcon}>
              <FiHeadphones />
            </div>

            <div className={classes.featureText}>
              <strong>24/7 Support</strong>
              <span>We're here to help</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default UserInfo;