import { IonButton, IonInput, IonItem, IonLabel, IonList, IonSelect, IonSelectOption, IonTextarea } from '@ionic/react'
import { useState } from 'react'
import { DataInputProps } from './DataInput.model'

const DataInputG2: React.FC<DataInputProps> = ({ onSave, values }) => {
    // component state
    const [sol_no, setSolNo] = useState<number>()
    const [dsf, setDsf] = useState<number>()
    const [isf, setIsf] = useState<number>()
    const [tsf, setTsf] = useState<number>()
    const [openess, setOpeness] = useState<string>()
    const [notes, setNotes] = useState<string>()

    // save handler
    const saveHandler = () => {
        const data = {
            ...(sol_no && { sol_no }), 
            ...(dsf && { dsf }), 
            ...(isf && { isf }), 
            ...(tsf && { tsf }), 
            ...(openess && { openess }), 
            ...(notes && { notes })}
        onSave(data)
    }

    return (<>
        <IonList>
            <IonItem>
                <IonLabel position="floating">SOLno</IonLabel>
                <IonInput type="number" min="0" step="1" value={sol_no} onIonChange={e => setSolNo(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">DSF</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={dsf} onIonChange={e => setDsf(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">ISF</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={isf} onIonChange={e => setIsf(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">TSF</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={tsf} onIonChange={e => setTsf(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Openess</IonLabel>
                <IonInput type="text" value={openess} onIonChange={e => setOpeness(String(e.target.value))}></IonInput>
            </IonItem>
        </IonList>
        <IonTextarea placeholder="Place custom notes" value={notes} onIonChange={e => setNotes(String(e.target.value))} rows={8} />
        <IonButton 
            expand="block"
            color="success"
            disabled={!sol_no || !dsf || !isf || !tsf }
            onClick={saveHandler}
        >SAVE</IonButton>
    </>)
}

export default DataInputG2