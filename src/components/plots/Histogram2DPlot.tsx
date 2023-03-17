import { IonCol, IonGrid, IonRow, IonSpinner } from "@ionic/react"
import { Data } from "plotly.js"
import { useEffect, useState } from "react"
import Plot from "react-plotly.js"
import { useFeldbuch } from "../../supabase/feldbuch"

interface HistorgramProps {
    xFeature: string,
    yFeature: string,
    height?: number
}

const Histogram2DPlot: React.FC<HistorgramProps> = ({ xFeature, yFeature, height }) => {
    // component state
    const [loading, setLoading] = useState<boolean>(true)
    const [data, setData] = useState<Data[]>([])

    // get the data
    const {plots, datasets } = useFeldbuch()

    // get prefered color scheme
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
 
    useEffect(() => {
        setLoading(true)

        // build the data arrays
        const x: number[] = []
        const y: number[] = []

        // transform the data
        plots.forEach(plot => {
            // get the associated sets
            let x_: number | undefined = undefined
            let y_: number | undefined = undefined
            const sets = datasets.filter(d => d.plot_id===plot.id)
            sets.forEach((set: any) => {
                if (Object.keys(set.data!).includes(xFeature)) {
                    x_ = set.data[xFeature]
                }
                if (Object.keys(set.data!).includes(yFeature)) {
                    y_ = set.data[yFeature]
                }
            })
            // check if we have data
            if (!!x_ && !!y_) {
                x.push(x_)
                y.push(y_)
            }
        })

        // create the plot data
        setData([
            {
                'type': 'histogram2dcontour',
                x: x,
                y: y,
                colorscale: 'Greens',
                reversescale: false,
                xaxis: 'x',
                yaxis: 'y'
            },
            {
                'type': 'histogram',
                y: y,
                xaxis: 'x2',
                showlegend: false,
                marker: {color: 'green'}
            },
            {
                'type': 'histogram',
                x: x,
                yaxis: 'y2',
                showlegend: false,
                marker: {color: 'green'}
            }
        ])
        setLoading(false)
    }, [plots, datasets, xFeature, yFeature])

    if (loading) {
        return <IonGrid>
            <IonRow>
                <IonCol size="12" style={{height: '350px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <IonSpinner name="crescent" />
                </IonCol>
            </IonRow>
        </IonGrid>
    }
    return (
        <Plot
            data={data}
            layout={{
                autosize: true,
                height: height || 350,
                paper_bgcolor: 'transparent',
                plot_bgcolor: 'transparent',
                font: {color: isDark ? 'white' : 'black'},
                xaxis: {zeroline: false, showgrid: false, domain: [0, 0.85], title: xFeature},
                yaxis: {zeroline: false, showgrid: false, domain: [0, 0.85], title: yFeature},
                xaxis2: {zeroline: false, showgrid: false, domain: [0.85, 1]},
                yaxis2: {zeroline: false, showgrid: false, domain: [0.85, 1]},
            }}
            useResizeHandler
            style={{width: '100%'}}
        />
    )
}

export default Histogram2DPlot