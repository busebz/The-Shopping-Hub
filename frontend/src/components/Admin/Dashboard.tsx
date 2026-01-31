import { useEffect, useState } from "react";
import classes from "./Dashboard.module.css";

const API_URL = "http://localhost:5000/api/admin/dashboard";

type Order = {
  user: string;
  total: number;
  date: string;
};

const Dashboard = () => {
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

        if (!res.ok) {
          setError(data.message || "Failed to load dashboard");
          return;
        }

        setTotalProducts(data.totalProducts ?? 0);
        setTotalOrders(data.totalOrders ?? 0);
        setTotalUsers(data.totalUsers ?? 0);
        setRecentOrders(Array.isArray(data.recentOrders) ? data.recentOrders : []);
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
    <>
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
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Dashboard;
