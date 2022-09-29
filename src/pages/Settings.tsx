import { IonAccordion, IonAccordionGroup, IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import MainMenu from "../components/MainMenu"
import SyncButton from "../components/SyncButton"
import { useFeldbuch } from "../supabase/feldbuch"

const Settings: React.FC = () => {
    // load the local data 
    const { plots, datasets, updates, dataGroups, clearLocalData } = useFeldbuch()

    return (
        <>
        <MainMenu />
        <IonPage id="main-content">
            <IonHeader collapse="fade">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Settings</IonTitle>
                    <IonButtons slot="end">
                        <SyncButton fill="clear" />
                    </IonButtons>
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

            <IonAccordionGroup>
                <IonAccordion value="local">
                    <IonItem slot="header">
                        <IonLabel>Local data cache</IonLabel>
                    </IonItem>
                    <IonList slot="content">
                        <IonItem>
                            <IonLabel>Base data</IonLabel>
                            <IonBadge slot="end">{ plots.length }</IonBadge>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Datasets</IonLabel>
                            <IonBadge slot="end">{ datasets.length }</IonBadge>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Data updates</IonLabel>
                            <IonBadge slot="end">{ updates.length }</IonBadge>
                        </IonItem>
                        <IonItem>
                            <IonLabel>Data type groups</IonLabel>
                            <IonBadge slot="end">{ dataGroups.length }</IonBadge>
                        </IonItem>
                        <IonButton color="danger" expand="full" onClick={clearLocalData}>DELETE</IonButton>
                    </IonList>    
                </IonAccordion>
            </IonAccordionGroup>

            </IonContent>
        </IonPage>
        </>
    )
}

export default Settings