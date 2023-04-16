import { IonButton, IonInput, IonItem, IonLabel, IonList, IonNote, IonSelect, IonSelectOption, IonTextarea, IonToggle } from '@ionic/react'
import { useState } from 'react'
import { DataInputProps } from './DataInput.model'

const DataInputG1: React.FC<DataInputProps> = ({ onSave, values }) => {
    // component state
    const [height, setHeight] = useState<number | undefined>(values?.height ? Number(values.height) : undefined)
    const [len, setLen] = useState<number | undefined>(values?.length ? Number(values.length) : undefined)
    const [diameter, setDiameter] = useState<number | undefined>(values?.diameter ? Number(values.diameter) : undefined)
    const [mortality, setMortality] = useState<string | undefined>(values?.mortality ? String(values.mortality) : undefined)
    const [browse, setBrowse] = useState<boolean>(values?.browse ? !!values.browse : false)
    const [cause, setCause] = useState<string | undefined>(values?.cause ? String(values.cause) : undefined)
    const [lost, setLost] = useState<boolean>(values?.lost ? !!values.lost : false)
    const [notes, setNotes] = useState<string | undefined>(values?.notes ? String(values.notes) : undefined)

    // save handler
    const saveHandler = () => {
        const data = {
            ...(height && { height }), 
            ...(len && { length: len }), 
            ...(diameter && { diameter }), 
            ...(mortality && { mortality }), 
            ...(browse && { browse }),
            ...(cause && { cause }), 
            ...(lost && { lost }),
            ...(notes && { notes })}
        onSave(data)
    }

    return (<>
        <IonList>
            <IonItem>
                <IonInput label="Height" labelPlacement="floating" type="number" min="0" step="0.1" value={height} onIonChange={e => setHeight(Number(e.target.value))}  />
            </IonItem>
            <IonItem>
                <IonInput label="Length" labelPlacement="floating" type="number" min="0" step="0.1" value={len} onIonChange={e => setLen(Number(e.target.value))}  />
            </IonItem>
            <IonItem>
                <IonInput label="Diameter" labelPlacement="floating" type="number" min="0" step="0.1" value={diameter} onIonChange={e => setDiameter(Number(e.target.value))}  />
            </IonItem>
            <IonItem>
                <IonSelect label="Mortality" labelPlacement="floating" onIonChange={e => setMortality(e.target.value)}>
                    <IonSelectOption value="dead">dead</IonSelectOption>
                    <IonSelectOption value="ms dead">ms dead</IonSelectOption>
                </IonSelect>
            </IonItem>
            <IonItem>
                <IonToggle mode="ios" color="warning"  checked={browse} onIonChange={e => setBrowse(e.target.checked)} justify="space-between">Plant has been browsed</IonToggle>
            </IonItem>
            <IonItem>
                <IonInput label="Cause" labelPlacement="floating" type="text" value={cause} onIonChange={e => setCause(String(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonToggle mode="ios" color="danger" checked={lost} onIonChange={e => setLost(e.target.checked)} justify="space-between">
                    This plant is lost
                </IonToggle>
                <IonNote slot="helper">This toggle indicates, that the entire plant is not there anymore, and recording is not possible. A browsing damage can be indicated above.</IonNote>
            </IonItem>
        </IonList>
        <IonTextarea placeholder="Place custom notes" label="Notes" value={notes} onIonChange={e => setNotes(String(e.target.value))} rows={8} />
        <IonButton 
            expand="block"
            color="success"
            disabled={(!height || !len || !diameter) && !lost && !(mortality==='dead' && len)}
            onClick={saveHandler}
        >SAVE</IonButton>
    </>)
}

export default DataInputG1