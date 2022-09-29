import { IonBackButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router"
import DataForm from "../components/DataForm";
import { useDatasetFilter } from "../features/filter";
import { useFeldbuch } from "../supabase/feldbuch"
import { Dataset, Plot } from "../supabase/feldbuch.model";

const AddUpdates: React.FC = () => {
    // component state
    const [plot, setPlot] = useState<Plot>();

    // get the url query params
    const params = useParams<{id: string}>()

    // load the feldbuch context
    const { plots, dataGroups, addDataset } = useFeldbuch();

    // load the filter context
    const { group, setGroup } = useDatasetFilter();

    // load a navigation history
    const history = useHistory();

    // use an toast
    const [present] = useIonToast()
    
    // load the plot data
    useEffect(() => setPlot(plots.find(p => p.id === Number(params.id))), [plots, params])
    

    // save Handler
    const onSave = (data: Dataset) => {
        // add the dataset
        addDataset!(data).then(() => {
            present({message: 'Your updates have been saved locally.', duration: 2000, position: 'top', color: 'success'})
            history.replace('/list')
        })
    }

    return (
        <IonPage>
            <IonHeader translucent>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref={plot ? `/list/${plot?.id}` : '/list'} />
                    </IonButtons>
                    <IonTitle>
                        {plot ? `individual ${plot.individual} - `: ''}
                        {group ? `neue ${group.long_name}` : 'Datenaufnahme'}
                    </IonTitle>
                    <IonSelect 
                        slot="end" 
                        onIonChange={e => setGroup(Number(e.target.value))}
                        interface="action-sheet"
                        placeholder="Bitte Aufnahmeart wählen"
                        value={group ? group.id : null}
                    >
                        <IonItem>
                            {dataGroups.map((g, idx) => (
                                <IonSelectOption key={idx} value={g.id}>
                                    {g.long_name} ({g.short_name})
                                </IonSelectOption>
                            ))}
                        </IonItem>
                    </IonSelect>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                { plot ? (
                    <DataForm plot_id={plot.id} onSave={onSave} />
                ) : <IonLabel className="ion-text-center"><p>Wähle zuerst die Art der Datenaufnahme</p></IonLabel> }
                
            </IonContent>
        </IonPage>
    )
}

export default AddUpdates