import React from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { type MenuFormData } from "@/schemas/menuSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Checkbox } from "./ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuFormProps {
  control: Control<MenuFormData>;
  errors: FieldErrors<MenuFormData>;
  isEditMode: boolean;
  isSubmitting: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const MenuForm: React.FC<MenuFormProps> = ({
  control,
  isEditMode,
  isSubmitting,
  onSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 w-full max-w-md">
      <div>
        <h2 className="text-xl font-bold">
          {isEditMode ? "Edit Menu Item" : "Create New Menu Item"}
        </h2>
      </div>

      <Controller
        name="name"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="space-y-1.5">
            <FieldLabel htmlFor={field.name}>Product Name</FieldLabel>
            <Input
              {...field}
              id={field.name}
              aria-invalid={fieldState.invalid}
              placeholder="e.g. Vanilla Latte"
              autoComplete="off"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="price"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="space-y-1.5">
            <FieldLabel htmlFor={field.name}>Price ($)</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              step="0.01"
              aria-invalid={fieldState.invalid}
              placeholder="0.00"
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="category"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid} className="space-y-1.5">
            <FieldLabel htmlFor={field.name}>Category</FieldLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger
                id={field.name}
                aria-invalid={fieldState.invalid}
                className="w-full"
              >
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="coffee">Coffee</SelectItem>
                <SelectItem value="bakery">Bakery</SelectItem>
                <SelectItem value="merch">Merchandise</SelectItem>
              </SelectContent>
            </Select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="isAvailable"
        control={control}
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid}
            className="flex flex-row items-center space-x-2 space-y-0 py-2"
          >
            <Checkbox
              id={field.name}
              checked={!!field.value}
              onCheckedChange={field.onChange}
              aria-invalid={fieldState.invalid}
            />
            <FieldLabel
              htmlFor={field.name}
              className="cursor-pointer select-none"
            >
              Is Available
            </FieldLabel>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : isEditMode
              ? "Update Item"
              : "Create Item"}
        </Button>
      </div>
    </form>
  );
};
