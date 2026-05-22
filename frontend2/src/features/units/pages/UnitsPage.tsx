import { useState, useEffect } from "react";
import { getUnits, createUnit, updateUnit } from "../../../services/UnitsService";
import { UnitsForm } from "../components/UnitsForm";
import type { IUnit, IUnitCreate, IUnitUpdate } from "../types/Units";
import { Button } from "../../../components/ButtonComponent";
import { useToast } from "../../../components/Toast";
import { DataTable } from "../../../components/DataTableComponent";
import type { ColumnDef } from "../../../components/DataTableComponent";

export const UnitsPage = () => {
    const activeCompany = JSON.parse(localStorage.getItem("activeCompany") || "{}");
    const companyId = activeCompany.id;
    const companyCen = activeCompany.companyCen;

    const [units, setUnits] = useState<IUnit[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState<IUnit | null>(null);

    const toast = useToast();

    const fetchUnits = async () => {
        try {
            setLoading(true);
            const data = await getUnits(companyCen, companyId);
            setUnits(data);
        } catch (error) {
            console.error("Error al cargar las unidades:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (companyCen) {
            fetchUnits();
        }
    }, [companyCen]);

    const handleSave = async (unitData: any) => {
        try {
            if (unitData.unitCen) {
                await updateUnit(companyCen, companyId, unitData as IUnitUpdate);
                toast.success("Unidad actualizada", "La unidad se ha actualizado correctamente.");
            } else {
                await createUnit(companyCen, companyId, unitData as IUnitCreate);
                toast.success("Unidad creada", "La unidad se ha creado correctamente.");
            }
            setIsFormOpen(false);
            setEditingUnit(null);
            fetchUnits();
        } catch (error: any) {
            toast.error("Error", error.message);
        }
    };

    const handleEdit = (unit: IUnit) => {
        setEditingUnit(unit);
        setIsFormOpen(true);
    };

    const columns: ColumnDef<IUnit>[] = [
        {
            header: "Nombre",
            accessor: "name",
            className: "font-medium text-white"
        },
        {
            header: "Abreviación",
            accessor: "abbreviation",
            className: "text-gray-100",
            cell: (unit) =>
                unit.abbreviation || (
                    <span className="italic text-gray-600">Sin abreviación</span>
                )
        },
        {
            header: "Acciones",
            cell: (unit) => (
                <Button variant="link" size="lg" onClick={() => handleEdit(unit)}>
                    Editar
                </Button>
            ),
        }
    ]

    return (
        <div className="p-4 sm:p-6 lg:p-8 w-full">
            {/* Header Responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 text-white">

                {isFormOpen ? (
                    <div className="flex justify-center w-full">
                        <h1 className="text-2xl font-bold ">{editingUnit ? "Editar Unidad" : "Nueva Unidad"}</h1>
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
                        initialData={editingUnit}
                        onSubmit={handleSave}
                        onCancel={() => {
                            setIsFormOpen(false);
                            setEditingUnit(null);
                        }}
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