import { IonButton, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react'
import { useState } from 'react'
import { DataInputProps } from './DataInput.model'

const DataInputG4: React.FC<DataInputProps> = ({ onSave }) => {
    // component state
    const [pressure, setPressure] = useState<number>()
    const [t_collected, setTCollected] = useState<Date>()
    const [t_measured, setTMeasued] = useState<Date>()
    const [len, setLen] = useState<number>()
    const [notes, setNotes] = useState<string>()

    // save handler
    const saveHandler = () => {
        const data = {
            ...(pressure && { pressure }), 
            ...(t_collected && { t_collected }), 
            ...(t_measured && { t_measured }), 
            ...(len && { mortality: len }), 
            ...(notes && { notes })}
        onSave(data)
    }

    return (<>
        <IonList>
            <IonItem>
                <IonLabel position="floating">Pressure</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={pressure} onIonChange={e => setPressure(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Time of collection</IonLabel>
                <IonInput type="datetime-local" value={(t_collected ? t_collected : new Date()).toLocaleString()} onIonChange={e => setTCollected(e.target.value ? new Date(e.target.value) : undefined)} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">TIme of measurement</IonLabel>
                <IonInput type="datetime-local" value={(t_measured ? t_measured : new Date()).toLocaleString()} onIonChange={e => setTMeasued(e.target.value ? new Date(e.target.value) : undefined)} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Length</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={len} onIonChange={e => setLen(Number(e.target.value))} />
            </IonItem>
        </IonList>
        <IonTextarea placeholder="Place custom notes" value={notes} onIonChange={e => setNotes(String(e.target.value))} rows={8} />
        <IonButton 
            expand="block"
            color="success"
            disabled={!pressure || !t_collected || !t_measured }
            onClick={saveHandler}
        >SAVE</IonButton>
    </>)
}

export default DataInputG4