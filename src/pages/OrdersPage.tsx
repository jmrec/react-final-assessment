import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useGetAllQuery, type OrderResponse } from "@/store/gen/orders";
import { cn, orderStatusBadgeClass } from "@/lib/utils";

const ITEMS_PER_PAGE = 8;

function getVisiblePages(
  current: number,
  total: number,
): Array<number | "ellipsis"> {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: Array<number | "ellipsis"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  if (start > 2) pages.push("ellipsis");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);

  return pages;
}

export default function OrdersPage() {
  const navigate = useNavigate();
  const { data: orders = [], isLoading, isError } = useGetAllQuery();

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedOrders = orders.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-muted-foreground">Loading orders...</div>
      )}

      {isError && (
        <div className="text-destructive p-4 border border-destructive/20 bg-destructive/10 rounded-md mb-6">
          We couldn't load your orders right now. Please try again in a moment.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="rounded-md border bg-card shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[20%] text-center">Order #</TableHead>
                  <TableHead className="w-[20%] text-center">Items</TableHead>
                  <TableHead className="w-[20%] text-center">Status</TableHead>
                  <TableHead className="w-[20%] text-center">Total</TableHead>
                  <TableHead className="w-[20%] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order: OrderResponse) => (
                    <TableRow
                      key={order.id}
                    >
                      <TableCell className="font-medium text-center">
                        #{order.id}
                      </TableCell>
                      <TableCell className="text-center">
                        {order.itemIds?.length ?? 0}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant="ghost"
                          className={cn(
                            "capitalize",
                            orderStatusBadgeClass(order.status),
                          )}
                        >
                          {(order.status ?? "Unknown").toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        ${order.total?.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/orders/${order.id}`);
                          }}
                          className="cursor-pointer"
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.max(1, p - 1));
                      }}
                      aria-disabled={currentPage <= 1}
                      className={
                        currentPage <= 1
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </PaginationItem>
                  {getVisiblePages(currentPage, totalPages).map((p, index) =>
                    p === "ellipsis" ? (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={p}>
                        <PaginationLink
                          href="#"
                          isActive={p === currentPage}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(p);
                          }}
                        >
                          {p}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setPage((p) => Math.min(totalPages, p + 1));
                      }}
                      aria-disabled={currentPage >= totalPages}
                      className={
                        currentPage >= totalPages
                          ? "pointer-events-none opacity-50"
                          : undefined
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  );
}
