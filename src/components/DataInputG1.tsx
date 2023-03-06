import { IonButton, IonInput, IonItem, IonLabel, IonList, IonNote, IonSelect, IonSelectOption, IonTextarea, IonToggle } from '@ionic/react'
import { useState } from 'react'
import { DataInputProps } from './DataInput.model'

const DataInputG1: React.FC<DataInputProps> = ({ onSave }) => {
    // component state
    const [height, setHeight] = useState<number>()
    const [len, setLen] = useState<number>()
    const [diameter, setDiameter] = useState<number>()
    const [mortality, setMortality] = useState<string>()
    const [browse, setBrowse] = useState<boolean>(false)
    const [cause, setCause] = useState<string>()
    const [lost, setLost] = useState<boolean>(false)
    const [notes, setNotes] = useState<string>()

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
                <IonLabel position="floating">Height</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={height} onIonChange={e => setHeight(Number(e.target.value))}  />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Length</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={len} onIonChange={e => setLen(Number(e.target.value))}  />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Diameter</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={diameter} onIonChange={e => setDiameter(Number(e.target.value))}  />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Mortality</IonLabel>
                <IonSelect onIonChange={e => setMortality(e.target.value)}>
                    <IonSelectOption value="dead">dead</IonSelectOption>
                    <IonSelectOption value="ms dead">ms dead</IonSelectOption>
                </IonSelect>
            </IonItem>
            <IonItem onClick={() => setBrowse(!browse)} style={{cursor: 'pointer'}}>
                <IonLabel>Plant has been browsed</IonLabel>
                <IonToggle mode="ios" color="warning" slot="end" checked={browse} onIonChange={e => setBrowse(e.target.checked)} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Cause</IonLabel>
                <IonInput type="text" value={cause} onIonChange={e => setCause(String(e.target.value))} />
            </IonItem>
            <IonItem onClick={() => setLost(!lost)}>
                <IonLabel>This plant is lost</IonLabel>
                <IonToggle mode="ios" color="danger" slot="end" checked={lost} onIonChange={e => setLost(e.target.checked)} />
                <IonNote slot="helper">This toggle indicates, that the entire plant is not there anymore, and recording is not possible. A browsing damage can be indicated above.</IonNote>
            </IonItem>
        </IonList>
        <IonTextarea placeholder="Place custom notes" value={notes} onIonChange={e => setNotes(String(e.target.value))} rows={8} />
        <IonButton 
            expand="block"
            color="success"
            disabled={(!height || !len || !diameter) && !lost}
            onClick={saveHandler}
        >SAVE</IonButton>
    </>)
}

export default DataInputG1