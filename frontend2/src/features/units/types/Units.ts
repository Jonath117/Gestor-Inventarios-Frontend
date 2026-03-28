export interface IUnit {
    id: number;
    name: string;
    description?: string;
}

export interface IUnitCreate {
    name: string;
    description?: string;
}

export interface IUnitFormError {
    name?: string;
    description?: string;
}