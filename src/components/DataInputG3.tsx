import { IonButton, IonInput, IonItem, IonLabel, IonList, IonTextarea, IonToggle } from '@ionic/react'
import { useState } from 'react'
import { DataInputProps } from './DataInput.model'

const DataInputG3: React.FC<DataInputProps> = ({ onSave, values }) => {
    // component state
    const [dark_adapted, setDarkAdapted] = useState<boolean>(values?.dark_adapted ? Boolean(values.dark_adapted) : false)
    const [pam_no, setPamNo] = useState<number | undefined>(values?.pam_no ? Number(values.pam_no) : undefined)
    const [f, setF] = useState<number | undefined>(values?.f ? Number(values.f) : undefined)
    const [y, setY] = useState<number | undefined>(values?.y ? Number(values.y) : undefined)
    const [m, setM] = useState<number | undefined>(values?.m ? Number(values.m) : undefined)
    const [c, setC] = useState<number | undefined>(values?.c ? Number(values.c) : undefined)
    const [l, setL] = useState<number | undefined>(values?.l ? Number(values.l) : undefined)
    const [notes, setNotes] = useState<string | undefined>(values?.notes ? String(values.notes) : undefined)

    // save handler
    const saveHandler = () => {
        const data = {
            ...(dark_adapted && { dark_adapted }), 
            ...(pam_no && { pam_no }), 
            ...(f && { f }), 
            ...(y && {  y }), 
            ...(m && { m }), 
            ...(c && { c }), 
            ...(l && { l }), 
            ...(notes && { notes })}
        onSave(data)
    }

    return (<>
        <IonList>
        <IonItem>
            <IonLabel position="fixed">Dark adapted</IonLabel>
                <IonToggle checked={Boolean(dark_adapted)} onIonChange={e => setDarkAdapted(Boolean(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">PAMno</IonLabel>
                <IonInput type="number" min="0" step="1" value={Number(pam_no)} onIonChange={e => setPamNo(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">F</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={f} onIonChange={e => setF(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">Y</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={y} onIonChange={e => setY(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">M</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={m} onIonChange={e => setM(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">C</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={c} onIonChange={e => setC(Number(e.target.value))} />
            </IonItem>
            <IonItem>
                <IonLabel position="floating">L</IonLabel>
                <IonInput type="number" min="0" step="0.1" value={l} onIonChange={e => setL(Number(e.target.value))} />
            </IonItem>
        </IonList>
        <IonTextarea placeholder="Place custom notes" value={notes} onIonChange={e => setNotes(String(e.target.value))} rows={8} />
        <IonButton 
            expand="block"
            color="success"
            disabled={!pam_no || !f || !y || !m || !c || !l }
            onClick={saveHandler}
        >SAVE</IonButton>
    </>)
}

export default DataInputG3