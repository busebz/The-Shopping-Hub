import { useEffect, useState } from "react";
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
import classes from "./Dashboard.module.css";

const API_URL = "http://localhost:5000/api/admin/dashboard";

type Order = {
  user: string;
  total: number;
  date: string;
};

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState("Dashboard");
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);

  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Unauthorized");
          setLoading(false);
          return;
        }

        const res = await fetch(API_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        console.log(data)
        if (!res.ok) {
          setError(data.message || "Failed to load dashboard");
          setLoading(false);
          return;
        }

        setTotalProducts(data.totalProducts || 0);
        setTotalOrders(data.totalOrders || 0);
        setTotalUsers(data.totalUsers || 0);
        setRecentOrders(
          Array.isArray(data.recentOrders) ? data.recentOrders : []
        );
      } catch {
        setError("Server error");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <div className={classes.main}>Loading dashboard...</div>;
  }

  if (error) {
    return <div className={classes.main}>{error}</div>;
  }

  return (
    <div className={classes.container}>
      <aside
        className={`${classes.sidebar} ${
          sidebarOpen ? "" : classes.collapsed
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
          <li
            className={`${classes.menuItem} ${
              activeMenu === "Dashboard" ? classes.active : ""
            }`}
            onClick={() => setActiveMenu("Dashboard")}
          >
            <FaTachometerAlt className={classes.icon} />
            {sidebarOpen && <span className={classes.menuText}>Dashboard</span>}
          </li>

          <li
            className={`${classes.menuItem} ${
              activeMenu === "Products" ? classes.active : ""
            }`}
            onClick={() => {
              setActiveMenu("Products");
              setProductsMenuOpen(!productsMenuOpen);
            }}
          >
            <FaBoxOpen className={classes.icon} />
            {sidebarOpen && <span className={classes.menuText}>Products</span>}
          </li>

          {sidebarOpen && productsMenuOpen && (
            <ul className={classes.subMenu}>
              <li
                className={classes.menuItem}
                onClick={() => setActiveMenu("ListProducts")}
              >
                <FaList className={classes.icon} />
                <span className={classes.menuText}>List Products</span>
              </li>
              <li
                className={classes.menuItem}
                onClick={() => setActiveMenu("AddProduct")}
              >
                <FaPlus className={classes.icon} />
                <span className={classes.menuText}>Add Product</span>
              </li>
            </ul>
          )}

          <li
            className={`${classes.menuItem} ${
              activeMenu === "Orders" ? classes.active : ""
            }`}
            onClick={() => setActiveMenu("Orders")}
          >
            <FaClipboardList className={classes.icon} />
            {sidebarOpen && <span className={classes.menuText}>Orders</span>}
          </li>

          <li
            className={`${classes.menuItem} ${
              activeMenu === "Users" ? classes.active : ""
            }`}
            onClick={() => setActiveMenu("Users")}
          >
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

      <main className={classes.main}>
        <h1>Dashboard</h1>

        <div className={classes.cards}>
          <div className={classes.card}>
            <h3>Total Products</h3>
            <p>{totalProducts}</p>
          </div>
          <div className={classes.card}>
            <h3>Total Orders</h3>
            <p>{totalOrders}</p>
          </div>
          <div className={classes.card}>
            <h3>Total Users</h3>
            <p>{totalUsers}</p>
          </div>
        </div>

        <div className={classes.recentOrders}>
          <h3>Recent Orders</h3>
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Total</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={3}>No orders found</td>
                </tr>
              ) : (
                recentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>{order.user}</td>
                    <td>{order.total} ₺</td>
                    <td>
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
