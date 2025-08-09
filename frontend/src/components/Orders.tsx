import { useEffect, useState } from "react";
import classes from "./Orders.module.css";

import useCart from "../hooks/useCart";

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
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        if (!token) {
          setError("Token bulunamadı, lütfen giriş yapın.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          "https://the-shopping-hub-backend-production.up.railway.app/api/user/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Siparişler alınamadı");
        }

        const data = await response.json();
        console.log("Sipariş verisi:", data);

        setOrders(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata: {error}</p>;
  if (orders.length === 0) return <p>Henüz sipariş bulunmamaktadır.</p>;

  return (
    <div className={classes.ordersContainer}>
      <h2 className={classes.pageTitle}>My Orders</h2>

      {orders.map((order) => (
        <div key={order._id} className={classes.orderRow}>
          <div className={classes.productImagesContainer}>
            {order.items.map((item) => {
              const imgUrl = new URL(
                `../images/${item.sku}.jpg`,
                import.meta.url
              ).href;
              return (
                <img
                  key={item.sku}
                  src={imgUrl}
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
                {new Date(order.date).toLocaleDateString("en-US", {
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
