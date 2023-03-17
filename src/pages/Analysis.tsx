import { IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCol, IonContent, IonGrid, IonHeader, IonItem, IonLabel, IonMenuButton, IonPage, IonRow, IonSelect, IonSelectOption, IonTitle, IonToolbar } from "@ionic/react"
import { useEffect, useState } from "react"
import MainMenu from "../components/MainMenu"
import Histogram2DPlot from "../components/plots/Histogram2DPlot"
import OverviewBarPlot from "../components/plots/OverviewBarPlot"
import { useFeldbuch } from "../supabase/feldbuch"

const Analysis: React.FC = () => {
    // set state for active card
    const [activeCard, setActiveCard] = useState<string>('')
    
    // plot options
    const [features, setFeatures] = useState<string[]>([])
    const [histFeatures, setHistFeatures] = useState<{x: string, y: string}>({x: 'height', y: 'length'})

    const maxStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 999,
        width: '100vw',
        height: '100vh'
    }
    const maximizeHandler = (name: string) => {
        setActiveCard(name)
        const int = setInterval(() => {
            window.dispatchEvent(new Event('resize'))
        }, 10)
        setTimeout(() => clearInterval(int), 800)
    }

    // get all available features
    const { datasets } = useFeldbuch()
    useEffect(() => {
        const feats = datasets.flatMap(d => Object.keys(d.data)).filter((val, idx, arr) => arr.indexOf(val) === idx)
        setFeatures(feats)
    }, [datasets])

    return <>
        <MainMenu />
        <IonPage id="main-content">
            <IonHeader collapse="fade">
                <IonToolbar>
                    <IonButtons slot="start">
                        <IonMenuButton />
                    </IonButtons>
                    <IonTitle>Data analysis</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent fullscreen>

                <IonGrid>
                    <IonRow>

                        <IonCol size="12" sizeMd="4">
                            <IonCard style={activeCard === 'overview' ? maxStyle : {}}>
                                <OverviewBarPlot height={activeCard === 'overview' ? window.innerHeight * 0.45 : 350} />
                                <IonCardHeader>
                                    <IonCardTitle>
                                        Total measurements
                                    </IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    The bar plot above visualizes total measurments taken per measurement type for all combinations of field site and treatment.
                                </IonCardContent>
                                {activeCard !== 'overview' ? (
                                    <IonButton fill="clear" onClick={() => maximizeHandler('overview')}>maximize</IonButton>) 
                                : null}
                                {activeCard === 'overview' ? (
                                    <IonButton fill="clear" onClick={() => maximizeHandler('')}>close</IonButton>
                                ) : null}
                            </IonCard>
                        </IonCol>

                        <IonCol size="12" sizeMd="4">
                            <IonCard style={activeCard === 'hist2d' ? maxStyle : {}}>
                                <Histogram2DPlot xFeature={histFeatures.x} yFeature={histFeatures.y} height={activeCard === 'hist2d' ? window.innerHeight * 0.45 : 350} />
                                <IonCardHeader>
                                    <IonCardTitle>2D Histogram</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent>
                                    2D Histogram with marginal distributions for two arbitrary features of the datasets.
                                    
                                    { activeCard === 'hist2d' ? (
                                        <IonGrid>
                                            <IonRow>
                                                <IonCol size="6">
                                                    <IonItem lines="none">
                                                        <IonLabel position="floating">X-Axis feature</IonLabel>
                                                        <IonSelect value={histFeatures.x} onIonChange={e => setHistFeatures({x: e.target.value as string, y: histFeatures.y})}>
                                                            { features.map(f => <IonSelectOption key={f} value={f}>{f}</IonSelectOption>) }
                                                        </IonSelect>
                                                    </IonItem>
                                                </IonCol>
                                                <IonCol size="6">
                                                    <IonItem lines="none">
                                                        <IonLabel position="floating">Y-Axis feature</IonLabel>
                                                        <IonSelect value={histFeatures.y} onIonChange={e => setHistFeatures({y: e.target.value as string, x: histFeatures.x})}>
                                                            { features.map(f => <IonSelectOption key={f} value={f}>{f}</IonSelectOption>) }
                                                        </IonSelect>
                                                    </IonItem>
                                                </IonCol>
                                            </IonRow>
                                        </IonGrid>
                                    ) : null }
                                
                                </IonCardContent>
                                { activeCard !== 'hist2d' ? (
                                    <IonButton fill="clear" onClick={() => maximizeHandler('hist2d')}>maximize</IonButton>
                                ) : null }
                                { activeCard === 'hist2d' ? (
                                    <IonButton fill="clear" onClick={() => maximizeHandler('')}>close</IonButton>
                                ) : null }
                            </IonCard>
                        </IonCol>

                    </IonRow>
                </IonGrid>

            </IonContent>
        </IonPage>
    </>
}

export default Analysis