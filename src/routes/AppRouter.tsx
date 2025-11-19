import { Routes, Route } from "react-router-dom";
import { routes } from "./routeConfig";

const renderRoutes = (routes: any[]) => {
  return routes.map((route, index) => {
    if (route.children) {
      return (
        <Route key={index} path={route.path} element={route.element}>
          {renderRoutes(route.children)}
        </Route>
      );
    }
    
    if (route.index) {
      return <Route key={index} index element={route.element} />;
    }
    
    return <Route key={index} path={route.path} element={route.element} />;
  });
};

export const AppRouter = () => (
  <Routes>
    {renderRoutes(routes)}
  </Routes>
);
