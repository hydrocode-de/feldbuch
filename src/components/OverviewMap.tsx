import { Plot } from "../supabase/feldbuch.model"
import { Wrapper } from '@googlemaps/react-wrapper'
import { isLatLngLiteral } from '@googlemaps/typescript-guards'
import { createRef, ReactFragment, useEffect, useRef, useState } from "react"
import React from "react"
import { createCustomEqual } from 'fast-equals'

const { REACT_APP_GOOGLE_MAPS_API_KEY: API_KEY } = process.env


const deepCompareEqualsForMaps = createCustomEqual(
(deepEqual) => (a: any, b: any) => {
    if (
    isLatLngLiteral(a) ||
    a instanceof google.maps.LatLng ||
    isLatLngLiteral(b) ||
    b instanceof google.maps.LatLng
    ) {
    return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
}
);

const useDeepCompareMemoize = (value: any) => {
    const ref = useRef()

    if (!deepCompareEqualsForMaps(value, ref.current)) {
        ref.current = value
    }

    return ref.current
}

const useDeepCompareEffectForMaps = (callback: React.EffectCallback, dependencies: any[]) => {
    useEffect(callback, dependencies.map(useDeepCompareMemoize))
}

  
interface OverviewMapProps {
    plot: Plot
}

const Marker: React.FC<google.maps.MarkerOptions> = options => {
    // marker state
    const [marker, setMarker] = useState<google.maps.Marker>()

    // create or remove marker
    useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker())
        }

        return () => {
            if (marker) {
                marker.setMap(null)
            }
        }
    }, [marker])

    // set marker options
    useEffect(() => {
        if (marker) {
            marker.setOptions(options)
        }
    }, [marker, options])
    
    return null
}

interface MapProps extends google.maps.MapOptions {
    style: {[key: string]: string}
    onClick?: (e: google.maps.MapMouseEvent) => void
    onIdle?: (map: google.maps.Map) => void
    children: React.ReactNode
}
const Map: React.FC<MapProps> = ({style, onClick, onIdle, children, ...options}) => {
    // create an reference
    const ref = useRef<HTMLDivElement>(null)

    // component state
    const [map, setMap] = useState<google.maps.Map>()

    // init the map
    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}))
        }
    }, [ref, map])

    useDeepCompareEffectForMaps(() => {
        if (map) {
            map.setOptions(options)
        }
    }, [map, options])

    // add event listeners
    useEffect(() => {
        if (map) {
            ['click', 'idle'].forEach(name => {
                google.maps.event.clearListeners(map, name)
            })

            if (onClick) {
                map.addListener('click', onClick)
            }

            if (onIdle) {
                map.addListener('idle', () => onIdle(map))
            }
        }
    }, [map, onClick, onIdle])

    return <>
        <div ref={ref} style={style}></div>
        { React.Children.map(children, (child) => {
            if (React.isValidElement(child)) {
                return React.cloneElement(child, { map })
            }
        }) }
    </> 
    
}

const OverviewMap: React.FC<OverviewMapProps> = ({ plot }) => {
    const position = {lat: plot.lat, lng: plot.lon}

    return (
        <Wrapper apiKey={API_KEY!}>
            <Map center={position} zoom={14}  style={{height: '250px', width: '100%'}}>
                <Marker position={position} />
            </Map>
        </Wrapper>
    )
}

export default OverviewMap

function createCustomEqual(arg0: (deepEqual: any) => (a: any, b: any) => any) {
    throw new Error("Function not implemented.")
}
