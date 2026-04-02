import type { ReactNode } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export type Align = "left" | "center" | "right";

export interface ColumnDef<T> {
    /** Texto del encabezado */
    header: string;
    /** Clave del objeto O render function */
    accessor?: keyof T;
    /** Render personalizado; recibe la fila completa */
    cell?: (row: T) => ReactNode;
    /** Alineación de celda (default: left) */
    align?: Align;
    /** Clases extra para <th> y <td> */
    className?: string;
}

interface DataTableProps<T extends { id?: number | string }> {
    /** Definición de columnas */
    columns: ColumnDef<T>[];
    /** Filas de datos */
    data: T[];
    /** Clave única por fila (default: "id") */
    rowKey?: keyof T;
    /** Mensaje cuando data está vacía */
    emptyMessage?: string;
    /** Muestra skeleton de carga */
    loading?: boolean;
    /** Nodo encima de la tabla (filtros, selector, etc.) */
    toolbar?: ReactNode;
    /** Clases extra del wrapper externo */
    className?: string;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

const alignClass: Record<Align, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

function SkeletonRows({ cols }: { cols: number }) {
    return (
        <>
            {[...Array(4)].map((_, i) => (
                <tr key={i} className="border-b border-[#1f2937]">
                    {[...Array(cols)].map((_, j) => (
                        <td key={j} className="px-5 py-4">
                            <div
                                className="h-3 rounded-full bg-[#1f2937] animate-pulse"
                                style={{ width: `${60 + Math.random() * 30}%`, opacity: 1 - i * 0.15 }}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function DataTable<T extends object>({
    columns,
    data,
    rowKey = "id" as keyof T,
    emptyMessage = "No hay datos registrados.",
    loading = false,
    toolbar,
    className = "",
}: DataTableProps<T>) {
    return (
        <div className={`flex flex-col gap-3 ${className}`}>
            {/* ── Toolbar opcional ── */}
            {toolbar && (
                <div className="bg-[#111827] border border-[#1f2937] rounded-xl px-4 py-3 flex flex-wrap items-center gap-3 shadow-sm">
                    {toolbar}
                </div>
            )}

            {/* ── Tabla ── */}
            <div className="overflow-x-auto bg-[#111827] rounded-xl border border-[#1f2937] shadow-xl">
                <table className="w-full text-sm text-left border-collapse">
                    {/* HEAD */}
                    <thead>
                        <tr className="bg-[#1f2937] border-b border-[#374151]">
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={[
                                        "px-5 py-3.5 text-xs font-semibold uppercase tracking-widest text-gray-400 select-none whitespace-nowrap",
                                        alignClass[col.align ?? "left"],
                                        col.className ?? "",
                                    ].join(" ")}
                                >
                                    {col.header}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    {/* BODY */}
                    <tbody className="divide-y divide-[#1f2937]">
                        {loading ? (
                            <SkeletonRows cols={columns.length} />
                        ) : data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={columns.length}
                                    className="px-5 py-12 text-center text-gray-500 italic text-sm"
                                >
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIdx) => {
                                const key = row[rowKey] != null ? String(row[rowKey]) : rowIdx;
                                return (
                                    <tr
                                        key={key}
                                        className="group hover:bg-[#1a2232] transition-colors duration-150"
                                    >
                                        {columns.map((col, colIdx) => {
                                            const value = col.accessor ? row[col.accessor] : undefined;
                                            return (
                                                <td
                                                    key={colIdx}
                                                    className={[
                                                        "px-5 py-4 text-gray-300 whitespace-nowrap",
                                                        alignClass[col.align ?? "left"],
                                                        col.className ?? "",
                                                    ].join(" ")}
                                                >
                                                    {col.cell
                                                        ? col.cell(row)
                                                        : value != null
                                                            ? String(value)
                                                            : <span className="italic text-gray-600">—</span>}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}