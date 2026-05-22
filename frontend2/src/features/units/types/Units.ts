export interface IUnit {
    unitCen: string;
    name: string;
    abbreviation?: string;
    isActive: boolean;
}

export interface IUnitCreate {
    name: string;
    abbreviation?: string;
}

export interface IUnitUpdate extends IUnitCreate {
    unitCen: string;
}

export interface IUnitFormError {
    name?: string;
    abbreviation?: string;
}