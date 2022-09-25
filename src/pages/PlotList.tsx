import { IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonMenuToggle, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import LoginButton from "../components/LoginButton";
import MainMenu from "../components/MainMenu";
import PlotListItem from "../components/PlotListItem";
import { useFeldbuch } from "../supabase/feldbuch"

const PlotList: React.FC = () => {
    // use the Feldbuch context
    const { plots } = useFeldbuch();

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

                        <IonList>
                            { plots.map((plot, idx) => <PlotListItem key={idx} plot={plot} />) }
                        </IonList>

                    </IonContent>
                </IonHeader>
            </IonPage>
        </>
    )
}

export default PlotList