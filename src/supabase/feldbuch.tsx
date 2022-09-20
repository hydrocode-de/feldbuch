import React, { createContext, useContext, useEffect, useState } from "react"
import { getItem, setItem } from 'localforage';
import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';

import { Plot } from "./feldbuch.model";
import { supabase } from './supabase';
import { useAuth } from "./auth";

interface Checksum {
    [table: string]: string | null
}

export interface Dataset {
    plot_id: number,
    type: 'g1' | 'g2' | 'g3' | 'g4',
    [key: string]: Date | number | string;
}

interface FeldbuchState {
    dirty: boolean,
    synced: boolean,
    plots: Plot[],
    datasets: any[]
    sync?: () => void,
    addDataset?: (data: Dataset) => void
}

const initialState: FeldbuchState = {
    dirty: true,
    synced: false,
    plots: [],
    datasets: []
}

// create the context
const FeldbuchContext = createContext(initialState);

Remote checksum weg machen und durch funktion ersetzen (global) die, die checksums lädt. Dann im kontext mit den local vergleichen 
und entsprechend den synced state setzen


export const FeldbuchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // create the internal state
    const [dirty, setDirty] = useState<boolean>(false);
    const [synced, setSynced] = useState<boolean>(false);
    const [remoteChecksums, setRemoteChecksums] = useState<Checksum>({});
    const [localChecksums, setLocalChecksums] = useState<Checksum>({feldbuch: '424242'});
    const [plots, setPlots] = useState<Plot[]>([]);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [dataUpdates, setDataUpdates] = useState<Dataset[]>([]);
    const [syncStore, setSyncStore] = useState<boolean>(true);

    // monitor the login state
    const { user } = useAuth();

    // check if we are synced
    useEffect(() => {
        if (isEqual(remoteChecksums, localChecksums)) {
            setSynced(true);
        } else {
            setSynced(false);
        }
    }, [remoteChecksums, localChecksums]);

    // check if we are dirty
    useEffect(() => {
        if (dataUpdates.length > 0) setDirty(true)
    }, [dataUpdates])

    // first off load the localChecksum
    useEffect(() => {
        if (syncStore) {
            // store checksums
            getItem('checksum', (err, value: Checksum | null) => {
                if (!err && value) setLocalChecksums(value)
            });

            // get plot data
            getItem('plots', (err, value: Plot[] | null) => {
                if (!err && value) setPlots(value)
            });

            // get Datasets
            getItem('datasets', (err, value: Dataset[] | null) => {
                if (!err && value) setDatasets(value)
            })

            // get stored Updates
            getItem('updates', (err, value: Dataset[] | null) => {
                if (!err && value) setDataUpdates(value)
            })
            setSyncStore(false)
        }
    }, [syncStore])

    // load remote checksums if possible
    useEffect(() => {
        // if logged in, load the checksums
        if (user) {
            supabase.from('checksums').select().then(({ error, data }) => {
                if (!error && data) {
                    // build the checksum object
                    const ch: {[key: string]: string | null} = {}
                    data.forEach(row => {
                        if (row.table && row.checksum) {
                            ch[row.table] = row.checksum
                        }
                    });
                    // store to context
                    setRemoteChecksums(ch);
                }
            })
        } else {
            // set empty to get out of sync
            setRemoteChecksums({});
        }
    }, [user]);

    // create context functions
    const sync = () => {
        // create a sync planner
        const toSync = {
            feldbuch: localChecksums['feldbuch'] !== remoteChecksums['feldbuch'],
            g1: localChecksums['g1'] !== remoteChecksums['g1'],
            g2: localChecksums['g2'] !== remoteChecksums['g2'],
            g3: localChecksums['g3'] !== remoteChecksums['g3'],
            g4: localChecksums['g4'] !== remoteChecksums['g4'],
        }

        // go for each
        Object.entries(toSync).forEach(([key, doSync]) => {
            if (doSync) {
                supabase.from(key).select().then(({error, data}) => {
                    if (!error && data) {
                        if (key === 'feldbuch') {
                            setItem('plots', data)
                        } else {
                            // filter the existing datasets 
                            const filtData = [...datasets.map(d => d.type !== key), ...data]
                            setItem('datasets', filtData)
                        }
                    }
                }); 
            }
        });

        // check if something was refreshed
        if (Object.values(toSync).some(b => b)) {
            // update the checksums into store
            supabase.from('checksums').select().then(({error, data}) => {
                if (!error && data) {
                    const checks: Checksum = {}
                    data.forEach(([key, val]) => {
                        checks[key] = val
                    })
                    setItem('checksum', checks, (err) => {
                        if (!err) {
                            setSyncStore(false)
                        }
                    })
                }
            });
        }

        // TODO: upload the dataUpdates
        if (dataUpdates.length > 0) {
            
        }
    }

    const addDataset = (data: Dataset) => {
        // check if the plot exists
        if (plots.map(p => p.id).includes(data.plot_id)) {
            // add this dataset to the stack
            const newDatasets = cloneDeep(dataUpdates)
            newDatasets.push(data)

            // set the data
            setDataUpdates(newDatasets)
        }
    }

    // create the context function
    const value = {
        dirty: dirty,
        synced: synced,
        plots: plots,
        datasets: datasets,
        sync: sync,
        addDataset: addDataset
    }


    return <>
        <FeldbuchContext.Provider value={value}>
            { children }
        </FeldbuchContext.Provider>
    </>
}

export const useFeldbuch = () => {
    return useContext(FeldbuchContext);
}