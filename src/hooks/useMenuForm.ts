import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { menuFormSchema, type MenuFormData } from "@/schemas/menuFormSchema";

interface useMenuFormProps {
  initialData?: MenuFormData | null;
  onSubmit: (data: MenuFormData) => Promise<void> | void;
}

export const useMenuForm = ({ initialData, onSubmit }: useMenuFormProps) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    defaultValues: initialData || { name: "", price: 0, category: "" },
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({ name: "", price: 0, category: "" });
    }
  }, [initialData, reset]);

  return {
    control,
    errors,
    isEditMode: !!initialData,
    isSubmitting,
    handleSubmit: handleSubmit(onSubmit),
  };
};
