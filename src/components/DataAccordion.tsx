import { IonAccordion, IonAlert, IonButton, IonButtons, IonIcon, IonItem, IonLabel, IonList, IonSpinner, IonTitle, IonToolbar } from "@ionic/react"
import { pencil, close, trashOutline } from "ionicons/icons"
import React, { useState } from "react"
import { useFeldbuch } from "../supabase/feldbuch"
import { Dataset } from "../supabase/feldbuch.model"
import DataForm from "./DataForm"

interface DataAccordionProps {
    index: number,
    dataset: Dataset,
    canUpdate?: boolean
}

const DataAccordion: React.FC<DataAccordionProps> = ({ dataset, index, canUpdate }) => {
    // component state for editing
    const [editMode, setEditMode] = useState<boolean>(false)
    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    // load the datagroups
    const { dataGroups, updateDataset } = useFeldbuch()

    const refDate = new Date(dataset.measurement_time ? dataset.measurement_time : '1970-01-01')
    
    // extra handler for toggling the button to prevent the accordion from opening
    const toggleEditMode = (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
        // toggle edit mode
        setEditMode(!editMode)

        event.stopPropagation()
    }
    
    // for editMode a save handler is needed
    const onSave = (data: Dataset) => {
        // set processing
        setIsProcessing(true)

        // update the dataset
        console.log(index)
        updateDataset!(data, index).then(() => {
            setEditMode(false)

            // reset processing
            setIsProcessing(false)
        }
        )
    }

    return (
        <IonAccordion value={String(index)}>
            <IonItem slot="header" color="light">
                <IonLabel>
                    <strong>{ refDate.getFullYear() }</strong>&nbsp;&nbsp;-&nbsp;&nbsp;{`${dataGroups.find(g => g.id===dataset.group_id)?.long_name}`}
                </IonLabel>
            </IonItem>
            <div className="ion-no-padding" slot="content">
                <IonToolbar>
                    <IonTitle>Details</IonTitle>
                    { canUpdate && !isProcessing  ? (
                        <IonButtons slot="end">
                            <IonButton fill="clear" color={editMode ? 'danger' : 'warning'} onClick={toggleEditMode}>
                                <IonIcon icon={editMode ? close : pencil} slot="icon-only" />
                            </IonButton>
                            <IonButton id="delete-update" fill="clear" color="danger">
                                <IonIcon icon={trashOutline} slot="icon-only" />
                            </IonButton>
                            <IonAlert
                                trigger="delete-update"
                                title="Delete dataset"
                                message="Are you sure you want to delete this dataset?"
                                buttons={[
                                    {text: 'Cancel', role: 'cancel'},
                                    {text: 'Delete', role: 'destructive', handler: () => {console.log('delete')}}
                                ]}
                            />
                        </IonButtons>
                    ) : null }
                    { isProcessing ? (
                        <IonSpinner slot="end" name="dots" />
                    ) : null }
                </IonToolbar>
                
                { editMode ? (
                    <DataForm plot_id={dataset.plot_id} defaults={dataset} onSave={onSave} />
                ) : (
                    <IonList>
                        { Object.entries({...dataset.data}).map(([key, value]) => (
                            <IonItem key={key}>
                                <IonLabel slot="start">{key.toUpperCase()}</IonLabel>
                                <IonLabel slot="end">{String(value)}</IonLabel>
                            </IonItem>
                        )) }
                    </IonList>
                )}
            </div>
        </IonAccordion>
    )
}

export default DataAccordion