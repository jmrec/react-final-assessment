import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import DefaultLayout from "@/layout/DefaultLayout";
import { routesConfig } from "@/config/routes";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          {routesConfig.map((route) => {
            const PageComponent = route.element;
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<PageComponent />}
              />
            );
          })}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
