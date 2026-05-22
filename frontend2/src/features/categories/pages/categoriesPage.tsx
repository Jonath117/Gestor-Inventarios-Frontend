import { useEffect, useState } from "react";
import type { Category } from "../types/category";
import { getCategories, createCategory, updateCategory } from "../../../services/CategoryService";
import { CategoryForm } from "../component/CategoryForm";
import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";
import { DataTable } from "../../../components/DataTableComponent";
import type { ColumnDef } from "../../../components/DataTableComponent";

export const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const toast = useToast();

    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyId = activeCompany.id;
    const companyCen = activeCompany.companyCen;

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await getCategories(companyCen, companyId);
            setCategories(data);
        } catch (err: any) {
            toast.error("Error al obtener las categorías", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyCen) fetchCategories();
    }, [companyCen]);

    const handleSave = async (data: any) => {
        try {
            if (data.categoryCen) {
                await updateCategory(companyCen, companyId, data);
            } else {
                await createCategory(companyCen, companyId, data);
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

    const columns: ColumnDef<Category>[] = [
        {
            header: "Nombre",
            accessor: "name",
            className: "font-medium text-white",
        },
        {
            header: "Descripción",
            accessor: "description",
            className: "text-gray-100",
        },
        {
            header: "Acciones",
            cell: (cat) => (
                <Button variant="link" size="lg" onClick={() => handleEdit(cat)}>
                    Editar
                </Button>
            ),
        },
    ];

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6 text-white">

                {isFormOpen ? (
                    <div className="flex justify-center w-full">
                        <h1 className="text-2xl font-bold ">{editingCategory ? "Editar Categoría" : "Nueva Categoría"}</h1>
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold">Categorías</h1>
                )}

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
                <DataTable
                    columns={columns}
                    data={categories}
                    loading={loading}
                    emptyMessage="No hay categorías registradas."
                />
            )}
        </div>
    );
}