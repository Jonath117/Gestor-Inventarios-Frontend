export interface Category{
    categoryCen: string;
    name: string;
    description? : string;
    isActive: boolean;
}

export interface CategoryCreate{
    name: string;
    description? : string;
}

export interface CategoryUpdate extends CategoryCreate{
    categoryCen: string;
}