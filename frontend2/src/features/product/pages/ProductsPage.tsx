import { useEffect, useState } from "react";
import type { IProductCreate, IProductUpdate, Product } from "../types/product.types";
import { getProducts, createProduct, editProduct, updateProductStatus } from "../../../services/ProductService";

import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";

import { ProductForm } from "../components/ProductForm";


export const ProductsPage = () => {
    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const currentCompanyId = activeCompany.id;
    const currentCompanyCen = activeCompany.companyCen;

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useToast();

    const [isFormOpen, setIsFormOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<Product | null>(null);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const data = await getProducts(currentCompanyCen, currentCompanyId);
            setProducts(data);
        } catch (error: any) {
            toast.error("Error cargando productos", error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (currentCompanyCen) fetchProducts();
    }, [currentCompanyCen]);

    const handleOpenCreate = () => {
        setProductToEdit(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (product: Product) => {
        setProductToEdit(product);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setProductToEdit(null);
    };


    const handleSubmitForm = async (data: any) => {
        try {
            if (productToEdit) {
                await editProduct(currentCompanyCen, currentCompanyId, data as IProductUpdate);
                toast.success("Éxito", "Producto actualizado correctamente");
            } else {
                await createProduct(currentCompanyCen, currentCompanyId, data as IProductCreate);
                toast.success("Éxito", "Producto creado correctamente");
            }
            handleCloseForm();
            fetchProducts();
        } catch (error: any) {
            toast.error("Error", error.message);
        }
    };

    const handleDeactivate = async (productCen: string, productName: string) => {
        const confirmed = await toast.confirm("¿Desactivar producto?", `¿Estás seguro de desactivar "${productName}"?`);

        if (confirmed) {
            try {
                await updateProductStatus(currentCompanyCen, currentCompanyId, productCen, "INACTIVE");
                toast.success("Desactivado", "El producto ha sido dado de baja.");
                fetchProducts();
            } catch (err: any) {
                toast.error("Error", err.message);
            }
        }
    };

    const handleActivate = async (productCen: string, productName: string) => {
        const confirmed = await toast.confirm("¿Activar producto?", `¿Estás seguro de activar "${productName}"?`);

        if (confirmed) {
            try {
                await updateProductStatus(currentCompanyCen, currentCompanyId, productCen, "ACTIVE");
                toast.success("Activado", "El producto ha sido activado.");
                fetchProducts();
            } catch (err: any) {
                toast.error("Error", err.message);
            }
        }
    };



    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold  text-white">Catálogo de Productos</h1>

                {!isFormOpen && (
                    <Button variant="primary" size="lg" onClick={handleOpenCreate}>
                        + Nuevo Producto
                    </Button>
                )}

            </div>

            {isFormOpen ? (
                <div className="mt-4">
                    <ProductForm
                        companyId={currentCompanyId}
                        companyCen={currentCompanyCen}
                        initialData={productToEdit}
                        onSubmit={handleSubmitForm}
                        onCancel={handleCloseForm}
                    />
                </div>
            ) : (
                isLoading ? (
                    <p className="text-gray-400 text-center mt-10">Cargando catálogo...</p>
                ) : (
                    <div className="overflow-x-auto bg-[#111827] rounded-xl border border-[#1f2937] shadow-lg">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead className="bg-[#1f2937] text-gray-400 uppercase text-xs tracking-wider">
                                <tr className="border-b border-[#374151]">
                                    <th className="p-4 font-semibold">SKU</th>
                                    <th className="p-4 font-semibold">Nombre</th>
                                    <th className="p-4 font-semibold">Categoría</th>
                                    <th className="p-4 font-semibold text-right">Costo</th>
                                    <th className="p-4 font-semibold text-right">Precio Venta</th>
                                    <th className="p-4 font-semibold text-center">Estado</th>
                                    <th className="p-4 font-semibold text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f2937]">
                                {products.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-6 text-center text-gray-500 italic">
                                            No hay productos registrados activos.
                                        </td>
                                    </tr>
                                ) : (
                                    products.map(prod => (
                                        <tr key={prod.productCen} className="hover:bg-[#1f2937]/50 transition-colors">
                                            <td className="p-4 text-md text-gray-400">{prod.sku}</td>
                                            <td className="p-4 font-medium text-gray-100">{prod.name}</td>
                                            <td className="p-4 text-md text-gray-400">{prod.categoryName}</td>
                                            <td className="p-4 text-md text-right text-gray-400">{(prod.costPrice ?? 0).toFixed(2)} Bs</td>
                                            <td className="p-4 text-md text-right font-medium text-emerald-400">{prod.salePrice.toFixed(2)} Bs</td>
                                            <td className="p-4 text-center">
                                                {prod.status !== "ACTIVE" ? (
                                                    <span className="bg-gray-500/10 text-gray-400 border border-gray-500/20 text-md px-2 py-1 rounded-full">Inactivo</span>
                                                ) : (
                                                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-md px-2 py-1 rounded-full">Disponible</span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center flex justify-center gap-2">
                                                {/* Botón Editar */}

                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={() => handleOpenEdit(prod)}
                                                    fullWidth={true}
                                                >
                                                    Editar
                                                </Button>

                                                <span className="text-gray-600">|</span>

                                                <Button
                                                    variant={prod.status === "ACTIVE" ? "danger" : "success"}
                                                    size="sm"
                                                    onClick={() => prod.status === "ACTIVE" ? handleDeactivate(prod.productCen, prod.name) : handleActivate(prod.productCen, prod.name)}
                                                    fullWidth={true}
                                                >
                                                    {prod.status === "ACTIVE" ? "Desactivar" : "Activar"}
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            )}
        </div>
    );
};