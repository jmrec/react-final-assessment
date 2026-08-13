"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MenuManageSheet } from "@/components/menu/MenuManageSheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MenuFormData } from "@/schemas/menuFormSchema";
import { useToast } from "@/hooks/useToast";
import {
  useGetAll1Query,
  useGetByCategoryQuery,
  type MenuItemResponse,
  useDeleteMenuByIdMutation,
} from "@/store/gen/menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

export default function MenuPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuFormData | null>(null);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    undefined,
  );

  const {
    data: allMenuItems = [],
    isLoading: isLoadingAll,
    isError: isErrorAll,
  } = useGetAll1Query(undefined, { skip: selectedCategory != null });
  const {
    data: filteredMenuItems = [],
    isLoading: isLoadingCategory,
    isError: isErrorCategory,
  } = useGetByCategoryQuery(
    { category: selectedCategory ?? "" },
    { skip: selectedCategory == null },
  );

  const menuItems = selectedCategory != null ? filteredMenuItems : allMenuItems;
  const isLoading = selectedCategory != null ? isLoadingCategory : isLoadingAll;
  const isError = selectedCategory != null ? isErrorCategory : isErrorAll;

  const [deleteMenuById, { isLoading: isDeleting }] =
    useDeleteMenuByIdMutation();
  const { menuDeleted, menuDeleteFailed } = useToast();

  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(menuItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paginatedItems = menuItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleCategoryChange = (value: string | null) => {
    setSelectedCategory(value && value !== "all" ? value : undefined);
    setPage(1);
  };

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setSelectedId(undefined);
    setIsOpen(true);
  };

  const handleEditOpen = (e: React.MouseEvent, item: MenuItemResponse) => {
    e.stopPropagation();
    if (!item.id) return;

    setSelectedItem({
      name: item.name ?? "",
      price: item.price ?? 0,
      category: item.category ?? "",
      available: item.available ?? false,
    });
    setSelectedId(item.id);
    setIsOpen(true);
  };

  const handleDeleteItem = async (
    e: React.MouseEvent,
    item: MenuItemResponse,
  ) => {
    e.stopPropagation();
    const id = item.id;
    if (!id) return;

    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await deleteMenuById({ id }).unwrap();
        menuDeleted(item.name ?? "Item");
      } catch (err) {
        console.error("Failed to delete the menu item:", err);
        menuDeleteFailed();
      }
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setSelectedItem(null);
      setSelectedId(undefined);
    }, 300);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-1 mb-7">
        <h1 className="text-2xl font-bold">Coffee Shop Menu</h1>
        <div className="flex items-center gap-2">
          <Select
            value={selectedCategory ?? "all"}
            onValueChange={handleCategoryChange}
          >
            <SelectTrigger className="w-44" aria-label="Filter by category">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="coffee">Coffee</SelectItem>
              <SelectItem value="bakery">Bakery</SelectItem>
              <SelectItem value="merch">Merchandise</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleCreateOpen}>Add Item</Button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">
          Loading menu options...
        </div>
      )}

      {isError && (
        <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded-md mb-6">
          We couldn't load the menu right now. Please try again in a moment.
        </div>
      )}

      {!isLoading && !isError && (
        <>
          <div className="rounded-md border bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%] text-center">Name</TableHead>
                  <TableHead className="w-[30%] text-center">Category</TableHead>
                  <TableHead className="w-[15%] text-center">Price</TableHead>
                  <TableHead className="w-[15%] text-center">
                    Available?
                  </TableHead>
                  <TableHead className="w-[15%] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-24 text-center text-gray-500"
                    >
                      {selectedCategory != null
                        ? "No items found in this category."
                        : "No menu items found. Add your first item above!"}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedItems.map((item: MenuItemResponse) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell className="capitalize text-gray-600">
                        {item.category}
                      </TableCell>
                      <TableCell>${item.price?.toFixed(2)}</TableCell>
                      <TableCell>{item.available ? "Yes" : "No"}</TableCell>
                      <TableCell className="text-right">
                        <ButtonGroup>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => handleEditOpen(e, item)}
                            className="cursor-pointer"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            onClick={(e) => handleDeleteItem(e, item)}
                            className="cursor-pointer"
                          >
                            Delete
                          </Button>
                        </ButtonGroup>
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

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <MenuManageSheet
          existingMenuItem={selectedItem}
          menuItemId={selectedId}
          onClose={handleClose}
        />
      </Sheet>
    </div>
  );
}
