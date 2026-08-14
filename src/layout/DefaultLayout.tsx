import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
} from "@/components/ui/navigation-menu";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { routesConfig } from "@/config/routes";
import { cn } from "@/lib/utils";
import React from "react";
import { Toaster } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Moon, Sun } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/theme-provider";

export default function DefaultLayout() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <div className="washi-texture flex min-h-screen flex-col bg-background text-foreground">
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex h-8 w-full max-w-5xl items-center justify-between px-6">
          <span className="font-heading text-[11px] tracking-[0.5em] text-muted-foreground">
            珈琲
          </span>
          <div className="flex items-center gap-2">
            <Sun className="h-3.5 w-3.5 text-muted-foreground" />
            <Switch
              size="sm"
              checked={isDark}
              onCheckedChange={(checked) =>
                setTheme(checked ? "dark" : "light")
              }
              aria-label="Toggle theme"
            />
            <Moon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <NavLink to="/" className="flex items-center gap-3">
            <span className="relative md:grid h-9 w-9 shrink-0 place-items-center">
              <span className="absolute inset-0 rounded-full bg-vermilion" />
              <span className="absolute inset-1.5 rounded-full border border-card/80" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-heading text-lg font-semibold tracking-wide">
                JM's Coffee Shop
              </span>
              <span className="relative mt-1.5 text-[10px] tracking-[0.35em] text-muted-foreground">
                喫茶 KISSA
              </span>
            </span>
          </NavLink>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="gap-1">
              {routesConfig
                .filter((route) => route.showInNav)
                .map((route) => {
                  const IconComponent = route.icon;
                  return (
                    <NavigationMenuItem key={route.path}>
                      <NavLink
                        to={route.path}
                        end={route.path === "/"}
                        className={({ isActive }) =>
                          cn(
                            "relative flex items-center gap-2 px-3 py-2 text-sm transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {IconComponent && (
                              <IconComponent className="h-4 w-4" />
                            )}
                            <span className="font-medium tracking-wide">
                              {route.label}
                            </span>
                            <span
                              aria-hidden="true"
                              className={cn(
                                "absolute inset-x-3 -bottom-px h-px bg-vermilion transition-opacity",
                                isActive ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </>
                        )}
                      </NavLink>
                    </NavigationMenuItem>
                  );
                })}
            </NavigationMenuList>
          </NavigationMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" className="lg:hidden" />
              }
            >
              <Menu />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {routesConfig
                .filter((route) => route.showInNav)
                .map((route) => {
                  const IconComponent = route.icon;
                  return (
                    <DropdownMenuItem
                      key={route.path}
                      onClick={() => navigate(route.path)}
                    >
                      {IconComponent && (
                        <IconComponent className="h-4 w-4" />
                      )}
                      <span>{route.label}</span>
                    </DropdownMenuItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 pb-8">
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
      <Toaster />

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-5 text-xs text-muted-foreground">
          <span className="font-heading tracking-[0.3em]">一期一会</span>
          <span>© {new Date().getFullYear()} JM's Coffee Shop</span>
        </div>
      </footer>
    </div>
  );
}
