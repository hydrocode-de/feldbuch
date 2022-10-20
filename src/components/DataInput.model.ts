export interface DataInputProps {
    onSave: (data: {[key: string]: string | number | Date | Boolean}) => void
}