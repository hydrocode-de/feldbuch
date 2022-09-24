import { IonBackButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { add } from 'ionicons/icons'
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import LoginButton from "../components/LoginButton";
import { useAuth } from "../supabase/auth";


import { useFeldbuch } from "../supabase/feldbuch";
import { Dataset, Plot } from "../supabase/feldbuch.model";

const ViewPlot: React.FC = () => {
    // define the component state
    const [plot, setPlot] = useState<Plot>();
    const [datasetList, setDatasetList] = useState<Dataset[]>([]);
    const [dataUpdateList, setDataUpdateList] = useState<Dataset[]>([]);

    // get url query params
    const params = useParams<{id: string}>();

    // use Feldbuch context
    const { plots, datasets } = useFeldbuch();

    // check if the user is logged in
    const { user } = useAuth();

    // load the correct plot and its data
    useEffect(() => {
        // find the relevant data
        const plot = plots.find(p => p.id == Number(params.id))
        const datasetList = datasets.filter(d => d.plot_id === plot!.id)
        
        // update the component state
        setPlot(plot)
        setDatasetList(datasetList)
    }, [plots])

    return (
        <IonPage>
            <IonHeader translucent>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/list" />
                    </IonButtons>
                    <IonTitle>{ plot?.species } individual {plot?.individual }</IonTitle>
                    <IonButtons slot="end">
                        <LoginButton fill="clear" />
                    </IonButtons>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                <pre><code>{JSON.stringify(plot, null, 4)}</code></pre>

                <IonList>
                    <IonListHeader>
                        <IonTitle>Existierende Daten</IonTitle>
                    </IonListHeader>
                    {datasetList.map((data, idx) => <IonItem key={idx}><IonLabel>DATASET TYPE: { data.group }</IonLabel></IonItem>)}
                </IonList>

                <IonList>
                    <IonListHeader>
                        <IonTitle>Updates</IonTitle>
                    </IonListHeader>
                    {dataUpdateList.map((data, idx) => <IonItem key={idx}><IonLabel>{ data.plot_id  }</IonLabel></IonItem>)}
                </IonList>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton color="success" disabled={!user}>
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

            </IonContent>
        </IonPage>
    )
}

export default ViewPlot