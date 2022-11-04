import { IonContent, IonHeader, IonItem, IonLabel, IonPage, IonSpinner, IonTitle, IonToolbar } from "@ionic/react"
import cloneDeep from "lodash.clonedeep";
import { useEffect, useState } from "react";
import MainMenu from "../components/MainMenu"
import { useFeldbuch } from "../supabase/feldbuch"
import { Dataset, Plot } from "../supabase/feldbuch.model";

interface ExportData extends Plot {
    [year: string]: Dataset
}
const DataExport: React.FC = () => {
    // load all plot data, datasets and updates
    const { plots, datasets, updates } = useFeldbuch();

    // state for export structure
    const [loading, setLoadering] = useState<boolean>(true);
    const [expData, setExpData] = useState<any[]>([]);
    
    // merge into a new export structure
    useEffect(() => {
        // clone existing plots
        const  expPlots = cloneDeep(plots) as ExportData[];
        datasets.forEach(dataset => {
            const i = expPlots.findIndex(p => p.id === dataset.plot_id)
            if (i >= 0) {
                // get the year of the new data
                const year = String(dataset.measurement_time ? dataset.measurement_time.getFullYear() : new Date().getFullYear())
                
                // add a year object
                if (!Object.keys(expPlots[i]).includes(year)) {
                    expPlots[i][year] = {}
                }
                expPlots[i][year]
            }
        })
    }, [])

    return (
        <>
            <MainMenu contentId="export-content" />
            <IonPage id="export-content">
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Datenexport</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>

                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">EMPTY</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    { loading ? (
                        <IonItem><IonLabel>Loading</IonLabel> <IonSpinner name="dots" slot="start" /></IonItem>
                    ) : null }
                </IonContent>
            </IonPage>
        </>
    )
}

export default DataExport