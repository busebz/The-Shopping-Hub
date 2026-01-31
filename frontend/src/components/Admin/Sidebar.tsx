import {
  FaBars,
  FaTachometerAlt,
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaSignOutAlt,
  FaPlus,
  FaList,
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import classes from "./Sidebar.module.css";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <aside
      className={`${classes.sidebar} ${sidebarOpen ? "" : classes.collapsed
        }`}
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

        <li
          className={classes.menuItem}
          onClick={() => navigate("/admin/products")}
        >
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

        <li
          className={classes.menuItem}
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/admin/login";
          }}
        >
          <FaSignOutAlt className={classes.icon} />
          {sidebarOpen && <span className={classes.menuText}>Logout</span>}
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
