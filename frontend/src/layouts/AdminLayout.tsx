import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/Admin/Sidebar";
import classes from "../components/Admin/Dashboard.module.css";

const AdminLayout = () => {
  return (
    <div className={classes.container}>
      <AdminSidebar />
      <main className={classes.main}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
