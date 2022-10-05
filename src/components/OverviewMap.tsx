import { IonSpinner } from '@ionic/react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useCallback, useEffect, useState } from 'react'
import { Plot } from '../supabase/feldbuch.model'

const { REACT_APP_GOOGLE_MAPS_API_KEY: API_KEY } = process.env

interface OverviewMapProps {
    plot: Plot
}

const OverviewMap: React.FC<OverviewMapProps> = ({ plot }) => {
    // use the google API loader to load a maps instance
    const { isLoaded } = useJsApiLoader({
        id: 'map-id',
        googleMapsApiKey: API_KEY!
    })

    // create a component state to store the map object
    const [map, setMap] = useState<google.maps.Map | null>(null)
    const center = {lat: plot.lat, lng: plot.lon}


    // create handler to initialize and unmount the map after js has loaded
    const onLoad = useCallback((map: google.maps.Map) => {
        setMap(map);
    }, [])
    
    useEffect(() => {
        if (map) {
            console.log('Updating the map...')
            // set the map
            map.setZoom(12)
            map.setCenter(center)

            // create the marker
            const marker = new google.maps.Marker({position: center})
            marker.setMap(map)
        }
        
    }, [map, center])

    const onUnmount = useCallback(() => setMap(null), [])

    if (!isLoaded) {
        return <IonSpinner />
    }
    return (
        <GoogleMap 
            mapContainerStyle={{width: '100%', height: '250px'}}
            onLoad={onLoad}
            onUnmount={onUnmount}
        />
    )
}

export default OverviewMap