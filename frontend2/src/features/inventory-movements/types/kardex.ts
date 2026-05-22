export interface KardexEntry {
    movementCen: string;
    movementType: string;
    date: string;
    warehouseCen: string;
    warehouseName: string;
    quantity: number;
    balance: number;
    source?: string;
    referenceCen?: string;
}
