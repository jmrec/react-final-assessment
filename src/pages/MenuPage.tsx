import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuManageSheet } from "@/components/menu/MenuManageSheet";
import type { MenuFormData } from "@/schemas/menuSchema";
import { useGetAll1Query, type MenuItemResponse } from "@/store/gen/menu";

export default function MenuPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuFormData | null>(null);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);

  const { data: menuItems = [], isLoading, isError, error } = useGetAll1Query();

  const handleCreateOpen = () => {
    setSelectedItem(null);
    setSelectedId(undefined);
    setIsOpen(true);
  };

  const handleEditOpen = (item: MenuItemResponse) => {
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
        <div className="grid gap-4">
          {menuItems.length === 0 ? (
            <p className="text-gray-500 py-4 text-center">
              No menu items found. Add your first item above!
            </p>
          ) : (
            menuItems.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-md flex justify-between items-center bg-white shadow-sm"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-sm text-gray-500 capitalize">
                    {item.category} · ${item.price?.toFixed(2)}
                  </span>
                </div>
                <Button variant="outline" onClick={() => handleEditOpen(item)}>
                  Edit
                </Button>
              </div>
            ))
          )}
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
