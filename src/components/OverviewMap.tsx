import { IonSpinner } from '@ionic/react'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api'
import { useCallback, useState } from 'react'
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
    //const center = {lat: 47.1, lng: 7.9232}

    // create handler to initialize and unmount the map after js has loaded
    const onLoad = useCallback((map: google.maps.Map) => {
        const bounds = new window.google.maps.LatLngBounds(center)
        map.fitBounds(bounds)
        map.setZoom(12)
        map.setCenter(center)
        setMap(map)
    }, [])
    
    const onUnmount = useCallback(() => setMap(null), [])

    if (!isLoaded) {
        return <IonSpinner />
    }
    return (
        <GoogleMap 
            mapContainerStyle={{width: '100%', height: '250px'}}
            center={center}
            zoom={6}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
                <Marker position={center} />
            
        </GoogleMap>
    )
}

export default OverviewMap