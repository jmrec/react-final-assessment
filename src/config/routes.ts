import {
  Home,
  Coffee,
  Users,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";
import React from "react";
import { Navigate } from "react-router-dom";

export interface RouteConfig {
  label: string;
  path: string;
  icon?: LucideIcon;
  element: React.ComponentType;
  showInNav?: boolean;
}

const HomePage = React.lazy(() => import("@/pages/HomePage"));
const MenuPage = React.lazy(() => import("@/pages/MenuPage"));
const BaristaPage = React.lazy(() => import("@/pages/BaristaPage"));
const OrdersPage = React.lazy(() => import("@/pages/OrdersPage"));
const ErrorPage = React.lazy(() => import("@/pages/ErrorPage"));
const OrdersPageShow = React.lazy(() => import("@/pages/OrdersPageShow"));
const PatronsPage = React.lazy(() => import("@/pages/PatronsPage"));

const NotFoundRedirect: React.ComponentType = () =>
  React.createElement(Navigate, { to: "/404", replace: true });

export const routesConfig: RouteConfig[] = [
  {
    label: "Home",
    path: "/",
    icon: Home,
    element: HomePage,
    showInNav: true,
  },
  {
    label: "Menu",
    path: "/menu",
    icon: Coffee,
    element: MenuPage,
    showInNav: true,
  },
  {
    label: "Add Menu Item",
    path: "/menu/create",
    element: MenuPage,
    showInNav: false,
  },
  {
    label: "Edit Menu Item",
    path: "/menu/:id/edit",
    element: MenuPage,
    showInNav: false,
  },
  {
    label: "Barista",
    path: "/barista",
    icon: Users,
    element: BaristaPage,
    showInNav: true,
  },
  {
    label: "Orders",
    path: "/orders",
    icon: ShoppingBag,
    element: OrdersPage,
    showInNav: true,
  },
  {
    label: "Order Details",
    path: "/orders/:orderId",
    element: OrdersPageShow,
    showInNav: false,
  },
  {
    label: "Patrons",
    path: "/patrons",
    icon: Users,
    element: PatronsPage,
    showInNav: true,
  },
  {
    label: "Error Page",
    path: "/404",
    element: ErrorPage,
    showInNav: false,
  },
  {
    label: "Not Found",
    path: "*",
    element: NotFoundRedirect,
    showInNav: false,
  }
];
