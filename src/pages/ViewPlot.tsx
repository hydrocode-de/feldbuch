import { IonAccordion, IonAccordionGroup, IonBackButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar } from "@ionic/react";
import { add } from 'ionicons/icons'
import { useEffect, useState } from "react";
import { useParams } from "react-router"
import DataAccordion from "../components/DataAccordion";
import LoginButton from "../components/LoginButton";
import OverviewMap from "../components/OverviewMap";
import { useDatasetFilter } from "../features/filter";
import { useAuth } from "../supabase/auth";


import { useFeldbuch } from "../supabase/feldbuch";
import { Dataset, Plot } from "../supabase/feldbuch.model";

const ViewPlot: React.FC = () => {
    // define the component state
    const [plot, setPlot] = useState<Plot>();
    const [datasetList, setDatasetList] = useState<Dataset[]>([]);
    const [dataUpdateList, setDataUpdateList] = useState<Dataset[]>([]);
    const [activeSegment, setActiveSegment] = useState<'img' | 'map' | 'details'>('img')

    // get url query params
    const params = useParams<{id: string}>();

    // use Feldbuch context
    const { datasets, updates } = useFeldbuch();
    const { filteredPlots: plots } = useDatasetFilter();

    // check if the user is logged in
    const { user } = useAuth();

    // load the correct plot and its data
    useEffect(() => {
        // find the relevant data
        const plot = plots.find(p => p.id == Number(params.id))
        const datasetList = datasets.filter(d => d.plot_id === plot!.id)
        const updatesList = updates.filter(d => d.plot_id === plot!.id)

        // update the component state
        setPlot(plot)
        setDatasetList(datasetList)
        setDataUpdateList(updatesList)
    }, [plots])

    return (
        <IonPage>
            <IonHeader collapse="fade" translucent>
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
                <IonCard>
                    { plot && plot!.lat ? <OverviewMap plot={plot} /> : null  }
                    
                <IonCardHeader>
                        <IonCardSubtitle>{plot?.site}&nbsp;&nbsp;-&nbsp;&nbsp;{plot?.treatment}</IonCardSubtitle>
                        <IonCardTitle>Number: {plot?.number}&nbsp;&nbsp;-&nbsp;&nbsp;<strong>Individual {plot?.individual}</strong></IonCardTitle>
                    </IonCardHeader>
                    {/* <IonSegment value={activeSegment} scrollable onIonChange={e => setActiveSegment(e.target.value as 'img' | 'map' | 'details')}>
                        <IonSegmentButton value="img">
                            <IonLabel>Show image</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="map">
                            <IonLabel>Show map</IonLabel>
                        </IonSegmentButton>
                        <IonSegmentButton value="details">
                            <IonLabel>Show details</IonLabel>
                        </IonSegmentButton>
                    </IonSegment>
                    { activeSegment === 'img' ? <img src="https://via.placeholder.com/1920x400" alt="Image" /> : null } */}
                    

                    <IonCardContent>
                        <IonAccordionGroup>
                        <IonAccordion value="detail">
                            <IonItem slot="header"><IonLabel>Details</IonLabel></IonItem>
                            <IonList slot="content">
                                <IonItem>
                                    <IonLabel slot="start">Place</IonLabel>
                                    <IonLabel slot="end">{plot?.place}</IonLabel>
                                </IonItem>
                                <IonItem href={`https://en.wikipedia.org/wiki/${plot?.species}`} target="_blank">
                                    <IonLabel slot="start">Species</IonLabel>
                                    <IonLabel slot="end">{plot?.species}</IonLabel>
                                </IonItem>
                                <IonItem>
                                    <IonLabel slot="start">PM replaced</IonLabel>
                                    <IonLabel slot="end">{plot?.pm_replaced}</IonLabel>
                                </IonItem>
                            </IonList>
                        </IonAccordion>
                        </IonAccordionGroup>
                    </IonCardContent>
                </IonCard>
                
                <IonCard><IonCardContent>
                <IonList>
                    <IonListHeader>
                        <IonTitle>Existing data</IonTitle>
                    </IonListHeader>
                    <IonAccordionGroup>
                        { datasetList.map((data, idx) => <DataAccordion dataset={data} index={String(idx)} key={idx} />) }
                    </IonAccordionGroup>
                </IonList>

                <IonList>
                    <IonListHeader>
                        <IonTitle>Your Updates</IonTitle>
                    </IonListHeader>
                    <IonAccordionGroup>
                        { dataUpdateList.map((data, idx) => <DataAccordion dataset={data} index={String(idx)} key={idx} />) }
                    </IonAccordionGroup>
                </IonList>
                </IonCardContent></IonCard>

                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton color="success" disabled={!user} routerLink={`/list/${plot?.id}/add`} routerDirection="forward">
                        <IonIcon icon={add} />
                    </IonFabButton>
                </IonFab>

            </IonContent>
        </IonPage>
    )
}

export default ViewPlot