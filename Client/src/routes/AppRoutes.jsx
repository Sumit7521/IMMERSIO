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
import Dashboard from "../pages/Dashboard";
import Metaverse from "../pages/Metaverse"
import Virtualclassroom from "../pages/Virtualclassroom";
import Aiclassroom from "../pages/Aiclassroom";

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
    path: '/dashboard',
    element: <Dashboard />
  },
  {
    path: '/metaverse',
    element: <Metaverse />
  },
  {
    path:'/virtual-classroom',
    element : <Virtualclassroom />
  },
  {
    path:'/ai-classroom',
    element : <Aiclassroom />
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default function AppRoute() {
  return <RouterProvider router={router} />;
}
