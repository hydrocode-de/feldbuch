import { IonAccordion, IonAccordionGroup, IonBadge, IonCheckbox, IonContent, IonIcon, IonInput, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonText } from "@ionic/react"
import { addCircleOutline, pencilOutline } from 'ionicons/icons'
import { useRef } from "react"

import { BaseData } from "../supabase/feldbuch.model"
import { useFeldbuch } from "../supabase/feldbuch"
import { useAuth } from "../supabase/auth"

interface UpdateListItemProps {
    baseData: BaseData
    deleted?: boolean
    selected?: boolean
    onDelete?: () => void
    onSelect?: () => void
}

const UpdateListItem: React.FC<UpdateListItemProps> = ({ baseData, deleted, selected, onDelete, onSelect }) => {
    // load dataGroups
    const { dataGroups } = useFeldbuch()
    const ref = useRef<HTMLIonItemSlidingElement>(null)
    
    // load extra information about e-mail adresses
    const {userInfos} = useAuth()

    return (
        <IonItemSliding ref={ref}>

            <IonItem disabled={deleted || selected} color={selected ? 'success' : 'light'}>
                <IonIcon size="large" slot="start" icon={baseData.dataset ? pencilOutline : addCircleOutline} color={baseData.dataset ? 'warning' : 'success'} />
                <IonLabel className="ion-text-wrap">
                    <p style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <span>{baseData.plot!.site}&nbsp;&nbsp;{baseData.plot!.treatment}</span>
                        <IonBadge color="dark">{ (userInfos.find(u => u.user_id === baseData.update.user_id) || {email: 'NaN'}).email }</IonBadge>
                    </p>
                    <h2 style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
                        <span>Number: {baseData.plot!.number}&nbsp;&nbsp;-&nbsp;&nbsp;Individual: {baseData.plot!.individual}</span>
                        <span>{ baseData.update.measurement_time ? new Date(baseData.update.measurement_time).toLocaleString() : 'NaN' }</span>
                    </h2>
                    
                    
                    <IonAccordionGroup>
                        <IonAccordion>
                            <IonItem slot="header" color={selected ? 'success' : 'default'}>
                                <IonLabel>{ (dataGroups.find(g => g.id === baseData.update.group_id) || {long_name: 'Unkown'}).long_name }</IonLabel>
                            </IonItem>
                            <IonList slot="content">
                                { Object.entries(baseData.update.data).map(([key, value], idx) => {
                                    let content: React.ReactNode = null
                                    
                                    // check if the dataset existed before
                                    if (baseData.dataset && baseData.dataset.data[key]) {
                                        if (baseData.dataset.data[key] !== value) {
                                        content = (<>
                                            <IonIcon icon={pencilOutline} color="warning" slot="end"></IonIcon>
                                            <IonLabel slot="start"><strong>{key}</strong></IonLabel>
                                            <IonLabel>
                                                <IonText color="danger" style={{textStyle: 'uncer'}}>{`${baseData.dataset.data[key]}`}</IonText>
                                                &nbsp;&nbsp;--&gt;&nbsp;&nbsp;
                                                <IonText color="success">{`${value}`}</IonText>
                                            </IonLabel>
                                        </>)
                                    }
                                    } else {
                                        content = (<>
                                            <IonIcon slot="end" icon={addCircleOutline} color="success" />
                                            <IonLabel slot="start"><strong>{`${key}:`}</strong></IonLabel>
                                            <IonLabel>{`${value}`}</IonLabel>
                                        </>)
                                    }
                                    return (
                                        <IonItem key={idx}>{content}</IonItem>
                                    )
                                }) }
                            </IonList>
                        </IonAccordion>
                    </IonAccordionGroup>
                </IonLabel>
            </IonItem>

            <IonItemOptions>
                <IonItemOption color="light" onClick={() => {onSelect!();ref.current?.close()}}>SELECT</IonItemOption>
                <IonItemOption color="danger" onClick={() => {onDelete!();ref.current?.close()}}>DELETE</IonItemOption>
            </IonItemOptions>

        </IonItemSliding>
    )
}

export default UpdateListItem