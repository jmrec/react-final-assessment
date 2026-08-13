import { useMemo } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  Coffee,
  Loader2,
  ShoppingBag,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAll1Query, useGetAvailableQuery } from "@/store/gen/menu";
import { useGetAllQuery } from "@/store/gen/orders";

export default function HomePage() {
  const {
    data: menuItems = [],
    isLoading: isMenuLoading,
    isError: isMenuError,
  } = useGetAll1Query();

  const {
    data: availableItems = [],
    isLoading: availableLoading,
  } = useGetAvailableQuery();

  const {
    data: orders = [],
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useGetAllQuery();

  const isLoading = isMenuLoading || availableLoading || isOrdersLoading;
  const isError = isMenuError || isOrdersError;

  const stats = useMemo(() => {
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const ready = orders.filter((o) => o.status === "READY").length;
    const paid = orders.filter((o) => o.status === "PAID").length;
    const revenue = orders
      .filter((o) => o.status === "PAID")
      .reduce((sum, o) => sum + (o.total ?? 0), 0);
    return { pending, ready, paid, revenue };
  }, [orders]);

  const cards = [
    {
      label: "Menu Items",
      value: menuItems.length,
      sub: `${availableItems.length} available`,
      icon: Coffee,
    },
    {
      label: "Orders",
      value: orders.length,
      sub: `${stats.pending} pending · ${stats.ready} ready`,
      icon: ShoppingBag,
    },
    {
      label: "Paid Orders",
      value: stats.paid,
      sub: "Completed",
      icon: CheckCircle2,
    },
    {
      label: "Revenue",
      value: `$${stats.revenue.toFixed(2)}`,
      sub: "From paid orders",
      icon: CircleDollarSign,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-gray-500">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading dashboard...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-10 rounded-md border border-red-200 bg-red-50 p-4 text-red-500">
        We couldn't load your dashboard right now. Please try again in a
        moment.
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ label, value, sub, icon: Icon }) => (
          <Card key={label}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                {label}
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardTitle>
              <CardDescription>{sub}</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="text-3xl font-bold">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}