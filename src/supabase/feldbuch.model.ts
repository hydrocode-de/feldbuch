export interface Plot {
    id: number,
    site: string,
    treatment: string,
    species: string,
    place: string,
    number: string,
    individual: string,
    lon: number,
    lat: number,
    pm_replaced: boolean,   
    created_at: Date,
}

export interface Dataset {
    id?: number,
    plot_id: number,
    group_id: number,
    user_id?: string,
    data: {[key: string]: Date | number | string | Boolean},
    measurement_time?: Date | string,
    created_at?: Date | string
}

export interface BaseData {
    update: Dataset
    dataset?: Dataset
    plot?: Plot
}

export interface DataGroup {
    id: number;
    short_name: string;
    long_name: string;
    created_at: Date;
}