import { MenuForm } from "@/components/MenuForm";
import type { MenuFormData } from "@/schemas/menuFormSchema";
import { useCreate1Mutation, useUpdateMutation } from "@/store/gen/menu";
import { useMenuForm } from "@/hooks/useMenuForm";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MenuManageSheetProps {
  existingMenuItem?: MenuFormData | null;
  menuItemId?: string | number;
  onClose: () => void;
}

export const MenuManageSheet: React.FC<MenuManageSheetProps> = ({
  existingMenuItem,
  menuItemId,
  onClose,
}) => {
  const [createMenuItem] = useCreate1Mutation();
  const [updateMenuItem] = useUpdateMutation();

  const handleFormSubmit = async (data: MenuFormData) => {
    try {
      if (existingMenuItem && menuItemId) {
        const numericId =
          typeof menuItemId === "string"
            ? parseInt(menuItemId, 10)
            : menuItemId;
        await updateMenuItem({
          id: numericId,
          menuItemRequest: data,
        }).unwrap();
      } else {
        await createMenuItem({
          menuItemRequest: data,
        }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error("Failed to save menu item:", error);
    }
  };

  const { control, errors, isEditMode, isSubmitting, handleSubmit } =
    useMenuForm({
      initialData: existingMenuItem,
      onSubmit: handleFormSubmit,
    });

  return (
    <SheetContent side="right" className="sm:max-w-md overflow-y-auto">
      <SheetHeader className="mb-6">
        <SheetTitle>
          {isEditMode ? "Edit Menu Item" : "Add Menu Item"}
        </SheetTitle>
        <SheetDescription>
          {isEditMode
            ? "Make changes to your coffee shop offering here. Click update when done."
            : "Fill out the details below to add a new drink or food item to your menu."}
        </SheetDescription>
      </SheetHeader>

      <MenuForm
        control={control}
        errors={errors}
        isEditMode={isEditMode}
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit}
        onCancel={onClose}
      />
    </SheetContent>
  );
};
