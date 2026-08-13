import React from "react";
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import { type MenuFormData } from "@/schemas/menuFormSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldGroup,
} from "@/components/ui/field";
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
    <form id="menu-item-form" onSubmit={onSubmit} className="w-full p-5">
      <FieldGroup>
        <Controller
          name="name"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="menu-form-name">Product Name</FieldLabel>
              <Input
                {...field}
                id="menu-form-name"
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
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="menu-form-price">Price ($)</FieldLabel>
              <Input
                {...field}
                id="menu-form-price"
                type="number"
                step="0.01"
                aria-invalid={fieldState.invalid}
                placeholder="0.00"
                onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="category"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="menu-form-category">Category</FieldLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger
                  id="menu-form-category"
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
          name="available"
          control={control}
          render={({ field, fieldState }) => (
            <Field
              data-invalid={fieldState.invalid}
              className="flex flex-row items-center space-x-2 space-y-0 py-2"
            >
              <Checkbox
                id="menu-form-available"
                className="size-4!"
                checked={!!field.value}
                onCheckedChange={field.onChange}
                aria-invalid={fieldState.invalid}
              />
              <FieldLabel
                htmlFor="menu-form-available"
                className="cursor-pointer select-none"
              >
                Is Available
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="mt-6">
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" form="menu-item-form" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : isEditMode ? "Update" : "Submit"}
          </Button>
        </Field>
      </div>
    </form>
  );
};
