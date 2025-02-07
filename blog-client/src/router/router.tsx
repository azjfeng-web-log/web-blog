import React from "react";
import { createHashRouter } from "react-router-dom";
import Index from "@src/pages/index";
import Login from "@src/pages/login";

const router = createHashRouter([
  {
    path: "/",
    element: <Index />,
    children: [],
  },
  {
    path: "/login",
    element: <Login />,
    children: [],
  },
]);

export default router;