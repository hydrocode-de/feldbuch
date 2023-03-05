import { IonBadge, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonMenuButton, IonModal, IonPage, IonSegment, IonSegmentButton, IonSelect, IonSelectOption, IonSpinner, IonTextarea, IonTitle, IonToggle, IonToolbar } from "@ionic/react"
import { filter, download } from 'ionicons/icons';

import ReactJson from 'react-json-view';
import { unparse } from 'papaparse';
import DataTable from 'react-data-table-component';

import cloneDeep from "lodash.clonedeep";
import { useEffect, useRef, useState } from "react";
import MainMenu from "../components/MainMenu"
import { useFeldbuch } from "../supabase/feldbuch"
import { Dataset, Plot } from "../supabase/feldbuch.model";

interface Record extends Plot {
    datasets: Dataset[]
}

interface CSVRecord extends Plot {
    [key: string]: any
}

const DataExport: React.FC = () => {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const modalRef = useRef<HTMLIonModalElement>(null)
    // component state
    const [records, setRecords] = useState<Record[]>([])
    const [csvRecords, setCSVRecords] = useState<CSVRecord[]>([])
    const [csvHeader, setCSVHeader] = useState<string[]>([])

    // setup filters
    const [availableYears, setAvailableYears] = useState<number[]>([])
    const [years, setYears] = useState<number[]>([])
    const [withData, setWithData] = useState<boolean>(true)

    // setup state for viewing
    const [viewMode, setViewMode] = useState<'json' | 'csv'>('json')

    // get all data
    const { datasets, plots } = useFeldbuch()

    // get all available years
    useEffect(() => {
        // update
        const yrs = datasets.map(d => new Date(d.created_at!).getFullYear()).filter((y, i, arr) => arr.indexOf(y) === i)
        setAvailableYears([...yrs])
        setYears([...yrs])
    }, [datasets])

    // apply the filter
    useEffect(() => {
        // wait unitl everything is loaded
        if (datasets.length === 0 || plots.length === 0 || availableYears.length === 0) return
        const recs: Record[] = []
        plots.forEach(plot => {
            const record = cloneDeep(plot) as Record
            record.datasets = datasets.filter(d => d.plot_id === plot.id)
                // add year and filter by year
                .map(d => {return {...d, year: new Date(d.created_at as string).getFullYear()}})
                .filter(d => years.includes(d.year))
            
            if (!withData || (withData && record.datasets.length > 0)) {
                recs.push(cloneDeep(record))
            }
        })
        setRecords(recs)

        // console.log(recs)
    }, [datasets, plots, years, withData])

    // destruct records to CSV
    useEffect(() => {
        const recs: CSVRecord[] = []
        const header: string[] = []
        records.forEach(r => {
            // de-construct the records
            const {datasets, ...plot} = r
            
            // extract data
            const data = Object.fromEntries(datasets.flatMap(d => Object.entries(d.data).map(([key, value]) => [`${key}_${(d as any).year}`, value])))
            
            // push the record
            const rec = {
                ...plot,
                ...data
            }
            recs.push(rec)

            // add to header
            Object.keys(rec).forEach(key => {
                if (!header.includes(key)){
                    header.push(key)
                }
            })
        })
        
        // update the state
        setCSVRecords(recs)
        setCSVHeader(header)
//        console.log(recs)
    }, [records])

    const onDownload = () => {}

    return (
        <>
            <MainMenu />
            <IonPage id="main-content">
                <IonHeader collapse="fade">
                    <IonToolbar>
                        <IonButtons slot="start">
                            <IonMenuButton />
                        </IonButtons>
                        <IonTitle>Data export</IonTitle>
                        <IonButtons slot="end">
                            <IonButton 
                                download={viewMode === 'csv' ? 'data.csv' : 'data.json'} 
                                href={
                                    URL.createObjectURL(new Blob([
                                            viewMode === 'csv' ? unparse(csvRecords) : JSON.stringify(records, null, 4)
                                        ], {type: viewMode === 'csv' ? 'text/csv' : 'application/json'})
                                    )
                                } 
                            >
                                <IonIcon slot="icon-only" icon={download} />
                            </IonButton>
                            <IonButton id="open-filter">
                                <IonIcon slot="icon-only" icon={filter} />
                            </IonButton>
                        </IonButtons>
                    </IonToolbar>
                </IonHeader>
                <IonContent fullscreen>
                    
                    <IonModal ref={modalRef} trigger="open-filter">
                        <IonHeader>
                            <IonToolbar>
                                <IonTitle>Filter export Data</IonTitle>
                                <IonButtons slot="end">
                                    <IonButton onClick={() => modalRef.current ? modalRef.current.dismiss() : null}>CLOSE</IonButton>
                                </IonButtons>
                            </IonToolbar>
                        </IonHeader>
                        <IonContent>
                            <IonList>
                                <IonItem>
                                    <IonLabel>Include only Plots with data</IonLabel>
                                    <IonToggle slot="end" checked={withData} onIonChange={e => setWithData(e.target.checked)} />
                                </IonItem>
                                <IonItem>
                                    <IonLabel>Filter by Year</IonLabel>
                                    <IonSelect multiple value={years} onIonChange={e => setYears(e.target.value)}>
                                       { availableYears.map(y => <IonSelectOption key={y} value={y}>{y}</IonSelectOption>) }
                                    </IonSelect>
                                </IonItem>
                            </IonList>
                        </IonContent>
                    </IonModal>

                    <IonHeader collapse="condense">
                        <IonToolbar>
                            <IonTitle size="large">EMPTY</IonTitle>
                        </IonToolbar>
                    </IonHeader>

                    <IonSegment value={viewMode} onIonChange={e => setViewMode(e.target.value as 'json' | 'csv')}>
                        <IonSegmentButton value="json">JSON</IonSegmentButton>
                        <IonSegmentButton value="csv">CSV</IonSegmentButton>
                    </IonSegment>

                    { records.length > 0 && viewMode === 'json' ? (
                        <ReactJson style={{padding: '1rem'}}  src={records} theme="hopscotch" />
                    ) : null}

                    { records.length > 0 && viewMode === 'csv' ? (
                        <DataTable
                            columns={csvHeader.map(h => {return {name: h, selector: (row: any) => row[h], sortable: true}})}
                            data={csvRecords}
                            pagination
                            fixedHeader
                            theme={isDark ? 'dark' : 'light'}
                            // style={{overflowX: 'scroll'}}
                        />
                    ) : null }
                    
                </IonContent>
            </IonPage>
        </>
    )
}

export default DataExport