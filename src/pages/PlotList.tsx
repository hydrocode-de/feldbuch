import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import LoginButton from "../components/LoginButton";
import PlotListItem from "../components/PlotListItem";
import { useFeldbuch } from "../supabase/feldbuch"

const PlotList: React.FC = () => {
    // use the Feldbuch context
    const { plots } = useFeldbuch();

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Stammdaten</IonTitle>
                    <LoginButton slot="end" fill="clear" />
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
    )
}

export default PlotList