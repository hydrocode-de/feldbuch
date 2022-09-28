import { IonBadge, IonChip, IonIcon, IonLabel } from "@ionic/react"
import { closeCircle } from 'ionicons/icons'
import React from "react"
import { Filter, useDatasetFilter } from "../features/filter"


const FilterChipList: React.FC = () => {
    // get the current filter
    const { filter, removeFilter } = useDatasetFilter();
    
    return <>
    {(Object.entries(filter) as Array<[keyof Filter, string]>).map(([key, value], idx) => {
        return (
            <IonChip key={idx} onClick={() => removeFilter([key])} disabled={['site', 'treatment'].includes(key)}>
                <IonLabel color="secondary">{key.toUpperCase()}: {value}</IonLabel>
                {!['site', 'treatment'].includes(key) ? <IonIcon icon={closeCircle}/> : null}
            </IonChip>
        )
    })}
    </>
}

export default FilterChipList