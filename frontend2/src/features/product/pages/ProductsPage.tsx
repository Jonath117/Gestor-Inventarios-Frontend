import { useEffect, useState } from "react";
import type { Product } from "../types/product.types";
import { getProducts } from "../../../services/ProductService";

export const ProductsPage = () => {
    const currentCompanyId = JSON.parse(localStorage.getItem("activeCompany") || "{}").id;

    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const data = await getProducts(currentCompanyId);
            setProducts(data);
        } catch (error) {
            console.error("Error cargando productos:", error);
            alert("No se pudieron cargar los productos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [currentCompanyId]);

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold  text-white">Catálogo de Productos</h1>
                <button className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700">
                    + Nuevo Producto
                </button>
            </div>

            {isLoading ? (
                <p>Cargando catálogo...</p>
            ) : (
                <div className="overflow-x-auto bg-[#111827] rounded-xl border border-[#1f2937]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#1f2937] text-gray-400 uppercase text-medium tracking-wider">
                            <tr className="border-b">
                                <th className="p-3">SKU</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Categoría</th>
                                <th className="p-3">Unidad</th>
                                <th className="p-3 text-right">Costo</th>
                                <th className="p-3 text-right">Precio Venta</th>
                                <th className="p-3 text-center">Estado</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="p-4 text-center text-gray-500">
                                        No hay productos registrados.
                                    </td>
                                </tr>
                            ) : (
                                products.map(prod => (
                                    <tr key={prod.id} className="border-b hover:bg-gray-800">
                                        <td className="p-3 text-sm text-gray-100">{prod.sku}</td>
                                        <td className="p-3 font-medium text-white">{prod.name}</td>
                                        <td className="p-3 text-gray-100">{prod.categoryName}</td>
                                        <td className="p-3 text-gray-100">{prod.unitName}</td>
                                        <td className="p-3 text-right text-red-600">${prod.price.toFixed(2)}</td>
                                        <td className="p-3 text-right font-bold text-green-600">${prod.salePrice.toFixed(2)}</td>
                                        <td className="p-3 text-center">
                                            {prod.isSoldOut ? (
                                                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Agotado (86)</span>
                                            ) : (
                                                <span className="bg-green-100 text-green-800 text-medium px-2 py-1 rounded">Disponible</span>
                                            )}
                                        </td>
                                        <td className="p-3 text-center">
                                            <button className="text-blue-600 underline hover:text-white cursor-pointer px-2 py-1 rounded">Editar</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};