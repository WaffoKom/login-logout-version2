import { RouterProvider, createBrowserRouter } from "react-router-dom";

import Username from "./components/Username.jsx";
import Password from "./components/Password.jsx";
import Register from "./components/Register.jsx";
import Profile from "./components/Profile.jsx";
import Recovery from "./components/Recovery.jsx";
import Reset from "./components/Reset.jsx";
import PageNotFound from "./components/PageNotFound.jsx";

// auth middleware
import { AuthorizeUser, ProtectRoute } from "./middleware/auth.jsx";

//  root routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <Username></Username>,
  },
  {
    path: "/register",
    element: <Register></Register>,
  },
  {
    path: "/password",
    element: (
      <ProtectRoute>
        <Password />
      </ProtectRoute>
    ),
  },
  {
    path: "/Recovery",
    element: <Recovery></Recovery>,
  },
  {
    path: "/profile",
    element: (
      <AuthorizeUser>
        <Profile />
      </AuthorizeUser>
    ),
  },
  {
    path: "/reset",
    element: <Reset></Reset>,
  },
  {
    path: "*",
    element: <PageNotFound></PageNotFound>,
  },
]);

export default function App() {
  return (
    <main className="">
      <RouterProvider router={router}></RouterProvider>
    </main>
  );
}
