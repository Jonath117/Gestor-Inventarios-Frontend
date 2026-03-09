export interface KardexEntry {
    id: number;
    date: string;
    movementType: string;
    quantity: number;
    previousStock: number;
    newStock: number;
    reason: string;
    reference: string | null;
    wareHouseName: string;
}
