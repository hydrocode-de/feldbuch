import { IonChip, IonContent, IonHeader, IonIcon, IonLabel, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonActionSheet, useIonAlert, useIonModal } from "@ionic/react"
import { closeCircle } from 'ionicons/icons'
import React, { useState } from "react"
import { Filter, useDatasetFilter, SITE, TREATMENT } from "../features/filter"

const filterValues = {
    site: SITE,
    treatment: TREATMENT
}

interface FilterModalProps {
    filter: Filter,
    current: keyof Filter,
    onChange?: (newFilter: Filter) => void
}
const FilterModal: React.FC<FilterModalProps> = ({filter, current, onChange}) => {
    return (<>
        <IonHeader>
            <IonToolbar>
            <IonTitle>Filter by { current }</IonTitle>
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
    // component state
    const [currentChip, setCurrentChip] = useState<keyof Filter>();
    
    // get the current filter
    const { filter, removeFilter } = useDatasetFilter();

    const [ presentAlert ] = useIonAlert()
    const [ present ] = useIonActionSheet()

    const onClick = (filterKey: keyof Filter) => {
        // presentAlert({
        //     message: `Select ${filterKey}`,
        //     buttons: ['OK', 'Cancel'],
        //     inputs: [
        //         {value: 'One', type: 'radio'},
        //         {value: 'One', type: 'radio'},
        //         {value: 'One', type: 'radio'},
        //     ],
        //     onDidDismiss: (e => console.log(e))
        // })
        present({
            header: `Select ${filterKey}`,
            buttons: [
                {text: 'One', data: 'one'},
                {text: 'Two', data: 'two'},
                {text: 'Three', data: 'three'},
                {text: 'One', data: 'one'},
                {text: 'Two', data: 'two'},
                {text: 'Three', data: 'three'},
                {text: 'One', data: 'one'},
                {text: 'Two', data: 'two'},
                {text: 'Three', data: 'three'},
                {text: 'One', data: 'one'},
                {text: 'Two', data: 'two'},
                {text: 'Three', data: 'three'},
            
            ],
            onDidDismiss: e => console.log(e)
        })
    }
    
    return <>
    {(Object.entries(filter) as Array<[keyof Filter, string]>).map(([key, value], idx) => {
        return (
            <IonChip key={idx} onClick={() => onClick(key)}>
                <IonLabel color="secondary">{key.toUpperCase()}: {value}</IonLabel>
                {!['site', 'treatment', 'number'].includes(key) ? <IonIcon icon={closeCircle}/> : null}
            </IonChip>
        )
    })}
    </>
}

export default FilterChipList