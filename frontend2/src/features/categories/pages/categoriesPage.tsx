import { useEffect, useState } from "react";
import type { Category } from "../types/category";
import { getCategories, createCategory, updateCategory } from "../../../services/CategoryService";
import { CategoryForm } from "../component/CategoryForm";


export const CategoriesPage =() => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const companyId = JSON.parse(localStorage.getItem("activeCompany") || "{}").id;

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories(companyId);
            setCategories(data);
        } catch (err) {
            setError((err as Error).message);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, [companyId]);

    const handleSave = async (data: any) => {
        try {
            if (data.id) {
                await updateCategory(companyId, data);
            } else {
                await createCategory(companyId, data);
            }
            setIsFormOpen(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (error) {
            alert(error);
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsFormOpen(true);
    };

return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6 text-white">
                <h1 className="text-2xl font-bold">Categorías</h1>
                {!isFormOpen && (
                    <button 
                        onClick={() => setIsFormOpen(true)} 
                        className="bg-green-600 text-white px-4 py-2 rounded">
                        + Nueva Categoría
                    </button>
                )}
            </div>

            {isFormOpen ? (
                <CategoryForm 
                    initialData={editingCategory} 
                    onSubmit={handleSave} 
                    onCancel={() => {
                        setIsFormOpen(false);
                        setEditingCategory(null);
                    }} 
                />
            ) : (
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b text-white">
                            <th className="p-2">Nombre</th>
                            <th className="p-2">Descripción</th>
                            <th className="p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id} className="border-b hover:bg-gray-800 text-white">
                                <td className="p-2">{cat.name}</td>
                                <td className="p-2">{cat.description}</td>
                                <td className="p-2">
                                    <button 
                                        onClick={() => handleEdit(cat)} 
                                        className="text-blue-600 underline">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}