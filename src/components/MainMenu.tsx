import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonTitle, IonToolbar } from "@ionic/react";
import { list, podiumOutline } from 'ionicons/icons';
import { useAuth } from "../supabase/auth";

interface MainMenuProps {
    contentId?: string
}

const MainMenu: React.FC<MainMenuProps> = ({ contentId }) => {
    // get the user
    const { isAdmin } = useAuth();

    return (
        <IonMenu type="push" contentId={contentId ? contentId : 'main-content'}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Feldbuch</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem routerLink="/list" routerDirection="root">
                        <IonLabel>Stammdaten</IonLabel>
                        <IonIcon icon={list} slot="start"/>
                    </IonItem>
                    <IonItem disabled={!isAdmin} routerLink="/updates" routerDirection="root">
                        <IonLabel>Änderungen</IonLabel>
                        <IonIcon icon={podiumOutline} slot="start"/>
                    </IonItem>
                </IonList>
            </IonContent>
        </IonMenu>
    )
}

export default MainMenu;