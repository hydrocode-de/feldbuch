import { IonButton, IonButtons, IonContent, IonHeader, IonItem, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar, useIonToast } from "@ionic/react"
import { useState } from "react"
import MainMenu from "../components/MainMenu"
import { useFeldbuch } from "../supabase/feldbuch"
import { Dataset } from "../supabase/feldbuch.model"

const UpdatesList: React.FC = () => {
    // component state
    const [updates, setUpdates] = useState<Dataset[]>([])

    // get the importer function from feldbuch context
    const { importAllUploads } = useFeldbuch()
    
    // get a toast handler
    const [ present ] = useIonToast();
    
    // load handler
    const onLoadUpdates = () => {
        importAllUploads!().then(datasets => {
            setUpdates(datasets)
            present({
                message: 'Alle Änderungen geladen',
                duration: 1000,
                color: 'sccess',
                position: 'top'
            })
        }).catch(error => {
            present({
                message: error,
                duration: 1500,
                color: 'danger',
                position: 'top'
            })
        })
    }

    return (
        <>
        <MainMenu contentId="update-content"/>
        <IonPage id="update-content">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Änderungen</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                        
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">
                            EMPTY TITLE
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                
                { updates.length > 0 ? (
                    <IonList>
                    {updates.map((u, idx) => <IonItem key={idx}>Plot: { u.plot_id} - Gruppe: {u.group_id} </IonItem>)}
                    </IonList>
                ) : (
                    <IonItem lines="none" style={{height: '100%', display: 'flex', justifyContent: 'center'}}>
                        <IonButton size="large" style={{margin: 'auto'}} color="dark" onClick={onLoadUpdates}>AUS DATENBANK LADEN LADEN</IonButton>
                    </IonItem>
                ) }

            </IonContent>
        </IonPage>
        </>
    )
}

export default UpdatesList