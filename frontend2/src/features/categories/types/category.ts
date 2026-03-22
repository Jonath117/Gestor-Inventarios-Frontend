export interface Category{
    id: number;
    name: string;
    description? : string;
}

export interface CategoryCreate{
    name: string;
    description? : string;
}

export interface CategoryUpdate extends CategoryCreate{
    id: number;
}