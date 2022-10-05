import { getPlatforms, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonList, IonMenuButton, IonPage, IonRow, IonTitle, IonToolbar } from "@ionic/react";
import FilterChipList from "../components/FilterChipList";
import FilterButton from "../components/FilterButton";
import LoginButton from "../components/LoginButton";
import MainMenu from "../components/MainMenu";
import PlotListItem from "../components/PlotListItem";
import SyncButton from "../components/SyncButton";
import { useDatasetFilter } from "../features/filter";
import { useAuth } from "../supabase/auth";
import { useFeldbuch } from "../supabase/feldbuch"

const PlotList: React.FC = () => {
    // use the filter context for a filtered list
    const { filteredPlots: plots } = useDatasetFilter();
    
    // handle authentication
    const { user } = useAuth();

    // check the general sync state
    const { synced } = useFeldbuch();

    // get the platform
    const platforms = getPlatforms()
    
    return (
        <>
            <MainMenu />
            <IonPage id="main-content">
                <IonHeader>
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Base data</IonTitle>
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
                                <IonItem lines="none">
                                    <FilterButton slot="start" fill="clear" />
                                    <FilterChipList />
                                    </IonItem>
                                { plots.map((plot, idx) => <PlotListItem key={idx} plot={plot} />) }
                            </IonList>
                        ) : (
                            <IonGrid style={{height: '100%'}}>
                                <IonCol size="12">
                                    <IonRow className="ion-justify-content-center">
                                    <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <IonLabel color="warning" className="ion-text-wrap">
                                        {synced !== 'unknown' ? 'No data applies to this filter.' : 'No local data found.'}
                                        &nbsp;
                                        { synced !=='head' && user ? 'Try synchronizing with the database.' : 'To synchronize you need to be logged in.'}
                                    </IonLabel>
                                    { synced !== 'head' && user ? (
                                        <SyncButton expand="block" fill="outline" />
                                    ) : (
                                        <IonButton color="primary" fill="outline" routerLink="/login" routerDirection="forward">LOGIN</IonButton>
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