import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./stylesheets/main.scss";
import ErrorPage from "./pages/error/ErrorPage.tsx";
import LoginPage from "./pages/login/LoginPage.tsx";
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
