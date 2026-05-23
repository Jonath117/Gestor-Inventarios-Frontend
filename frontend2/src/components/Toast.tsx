import { createContext, useContext, useState, useCallback, useRef, type ReactNode } from "react";
import {
    CheckCircleIcon,
    ExclamationTriangleIcon,
    XCircleIcon,
    InformationCircleIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

// ── Tipos ──────────────────────────────────────────────────────────────────
type ToastType = "success" | "error" | "warning" | "info";

interface Toast {
    id: number;
    type: ToastType;
    title: string;
    message?: string;
    onConfirm?: (val: boolean) => void;
}
interface ToastContextType {
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;

    confirm: (title: string, message?: string) => Promise<boolean>;
}

// ── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
    return ctx;
};

// ── Estilos por tipo ───────────────────────────────────────────────────────
const styles: Record<ToastType, { border: string; icon: string; iconBg: string; bar: string }> = {
    success: {
        border: "border-emerald-500/30",
        icon: "text-emerald-400",
        iconBg: "bg-emerald-500/10",
        bar: "bg-emerald-500",
    },
    error: {
        border: "border-red-500/30",
        icon: "text-red-400",
        iconBg: "bg-red-500/10",
        bar: "bg-red-500",
    },
    warning: {
        border: "border-yellow-500/30",
        icon: "text-yellow-400",
        iconBg: "bg-yellow-500/10",
        bar: "bg-yellow-500",
    },
    info: {
        border: "border-indigo-500/30",
        icon: "text-indigo-400",
        iconBg: "bg-indigo-500/10",
        bar: "bg-indigo-500",
    },
};

const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircleIcon className="w-8 h-8" />,
    error: <XCircleIcon className="w-8 h-8" />,
    warning: <ExclamationTriangleIcon className="w-8 h-8" />,
    info: <InformationCircleIcon className="w-8 h-8" />,
};

// ── Toast individual ───────────────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: number) => void }) => {
    const s = styles[toast.type];



    return (
        <div
            className={`
                relative flex items-start gap-3 
                w-200 
                rounded-xl
                bg-[#111827] border ${s.border}
                px-4 py-3.5 shadow-2xl shadow-black/40
                animate-[slideIn_0.3s_ease_forwards]
            `}
        >
            {/* Barra lateral de color */}
            <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-full ${s.bar}`} />

            {/* Ícono */}
            <div className={`shrink-0 p-1.5 rounded-lg ${s.iconBg} ${s.icon} mt-0.5`}>
                {icons[toast.type]}
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
                <p className="text-1xl font-semibold text-white leading-snug">{toast.title}</p>
                {toast.message && (
                    <p className="text-1xl text-gray-400 mt-0.5 leading-relaxed">{toast.message}</p>
                )}
                {toast.onConfirm && (
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={() => {
                                toast.onConfirm?.(true);
                                onRemove(toast.id);
                            }}
                            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                            Confirmar
                        </button>
                        <button
                            onClick={() => {
                                toast.onConfirm?.(false);
                                onRemove(toast.id);
                            }}
                            className="px-3 py-1 rounded bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                )}
            </div>

            {/* Cerrar */}
            <button
                onClick={() => onRemove(toast.id)}
                className="shrink-0 text-gray-600 hover:text-gray-300 transition-colors mt-0.5"
            >
                <XMarkIcon className="w-6 h-6" />
            </button>

            {/* Barra de progreso */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl ${s.bar} opacity-30 animate-[shrink_3s_linear_forwards]`} />
        </div>
    );
};

// ── Provider ───────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const counter = useRef(0);

    const remove = useCallback((id: number) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const add = useCallback((type: ToastType, title: string, message?: string, onConfirm?: (val: boolean) => void) => {
        const id = Date.now() + counter.current++;
        setToasts((prev) => [...prev, { id, type, title, message, onConfirm }]);

        if (!onConfirm) {
            setTimeout(() => remove(id), 3000);
        }
    }, [remove]);

    const ctx: ToastContextType = {
        success: (t, m) => add("success", t, m),
        error: (t, m) => add("error", t, m),
        warning: (t, m) => add("warning", t, m),
        info: (t, m) => add("info", t, m),
        confirm: (t, m) =>
            new Promise((resolve) =>
                add("warning", t, m, (result: boolean) => resolve(result))
            ),
    };

    return (
        <ToastContext.Provider value={ctx}>
            {children}

            {/* Contenedor de toasts */}
            <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none">
                {toasts.map((t) => (
                    <div key={t.id} className="pointer-events-auto">
                        <ToastItem toast={t} onRemove={remove} />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};