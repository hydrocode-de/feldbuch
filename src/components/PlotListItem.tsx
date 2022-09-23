import { IonItem, IonLabel } from "@ionic/react"
import { Plot } from "../supabase/feldbuch.model"

interface PlotListItemProps {
    plot: Plot
}

const PlotListItem: React.FC<PlotListItemProps> = ({ plot }) => {
    return (
        <IonItem routerLink={`/list/${plot.id}`} detail={false}>
            <IonLabel className="ion-text-wrap">
                <h2>{plot.site} - {plot.treatment} - {plot.number} - {plot.individual}</h2>
                <p>{plot.species}</p>
            </IonLabel>
        </IonItem>
    )
}

export default PlotListItem