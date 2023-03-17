import { useEffect, useState } from "react"
import Plot from 'react-plotly.js'
import { Data } from "plotly.js"

import { useFeldbuch } from "../../supabase/feldbuch"
import { IonSpinner } from "@ionic/react"

interface OverviewBarPlotProps {
    height?: number
}

const OverviewBarPlot: React.FC<OverviewBarPlotProps> = ({ height }) => {
    // component state
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<Data[]>([{type: 'bar', x: ['foo', 'bar'], y: [3, 8]}])

    // get the data
    const { plots, datasets, dataGroups } = useFeldbuch()

    // get prefered color scheme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    // calculate the statistics
    useEffect(() => {
        setLoading(true)
        const categories: any = {}
        // generate the data
        plots.forEach(plot => {
            const lab = `${plot.site} - ${plot.treatment}`
            if (!Object.keys(categories).includes(lab)) {
                categories[lab] = {1: 0, 2: 0, 3: 0, 4: 0}
            }
            // get the datasets
            const data = datasets.filter(d => d.plot_id == plot.id)
            data.forEach(d => categories[lab][d.group_id] += 1)
        })

        // now set the plot data
        setData(
            dataGroups.map(gr => {
                return {
                    type: 'bar',
                    x: Object.keys(categories),
                    y: Object.values(categories).map((g: any) => g[gr.id]),
                    name: gr.long_name
                }
            })
        )
        setLoading(false);
    }, [plots, datasets])

    if (loading) {
        return <IonSpinner name="crescent" />
    }
    return (
        <Plot data={data} layout={{
            autosize: true,
            height: height || 350,
            barmode: 'stack',
            paper_bgcolor: 'transparent',
            plot_bgcolor: 'transparent',
            font: {color: isDark ? 'white' : 'black'},
            legend: {orientation: 'h', yanchor: 'top', y: 1.15}
        }} useResizeHandler style={{width: '100%'}} />
    )
}

export default OverviewBarPlot