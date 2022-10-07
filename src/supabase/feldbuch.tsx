import React, { createContext, useContext, useEffect, useState } from "react"
import localforage from 'localforage';
import cloneDeep from 'lodash.clonedeep';

import { Plot, Dataset, DataGroup } from "./feldbuch.model";
import { supabase } from './supabase';
import { useAuth } from "./auth";


export type SYNC_STATE = 'behind' | 'head' | 'unknown';

interface FeldbuchState {
    dirty: boolean,
    synced: SYNC_STATE,
    plots: Plot[],
    datasets: Dataset[],
    updates: Dataset[],
    dataGroups: DataGroup[],
    checkSyncState: () => Promise<boolean>,
    sync?: () => Promise<boolean>,
    upload?: () => Promise<void>,
    addDataset?: (data: Dataset) => Promise<void>
    importAllUploads?: () => Promise<Dataset[]>
    clearLocalData?: () => Promise<void>
    deleteUpdates?: (ids: number[]) => Promise<void>
}

const initialState: FeldbuchState = {
    dirty: true,
    synced: 'unknown',
    plots: [],
    datasets: [],
    updates: [],
    dataGroups: [],
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
    const [dataGroups, setDataGroups] = useState<DataGroup[]>([]);
    const [syncStore, setSyncStore] = useState<boolean>(true);

    // get the current user
    const { user } = useAuth();

    // check if we are dirty
    useEffect(() => {
        if (dataUpdates.length > 0 && !dirty) setDirty(true)
        if (dataUpdates.length === 0 && dirty) setDirty(false)
    }, [dataUpdates, dirty])

    // first off load the local data
    useEffect(() => {
        if (syncStore) {
            // get plot data
            localforage.getItem('plots', (err, value: Plot[] | null) => {
                if (!err && value) {
                    setPlots(value)
                } else {
                    setPlots([])
                }
            });

            // get groups lookup
            localforage.getItem('groups', (err, value: DataGroup[] | null) => {
                if (!err && value) {
                    setDataGroups(value)
                } else {
                    setDataGroups([])
                }
            })

            // get Datasets
            localforage.getItem('datasets', (err, value: Dataset[] | null) => {
                if (!err && value) {
                    setDatasets(value)
                } else {
                    setDatasets([])
                }
            })

            // get stored Updates
            localforage.getItem('updates', (err, value: Dataset[] | null) => {
                if (!err && value) {
                    setDataUpdates(value)
                } else {
                    setDataUpdates([])
                }
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

            const groupsQuery = supabase.from('groups').select().then(({error, data}) => {
                if (error) reject(error)

                // got groups lookup data
                return localforage.setItem('groups', data)
            })

            /* // wait for the plotQuery, then load the data
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
            }) */

            // get the accepted data
            const dataQuery = supabase.from('datasets').select().then(({error, data}) => {
                if (error) reject(error.message)
                if (data) {
                    const datasets: Dataset[] = data.map(({data, ...opts}) => {
                        return {...opts, data: JSON.parse(data)}
                    })
                    return datasets
                } else {
                    return []
                }
            }).then(datasets => localforage.setItem('datasets', datasets))
            
            // get the updates candidates
            // this one is causing problems because it is synced twice
            // const updatesQuery = supabase.from('updates').select().then(({error, data}) => {
            //     if (error) reject(error.message)
            //     if (data) {
            //         return data as Dataset[]
            //     } else {
            //         return []
            //     }
            // }).then(updates => localforage.setItem('updates', updates))

            // update the checksums after all other are finished
            return Promise.all([plotQuery, groupsQuery]).then(() => {
                Promise.all([dataQuery]).then(() => {
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
            })
        });
    }

    // upload updates to the database
    const upload = (): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!user) reject('No user logged in.')

            // send to supabase
            supabase.from('updates').insert(dataUpdates).then(({ error }) => {
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

    const addDataset = (data: Dataset): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (user) {
                // check if the plot exists
                if (plots.map(p => p.id).includes(data.plot_id)) {
                    // add this dataset to the stack
                    const newDatasets = cloneDeep(dataUpdates)
                    newDatasets.push({
                        ...data,
                        user_id: user.id,
                        measurement_time: new Date()
                    })

                    // set the data
                    localforage.setItem('updates', newDatasets).then(() => {
                        setDataUpdates(newDatasets)
                        resolve()
                    })
                } else {
                    reject(`The bse plot dataset of ID ${data.plot_id} is not in local cache.`)
                }
            } else {
                reject('User not logged in!')
            }
        })
    }

    // some helper function to work with all updates
    const importAllUploads = (): Promise<Dataset[]> => {
        return new Promise((resolve, reject) => {
            // load data
            supabase.from('updates').select().then(({error, data}) => {
                // if there was an error, reject the Promise
                if (error) reject(error.message)
                if (data) {
                    resolve(data)
                } else {
                    resolve([])
                }

            })
        })
    }

    const deleteUpdates = (ids: number[]): Promise<void> => {
        return new Promise((resolve, reject) => {
            supabase.from('updates').delete().in('id', ids).then(({ error }) => {
                if (error) reject(error.message)
                resolve()
            })
        })
    }

    // clear the local data
    const clearLocalData = (): Promise<void> => {
        return localforage.clear().then(() => {
            // sync local
            setSyncStore(true)
            return Promise.resolve()
        }).catch(error => Promise.reject(error))
    }

    // create the context function
    const value = {
        dirty: dirty,
        synced: synced,
        plots: plots,
        datasets: datasets,
        updates: dataUpdates,
        dataGroups,
        checkSyncState,
        sync,
        upload,
        addDataset,
        importAllUploads,
        deleteUpdates,
        clearLocalData
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