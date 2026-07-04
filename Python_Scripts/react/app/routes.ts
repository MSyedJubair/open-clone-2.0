import { type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

// Automatically registers everything inside your app/routes/ folder!
export default flatRoutes() satisfies RouteConfig;