"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import type { Role } from "@prisma/client";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  category: z.string().optional(),
  defaultNotes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: Role | null;
}

export function RoleModal({ isOpen, onClose, role }: RoleModalProps) {
  const utils = trpc.useUtils();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createRole = trpc.role.create.useMutation({
    onSuccess: () => { void utils.role.list.invalidate(); onClose(); },
  });
  const updateRole = trpc.role.update.useMutation({
    onSuccess: () => { void utils.role.list.invalidate(); onClose(); },
  });
  const deleteRole = trpc.role.delete.useMutation({
    onSuccess: () => { void utils.role.list.invalidate(); onClose(); },
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

  const onSubmit = (data: FormData) => {
    if (role) {
      updateRole.mutate({ id: role.id, ...data });
    } else {
      createRole.mutate(data);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-lg font-semibold mb-4">
          {role ? "Edit Role" : "Add Role"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              {...register("name")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <input
              {...register("category")}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Notes</label>
            <textarea
              {...register("defaultNotes")}
              rows={2}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex justify-between pt-2">
            {role && (
              <button
                type="button"
                onClick={() => deleteRole.mutate({ id: role.id })}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                {role ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
