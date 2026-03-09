import { MovementForm } from "../components/MovementForm";

export const MovementPage = () => {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="mb-8 flex justify-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Registrar Movimiento de Inventario</h1>
            </div>
            
            <MovementForm />
        </div>
    );
};