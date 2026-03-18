"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import type { Team, Supply } from "@prisma/client";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  units: z.string(),
  areas: z.string(),
});

type FormData = z.infer<typeof schema>;

interface TeamWithRelations extends Team {
  supplies: Supply[];
}

interface TeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: TeamWithRelations | null;
}

export function TeamModal({ isOpen, onClose, team }: TeamModalProps) {
  const utils = trpc.useUtils();
  const [supplies, setSupplies] = useState<{ item: string; quantity: number }[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const createTeam = trpc.team.create.useMutation({
    onSuccess: () => { void utils.team.list.invalidate(); onClose(); },
  });
  const updateTeam = trpc.team.update.useMutation({
    onSuccess: () => { void utils.team.list.invalidate(); onClose(); },
  });
  const deleteTeam = trpc.team.delete.useMutation({
    onSuccess: () => { void utils.team.list.invalidate(); onClose(); },
  });

  useEffect(() => {
    if (team) {
      reset({
        name: team.name,
        units: team.units.join(", "),
        areas: team.areas.join(", "),
      });
      setSupplies(team.supplies.map(s => ({ item: s.item, quantity: s.quantity })));
    } else {
      reset({ name: "", units: "", areas: "" });
      setSupplies([]);
    }
  }, [team, reset]);

  const parseCommaSeparated = (value: string) =>
    value.split(",").map(s => s.trim()).filter(Boolean);

  const onSubmit = (data: FormData) => {
    const payload = {
      name: data.name,
      units: parseCommaSeparated(data.units),
      areas: parseCommaSeparated(data.areas),
      supplies,
    };
    if (team) {
      updateTeam.mutate({ id: team.id, ...payload });
    } else {
      createTeam.mutate(payload);
    }
  };

  const addSupply = () => setSupplies([...supplies, { item: "", quantity: 1 }]);
  const removeSupply = (i: number) => setSupplies(supplies.filter((_, idx) => idx !== i));
  const updateSupply = (i: number, field: "item" | "quantity", value: string | number) => {
    setSupplies(supplies.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">{team ? "Edit Team" : "Add Team"}</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Units (comma-separated)</label>
            <input
              {...register("units")}
              placeholder="ICU, ED, OR"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Areas (comma-separated)</label>
            <input
              {...register("areas")}
              placeholder="North Wing, Building B"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Supplies</label>
              <button type="button" onClick={addSupply} className="text-xs text-red-600 hover:text-red-700">
                + Add Supply
              </button>
            </div>
            {supplies.map((supply, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input
                  value={supply.item}
                  onChange={(e) => updateSupply(i, "item", e.target.value)}
                  placeholder="Item name"
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <input
                  type="number"
                  min={0}
                  value={supply.quantity}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value, 10);
                    updateSupply(i, "quantity", Number.isNaN(parsed) ? 0 : Math.max(0, parsed));
                  }}
                  className="w-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button type="button" onClick={() => removeSupply(i)} className="text-red-500 hover:text-red-700 text-sm">
                  ×
                </button>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2">
            {team && (
              <button
                type="button"
                onClick={() => deleteTeam.mutate({ id: team.id })}
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
                {team ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
