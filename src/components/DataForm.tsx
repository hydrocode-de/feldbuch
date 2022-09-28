import { IonButton, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTextarea, IonToggle } from "@ionic/react";
import { useEffect, useState } from "react";
import { useDatasetFilter } from "../features/filter";
import { DataGroup, Dataset } from "../supabase/feldbuch.model"

interface DataFormProps {
    plot_id: number,
    onSave?: (data: Dataset) => void,
}

const DataForm: React.FC<DataFormProps> = ({plot_id, onSave }) => {
    // component state
    const [data, setData] = useState<{[key: string]: any}>({})
    const { group } = useDatasetFilter();

    // save handler
    const saveHandler = () => {
        // create the object
        const dataset: Dataset = {plot_id, data, group_id: group!.id}
        onSave!(dataset)
    }
    
    // switch the form
    let form: any;
    if (!group) {
        return <IonItem><IonLabel style={{textAlign: 'center'}}>Please select the data type first</IonLabel></IonItem>
    }
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
            </>;
            break;
        case 'g2':
            form = <>
                <IonItem>
                    <IonLabel position="floating">SOLno</IonLabel>
                    <IonInput type="number" min="0" step="1" value={Number(data!.sol_no)} onIonChange={e => setData({...data, sol_no: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">DSF</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.dsf)} onIonChange={e => setData({...data, dsf: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">ISF</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.isf)} onIonChange={e => setData({...data, isf: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">TSF</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.tsf)} onIonChange={e => setData({...data, tsf: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Openess</IonLabel>
                    <IonInput type="text" value={data!.openess} onIonChange={e => setData({...data, openess: e.target.value})}></IonInput>
                </IonItem>
            </>;
            break;
        case 'g3':
            form = <>
                <IonItem>
                    <IonLabel position="fixed">An Dunkelheit angepasst?</IonLabel>
                    <IonToggle checked={Boolean(data.dark_adapted)} onIonChange={e => setData({...data, dark_adapted: Boolean(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">PAMno</IonLabel>
                    <IonInput type="number" min="0" step="1" value={Number(data!.pam_no)} onIonChange={e => setData({...data, pam_no: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">F</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.f)} onIonChange={e => setData({...data, f: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Y</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.y)} onIonChange={e => setData({...data, y: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">M</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.m)} onIonChange={e => setData({...data, m: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">C</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.c)} onIonChange={e => setData({...data, c: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">L</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.l)} onIonChange={e => setData({...data, l: Number(e.target.value)})} />
                </IonItem>
            </>;
            break;
        case 'g4':
            form = <>
                <IonItem>
                    <IonLabel position="floating">Druck</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.pressure)} onIonChange={e => setData({...data, pressure: Number(e.target.value)})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Zeitpunkt der Gewinnung</IonLabel>
                    <IonInput type="datetime-local" value={data.t_collected ? data.t_collected : new Date()} onIonChange={e => setData({...data, t_collected: e.target.value})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Zeitpunkt der Messung</IonLabel>
                    <IonInput type="datetime-local" value={data.t_measured ? data.measured : new Date()} onIonChange={e => setData({...data, t_measured: e.target.value})} />
                </IonItem>
                <IonItem>
                    <IonLabel position="floating">Länge</IonLabel>
                    <IonInput type="number" min="0" step="0.1" value={Number(data!.len)} onIonChange={e => setData({...data, len: Number(e.target.value)})} />
                </IonItem>

            </>;
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
                <IonTextarea placeholder="Eigene Notizen hinzufügen" value={data!.notes} onIonInput={e => setData({...data, notes: e.target.value})} rows={8} />
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