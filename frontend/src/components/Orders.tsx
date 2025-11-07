import { useEffect, useState } from "react";
import classes from "./Orders.module.css";
import useCart from "../hooks/useCart";

const API_URL =
  import.meta.env.API_URL ||
  "https://the-shopping-hub-backend-production.up.railway.app";

type OrderItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  _id: string;
  date: string;
  items: OrderItem[];
};

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { calculateOrderTotal } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/user/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch orders");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div className={classes.ordersContainer}>
      <h2 className={classes.pageTitle}>My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className={classes.orderRow}>
          <div className={classes.productImagesContainer}>
            {order.items.map((item) => {
              const imgUrl = new URL(`../images/${item.sku}.jpg`, import.meta.url).href;
              return (
                <img
                  key={item.sku}
                  src={imgUrl}
                  onError={(e) => (e.currentTarget.src = "/images/placeholder.jpg")}
                  alt={item.name}
                  className={classes.productImage}
                  title={`${item.name} x${item.quantity}`}
                />
              );
            })}
          </div>

          <div className={classes.orderInfoContainer}>
            <div className={classes.datePriceContainer}>
              <div className={classes.orderDate}>
                {new Date(order.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className={classes.orderTotal}>
                Total: ${calculateOrderTotal(order.items).toFixed(2)}
              </div>
            </div>
            <button
              className={classes.detailsButton}
              onClick={() => alert(`Details for order ${order._id}`)}
            >
              Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Orders;
