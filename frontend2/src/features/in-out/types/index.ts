export interface MovementFormData {
    productId: number | "";
    warehouseId: number | "";
    movementType: "IN" | "OUT";
    quantity: number | "";
    reference: string;
    reason: string;
}