import { IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonModal } from "@ionic/react"
import { closeCircle } from 'ionicons/icons'
import React from "react"
import { Filter, useDatasetFilter } from "../features/filter"


interface FilterModalProps {
    filter: Filter,
    current: keyof Filter,
    onChange?: (newFilter: Filter) => void
}
const FilterModal: React.FC<FilterModalProps> = ({filter, current, onChange}) => {
    return (<>
        <IonHeader>
            <IonToolbar>
            <IonTitle>{ current }</IonTitle>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonSelect>
                <IonSelectOption>One</IonSelectOption>
                <IonSelectOption>Two</IonSelectOption>
            </IonSelect>
        </IonContent>
    </>)
}

const FilterChipList: React.FC = () => {
    // get the current filter
    const { filter, removeFilter } = useDatasetFilter();

    const [present, dismiss] = useIonModal(<FilterModal onChange={() => console.log('filtered')}/>)
    const onClick = (filter: string) => {
        
    }
    
    return <>
    {(Object.entries(filter) as Array<[keyof Filter, string]>).map(([key, value], idx) => {
        return (
            <IonChip key={idx} onClick={() => removeFilter([key])} disabled={['site', 'treatment', 'number'].includes(key)}>
                <IonLabel color="secondary">{key.toUpperCase()}: {value}</IonLabel>
                {!['site', 'treatment', 'number'].includes(key) ? <IonIcon icon={closeCircle}/> : null}
            </IonChip>
        )
    })}
    </>
}

export default FilterChipList