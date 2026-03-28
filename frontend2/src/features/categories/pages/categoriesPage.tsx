import { useEffect, useState } from "react";
import type { Category } from "../types/category";
import { getCategories, createCategory, updateCategory } from "../../../services/CategoryService";
import { CategoryForm } from "../component/CategoryForm";
import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";

export const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const toast = useToast();

    const companyId = JSON.parse(localStorage.getItem("activeCompany") || "{}").id;

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories(companyId);
            setCategories(data);
        } catch (err: any) {
            toast.error("Error al obtener las categorías", err.message);
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
        } catch (error: any) {
            toast.error("Error al guardar la categoría", error.message);
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
                    <Button variant="primary" size="lg" onClick={() => setIsFormOpen(true)}>
                        + Nueva Categoría
                    </Button>
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
                                    <td className="p-3 font-medium text-medium text-white">{cat.name}</td>
                                    <td className="p-3 text-medium text-gray-100">{cat.description}</td>
                                    <td className="p-3">
                                        <Button variant="link" size="lg" onClick={() => handleEdit(cat)}>
                                            Editar
                                        </Button>
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