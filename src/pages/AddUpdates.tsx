import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import { useFeldbuch } from "../supabase/feldbuch"
import { Plot } from "../supabase/feldbuch.model";

const AddUpdates: React.FC = () => {
    // component state
    const [plot, setPlot] = useState<Plot>();

    // get the url query params
    const params = useParams<{id: string}>()

    // load the feldbuch provider
    const { plots } = useFeldbuch();
    
    // load the plot data
    useEffect(() => setPlot(plots.find(p => p.id === Number(params.id))), [plots])
    
    return (
        <IonPage>
            <IonHeader translucent>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={plot ? `/list/${plot?.id}` : '/list'} />
                    </IonButtons>
                    <IonTitle>
                        {plot ? `individual ${plot.individual} - `: ''}
                        Datenaufnahme
                    </IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                New data can be added here
            </IonContent>
        </IonPage>
    )
}

export default AddUpdates