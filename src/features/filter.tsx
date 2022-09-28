import { createContext, useContext, useEffect, useState } from "react"
import { useFeldbuch } from "../supabase/feldbuch"
import { DataGroup, Plot } from "../supabase/feldbuch.model"

export const SITE = ['Weilheim', 'Albbruck', 'Unteralpfen'] as const
export const TREATMENT = ['full clearence' , 'partial harvest' , 'no harvest' , 'high stumps'] as const
export const INDIVIDUAL = ['1' , '2' , '3' , '4' , '5' , '6' , '7' , '8' , '9' , '10' , '11' , '12' , '13' , '14' , '15' , '16' , '17' , '18' , '19' , '20' , 'N' , 'E' , 'S' , 'W'] as const
export const PLACE = ['free space', 'under tree', 'stump', 'high stump', 'tree'] as const 

export interface Filter {
    site?: typeof SITE[number]
    treatment?: typeof TREATMENT[number]
    number?: number
    individual?: typeof INDIVIDUAL[number]
    species?: string
    place?: typeof PLACE[number]
}

interface FilterState {
    filteredPlots: Plot[],
    filter: Filter,
    group?: DataGroup,
    addFilter: (filterOptions: Filter) => void,
    removeFilter: (filterKeys: Array<keyof Filter>) => void
    clearFilter: () => void,
    setGroup: (groupId: number) => void
}

const initialState: FilterState = {
    filteredPlots: [],
    filter: {site: 'Weilheim', treatment: 'partial harvest'},
    addFilter: (filterOptions: Filter) => console.log('Filter not initialized'),
    removeFilter: (filterKeys: Array<keyof Filter>) => console.log('Filter not initialized'),
    clearFilter: () => console.log('Filter not initialized'),
    setGroup: (groupId: number) => console.log('Filter not initialized') 
}

// create the context
const FilterContext = createContext(initialState);

export const FilterProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    // context state
    const [filteredPlots, setFilteredPlots] = useState<Plot[]>([])
    const [filter, setFilter] = useState<Filter>(initialState.filter)
    const [currentGroup, setCurrentGroup] = useState<DataGroup>();

    // load the current plot list from feldbuch
    const { plots, dataGroups } = useFeldbuch()

    // effect functions
    useEffect(() => {
        // apply the filter
        const newFilteredPlots = plots.filter(plot => {
            return (Object.keys(filter) as Array<keyof typeof filter>).every(key => plot[key] === filter[key])
        })
        setFilteredPlots(newFilteredPlots)
    }, [plots, filter])

    // create the context functions
    const addFilter = (filteredOptions: Filter) => {
        const newFilter = {...filter, ...filteredOptions}
        setFilter(newFilter)
    }

    // remove one or many filter keys
    const removeFilter = (filterKeys: Array<keyof Filter>) => {
        // copy anything that is not in filteredKeys
        const filterEntries = Object.entries(filter).filter(([key]) => !filterKeys.includes(key as keyof Filter))
        const newFilter = Object.fromEntries(filterEntries) as Filter
        setFilter(newFilter)
    }
    
    // clear Filter
    const clearFilter = () => setFilter({})

    // update the data Group
    const setGroup = (groupId: number) => setCurrentGroup(dataGroups.find(g => g.id===groupId))


    // create the current context object
    const value = {
        filteredPlots,
        filter,
        addFilter,
        removeFilter,
        clearFilter,
        group: currentGroup,
        setGroup
    }

    return <>
        <FilterContext.Provider value={value}>
            { children }
        </FilterContext.Provider>
    </>
}

export const useDatasetFilter = () => {
    return useContext(FilterContext)
}