"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
import {
  useGetAll1Query,
  type MenuItemResponse,
  useDeleteMenuByIdMutation,
} from "@/store/gen/menu";

export default function MenuPage() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuFormData | null>(null);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  const { data: menuItems = [], isLoading, isError, error } = useGetAll1Query();
  const [deleteMenuById, { isLoading: isDeleting }] =
    useDeleteMenuByIdMutation();

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
      isAvailable: item.available ?? false,
    });
    setSelectedId(item.id);
    setIsOpen(true);
  };

  const handleDeleteItem = async (
    e: React.MouseEvent,
    id: number | undefined,
  ) => {
    e.stopPropagation();
    if (!id) return;

    if (window.confirm("Are you sure you want to remove this item?")) {
      try {
        await deleteMenuById({ id }).unwrap();
      } catch (err) {
        console.error("Failed to delete the menu item:", err);
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
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Coffee Shop Menu</h1>
        <Button onClick={handleCreateOpen}>Add Item</Button>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-gray-500">
          Loading menu options...
        </div>
      )}

      {isError && (
        <div className="text-red-500 p-4 border border-red-200 bg-red-50 rounded-md mb-6">
          Failed to load menu: {JSON.stringify(error)}
        </div>
      )}

      {!isLoading && !isError && (
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
                    colSpan={4}
                    className="h-24 text-center text-gray-500"
                  >
                    No menu items found. Add your first item above!
                  </TableCell>
                </TableRow>
              ) : (
                menuItems.map((item: MenuItemResponse) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer hover:bg-gray-50 select-none"
                    onClick={() => navigate(`/menu/${item.id}`)}
                  >
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
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={isDeleting}
                          onClick={(e) => handleDeleteItem(e, item.id)}
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
