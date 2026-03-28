import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "success" | "danger" | "ghost" | "link";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    loadingText?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
    children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-indigo-600 text-white border-transparent hover:bg-indigo-500 active:bg-indigo-700 shadow-[0_1px_2px_rgba(79,70,229,0.3)] hover:shadow-[0_3px_10px_rgba(79,70,229,0.35)]",
    success:
        "bg-emerald-600 text-white border-transparent hover:bg-emerald-500 active:bg-emerald-700 shadow-[0_1px_2px_rgba(5,150,105,0.3)] hover:shadow-[0_3px_10px_rgba(5,150,105,0.35)]",
    danger:
        "bg-rose-600 text-white border-transparent hover:bg-rose-500 active:bg-rose-700 shadow-[0_1px_2px_rgba(225,29,72,0.3)] hover:shadow-[0_3px_10px_rgba(225,29,72,0.35)]",
    ghost:
        "bg-transparent text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300 active:bg-slate-200 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800",
    link: "bg-transparent text-indigo-600 border-transparent hover:text-indigo-500 underline-offset-2 hover:underline px-0 py-0 rounded-none shadow-none dark:text-indigo-400",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2 gap-2",
    lg: "text-base px-5 py-2.5 gap-2.5",
};

export function Button({
    variant = "primary",
    size = "md",
    loading = false,
    loadingText = "Procesando...",
    icon,
    iconPosition = "left",
    fullWidth = false,
    disabled,
    children,
    className = "",
    ...props
}: ButtonProps) {
    const isDisabled = disabled || loading;

    return (
        <button
            disabled={isDisabled}
            className={[
                // base
                "relative inline-flex items-center justify-center font-medium rounded-lg border",
                "transition-all duration-150 ease-out",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                "active:scale-[0.97]",
                // disabled
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
                // variant
                variantStyles[variant],
                // size
                sizeStyles[size],
                // full width
                fullWidth ? "w-full" : "w-auto",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            {...props}
        >
            {/* Spinner when loading */}
            {loading && (
                <svg
                    className="animate-spin shrink-0 w-4 h-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                </svg>
            )}

            {/* Icon left */}
            {!loading && icon && iconPosition === "left" && (
                <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                    {icon}
                </span>
            )}

            {/* Label */}
            <span>{loading ? loadingText : children}</span>

            {/* Icon right */}
            {!loading && icon && iconPosition === "right" && (
                <span className="shrink-0 w-4 h-4 flex items-center justify-center">
                    {icon}
                </span>
            )}
        </button>
    );
}