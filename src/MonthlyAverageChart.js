import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import getCountryISO2 from 'country-iso-3-to-2';
import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';






export default MonthlyAverageChart = () => {

    const { cities, countries, city, country, datasets, dateRange } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [tickCount, setTickCount] = useState(0);

   



    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Container className="custom-tooltip">
                    <div className="tooltip-date">{label}</div>
                    <Row>
                        <Col className="tooltip-item-name">Maximum Temperature</Col>
                        <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.max_temperature).toFixed(2)}&deg;</Col>
                    </Row>
                    <Row>
                        <Col className="tooltip-item-name">Average Temperature</Col>
                        <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.avg_temperature).toFixed(2)}&deg;</Col>
                    </Row>
                    <Row>
                        <Col className="tooltip-item-name">Minumum Temperature</Col>
                        <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.min_temperature).toFixed(2)}&deg;</Col>
                    </Row>
                </Container>
            );
        }
    };
    


    useEffect(() => {

        const uniqueTime = [...new Set(datasets.data.map(item => item.time))];

        setChartData(datasets.data);
        setTickCount(uniqueTime.length);
    
    }, [datasets]);

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Average Monthly Temperature in <span className="location-highlight">
                                <ReactCountryFlag countryCode={getCountryISO2(country)} svg /> 
                                <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }</span>
                            </span> from {dateRange[0]} to {dateRange[1]}</>
                    }
                </h3>}
            </header>
            
            <div className="chart-controls">
                <Row className="justify-content-between">
                    <Col xs="auto">
                    </Col>
                    <Col xs="auto">
                        <Row>
                            <Col xs="auto">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <Icon path={mdiCog} size={1} /> View Options
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <Icon path={mdiDownload} size={1} /> Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <Button className="chart-control-btn"><Icon path={mdiShareVariant} size={1} /> Share</Button>
                            </Col>     
                        </Row>
                    </Col>
                </Row>                
            </div>
           
            <div className="chart-container">
                <ResponsiveContainer width="100%" height={250}>
                <ComposedChart
                    width={800} 
                    height={250} 
                    data={chartData} 
                    margin={{
                        top: 0,
                        right: 40, 
                        bottom: 20,
                        left: 0
                    }}
                   >
                    <defs>
                        <linearGradient id="maxmin" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#a0c4fd" stopOpacity={0.6}/>
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="date"  angle={-90} tickCount={tickCount}/>
                    <YAxis/>
                    <Tooltip content={CustomTooltip}/>
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="linear" dataKey="avg_temperature" stroke="#bd00ff"  dot={false}  strokeWidth="2"/>
                    <Area type="linear" dataKey="maxmin_temperature" fill="url(#maxmin)" stroke="#8884d8" strokeOpacity={0.2} />
                </ComposedChart>
                </ResponsiveContainer>
            </div>

            <footer>
                <Row>
                    <Col>
                        Legend
                    </Col>
                    <Col>
                        Source
                    </Col>
                </Row>
            </footer>
        
        </section >

    )

}