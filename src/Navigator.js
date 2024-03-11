import {useEffect, useContext, useRef} from 'react';

import { AppContext } from './AppContext';


import { MapContainer, TileLayer, Tooltip, CircleMarker, Rectangle, Marker, Popup, useMap } from 'react-leaflet';


import LeafletGrid from './LeafletGrid';

import 'leaflet/dist/leaflet.css';


const Navigator = () => {

    const { position } = useContext(AppContext);

    const mapRef = useRef(null);

    useEffect(() => {
        
        if (mapRef.current) {
          mapRef.current.panTo(position);
        }
    }, [position])


    return (
        <>
            <div className="fw-bold mb-1">or choose a square on the map to see its climate data:</div>
            <div>
                {
                    position.length > 0 &&
                    
                    <MapContainer center={position} zoom={6} scrollWheelZoom={false} style={{ height: 500, width: "100%" }} ref={mapRef}>
                        <TileLayer
                            attribution=''
                            url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                        />
                        <LeafletGrid position={position}/>


                    </MapContainer>
                }
            </div>
        </>
    )
}

export default Navigator;