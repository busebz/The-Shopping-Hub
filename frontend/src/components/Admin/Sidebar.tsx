import {
  FaBars,
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthProvider";
import classes from "./Sidebar.module.css";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const { logoutAdmin } = useAuthContext();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login", { replace: true });
  };

  return (
    <aside
      className={`${classes.sidebar} ${sidebarOpen ? "" : classes.collapsed}`}
    >
      <div className={classes.top}>
        <button
          className={classes.toggle}
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FaBars />
        </button>
        {sidebarOpen && <span className={classes.brand}>Admin Panel</span>}
      </div>

      <ul className={classes.menu}>
        <li className={classes.menuItem} onClick={() => navigate("/admin/dashboard")}>
          <FaTachometerAlt className={classes.icon} />
          {sidebarOpen && <span className={classes.menuText}>Dashboard</span>}
        </li>

        <li className={classes.menuItem} onClick={() => navigate("/admin/products")}>
          <FaBoxOpen className={classes.icon} />
          {sidebarOpen && <span className={classes.menuText}>Products</span>}
        </li>

        <li className={classes.menuItem} onClick={() => navigate("/admin/orders")}>
          <FaClipboardList className={classes.icon} />
          {sidebarOpen && <span className={classes.menuText}>Orders</span>}
        </li>

        <li className={classes.menuItem} onClick={() => navigate("/admin/users")}>
          <FaUsers className={classes.icon} />
          {sidebarOpen && <span className={classes.menuText}>Users</span>}
        </li>

        <li className={classes.menuItem} onClick={handleLogout}>
          <FaSignOutAlt className={classes.icon} />
          {sidebarOpen && <span className={classes.menuText}>Logout</span>}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
