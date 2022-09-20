export interface Plot {
    id: number,
    site: string,
    treatment: string,
    species: string,
    place: string,
    number: number,
    individual: string,
    user_id: string,
    pm_replaced: boolean,
    measurement_time: Date,
    created_at: Date,
    wkt: string,
}