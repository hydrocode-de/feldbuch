import React from "react"
import { IonChip, IonLabel, useIonActionSheet, useIonAlert } from "@ionic/react"
import { Filter, useDatasetFilter, SITE, TREATMENT, INDIVIDUAL, PLACE } from "../features/filter"

const filterValues = {
    site: SITE,
    treatment: TREATMENT,
    individual: INDIVIDUAL,
    number: [],
    species: [],
    place: PLACE
}

const FilterChipList: React.FC = () => {
    // get the current filter
    const { filter, addFilter } = useDatasetFilter();

    const [ presentAlert ] = useIonAlert()
    const [ present ] = useIonActionSheet()

    const onClick = (filterKey: keyof Filter) => {
        if (['site', 'treatment', 'individual', 'place'].includes(filterKey)) {
            present({
                header: `Select ${filterKey}`,
                buttons: [
                    ...filterValues[filterKey].map(o => {
                        return {text: o, data: o, role: 'accept'}
                    }),
                ],
                onDidDismiss: e => {
                    // if the action sheet was not dismissed, set the new filter
                    if (e.detail.role !== 'cancel') {
                        addFilter({[filterKey]: e.detail.data })
                    }
                }
            })
        } else if (filterKey === 'number') {
            presentAlert({
                message: 'Select number',
                buttons: ['OK', 'Cancel'],
                inputs: [{
                    type: 'number',
                    value: Number(filter[filterKey]),
                    min: 0,
                    max: 280
                }],
                onDidDismiss: e => {
                    if (e.detail.role !== 'cancel') {
                        addFilter({number: e.detail.data.values[0]})
                    }
                }
            })
        }
    }
    
    return <>
    {(Object.entries(filter) as Array<[keyof Filter, string]>).map(([key, value], idx) => {
        return (
            <IonChip key={idx} onClick={() => onClick(key)}>
                <IonLabel color="secondary">{key.toUpperCase()}: {value}</IonLabel>
            </IonChip>
        )
    })}
    </>
}

export default FilterChipList