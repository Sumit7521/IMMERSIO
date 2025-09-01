// AppRoute.js
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";

import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import RegisterUser from "../pages/RegisterUser";
import LoginUser from "../pages/LoginUser";
import Avatar from "../pages/Avatar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: '/register',
    element:<RegisterUser />
  },
  {
    path: '/login',
    element:<LoginUser />
  },
  {
    path: '/avatar-custom',
    element: <Avatar />
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRoute() {
  return <RouterProvider router={router} />;
}
