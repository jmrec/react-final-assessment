import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Outlet, NavLink } from "react-router-dom";
import { routesConfig } from "@/config/routes";
import React from "react";

export default function DefaultLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header Container */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center justify-between">
          {/* Left Side: Navigation Menu */}
          <div className="flex items-center gap-6">
            <span className="font-bold">JM's Coffee Shop</span>
            <NavigationMenu>
              <NavigationMenuList className="gap-6 text-sm font-medium flex-row">
                {routesConfig
                  .filter((route) => route.showInNav)
                  .map((route) => {
                    const IconComponent = route.icon;
                    return (
                      <NavigationMenuItem key={route.path}>
                        <NavLink
                          to={route.path}
                          className={({ isActive }) =>
                            `flex items-center gap-2 transition-colors hover:text-primary ${
                              isActive
                                ? "text-foreground font-semibold"
                                : "text-muted-foreground"
                            }`
                          }
                        >
                          {IconComponent && (
                            <IconComponent className="h-4 w-4" />
                          )}
                          <span>{route.label}</span>
                        </NavLink>
                      </NavigationMenuItem>
                    );
                  })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container py-6">
        <React.Suspense
          fallback={
            <div className="p-4 text-sm text-muted-foreground">
              Loading page...
            </div>
          }
        >
          <Outlet />
        </React.Suspense>
      </main>
    </div>
  );
}
