import { IonButton, IonButtons, IonContent, IonHeader, IonList, IonMenuButton, IonNote, IonPage, IonTitle, IonToolbar, useIonToast } from "@ionic/react"
import { useEffect, useState } from "react"
import MainMenu from "../components/MainMenu"
import UpdateListItem from "../components/UpdateListItem"
import { useFeldbuch } from "../supabase/feldbuch"
import { Dataset, BaseData } from "../supabase/feldbuch.model"



const UpdatesList: React.FC = () => {
    // component state
    const [updates, setUpdates] = useState<Dataset[]>([])
    const [baseData, setBaseData] = useState<BaseData[]>([])
    const [isDeleted, setIsDeleted] = useState<number[]>([])
    const [isSelected, setIsSelected] = useState<number[]>([])

    // get the importer function from feldbuch context
    const { importAllUploads, datasets, plots, deleteUpdates, acceptUploads } = useFeldbuch()
    
    // get a toast handler
    const [ present ] = useIonToast();
    
    // update base data, whenever new data arrives
    useEffect(() => {
        const newBaseData = updates.map(update => {
            return {
                update,
                plot: plots!.find(p => p.id === update.plot_id),
                dataset: datasets!.find(d => d.plot_id === update.plot_id && 
                    //d.measurement_time! === update.measurement_time!.getFullYear() &&
                    d.group_id === update.group_id
                    )
            }
        })
        setBaseData(newBaseData)
    }, [updates, plots, datasets])

    // load handler
    const onLoadUpdates = () => {
        importAllUploads!().then(datasets => {
            // set the updates
            setUpdates(datasets)
            

            // clear selected and deleted items
            setIsDeleted([])
            setIsSelected([])

            // present a message to the user
            present({
                message: 'Alle Änderungen geladen',
                duration: 1000,
                color: 'sccess',
                position: 'top'
            })
        }).catch(error => {
            present({
                message: error,
                duration: 1500,
                color: 'danger',
                position: 'top'
            })
        })
    }

    const onSelectAll = () => {
        const selected: number[] = []
        baseData.forEach((_, idx) => {
            if (!isDeleted.includes(idx)) {
                selected.push(idx)
            }
        })
        setIsSelected(selected)
    }

    const onDelete = () => {
        const deleteIds = isDeleted.map(idx => baseData[idx].update.id!)
        deleteUpdates!(deleteIds).then(() => {
            present({
                message: `Deleted update sugegstions of ID: ${deleteIds}`,
                duration: 1500,
                color: 'danger',
                position: 'top'
            })

            // refresh the List
            onLoadUpdates()
        }).catch(error => {
            present({
                message: error,
                duration: 1500,
                color: 'warning',
                position: 'top'
            })
        })
    }

    const onAcceptUploads = () => {
        acceptUploads!(updates).then(message => {
            present({
                message: message,
                duration: 2000,
                color: 'success',
                position: 'top'
            })
            onLoadUpdates()
        }).catch(error => {
            present({
                message: error,
                duration: 1500,
                color: 'danger',
                position: 'top'
            })
        })
    }

    // subscribe to changes
    useEffect(() => {
        onLoadUpdates()
    }, [])

    return (
        <>
        <MainMenu contentId="update-content"/>
        <IonPage id="update-content">
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Update suggestions</IonTitle>
                    <IonButtons slot="end">
                        <IonButton color="primary" onClick={onSelectAll}>SELECT ALL</IonButton>
                        <IonButton color="success" disabled={isSelected.length===0} onClick={onAcceptUploads}>ACCEPT SELECTED</IonButton>
                        <IonButton color="danger" fill="solid" disabled={isDeleted.length===0} onClick={onDelete}>DELETE</IonButton>
                        
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>
                        
                <IonHeader collapse="condense">
                    <IonToolbar>
                        <IonTitle size="large">
                            EMPTY TITLE
                        </IonTitle>
                    </IonToolbar>
                </IonHeader>
                
                { updates.length > 0 ? (
                    <IonList>
                    {baseData.map((b, idx) => <UpdateListItem 
                        key={idx}
                        baseData={b}
                        deleted={isDeleted.includes(idx)}
                        selected={isSelected.includes(idx)} 
                        onDelete={() => setIsDeleted([...isDeleted, idx])}
                        onSelect={() => setIsSelected([...isSelected, idx])}
                    />)}
                    </IonList>
                ) : <IonNote className="ion-text-center">No update suggestions found</IonNote> }

            </IonContent>
        </IonPage>
        </>
    )
}

export default UpdatesList