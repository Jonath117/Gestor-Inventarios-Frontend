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
                        className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
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
            <div className="overflow-x-auto bg-[#111827] rounded-xl border border-[#1f2937]">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1f2937] text-gray-400 uppercase text-medium tracking-wider">
                        <tr className="border-b">
                            <th className="p-3">Nombre</th>
                            <th className="p-3 ">Descripción</th>
                            <th className="p-3">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map(cat => (
                            <tr key={cat.id} className=" border-b hover:bg-gray-800">
                                <td className="p-3 text-sm text-gray-100">{cat.name}</td>
                                <td className="p-3 font-medium text-white">{cat.description}</td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => handleEdit(cat)} 
                                        className="text-blue-600 underline hover:text-white cursor-pointer px-2 py-1 rounded">
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    );
}