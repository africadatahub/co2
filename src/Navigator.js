import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { MapContainer, TileLayer, Tooltip, CircleMarker, Rectangle, Marker, Popup, useMap } from 'react-leaflet';


import LeafletGrid from './LeafletGrid';

import 'leaflet/dist/leaflet.css';


const Navigator = ({ countries, cities, city, position, setPosition, country, address, interacted }) => {

    React.useEffect(() => {
        console.log(position);
    }, [position]);

    React.useEffect(() => {
        console.log(address);
    }, [address]);

    const changePosition = (latlng) => {
        setPosition(latlng);
    }


    return (
        <>
            <div className="fw-bold mb-1">or choose a square on the map to see its climate data:</div>
            <div>
                <MapContainer center={position} zoom={interacted ? 7 : 6} scrollWheelZoom={false} style={{ height: 500, width: "100%" }} key={JSON.stringify(position)}>
                    <TileLayer
                        attribution=''
                        url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                    />
                    <LeafletGrid position={position} interacted={interacted} setPosition={changePosition}/>
                    
                </MapContainer>
            </div>
        </>
    )
}

export default Navigator;