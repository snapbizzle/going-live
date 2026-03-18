"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Pencil, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const roleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  defaultNotes: z.string().optional(),
});

type RoleFormData = z.infer<typeof roleSchema>;

interface Role {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  defaultNotes?: string | null;
}

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role | null;
  mode: "view" | "create";
}

export function RoleModal({ isOpen, onClose, role, mode }: RoleModalProps) {
  const [isEditing, setIsEditing] = useState(mode === "create");
  const utils = trpc.useUtils();

  const createRole = trpc.role.create.useMutation({
    onSuccess: () => {
      utils.role.getAll.invalidate();
      onClose();
    },
  });

  const updateRole = trpc.role.update.useMutation({
    onSuccess: () => {
      utils.role.getAll.invalidate();
      setIsEditing(false);
    },
  });

  const deleteRole = trpc.role.delete.useMutation({
    onSuccess: () => {
      utils.role.getAll.invalidate();
      utils.team.getAll.invalidate();
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: role?.name ?? "",
      description: role?.description ?? "",
      category: role?.category ?? "",
      defaultNotes: role?.defaultNotes ?? "",
    },
  });

  useEffect(() => {
    if (role) {
      reset({
        name: role.name,
        description: role.description ?? "",
        category: role.category ?? "",
        defaultNotes: role.defaultNotes ?? "",
      });
    } else {
      reset({ name: "", description: "", category: "", defaultNotes: "" });
    }
  }, [role, reset]);

  useEffect(() => {
    setIsEditing(mode === "create");
  }, [mode]);

  if (!isOpen) return null;

  const onSubmit = (data: RoleFormData) => {
    if (mode === "create") {
      createRole.mutate(data);
    } else if (role) {
      updateRole.mutate({ id: role.id, ...data });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-red-600">
          <h2 className="text-lg font-semibold text-white">
            {mode === "create" ? "Add New Role" : role?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <>
                <input
                  {...register("name")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Role name"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-800">{role?.name}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            {isEditing ? (
              <input
                {...register("category")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. Clinical, Technical, Vendor"
              />
            ) : (
              <p className="text-sm text-gray-800">
                {role?.category || (
                  <span className="text-gray-400">Not specified</span>
                )}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            {isEditing ? (
              <textarea
                {...register("description")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={3}
                placeholder="Role description"
              />
            ) : (
              <p className="text-sm text-gray-800">
                {role?.description || (
                  <span className="text-gray-400">No description</span>
                )}
              </p>
            )}
          </div>

          {/* Default Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Notes
            </label>
            {isEditing ? (
              <textarea
                {...register("defaultNotes")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={2}
                placeholder="Default notes for this role"
              />
            ) : (
              <p className="text-sm text-gray-800">
                {role?.defaultNotes || (
                  <span className="text-gray-400">No default notes</span>
                )}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {mode === "view" && !isEditing && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    deleteRole.mutate({ id: role!.id })
                  }
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                  Edit
                </button>
              </>
            )}

            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    if (mode === "view") {
                      setIsEditing(false);
                    } else {
                      onClose();
                    }
                  }}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createRole.isPending || updateRole.isPending}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {createRole.isPending || updateRole.isPending
                    ? "Saving..."
                    : mode === "create"
                    ? "Create Role"
                    : "Save Changes"}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
