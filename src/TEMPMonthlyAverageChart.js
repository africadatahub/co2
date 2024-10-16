import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { ChartContainer, LineChart, AreaChart } from 'reaviz';

import SocialShare from "./SocialShare";

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';



const TEMPMonthlyAverageChart = () => {

    const { cities, countries, city, country, convertCountry, address, currentData, dateRange, monthNames, downloadData } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [showMaxMin, setShowMaxMin] = useState(true);
    const [showClimatology, setShowClimatology] = useState(true);


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Container className="custom-tooltip">
                    <div className="tooltip-date">{monthNames[payload[0].payload.month_number-1]} {payload[0].payload.year}</div>
                    {
                        showMaxMin &&
                        <Row style={{color: '#fca5a5'}}>
                            <Col className="tooltip-item-name">Maximum Temperature</Col>
                            <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.tmax_temperature).toFixed(2)}&deg;</Col>
                        </Row>
                    }
                    <Row style={{color: '#bd00ff'}}>
                        <Col className="tooltip-item-name">Average Temperature</Col>
                        <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.tavg_temperature)}&deg;</Col>
                    </Row>
                    {
                        showMaxMin &&
                        <Row style={{color: '#a0c4fd'}}>
                            <Col className="tooltip-item-name">Minumum Temperature</Col>
                            <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.tmin_temperature).toFixed(2)}&deg;</Col>
                        </Row>
                    }
                    {
                        showClimatology &&
                        <Row style={{color: '#ed8f38'}}>
                            <Col className="tooltip-item-name">Historical Average</Col>
                            <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.tavg_climatology)}&deg;</Col>
                        </Row>
                    }   
                </Container>
            );
        }
    };
    


    useEffect(() => {

        
        setChartData(currentData);
    
    }, [currentData]);

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Average monthly temperature in <span className="location-highlight">
                                <div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3',country).iso2} svg /></div> 
                                <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : address }</span>
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
                                        <Dropdown.Item onClick={() => setShowClimatology(!showClimatology)}><input type="checkbox" checked={showClimatology}/> Historical Avg</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setShowMaxMin(!showMaxMin)}><input type="checkbox" checked={showMaxMin}/> Max/Min Range</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <Icon path={mdiDownload} size={1} /> Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => downloadData('csv','monthly-temperature')}>CSV</Dropdown.Item>
                                        <Dropdown.Item onClick={() => downloadData('png','monthly-temperature')}>PNG</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <SocialShare chart="average-monthly-temperature" />
                            </Col>
                        </Row>
                    </Col>
                </Row>                
            </div>

            <div className="chart-export" id="monthly-temperature">
                
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
                        <XAxis dataKey="year"  angle={-90} interval={11}/>
                        <YAxis label={{ 
                            value: `°C`,
                            style: { textAnchor: 'middle' },
                            angle: -90,
                            position: 'left',
                            offset: -20, }}
                        />
                        <Tooltip content={CustomTooltip}/>
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="linear" dataKey="tavg_temperature" stroke="#bd00ff"  dot={false}  strokeWidth="1"/>
                        {
                            showMaxMin && <Area type="linear" dataKey="minmax_temperature" fill="url(#maxmin)" stroke="#8884d8" strokeOpacity={0.2} />
                        }
                        {
                            showClimatology && <Line type="linear" dataKey="tavg_climatology" stroke="#ed8f38" dot={false} strokeWidth="1" strokeDasharray="2"/>
                        }
                    </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <footer>
                    <Row>
                        <Col>
                            <div className="legend-item">
                                <div className="legend-item-color" style={{backgroundColor: '#bd00ff'}}></div>
                                <div className="legend-item-label">Avg Temp</div>
                            </div>
                            {
                                showMaxMin &&
                                <>
                                    <div className="legend-item">
                                        <div className="legend-item-color" style={{backgroundColor: '#fca5a5'}}></div>
                                        <div className="legend-item-label">Max Temp</div>
                                    </div>
                                    <div className="legend-item">
                                        <div className="legend-item-color" style={{backgroundColor: '#a0c4fd'}}></div>
                                        <div className="legend-item-label">Min Temp</div>
                                    </div>
                                </>
                            }
                            {
                                showClimatology &&
                                <div className="legend-item">
                                    <div className="legend-item-color" style={{backgroundColor: '#ed8f38'}}></div>
                                    <div className="legend-item-label">Historical Avg</div>
                                </div>
                            }
                        </Col>
                        <Col xs="auto">
                            Data source: <a target="_blank" href="https://berkeleyearth.org/data/">Berkeley Earth</a>
                        </Col>
                    </Row>
                </footer>

            </div>
        
        </section >

    )

}

export default TEMPMonthlyAverageChart;