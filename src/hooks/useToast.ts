import { useCallback } from "react";
import { toast } from "@/components/ui/toast";

type ToastType = "success" | "info" | "warning" | "error" | "loading";

interface ToastInput {
  title: string;
  description?: string;
}

export function useToast() {
  const show = useCallback(
    (type: ToastType, { title, description }: ToastInput) => {
      toast.add({ type, title, description });
    },
    [],
  );

  const success = useCallback(
    (title: string, description?: string) => {
      toast.add({ type: "success", title, description });
    },
    [],
  );

  const error = useCallback(
    (title: string, description?: string) => {
      toast.add({ type: "error", title, description });
    },
    [],
  );

  const info = useCallback(
    (title: string, description?: string) => {
      toast.add({ type: "info", title, description });
    },
    [],
  );

  const menuCreated = useCallback((name: string) => {
    toast.add({
      type: "success",
      title: "Menu item created",
      description: `"${name}" has been added to the menu.`,
    });
  }, []);

  const menuUpdated = useCallback((name: string) => {
    toast.add({
      type: "success",
      title: "Menu item updated",
      description: `"${name}" has been updated.`,
    });
  }, []);

  const menuDeleted = useCallback((name: string) => {
    toast.add({
      type: "success",
      title: "Menu item deleted",
      description: `"${name}" has been removed from the menu.`,
    });
  }, []);

  const menuCreateFailed = useCallback(() => {
    toast.add({
      type: "error",
      title: "Failed to create menu item",
      description: "Something went wrong. Please try again.",
    });
  }, []);

  const menuUpdateFailed = useCallback(() => {
    toast.add({
      type: "error",
      title: "Failed to update menu item",
      description: "Something went wrong. Please try again.",
    });
  }, []);

  const menuDeleteFailed = useCallback(() => {
    toast.add({
      type: "error",
      title: "Failed to delete menu item",
      description: "Something went wrong. Please try again.",
    });
  }, []);

  return {
    toast: show,
    success,
    error,
    info,
    menuCreated,
    menuUpdated,
    menuDeleted,
    menuCreateFailed,
    menuUpdateFailed,
    menuDeleteFailed,
  };
}
