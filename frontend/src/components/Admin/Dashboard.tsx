import { useEffect, useState } from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaUsers,
  FaArrowTrendUp,
} from "react-icons/fa6";

import classes from "./Dashboard.module.css";

type Order = {
  user: string;
  total: number;
  date: string;
};

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
          setError("Unauthorized");
          return;
        }

        const res = await fetch(
          `${API_URL}/api/admin/dashboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          setError(
            data.message ||
              "Failed to load dashboard"
          );
          return;
        }

        setTotalProducts(
          data.totalProducts ?? 0
        );

        setTotalOrders(
          data.totalOrders ?? 0
        );

        setTotalUsers(
          data.totalUsers ?? 0
        );

        setRecentOrders(
          Array.isArray(data.recentOrders)
            ? data.recentOrders
            : []
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
    return (
      <div className={classes.dashboard}>
        <div className={classes.loading}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.dashboard}>
        <div className={classes.error}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className={classes.dashboard}>
      <div className={classes.pageHeader}>
        <div>
          <span className={classes.eyebrow}>
            ADMIN OVERVIEW
          </span>

          <h1>Dashboard</h1>

          <p>
            Welcome back. Here's an overview of your store.
          </p>
        </div>

        <div className={classes.headerBadge}>
          <FaArrowTrendUp />

          <span>
            Store Overview
          </span>
        </div>
      </div>

      <div className={classes.cards}>
        <div className={classes.card}>
          <div className={classes.cardIconWrapper}>
            <FaBoxOpen />
          </div>

          <div className={classes.cardContent}>
            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              Products currently listed
            </small>
          </div>
        </div>

        <div className={classes.card}>
          <div className={classes.cardIconWrapper}>
            <FaClipboardList />
          </div>

          <div className={classes.cardContent}>
            <span>
              Total Orders
            </span>

            <strong>
              {totalOrders}
            </strong>

            <small>
              Orders placed by customers
            </small>
          </div>
        </div>

        <div className={classes.card}>
          <div className={classes.cardIconWrapper}>
            <FaUsers />
          </div>

          <div className={classes.cardContent}>
            <span>
              Total Users
            </span>

            <strong>
              {totalUsers}
            </strong>

            <small>
              Registered customers
            </small>
          </div>
        </div>
      </div>

      <div className={classes.recentOrders}>
        <div className={classes.sectionHeader}>
          <div>
            <h2>
              Recent Orders
            </h2>

            <p>
              Latest customer orders placed in your store.
            </p>
          </div>

          <span className={classes.orderCount}>
            {recentOrders.length} recent
          </span>
        </div>

        <div className={classes.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>
                  Customer
                </th>

                <th>
                  Total
                </th>

                <th>
                  Order Date
                </th>
              </tr>
            </thead>

            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className={classes.empty}
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                recentOrders.map(
                  (order, index) => (
                    <tr key={index}>
                      <td>
                        <div className={classes.userCell}>
                          <div className={classes.avatar}>
                            {order.user
                              ?.charAt(0)
                              .toUpperCase() ||
                              "U"}
                          </div>

                          <span>
                            {order.user}
                          </span>
                        </div>
                      </td>

                      <td>
                        <span className={classes.total}>
                          $
                          {Number(
                            order.total
                          ).toFixed(2)}
                        </span>
                      </td>

                      <td className={classes.date}>
                        {new Date(
                          order.date
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;