import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetById1Query } from "@/store/gen/orders";
import { useGetAll1Query } from "@/store/gen/menu";
import { cn, orderStatusBadgeClass } from "@/lib/utils";

export default function OrdersPageShow() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const id = Number(orderId);
  const { data: order, isLoading, isError } = useGetById1Query(
    { id },
    { skip: !Number.isFinite(id) || id <= 0 },
  );
  const { data: menuItems = [] } = useGetAll1Query();

  if (isLoading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading order...</div>
    );
  }

  if (isError || !order) {
    return (
      <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded-md">
        Failed to load order.
      </div>
    );
  }

  const orderedItems = (order.itemIds ?? []).map((itemId, index) => {
    const item = menuItems.find((m) => m.id === itemId);
    return {
      key: `${itemId}-${index}`,
      name: item?.name ?? `Item #${itemId}`,
      price: item?.price,
    };
  });

  return (
    <div className="space-y-4 text-left">
      <Button
        variant="ghost"
        size="sm"
        className="mt-4 cursor-pointer hover:underline"
        onClick={() => navigate("/orders")}
      >
        <ArrowLeft />
        Back to Orders
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between gap-2">
            <span>Order #{order.id}</span>
            <Badge
              variant="ghost"
              className={cn(
                "capitalize",
                orderStatusBadgeClass(order.status),
              )}
            >
              {(order.status ?? "Unknown").toLowerCase()}
            </Badge>
          </CardTitle>
          <CardDescription>
            {order.itemIds?.length ?? 0} item(s) · Total $
            {order.total?.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orderedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No items associated with this order.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {orderedItems.map((item) => (
                <li
                  key={item.key}
                  className="flex items-center justify-between py-2"
                >
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {item.price != null ? `$${item.price.toFixed(2)}` : "—"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}