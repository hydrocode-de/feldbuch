import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from "@ionic/react"
import MainMenu from "../components/MainMenu"

const UpdatesList: React.FC = () => {
    
    
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

            </IonContent>
        </IonPage>
        </>
    )
}

export default UpdatesList