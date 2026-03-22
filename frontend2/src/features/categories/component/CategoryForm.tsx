import { useState, useEffect } from "react";
import type { Category, CategoryCreate } from "../types/category";

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
            onSubmit({ id: initialData.id, name, description }); // Modo Update
        } else {
            onSubmit({ name, description }); // Modo Create
        }
    };

    return (
        <form onSubmit={handleSubmit} className="border p-4 rounded bg-gray-50">
            <h3 className="font-bold mb-4">{initialData ? "Editar Categoría" : "Nueva Categoría"}</h3>
            
            <div className="mb-2">
                <label className="block text-sm">Nombre</label>
                <input 
                    required 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    className="border p-2 w-full" 
                />
            </div>
            
            <div className="mb-4">
                <label className="block text-sm">Descripción (Opcional)</label>
                <input 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    className="border p-2 w-full" 
                />
            </div>

            <div className="flex gap-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                    Guardar
                </button>
                <button type="button" onClick={onCancel} className="bg-gray-300 px-4 py-2 rounded">
                    Cancelar
                </button>
            </div>
        </form>
    );
};