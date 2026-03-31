import { createBrowserRouter } from "react-router";
import { Home } from "./screens/Home";
import { Upload } from "./screens/Upload";
import { Processing } from "./screens/Processing";
import { Results } from "./screens/Results";
import { History } from "./screens/History";
import { Layout } from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "upload", Component: Upload },
      { path: "processing", Component: Processing },
      { path: "results", Component: Results },
      { path: "history", Component: History },
    ],
  },
]);
