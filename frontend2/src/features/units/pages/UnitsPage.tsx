import { useState, useEffect } from "react";
import { getUnits, createUnit } from "../../../services/UnitsService";
import { UnitsForm } from "../components/UnitsForm";
import type { IUnit, IUnitCreate } from "../types/Units";
import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";
import { DataTable } from "../../../components/DataTableComponent";
import type { ColumnDef } from "../../../components/DataTableComponent";

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

    const columns: ColumnDef<IUnit>[] = [
        {
            header: "Nombre",
            accessor: "name",
            className: "font-medium text-white"
        },
        {
            header: "Descripción",
            cell: (unit) =>
                unit.description || (
                    <span className="italic text-gray-600">Sin descripción</span>
                )
        }
    ]

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            {/* Header Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 text-white">

                {isFormOpen ? (
                    <div className="flex justify-center w-full">
                        <h1 className="text-2xl font-bold ">Nueva Unidad</h1>
                    </div>
                ) : (
                    <h1 className="text-2xl font-bold">Unidades de Medida</h1>
                )}


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
                <DataTable
                    data={units}
                    columns={columns}
                    loading={loading}
                    emptyMessage="No hay unidades registradas"
                />
            )}
        </div>
    );
};