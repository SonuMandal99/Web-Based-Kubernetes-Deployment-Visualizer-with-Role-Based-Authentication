import { createBrowserRouter } from "react-router";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { Deployments } from "./pages/Deployments";
import { Pods } from "./pages/Pods";
import { Services } from "./pages/Services";
import { Landing } from "./pages/Landing";
import { DashboardLayout } from "./components/DashboardLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Wrapper component for protected app shell with dashboard layout
function ProtectedApp() {
  return (
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/register",
    Component: Register,
  },
  {
    path: "/app",
    Component: ProtectedApp,
    children: [
      { index: true, Component: Dashboard },
      { path: "deployments", Component: Deployments },
      { path: "pods", Component: Pods },
      { path: "services", Component: Services },
    ],
  },
]);
