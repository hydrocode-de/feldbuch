import { Dataset } from "../supabase/feldbuch.model";

export interface DataInputProps {
    onSave: (data: {[key: string]: string | number | Date | Boolean}) => void,
    values?: {[key: string]: string | number | Date | Boolean},
}