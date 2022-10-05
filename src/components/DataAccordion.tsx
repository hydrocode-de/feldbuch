import { IonAccordion, IonInput, IonItem, IonLabel, IonList } from "@ionic/react"
import { useFeldbuch } from "../supabase/feldbuch"
import { Dataset } from "../supabase/feldbuch.model"

interface DataAccordionProps {
    index: string
    dataset: Dataset,
    update?: boolean
}

const DataAccordion: React.FC<DataAccordionProps> = ({ dataset, index }) => {
    // load the datagroups
    const { dataGroups } = useFeldbuch()

    const refDate = new Date(dataset.measurement_time ? dataset.measurement_time : '1970-01-01')
    return (
        <IonAccordion value={index}>
            <IonItem slot="header" color="light">
                <IonLabel><strong>{ refDate.getFullYear() }</strong>&nbsp;&nbsp;-&nbsp;&nbsp;{`${dataGroups.find(g => g.id===dataset.group_id)?.long_name}`}</IonLabel>
            </IonItem>
            <div className="ion-no-padding" slot="content">
                <IonList>
                    { Object.entries(dataset.data).map(([key, value]) => (
                        <IonItem key={key}>
                            <IonLabel slot="start">{key.toUpperCase()}</IonLabel>
                            <IonLabel slot="end">{String(value)}</IonLabel>
                        </IonItem>
                    )) }
                </IonList>
            </div>
        </IonAccordion>
    )
}

export default DataAccordion