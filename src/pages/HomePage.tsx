import { useMemo } from "react";
import {
  CheckCircle2,
  CircleDollarSign,
  Coffee,
  Crown,
  Loader2,
  ShoppingBag,
  TrendingUp,
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

  const mostPopularCategory = useMemo(() => {
    const itemCounts = new Map<number, number>();
    const categoryCounts = new Map<string, number>();
    for (const order of orders) {
      for (const itemId of order.itemIds ?? []) {
        itemCounts.set(itemId, (itemCounts.get(itemId) ?? 0) + 1);

        const item = menuItems.find((m) => m.id === itemId);
        const category = item?.category?.trim() || "Uncategorized";
        categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
      }
    }

    let name = "";
    let sold = 0;
    for (const [category, count] of categoryCounts) {
      if (count > sold) {
        name = category;
        sold = count;
      }
    }

    const items = menuItems
      .filter((m) => (m.category?.trim() || "Uncategorized") === name)
      .map((m) => ({
        id: m.id,
        name: m.name,
        count: m.id != null ? (itemCounts.get(m.id) ?? 0) : 0,
      }))
      .filter((item) => item.count > 0)
      .sort((a, b) => b.count - a.count);

    return { name, sold, items };
  }, [orders, menuItems]);

  const popularItems = useMemo(() => {
    const counts = new Map<number, number>();
    for (const order of orders) {
      for (const itemId of order.itemIds ?? []) {
        counts.set(itemId, (counts.get(itemId) ?? 0) + 1);
      }
    }

    return Array.from(counts.entries())
      .map(([id, count]) => {
        const item = menuItems.find((m) => m.id === id);
        return {
          id,
          name: item?.name ?? `Item #${id}`,
          count,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [orders, menuItems]);

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

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Most Popular Category
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription className="text-left">
              Based on items ordered
            </CardDescription>
          </CardHeader>
          <CardContent>
            {mostPopularCategory.sold === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet.</p>
            ) : (
              <>
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-bold capitalize">
                    {mostPopularCategory.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {mostPopularCategory.sold} sold
                  </span>
                </div>
                <ul className="divide-y divide-border">
                  {mostPopularCategory.items.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between py-2"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {item.count} sold
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Popular Items
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
            <CardDescription className="text-left">
              Most ordered across all orders
            </CardDescription>
          </CardHeader>
          <CardContent>
            {popularItems.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No items ordered yet.
              </p>
            ) : (
              <ul className="divide-y divide-border">
                {popularItems.map((item, index) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="flex items-center gap-3 font-medium">
                      <span className="w-4 text-sm text-muted-foreground">
                        {index + 1}
                      </span>
                      {item.name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {item.count} sold
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}