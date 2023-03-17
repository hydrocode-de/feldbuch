import { IonBadge, IonItem, IonLabel } from "@ionic/react"
import { Plot } from "../supabase/feldbuch.model"

interface PlotListItemProps {
    plot: Plot
}

const PlotListItem: React.FC<PlotListItemProps> = ({ plot }) => {
    return (
        <IonItem routerLink={`/list/${plot.id}`} detail>
            <IonLabel className="ion-text-wrap">
                <h1>Individual {plot.individual}</h1>
                <p>Number: {plot.number} - {plot.species}</p>
            </IonLabel>
        </IonItem>
    )
}

export default PlotListItem