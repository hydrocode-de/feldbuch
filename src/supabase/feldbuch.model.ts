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
    id: number,
    plot_id: number,
    group: 'g1' | 'g2' | 'g3' | 'g4',
    user_id?: string,
    data: {[key: string]: Date | number | string};
}

export interface DataGroup {
    id: number;
    short_name: string;
    long_name: string;
    created_at: Date;
}