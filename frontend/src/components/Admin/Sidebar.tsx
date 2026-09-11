import {
  FaBars,
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";

import classes from "./Sidebar.module.css";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  const { logoutAdmin } = useAuthContext();

  const handleLogout = () => {
    logoutAdmin();

    navigate("/admin/login", {
      replace: true,
    });
  };

  const isActive = (path: string) =>
    location.pathname.startsWith(path);

  return (
    <aside
      className={`${classes.sidebar} ${
        sidebarOpen
          ? ""
          : classes.collapsed
      }`}
    >
      <div className={classes.top}>
        {sidebarOpen && (
          <div className={classes.brandText}>
            <span className={classes.brand}>
              TheShopping
              <strong>Hub</strong>
            </span>

            <span
              className={classes.adminText}
            >
              ADMIN PANEL
            </span>
          </div>
        )}

        <button
          type="button"
          className={classes.toggle}
          onClick={() =>
            setSidebarOpen(
              (prev) => !prev
            )
          }
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
      </div>

      <ul className={classes.menu}>
        <li
          className={`${
            classes.menuItem
          } ${
            isActive(
              "/admin/dashboard"
            )
              ? classes.active
              : ""
          }`}
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          <FaTachometerAlt
            className={classes.icon}
          />

          {sidebarOpen && (
            <span
              className={
                classes.menuText
              }
            >
              Dashboard
            </span>
          )}
        </li>

        <li
          className={`${
            classes.menuItem
          } ${
            isActive(
              "/admin/products"
            )
              ? classes.active
              : ""
          }`}
          onClick={() =>
            navigate(
              "/admin/products"
            )
          }
        >
          <FaBoxOpen
            className={classes.icon}
          />

          {sidebarOpen && (
            <span
              className={
                classes.menuText
              }
            >
              Products
            </span>
          )}
        </li>

        <li
          className={
            classes.menuItem
          }
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          <FaClipboardList
            className={classes.icon}
          />

          {sidebarOpen && (
            <span
              className={
                classes.menuText
              }
            >
              Orders
            </span>
          )}
        </li>

        <li
          className={
            classes.menuItem
          }
          onClick={() =>
            navigate(
              "/admin/dashboard"
            )
          }
        >
          <FaUsers
            className={classes.icon}
          />

          {sidebarOpen && (
            <span
              className={
                classes.menuText
              }
            >
              Users
            </span>
          )}
        </li>
      </ul>

      <div className={classes.bottom}>
        <button
          type="button"
          className={classes.logout}
          onClick={handleLogout}
        >
          <FaSignOutAlt
            className={classes.icon}
          />

          {sidebarOpen && (
            <span>Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;