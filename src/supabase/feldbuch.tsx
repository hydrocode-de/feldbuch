import React, { createContext, useContext, useEffect, useState } from "react"
import localforage from 'localforage';
import isEqual from 'lodash.isequal';
import cloneDeep from 'lodash.clonedeep';

import { Plot, Dataset } from "./feldbuch.model";
import { supabase } from './supabase';
import { useAuth } from "./auth";

interface Checksum {
    [table: string]: string | null
}

export type SYNC_STATE = 'behind' | 'head' | 'unknown';

interface FeldbuchState {
    dirty: boolean,
    synced: SYNC_STATE,
    plots: Plot[],
    datasets: any[],
    checkSyncState: () => Promise<boolean>,
    sync?: () => void,
    addDataset?: (data: Dataset) => void
}

const initialState: FeldbuchState = {
    dirty: true,
    synced: 'unknown',
    plots: [],
    datasets: [],
    checkSyncState: () => Promise.reject('FeldbuchProvider not initialized!')
}

// create the context
const FeldbuchContext = createContext(initialState);

export const FeldbuchProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // create the internal state
    const [dirty, setDirty] = useState<boolean>(false);
    const [synced, setSynced] = useState<SYNC_STATE>('unknown');
    const [plots, setPlots] = useState<Plot[]>([]);
    const [datasets, setDatasets] = useState<Dataset[]>([]);
    const [dataUpdates, setDataUpdates] = useState<Dataset[]>([]);
    const [syncStore, setSyncStore] = useState<boolean>(true);

    // monitor the login state
    const { user } = useAuth();

    // check if we are dirty
    useEffect(() => {
        if (dataUpdates.length > 0) setDirty(true)
    }, [dataUpdates])

    // first off load the localChecksum
    useEffect(() => {
        if (syncStore) {
            // get plot data
            localforage.getItem('plots', (err, value: Plot[] | null) => {
                if (!err && value) setPlots(value)
            });

            // get Datasets
            localforage.getItem('datasets', (err, value: Dataset[] | null) => {
                if (!err && value) setDatasets(value)
            })

            // get stored Updates
            localforage.getItem('updates', (err, value: Dataset[] | null) => {
                if (!err && value) setDataUpdates(value)
            })
            setSyncStore(false)
        }
    }, [syncStore])


    // create context functions



    // check sync state
    const checkSyncState = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            // try to reach supabase
            supabase.from('checksum').select('checksum').limit(1).then(({ error, data }) => {
                // reject the promise if there was a connection problem with supabase
                if (error) {
                    setSynced('unknown');
                    reject(error.message);
                } else {
                    // get the local stuff
                    localforage.getItem('checksum', (err, value: string | null) => {
                        if (err) {
                            setSynced('unknown')
                            reject(err)
                        }
                        const isSynced = value === data[0]
                        // compare the checksums
                        setSynced(isSynced ? 'head' : 'behind');
                        resolve(isSynced);
                        
                    });
                }
            })
        });
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
        checkSyncState: checkSyncState,
        sync: () => {},
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