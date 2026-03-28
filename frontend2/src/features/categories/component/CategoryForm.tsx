import { useState, useEffect } from "react";
import type { Category, CategoryCreate } from "../types/category";
import { Button } from "../../../components/ButtonComponent";

interface Props {
    initialData?: Category | null;
    onSubmit: (data: CategoryCreate | Category) => void;
    onCancel: () => void;
}

export const CategoryForm = ({ initialData, onSubmit, onCancel }: Props) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description || "");
        } else {
            setName("");
            setDescription("");
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSubmit({ id: initialData.id, name, description });
        } else {
            onSubmit({ name, description });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#111827] border p-5 sm:p-6 rounded-xl border-[#1f2937] w-full max-w-md mx-auto shadow-lg">
            <h3 className="font-bold mb-4 text-medium text-white">{initialData ? "Editar Categoría" : "Nueva Categoría"}</h3>

            <div className="mb-2">
                <label className="block text-medium text-white">Nombre</label>
                <input
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="border p-2 w-full rounded-lg bg-[#0f172a] border-[#374151] text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            <div className="mb-4">
                <label className="block text-medium text-white">Descripción (Opcional)</label>
                <input
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="border p-2 w-full rounded-lg bg-[#0f172a] border-[#374151] text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
            </div>

            <div className="flex gap-5">
                <Button variant="success" size="lg" onClick={handleSubmit} fullWidth={true}>
                    Guardar
                </Button>
                <Button variant="danger" size="lg" onClick={onCancel} fullWidth={true}>
                    Cancelar
                </Button>
            </div>
        </form>
    );
};