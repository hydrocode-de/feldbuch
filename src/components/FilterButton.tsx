import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonModal } from '@ionic/react';
import { filter as filterIcon, closeCircle } from 'ionicons/icons'
import React from 'react';
import { Filter, INDIVIDUAL, SITE, TREATMENT, useDatasetFilter } from "../features/filter"

// get the ionbutton props without onClick
type IonButtonProps = Exclude<React.ComponentProps<typeof IonButton>, 'onClick'>

interface FilterModalProps {
    onSave?: (data?: any) => void
}

const FilterModal: React.FC<FilterModalProps> = ({ onSave }) => {
    // load the current filter
    const { filter, addFilter, removeFilter } = useDatasetFilter()

    // change handler
    const filterChangeHandler = (key: keyof Filter, value: string) => {
        // check if the filter was set or removed
        if (value && value !== 'remove') {
            addFilter({[key]: value})
        } else {
            removeFilter([key])
        }
    }

    return <>
        <IonHeader>
            <IonToolbar>
                <IonTitle>Filter</IonTitle>
                <IonButtons slot="end">
                    <IonButton color="primary" onClick={() => onSave!(filter)}>APPLY</IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
            <IonList>
                <IonItem>
                    <IonLabel>Site</IonLabel>
                    <IonSelect interface="popover" value={filter.site} onIonChange={e => filterChangeHandler('site', e.target.value)}>
                        { SITE.map((s, idx) => <IonSelectOption key={idx} value={s}>{s}</IonSelectOption>) }
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel>Treatment</IonLabel>
                    <IonSelect value={filter.treatment} onIonChange={e => filterChangeHandler('treatment', e.target.value)}>
                        { TREATMENT.map((t, idx) => <IonSelectOption key={idx} value={t}>{t}</IonSelectOption>) }
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel>Individual</IonLabel>
                    <IonSelect interface="action-sheet" value={filter.individual} onIonChange={e => filterChangeHandler('individual', e.target.value)}>
                        <IonSelectOption value="remove">- no filter by individual -</IonSelectOption>
                        { INDIVIDUAL.map((i, idx) => <IonSelectOption key={idx} value={i}>{i}</IonSelectOption>)}
                    </IonSelect>
                    { filter.individual  ? (
                        <IonButtons slot="end">
                            <IonButton color="danger" onClick={() => filterChangeHandler('individual', 'remove')}>
                                <IonIcon slot="icon-only" icon={closeCircle} />
                            </IonButton>
                        </IonButtons>
                    ) : null }
                </IonItem>
                <IonItem>
                    <IonLabel position="fixed">Number</IonLabel>
                    <IonInput type="number" min="0" max="280" value={filter.number} onIonChange={e => filterChangeHandler('number', e.target.value as string)} />
                    { filter.number  ? (
                        <IonButtons slot="end">
                            <IonButton color="danger" onClick={() => filterChangeHandler('number', 'remove')}>
                                <IonIcon slot="icon-only" icon={closeCircle} />
                            </IonButton>
                        </IonButtons>
                    ) : null }
                </IonItem>
                <IonItem>
                    <IonLabel>Species</IonLabel>
                    <IonInput type="text" value={filter.species} onIonChange={e => filterChangeHandler('species', e.target.value as string)} />
                    { filter.species  ? (
                        <IonButtons slot="end">
                            <IonButton color="danger" onClick={() => filterChangeHandler('species', 'remove')}>
                                <IonIcon slot="icon-only" icon={closeCircle} />
                            </IonButton>
                        </IonButtons>
                    ) : null }
                </IonItem>
            </IonList>
        </IonContent>
    </>
}

const FilterButton: React.FC<IonButtonProps> = props => {    
    // handle new filter
    const onSave = (data: any) => {
        console.log(data)
        dismiss()
    }

    const [present, dismiss] = useIonModal(
        <FilterModal onSave={onSave} />
    )

    return (
        <>
            <IonButton {...props} onClick={() => present()}>
                <IonIcon slot="icon-only" icon={filterIcon} />
            </IonButton>
        </>
    )
}

export default FilterButton