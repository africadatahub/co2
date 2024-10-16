import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';

import { linearRegression } from 'simple-statistics';

import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';

import SocialShare from "./SocialShare";
import c from "dom-to-image-more";



const AQMap = () => {

    const { cities, city, position, country, convertCountry, address, currentData, dateRange, monthNames, downloadData, airQualityData, airQuality, airQualityScale } = useContext(AppContext);

    const [mapPositionX, setMapPositionX] = useState(0);
    const [mapPositionY, setMapPositionY] = useState(0);

    const mapPosition = () => {
        const activeLat = position[0];
        const activeLon = position[1];

        const boxWidth = 600; // width of the box
        const boxHeight = 200; // height of the box

        const latMin = -37;
        const latMax = 37;
        const lonMin = -20;
        const lonMax = 60;

        const imageWidth = 2925; // width of the image
        const imageHeight = 2702; // height of the image

        // Calculate the position of the active point in terms of the image dimensions
        const activeX = ((activeLon - lonMin) / (lonMax - lonMin)) * imageWidth;
        const activeY = ((latMax - activeLat) / (latMax - latMin)) * imageHeight; // assuming the origin (0,0) is top-left

        // Calculate offsets to center the active point
        const offsetX = (activeX - boxWidth / 2);
        const offsetY = (activeY - boxHeight / 2);

        const backgroundPositionX = parseInt(offsetX);
        const backgroundPositionY = parseInt(offsetY);

        setMapPositionX(backgroundPositionX);
        setMapPositionY(backgroundPositionY);

        
    }

    useEffect(() => {
        mapPosition();
    }, [airQualityData]);

    return (

        <>

        <section className="air-quality-map mb-4 py-5">
            
            <section className="chart-wrapper"> 
                <header>
                    <h3>Heatmap</h3>
                </header>
                <Row>
                    <Col>
                        <div className="air-quality-map-wrapper" style={{height: '300px', overflow: 'hidden', width: '100%', position: 'relative'}}>
                            <div className="air-quality-map" style={{
                                backgroundImage: 'url("maps/aerosol_optical_depth_2003_2003.jpg")', 
                                width: '2925px',
                                height: '2702px',
                                backgroundColor: 'rgb(166, 210, 226)',
                                left: `-${mapPositionX}px`,
                                top: `-${mapPositionY}px`,
                                position: 'absolute'
                            }}>
                            </div>
                        </div>
                    </Col>
                </Row>
                <footer>
                    <Row>
                        <Col>
                            
                        </Col>
                        <Col xs="auto">
                            Data source: <a target="_blank" href="https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MYD08_M3#overview">MODIS</a>
                        </Col>
                    </Row>
                </footer>
            </section>
            
        </section>

        </>

    )

}

export default AQMap;