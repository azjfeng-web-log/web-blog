import React from "react";
import { createHashRouter } from "react-router-dom";
import Index from "@src/pages/index-page/index";
import Login from "@src/pages/login-page/index";
import Auth from "@src/components/Auth";
import CreationPage from "@src/pages/create-page/index";
import DetailPage from "@src/pages/detail-page";

const router = createHashRouter([
  {
    path: "/",
    element: <Auth children={<Index />}></Auth>,
    children: [],
  },
  {
    path: "/create-page",
    element: <Auth children={<CreationPage />}></Auth>,
    children: [],
  },
  {
    path: "/detail-page/:articleId",
    element: <Auth children={<DetailPage />}></Auth>,
    children: [],
  },
  {
    path: "/login",
    element: <Login />,
    children: [],
  },
]);

export default router;
