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

export interface Dataset {
    plot_id: number,
    type: 'g1' | 'g2' | 'g3' | 'g4',
    [key: string]: Date | number | string;
}