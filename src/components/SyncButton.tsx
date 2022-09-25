import { IonButton, IonIcon, IonSpinner, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react";
import { cloudDownloadOutline, cloudUploadOutline, refreshOutline, alertOutline } from 'ionicons/icons';

import { useFeldbuch } from "../supabase/feldbuch";

// get the IonButton props without the onClick handler
type IonButtonProps = Exclude<React.ComponentProps<typeof IonButton>, 'onClick'>

const SyncButton: React.FC<IonButtonProps> = props => {
    // use the feldbuch context
    const { checkSyncState, synced, dirty, sync, upload } = useFeldbuch()
    
    // some component state
    const [busy, setBusy] = useState<boolean>(false);

    // get a toast provider
    const [ present ] = useIonToast()
    
    // on component mount, check the sync state
    useEffect(() => {
        setBusy(true)
        checkSyncState().then(() => setBusy(false))
    }, [])


    // data handler
    const onUpload = () => {
        // setBusy(true)
        upload!().then(() => {
            // send a message
            present({
                message: 'Deine Änderungen wurden an die Datenbank geschickt. Vielen Dank!',
                duration: 1500,
                position: 'top',
                color: 'success'
            })
        }).catch(error => {
            present({
                message: error,
                duration: 2000,
                position: 'top',
                color: 'danger'
            })
        })
    }

    const onSync = () => {
        sync!().then(() => {
            present({
                message: 'Du bist auf dem neusten Stand',
                duration: 1000,
                position: 'top',
                color: 'success'
            })
        }).catch(error => {
            present({
                message: error,
                duration: 1500,
                position: 'top',
                color: 'danger'
            })
        })
    }

    const onRefresh = () => {
        setBusy(true)
        checkSyncState().then(() => setBusy(false))
    }


    // if the component is busy, show a spinner
    if (busy) {
        return <IonSpinner name="dots" slot="end" />
    }

    // upload needed?
    if (dirty) {
        return (
            <IonButton onClick={onUpload} {...props}>
                <IonIcon slot="icon-only" icon={cloudUploadOutline} />
            </IonButton>
        )
    }
    // downstream
    else if (synced === 'behind') {
        return (
            <IonButton onClick={onSync} {...props}>
                <IonIcon slot="icon-only" icon={cloudDownloadOutline} />
            </IonButton>
        )
    }
    else if ( synced === 'unknown') {
        return (
            <IonButton onClick={onRefresh} {...props} color="danger">
                <IonIcon slot="icon-only" icon={alertOutline} />
            </IonButton>
        )
    }
    // synced and not dirty
    else {
        return (
            <IonButton onClick={onRefresh} {...props}>
                <IonIcon slot="icon-only" icon={refreshOutline} />
            </IonButton>
        )
    }
    
    
    return (
        null
    )
}

export default SyncButton