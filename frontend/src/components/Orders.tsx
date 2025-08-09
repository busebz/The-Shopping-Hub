import { useEffect, useState } from "react";

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

        const response = await fetch("https://the-shopping-hub-backend-production.up.railway.app/api/user/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

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
    <div>
      <h2>Siparişlerim</h2>
      {orders.map((order) => (
        <div key={order._id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
          <p><strong>Tarih:</strong> {new Date(order.date).toLocaleString()}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.sku}>
                {item.name} - Adet: {item.quantity} - Fiyat: ${item.price.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Orders;
