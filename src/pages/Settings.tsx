import { IonAccordion, IonAccordionGroup, IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonListHeader, IonMenuButton, IonNote, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import MainMenu from "../components/MainMenu"
import SyncButton from "../components/SyncButton"
import { useAuth } from "../supabase/auth"
import { useFeldbuch } from "../supabase/feldbuch"

import pack from '../../package.json'

const Settings: React.FC = () => {
    // load the local data 
    const { plots, datasets, updates, dataGroups, clearLocalData } = useFeldbuch()
    
    // load user data
    const { user } = useAuth()

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

            <IonList>
                <IonItem>
                    <IonLabel slot="start">Application version</IonLabel>
                    <IonLabel slot="end"><code>{ pack.version }</code></IonLabel>
                </IonItem>
            </IonList>

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

                <IonAccordion value="user">
                    <IonItem slot="header">
                        <IonLabel>User data</IonLabel>
                    </IonItem>
                    <IonList slot="content">
                        { !user ? (<IonNote className="ion-padding">You are not logged in</IonNote>) : (<>
                               <IonItem>
                                    <IonLabel slot="start">User ID</IonLabel>
                                    <IonLabel slot="end">{user.id}</IonLabel>
                               </IonItem>
                               <IonItem>
                                <IonLabel slot="start">E-Mail</IonLabel>
                                <IonLabel slot="end">{user.email}</IonLabel>
                               </IonItem>
                            </>)}
                    </IonList>
                </IonAccordion>
            </IonAccordionGroup>

            </IonContent>
        </IonPage>
        </>
    )
}

export default Settings