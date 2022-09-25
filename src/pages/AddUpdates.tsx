import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonItem, IonLabel, IonPage, IonSelect, IonSelectOption, IonTitle, IonToolbar, useIonToast } from "@ionic/react";
import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router"
import DataForm from "../components/DataForm";
import { useFeldbuch } from "../supabase/feldbuch"
import { DataGroup, Dataset, Plot } from "../supabase/feldbuch.model";

const AddUpdates: React.FC = () => {
    // component state
    const [plot, setPlot] = useState<Plot>();
    const [activeGroup, setActiveGroup] = useState<DataGroup>();

    // get the url query params
    const params = useParams<{id: string}>()

    // load the feldbuch provider
    const { plots, dataGroups, addDataset } = useFeldbuch();

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
            present({message: 'Der Datensatz wurde lokal gespeichert', duration: 2000, position: 'top', color: 'success'})
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
                        {activeGroup ? `neue ${activeGroup.long_name}` : 'Datenaufnahme'}
                    </IonTitle>
                    <IonSelect 
                        slot="end" 
                        onIonChange={e => setActiveGroup(dataGroups.find(g => g.id === e.target.value))}
                        interface="action-sheet"
                        placeholder="Bitte Aufnahmeart wählen"
                    >
                        <IonItem>
                            {dataGroups.map((group, idx) => (
                                <IonSelectOption key={idx} value={group.id}>
                                    {group.long_name} ({group.short_name})
                                </IonSelectOption>
                            ))}
                        </IonItem>
                    </IonSelect>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen>
                { plot && activeGroup ? (
                    <DataForm group={activeGroup} plot_id={plot.id} onSave={onSave} />
                ) : <IonLabel className="ion-text-center"><p>Wähle zuerst die Art der Datenaufnahme</p></IonLabel> }
                
            </IonContent>
        </IonPage>
    )
}

export default AddUpdates