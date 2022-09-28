import { IonAccordion, IonItem, IonLabel } from "@ionic/react"
import { Dataset } from "../supabase/feldbuch.model"

interface DataAccordionProps {
    index: string
    dataset: Dataset
}

const DataAccordion: React.FC<DataAccordionProps> = ({ dataset, index }) => {
    return (
        <IonAccordion value={index}>
            <IonItem slot="header" color="light">
                <IonLabel>{ dataset!.measurement_time ? dataset.measurement_time.toString() : 'unlabeled data' }</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
                <pre><code>{JSON.stringify(dataset, null, 4)}</code></pre>
            </div>
        </IonAccordion>
    )
}

export default DataAccordion