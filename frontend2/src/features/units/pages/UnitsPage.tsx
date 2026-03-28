import { useState, useEffect } from "react";
import { getUnits, createUnit } from "../../../services/UnitsService";
import { UnitsForm } from "../components/UnitsForm";
import type { IUnit, IUnitCreate } from "../types/Units";
import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";

export const UnitsPage = () => {
    const companyId = JSON.parse(localStorage.getItem("activeCompany") || "{}").id;

    const [units, setUnits] = useState<IUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const toast = useToast();

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const data = await getUnits(companyId);
            setUnits(data);
        } catch (error) {
            console.error("Error al cargar las unidades:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyId > 0) {
            fetchUnits();
        }
    }, [companyId]);

    const handleSave = async (unitData: IUnitCreate | IUnit) => {
        try {
            await createUnit(companyId, unitData as IUnitCreate);
            setIsFormOpen(false);
            fetchUnits();
            toast.success("Unidad creada exitosamente", "La unidad se ha creado correctamente.");
        } catch (error: any) {
            toast.error("Error al crear la unidad", error.message);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            {/* Header Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 text-white">
                <h1 className="text-2xl font-bold">Unidades de Medida</h1>
                {!isFormOpen && (
                    <Button variant="primary" size="lg" onClick={() => setIsFormOpen(true)}>
                        + Nueva Unidad
                    </Button>
                )}
            </div>

            {isFormOpen ? (
                <div className="flex justify-center mt-10">
                    <UnitsForm
                        onSubmit={handleSave}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </div>
            ) : (
                <div className="overflow-x-auto bg-[#111827] rounded-xl border border-[#1f2937] shadow-lg">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Cargando unidades...</div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[500px]">
                            <thead className="bg-[#1f2937] text-gray-400 uppercase text-medium tracking-wider">
                                <tr>
                                    <th className="p-4 font-semibold">Nombre</th>
                                    <th className="p-4 font-semibold">Descripción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[#1f2937]">
                                {units.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="p-6 text-center text-gray-500">
                                            No hay unidades registradas.
                                        </td>
                                    </tr>
                                ) : (
                                    units.map((unit) => (
                                        <tr key={unit.id} className="hover:bg-[#1f2937]/50 transition-colors">
                                            <td className="p-4 text-sm text-gray-100 font-medium">{unit.name}</td>
                                            <td className="p-4 text-medium text-white">
                                                {unit.description || <span className="italic text-gray-600">Sin descripción</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};