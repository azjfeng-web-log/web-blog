import React from "react";
import { createHashRouter } from "react-router-dom";
import Index from "@src/pages/index-page/index";
import Login from "@src/pages/login-page/index";
import Auth from "@src/components/Auth";
import CreationPage from "@src/pages/create-page/index";
import DetailPage from "@src/pages/detail-page";
import ErrorBoundaryPage from "@src/components/ErrorBoundaryPage";

const router = createHashRouter([
  {
    path: "/",
    element: <Auth children={<Index />}></Auth>,
    children: [],
    ErrorBoundary: ErrorBoundaryPage,
  },
  {
    path: "/create-page",
    element: <Auth children={<CreationPage />}></Auth>,
    children: [],
    ErrorBoundary: ErrorBoundaryPage,
  },
  {
    path: "/detail-page/:articleId",
    element: <Auth children={<DetailPage />}></Auth>,
    children: [],
    ErrorBoundary: ErrorBoundaryPage,
  },
  {
    path: "/login",
    element: <Login />,
    children: [],
    ErrorBoundary: ErrorBoundaryPage,
  },
]);

export default router;
