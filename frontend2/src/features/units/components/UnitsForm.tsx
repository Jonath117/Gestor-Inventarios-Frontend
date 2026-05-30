import { useState, useEffect } from "react";
import type { IUnit, IUnitCreate } from "../types/Units";
import { Button } from "../../../components/ButtonComponent";

interface Props {
    initialData?: IUnit | null;
    onSubmit: (data: IUnitCreate | IUnit) => void;
    onCancel: () => void;
}

export const UnitsForm = ({ initialData, onSubmit, onCancel }: Props) => {
    const [formData, setFormData] = useState<IUnitCreate>({
        name: "",
        abbreviation: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                abbreviation: initialData.abbreviation || "",
            });
        } else {
            setFormData({ name: "", abbreviation: "" });
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (initialData) {
            onSubmit({ ...initialData, ...formData });
        } else {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#111827] border p-5 sm:p-6 rounded-xl border-[#1f2937] w-full max-w-md mx-auto shadow-lg">
            <h3 className="font-bold mb-5 text-lg text-white">
                {initialData ? "Editar Unidad" : "Nueva Unidad"}
            </h3>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre</label>
                <input
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border p-2.5 w-full rounded-lg bg-[#0f172a] border-[#374151] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Ej. Litro, Porción..."
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-1">Descripción (Opcional)</label>
                <input
                    name="abbreviation"
                    value={formData.abbreviation}
                    onChange={handleChange}
                    className="border p-2.5 w-full rounded-lg bg-[#0f172a] border-[#374151] text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                    placeholder="Detalles adicionales..."
                />
            </div>

            <div className="flex gap-5 justify-between">
                <Button variant="danger" size="lg" onClick={onCancel} fullWidth={true}>
                    Cancelar
                </Button>

                <Button variant="success" size="lg" onClick={handleSubmit} fullWidth={true}>
                    Guardar
                </Button>
            </div>
        </form>
    );
};