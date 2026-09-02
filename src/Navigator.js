import {useEffect, useContext, useRef, useState} from 'react';

import { AppContext } from './AppContext';


import { MapContainer, TileLayer, Tooltip, CircleMarker, Rectangle, Marker, Popup, useMap, WMSTileLayer } from 'react-leaflet';


import LeafletGrid from './LeafletGrid';

import Form from 'react-bootstrap/Form';

import 'leaflet/dist/leaflet.css';

const landCoverClasses = [
    { value: 10, label: 'Tree cover', color: '#006400' },
    { value: 20, label: 'Shrubland', color: '#ffbb22' },
    { value: 30, label: 'Grassland', color: '#ffff4c' },
    { value: 40, label: 'Cropland', color: '#ff1399' },
    { value: 50, label: 'Built-up', color: '#a00000' },
    { value: 60, label: 'Bare / sparse vegetation', color: '#ffd8a8' },
    { value: 70, label: 'Snow and ice', color: '#f0f0f0' },
    { value: 80, label: 'Permanent water bodies', color: '#0064ff' },
    { value: 90, label: 'Herbaceous wetland', color: '#009999' },
    { value: 95, label: 'Mangroves', color: '#00cc00' },
    { value: 100, label: 'Moss and lichen', color: '#f0ff00' },
];


const Navigator = () => {

    const { position } = useContext(AppContext);

    const mapRef = useRef(null);

    const [showLandCover, setShowLandCover] = useState(false);

    useEffect(() => {
        
        if (mapRef.current) {
          mapRef.current.panTo(position);
        }
    }, [position])


    return (
        <>
            <div id="landcover">
                <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="fw-bold">or choose a square on the map to see its climate data:</div>
                    <Form.Switch
                        id="landcover-layer-toggle"
                        label="Land cover"
                        checked={showLandCover}
                        onChange={(e) => setShowLandCover(e.target.checked)}
                    />
                </div>
                {
                    position.length > 0 &&

                    <MapContainer center={position} zoom={6} scrollWheelZoom={false} style={{ height: 500, width: "100%" }} ref={mapRef}>
                        <TileLayer
                            attribution=''
                            url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
                        />
                        <LeafletGrid position={position}/>
                        {
                            showLandCover &&
                            <WMSTileLayer
                                url="https://titiler.terrascope.be/wms"
                                layers="esa-worldcover-map-10m-2021-v2_map"
                                time="2021-01-01"
                                version="1.3.0"
                                format="image/png"
                                transparent={true}
                                opacity={0.85}
                                attribution='© ESA WorldCover project / Contains modified Copernicus Sentinel data processed by ESA WorldCover consortium'
                            />
                        }

                    </MapContainer>
                }
                {
                    showLandCover &&
                    <div className="landcover-legend mt-2">
                        <strong>ESA WorldCover 2021 land cover</strong>
                        <div className="legend-items">
                            {landCoverClasses.map((c) => (
                                <div className="legend-item" key={c.value}>
                                    <span className="legend-item-color" style={{ backgroundColor: c.color }}></span>
                                    <span className="legend-item-label">{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

export default Navigator;