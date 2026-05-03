export interface BaseEntity {
    id: number;
    created_at: string;
    updated_at: string;
}


export interface PaginationResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}