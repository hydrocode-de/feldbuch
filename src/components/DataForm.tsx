import { IonButton, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTextarea } from "@ionic/react";
import { useState } from "react";
import { DataGroup, Dataset } from "../supabase/feldbuch.model"

interface DataFormProps {
    group: DataGroup,
    plot_id: number,
    onSave?: (data: Dataset) => void,
}

const DataForm: React.FC<DataFormProps> = ({group, plot_id, onSave }) => {
    // component state
    const [data, setData] = useState<{[key: string]: any}>({})

    // save handler
    const saveHandler = () => {
        // create the object
        const dataset: Dataset = {plot_id, data, group_id: group.id}
        onSave!(dataset)
    }
    
    // switch the form
    let form: any;
    switch (group.short_name) {
        case 'g1':
            form = <>
                <IonItem>
                    <IonLabel position="floating">Höhe</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.height)} onIonChange={e => setData({...data, height: Number(e.target.value)})}  />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Länge</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.len)} onIonChange={e => setData({...data, len: Number(e.target.value)})}  />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Durchmesser</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.diameter)} onIonChange={e => setData({...data, diameter: Number(e.target.value)})}  />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Sterblichkeit</IonLabel>
                    <IonSelect onIonChange={e => setData({...data, mortality: e.target.value})}>
                        <IonSelectOption value="dead">dead</IonSelectOption>
                        <IonSelectOption value="ms dead">ms dead</IonSelectOption>
                    </IonSelect>
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Cause</IonLabel>
                    <IonInput type="text" value={data!.cause} onIonChange={e => setData({...data, cause: e.target.value})} />
                </IonItem>
                <IonTextarea placeholder="Eigene Notizen hinzufügen" value={data!.notes} onIonInput={e => setData({...data, notes: e.target.value})} rows={8} />
            </>;
            break;
        case 'g2':
            form = (null);
            break;
        case 'g3':
            form = (null);
            break;
        case 'g4':
            form = (null);
            break;
            
        default:
            return (
                <IonItem color="danger">
                    <IonLabel>Got an undefined group identifier</IonLabel>
                </IonItem>
            );
    }

    return (
        <>
            <IonList>
                { form }
                <IonButton 
                    expand="block"
                    color="success"
                    disabled={Object.keys(data).length === 0}
                    onClick={saveHandler}
                >SPEICHERN</IonButton>
            </IonList>
        </>
    )
}

export default DataForm