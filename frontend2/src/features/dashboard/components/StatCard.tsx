interface Props {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    accent: "indigo" | "emerald" | "red";
    subtitle?: string;
}

const accentMap = {
    indigo: {
        bg: "bg-indigo-500/10",
        border: "border-indigo-500/20",
        icon: "text-indigo-400",
        value: "text-indigo-300",
        glow: "shadow-indigo-500/10",
    },
    emerald: {
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: "text-emerald-400",
        value: "text-emerald-300",
        glow: "shadow-emerald-500/10",
    },
    red: {
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        icon: "text-red-400",
        value: "text-red-300",
        glow: "shadow-red-500/10",
    },
};

export const StatCard = ({ title, value, icon, accent, subtitle }: Props) => {
    const c = accentMap[accent];

    return (
        <div className={`relative rounded-2xl border ${c.border} bg-[#111827] p-6 shadow-xl ${c.glow} overflow-hidden`}>
            {/* Fondo decorativo */}
            <div className={`absolute -top-6 -right-6 w-28 h-28 rounded-full ${c.bg} blur-2xl`} />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
                        {title}
                    </p>
                    <p className={`text-4xl font-bold ${c.value} tabular-nums`}>
                        {value.toLocaleString()}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-xl ${c.bg} border ${c.border} ${c.icon}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
};