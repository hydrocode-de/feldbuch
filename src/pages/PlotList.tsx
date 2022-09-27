import { IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonMenuToggle, IonPage, IonRow, IonText, IonTitle, IonToolbar } from "@ionic/react";
import LoginButton from "../components/LoginButton";
import MainMenu from "../components/MainMenu";
import PlotListItem from "../components/PlotListItem";
import SyncButton from "../components/SyncButton";
import { useAuth } from "../supabase/auth";
import { useFeldbuch } from "../supabase/feldbuch"

const PlotList: React.FC = () => {
    // use the Feldbuch context
    const { plots } = useFeldbuch();
    const { user } = useAuth();

    return (
        <>
            <MainMenu />
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Stammdaten</IonTitle>
                        <IonButtons slot="end">
                            <LoginButton slot="end" fill="clear" />
                        </IonButtons>
                    </IonToolbar>
                    <IonContent fullscreen>

                        <IonHeader collapse="condense">
                            <IonToolbar>
                                <IonTitle size="large">
                                    EMPTY TITLE
                                </IonTitle>
                            </IonToolbar>
                        </IonHeader>

                        { plots.length > 0 ? (
                            <IonList>
                                { plots.map((plot, idx) => <PlotListItem key={idx} plot={plot} />) }
                            </IonList>
                        ) : (
                            <IonGrid style={{height: '100%'}}>
                                <IonCol size="12">
                                    <IonRow className="ion-justify-content-center">
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <IonLabel color="warning" className="ion-text-wrap">
                                        Keine lokalen Daten gefunden.
                                        { user ? 'Versuche dich mit der Datenbank zu synchonisieren' : 'Zum Synchronisieren musst du dich einloggen.'}
                                    </IonLabel>
                                    { user ? (
                                        <SyncButton expand="block" fill="outline" />
                                    ) : (
                                        <IonButton color="primary" fill="outline" routerLink="/login" routerDirection="forward">zum Login</IonButton>
                                    )}
                                    </div>
                                    </IonRow>
                                </IonCol>
                            </IonGrid>
                            
                        ) }
                        

                    </IonContent>
                </IonHeader>
            </IonPage>
        </>
    )
}

export default PlotList