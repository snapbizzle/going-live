"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Plus, Trash2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

const teamSchema = z.object({
  name: z.string().min(1, "Name is required"),
  units: z.string().default(""),
  areas: z.string().default(""),
  supplies: z
    .array(
      z.object({
        id: z.string().optional(),
        item: z.string().min(1, "Item name required"),
        quantity: z.coerce.number().int().min(0, "Must be 0 or more"),
      })
    )
    .default([]),
});

type TeamFormData = z.infer<typeof teamSchema>;

interface Supply {
  id: string;
  item: string;
  quantity: number;
}

interface Team {
  id: string;
  name: string;
  units: string[];
  areas: string[];
  supplies: Supply[];
}

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team | null;
  mode?: "view" | "create";
}

export function TeamModal({
  isOpen,
  onClose,
  team,
  mode = "view",
}: TeamModalProps) {
  const [isEditing, setIsEditing] = useState(mode === "create");
  const utils = trpc.useUtils();

  const createTeam = trpc.team.create.useMutation({
    onSuccess: () => {
      utils.team.getAll.invalidate();
      onClose();
    },
  });

  const updateTeam = trpc.team.update.useMutation({
    onSuccess: () => {
      utils.team.getAll.invalidate();
      setIsEditing(false);
    },
  });

  const deleteTeam = trpc.team.delete.useMutation({
    onSuccess: () => {
      utils.team.getAll.invalidate();
      onClose();
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<TeamFormData>({
    resolver: zodResolver(teamSchema),
    defaultValues: {
      name: team?.name ?? "",
      units: team?.units.join(", ") ?? "",
      areas: team?.areas.join(", ") ?? "",
      supplies: team?.supplies ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "supplies",
  });

  useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        units: team.units.join(", "),
        areas: team.areas.join(", "),
        supplies: team.supplies,
      });
    } else {
      reset({ name: "", units: "", areas: "", supplies: [] });
    }
  }, [team, reset]);

  useEffect(() => {
    setIsEditing(mode === "create");
  }, [mode]);

  if (!isOpen) return null;

  const parseCommaSeparated = (val: string): string[] =>
    val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const onSubmit = (data: TeamFormData) => {
    const payload = {
      name: data.name,
      units: parseCommaSeparated(data.units),
      areas: parseCommaSeparated(data.areas),
      supplies: data.supplies.map(({ id, item, quantity }) => ({
        id,
        item,
        quantity,
      })),
    };

    if (mode === "create") {
      createTeam.mutate({ name: payload.name, units: payload.units, areas: payload.areas, supplies: payload.supplies.map(({ item, quantity }) => ({ item, quantity })) });
    } else if (team) {
      updateTeam.mutate({ id: team.id, ...payload });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-red-600 flex-shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {mode === "create" ? "Add New Team" : team?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 overflow-y-auto flex-1"
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            {isEditing ? (
              <>
                <input
                  {...register("name")}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Team name"
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.name.message}
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-800">{team?.name}</p>
            )}
          </div>

          {/* Units */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsible Units
              {isEditing && (
                <span className="text-gray-400 font-normal ml-1">
                  (comma separated)
                </span>
              )}
            </label>
            {isEditing ? (
              <input
                {...register("units")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. ICU, ED, OR"
              />
            ) : (
              <p className="text-sm text-gray-800">
                {team?.units.length ? (
                  team.units.join(", ")
                ) : (
                  <span className="text-gray-400">None specified</span>
                )}
              </p>
            )}
          </div>

          {/* Areas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Responsible Areas
              {isEditing && (
                <span className="text-gray-400 font-normal ml-1">
                  (comma separated)
                </span>
              )}
            </label>
            {isEditing ? (
              <input
                {...register("areas")}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="e.g. North Wing, Building B"
              />
            ) : (
              <p className="text-sm text-gray-800">
                {team?.areas.length ? (
                  team.areas.join(", ")
                ) : (
                  <span className="text-gray-400">None specified</span>
                )}
              </p>
            )}
          </div>

          {/* Supplies */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Supplies
              </label>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => append({ item: "", quantity: 0 })}
                  className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                >
                  <Plus className="w-3 h-3" />
                  Add Supply
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                {fields.length === 0 ? (
                  <p className="text-xs text-gray-400">No supplies added</p>
                ) : (
                  fields.map((field, index) => (
                    <div key={field.id} className="flex gap-2 items-start">
                      <input
                        {...register(`supplies.${index}.item`)}
                        className="flex-1 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Item name"
                      />
                      <input
                        {...register(`supplies.${index}.quantity`)}
                        type="number"
                        min="0"
                        className="w-20 border border-gray-300 rounded-md px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Qty"
                      />
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-red-400 hover:text-red-600 mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {team?.supplies.length ? (
                  team.supplies.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between text-sm text-gray-800"
                    >
                      <span>{s.item}</span>
                      <span className="text-gray-500">×{s.quantity}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No supplies listed</p>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            {mode === "view" && !isEditing && (
              <>
                <button
                  type="button"
                  onClick={() => deleteTeam.mutate({ id: team!.id })}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Team
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
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
                  disabled={createTeam.isPending || updateTeam.isPending}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {createTeam.isPending || updateTeam.isPending
                    ? "Saving..."
                    : mode === "create"
                    ? "Create Team"
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
