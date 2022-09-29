import { IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonTitle, IonToolbar } from "@ionic/react";
import { list, podiumOutline, cog } from 'ionicons/icons';
import { useAuth } from "../supabase/auth";

interface MainMenuProps {
    contentId?: string
}

const MainMenu: React.FC<MainMenuProps> = ({ contentId }) => {
    // get the user
    const { isAdmin } = useAuth();

    return (
        <IonMenu type="overlay" contentId={contentId ? contentId : 'main-content'}>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Feldbuch</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonList>
                    <IonItem routerLink="/list" routerDirection="root">
                        <IonLabel>Base data</IonLabel>
                        <IonIcon icon={list} slot="start"/>
                    </IonItem>
                    <IonItem disabled={!isAdmin} routerLink="/updates" routerDirection="root">
                        <IonLabel>Update suggestions</IonLabel>
                        <IonIcon icon={podiumOutline} slot="start"/>
                    </IonItem>
                    <IonItem routerLink="/settings" routerDirection="root">
                        <IonLabel>Settings</IonLabel>
                        <IonIcon icon={cog} slot="start" />
                    </IonItem>
                </IonList>
            </IonContent>
        </IonMenu>
    )
}

export default MainMenu;