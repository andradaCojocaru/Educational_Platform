import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

const PrivateRoute = ({ children, allowedRoles }) => {
  /*  subscribe ONLY to the pieces we need  */
  const loading = useAuthStore(s => s.loadingState);
  const user    = useAuthStore(s => s.allUserData);   // null OR {…}

  const isLoggedIn = !!user;
  const role       = user?.role;

  /* wait for cookies → store hydration */
  if (loading) return <p>Loading…</p>;

  /* 1️⃣  not authenticated → /login */
  if (!isLoggedIn) return <Navigate to="/login/" replace />;

  /* 2️⃣  authenticated but role not allowed → / */
  if (allowedRoles && !allowedRoles.includes(role))
    return <Navigate to="/" replace />;

  /* 3️⃣  everything OK */
  return children;
};

export default PrivateRoute;
