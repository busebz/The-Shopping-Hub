import { useEffect, useMemo, useState } from "react";
import classes from "./Orders.module.css";
import useCart from "../hooks/useCart";

import {
  FiBox,
  FiCalendar,
  FiShoppingBag,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiChevronRight,
} from "react-icons/fi";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

type OrderItem = {
  sku: string;
  name: string;
  price: number;
  quantity: number;
};

type OrderStatus =
  | "Processing"
  | "Completed"
  | "Cancelled";

type Order = {
  _id: string;
  date: string;
  items: OrderItem[];
  status?: OrderStatus;
};

type FilterType =
  | "All"
  | "Processing"
  | "Completed"
  | "Cancelled";

type SortType =
  | "Newest"
  | "Oldest"
  | "Highest"
  | "Lowest";

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const [activeFilter, setActiveFilter] =
    useState<FilterType>("All");

  const [sortBy, setSortBy] =
    useState<SortType>("Newest");

  const { calculateOrderTotal } = useCart();

  useEffect(() => {
    const fetchOrders = async () => {
      const userToken =
        localStorage.getItem("userToken");

      if (!userToken) {
        setError(
          "No token found. Please log in."
        );

        setLoading(false);

        return;
      }

      try {
        const response = await fetch(
          `${API_URL}/api/user/orders`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        if (!response.ok) {
          const errorData =
            await response.json();

          throw new Error(
            errorData.message ||
              "Failed to fetch orders"
          );
        }

        const data =
          await response.json();

        setOrders(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(
            "An unknown error occurred."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getOrderStatus = (
    order: Order
  ): OrderStatus => {
    return order.status || "Completed";
  };

  const displayedOrders = useMemo(() => {
    let result = [...orders];

    if (activeFilter !== "All") {
      result = result.filter(
        (order) =>
          getOrderStatus(order) ===
          activeFilter
      );
    }

    result.sort((a, b) => {
      const aDate =
        new Date(a.date).getTime();

      const bDate =
        new Date(b.date).getTime();

      const aTotal =
        calculateOrderTotal(a.items);

      const bTotal =
        calculateOrderTotal(b.items);

      if (sortBy === "Newest") {
        return bDate - aDate;
      }

      if (sortBy === "Oldest") {
        return aDate - bDate;
      }

      if (sortBy === "Highest") {
        return bTotal - aTotal;
      }

      return aTotal - bTotal;
    });

    return result;
  }, [
    orders,
    activeFilter,
    sortBy,
    calculateOrderTotal,
  ]);

  const getStatusIcon = (
    status: OrderStatus
  ) => {
    if (status === "Processing") {
      return <FiClock />;
    }

    if (status === "Cancelled") {
      return <FiXCircle />;
    }

    return <FiCheckCircle />;
  };

  if (loading) {
    return (
      <div className={classes.stateMessage}>
        Loading orders...
      </div>
    );
  }

  if (error) {
    return (
      <div className={classes.stateMessage}>
        Error: {error}
      </div>
    );
  }

  return (
    <main className={classes.page}>
      <div
        className={
          classes.ordersContainer
        }
      >
        <div className={classes.header}>
          <h1
            className={classes.pageTitle}
          >
            My Orders
          </h1>

          <p
            className={
              classes.pageSubtitle
            }
          >
            Track and review your recent
            purchases.
          </p>
        </div>

        <div
          className={
            classes.controlsRow
          }
        >
          <div
            className={classes.filters}
          >
            <button
              type="button"
              className={`${
                classes.filterButton
              } ${
                activeFilter === "All"
                  ? classes.activeFilter
                  : ""
              }`}
              onClick={() =>
                setActiveFilter("All")
              }
            >
              <FiBox />

              <span>All Orders</span>

              <span
                className={
                  classes.filterCount
                }
              >
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              className={`${
                classes.filterButton
              } ${
                activeFilter ===
                "Processing"
                  ? classes.activeFilter
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(
                  "Processing"
                )
              }
            >
              <FiClock />

              <span>Processing</span>
            </button>

            <button
              type="button"
              className={`${
                classes.filterButton
              } ${
                activeFilter ===
                "Completed"
                  ? classes.activeFilter
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(
                  "Completed"
                )
              }
            >
              <FiCheckCircle />

              <span>Completed</span>
            </button>

            <button
              type="button"
              className={`${
                classes.filterButton
              } ${
                activeFilter ===
                "Cancelled"
                  ? classes.activeFilter
                  : ""
              }`}
              onClick={() =>
                setActiveFilter(
                  "Cancelled"
                )
              }
            >
              <FiXCircle />

              <span>Cancelled</span>
            </button>
          </div>

          <div
            className={
              classes.sortContainer
            }
          >
            <span>Sort by:</span>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target
                    .value as SortType
                )
              }
              className={
                classes.sortSelect
              }
            >
              <option value="Newest">
                Newest
              </option>

              <option value="Oldest">
                Oldest
              </option>

              <option value="Highest">
                Highest total
              </option>

              <option value="Lowest">
                Lowest total
              </option>
            </select>
          </div>
        </div>

        {displayedOrders.length === 0 ? (
          <div
            className={
              classes.emptyOrders
            }
          >
            No orders found for this
            filter.
          </div>
        ) : (
          <div
            className={
              classes.ordersList
            }
          >
            {displayedOrders.map(
              (order) => {
                const total =
                  calculateOrderTotal(
                    order.items
                  );

                const itemCount =
                  order.items.reduce(
                    (sum, item) =>
                      sum +
                      item.quantity,
                    0
                  );

                const visibleItems =
                  order.items.slice(0, 2);

                const remainingItems =
                  order.items.length - 2;

                const status =
                  getOrderStatus(order);

                return (
                  <div
                    key={order._id}
                    className={
                      classes.orderCard
                    }
                  >
                    <div
                      className={
                        classes.productImagesContainer
                      }
                    >
                      {visibleItems.map(
                        (item) => {
                          const imgUrl =
                            new URL(
                              `../images/${item.sku}.jpg`,
                              import.meta.url
                            ).href;

                          return (
                            <img
                              key={
                                item.sku
                              }
                              src={imgUrl}
                              alt={
                                item.name
                              }
                              title={`${item.name} x${item.quantity}`}
                              className={
                                classes.productImage
                              }
                              onError={(
                                e
                              ) => {
                                e.currentTarget.src =
                                  "/images/placeholder.jpg";
                              }}
                            />
                          );
                        }
                      )}

                      {remainingItems >
                        0 && (
                        <div
                          className={
                            classes.moreItems
                          }
                        >
                          +
                          {
                            remainingItems
                          }
                        </div>
                      )}
                    </div>

                    <div
                      className={
                        classes.orderMainInfo
                      }
                    >
                      <h3
                        className={
                          classes.orderNumber
                        }
                      >
                        Order #
                        {order._id
                          .slice(-8)
                          .toUpperCase()}
                      </h3>

                      <div
                        className={
                          classes.orderMeta
                        }
                      >
                        <span>
                          <FiCalendar />

                          {new Date(
                            order.date
                          ).toLocaleDateString(
                            undefined,
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>

                        <span>
                          <FiShoppingBag />

                          {itemCount}{" "}
                          {itemCount === 1
                            ? "item"
                            : "items"}
                        </span>
                      </div>

                      <button
                        type="button"
                        className={
                          classes.viewItemsButton
                        }
                      >
                        View items
                        <FiChevronRight />
                      </button>
                    </div>

                    <div
                      className={
                        classes.statusPrice
                      }
                    >
                      <div
                        className={`${
                          classes.statusBadge
                        } ${
                          status ===
                          "Completed"
                            ? classes.completed
                            : status ===
                              "Processing"
                            ? classes.processing
                            : classes.cancelled
                        }`}
                      >
                        {getStatusIcon(
                          status
                        )}

                        {status}
                      </div>

                      <div
                        className={
                          classes.totalBlock
                        }
                      >
                        <span>Total</span>

                        <strong>
                          $
                          {total.toFixed(
                            2
                          )}
                        </strong>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={
                        classes.detailsButton
                      }
                      onClick={() =>
                        alert(
                          `Details for order ${order._id}`
                        )
                      }
                    >
                      View Details
                      <FiChevronRight />
                    </button>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </main>
  );
};

export default Orders;