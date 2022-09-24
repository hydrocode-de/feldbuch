import React, { createContext, useContext, useEffect, useState } from "react"
import localforage from 'localforage';
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
    datasets: Dataset[],
    checkSyncState: () => Promise<boolean>,
    sync?: () => Promise<boolean>,
    upload?: (data: Dataset[]) => Promise<void>,
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

    // get the current user
    const { user } = useAuth();

    // check if we are dirty
    useEffect(() => {
        if (dataUpdates.length > 0 && !dirty) setDirty(true)
        if (dataUpdates.length === 0 && dirty) setDirty(false)
    }, [dataUpdates])

    // first off load the local data
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

    // sync
    const sync = (): Promise<boolean> => {
        return new Promise((resolve, reject) => {
            const plotQuery = supabase.from('feldbuch').select().then(({error, data}) => {
                if (error) reject(error)

                // got feldbuch data
                return localforage.setItem('plots', data)
            })

            // wait for the plotQuery, then load the data
            const dataQueries: PromiseLike<Dataset[]>[] = [];
            ['g1', 'g2', 'g3', 'g4'].forEach(name => {
                dataQueries.push(supabase.from(name).select().then(({error, data}) => {
                    if (error) reject(error)
                    if (data) {
                        const dataList: Dataset[] = data.map(d => {
                            return {group: name, ...d}
                        })
                        return dataList
                    } else {
                        return []
                    }
                }))
            })
            
            // data saver query
            const dataSave = Promise.all([plotQuery]).then(() => {
                Promise.all(dataQueries).then((datasets) => {
                    return localforage.setItem('datasets', datasets.flat())
                })
            })

            // do the checksum
            return Promise.all([dataSave]).then(() => {
                supabase.from('checksum').select('checksum').limit(1).then(({error, data}) => {
                    if (error) reject('Checksum error')
                    if (data) {
                        localforage.setItem('checksum', data[0].checksum).then(() => {
                            setSyncStore(true)
                            checkSyncState().then(isSynced => resolve(isSynced))
                        })
                    }
                });
            })
        });
    }

    // upload updates to the database
    const upload = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!user) reject('No user logged in.')

            // convert the data - add user id
            const updates = dataUpdates.map(d => {
                const {group, plot_id, ...data} = d
                return {user_id: user?.id, group: group, plot_id: plot_id, updates: data}
            })

            // send to supabase
            supabase.from('updates').insert(updates).then(({ error }) => {
                // if there was an error, reject the promise
                if (error) {
                    reject(error.message)
                } else {
                    // empty the cache
                    setDataUpdates([])
                    
                    // resolve void
                    resolve()
                }
            })

        })
    }

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
                        const isSynced = value === data[0].checksum
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
            localforage.setItem('updates', newDatasets).then(() => setDataUpdates(newDatasets))
        }
    }

    // create the context function
    const value = {
        dirty: dirty,
        synced: synced,
        plots: plots,
        datasets: datasets,
        checkSyncState: checkSyncState,
        sync: sync,
        upload: upload,
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