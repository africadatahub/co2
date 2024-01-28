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

import { ComposedChart, Line, Area, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';






const TemperatureAnomalyChart = () => {

    const { cities, countries, city, country, datasets, dateRange, getAnomalyColor, monthNames, temperatureScale } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [tickCount, setTickCount] = useState(0);

    

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Container className="custom-tooltip">
                    <div className="tooltip-date">{monthNames[payload[0].payload.month_number]}  {label}</div>
                    <Row>
                        <Col className="tooltip-item-name">Temperature Anomaly</Col>
                        <Col xs={3} className="tooltip-item-value"><span style={{color: getAnomalyColor(parseFloat(payload[0].payload.avg_anomaly))}}>{parseFloat(payload[0].payload.avg_anomaly).toFixed(2)}&deg;</span></Col>
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
                        <>Relative Temperatures in <span className="location-highlight">
                                <div className="country-flag-circle"><ReactCountryFlag countryCode={getCountryISO2(country)} svg /></div> 
                                <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }</span>
                            </span> from {dateRange[0]} to {dateRange[1]}</>
                    }
                </h3>}
            </header>
            
            <div className="chart-controls">
                <Row className="justify-content-between">
                    <Col xs="auto">
                        {/* <Form.Select>
                            <option>Long term average</option>
                        </Form.Select> */}
                    </Col>
                    <Col xs="auto">
                        <Row>
                            
                            <Col xs="auto">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <Icon path={mdiDownload} size={1} /> Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item href="#/action-1">CSV</Dropdown.Item>
                                        <Dropdown.Item href="#/action-1">PNG</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
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
                    <XAxis dataKey="time" angle={-90} interval={11}/>
                    <YAxis/>
                    <Tooltip content={CustomTooltip}/>
                    <CartesianGrid stroke="#f5f5f5" />
                    <Bar dataKey="avg_anomaly">
                    {
                        chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getAnomalyColor(entry.avg_anomaly)} />
                        ))
                    }
                    </Bar>
                    
                </ComposedChart>
                </ResponsiveContainer>
            </div>

            <footer>
                <Row>
                    <Col>
                        {
                            temperatureScale.map((item, i) => {
                                return (
                                    <div key={i} className="legend-item">
                                        <div className="legend-item-color" style={{backgroundColor: item.color}}></div>
                                        <div className="legend-item-label">{item.min == -Infinity ? -1.5 : item.min} - {item.max == Infinity ? 1.5 : item.max}&deg;</div>
                                    </div>
                                )
                            })
                        }
                    </Col>
                    <Col xs="auto">
                        Data source: <a target="_blank" href="https://berkeleyearth.org/data/">Berkeley Earth</a>
                    </Col>
                </Row>
            </footer>
        
        </section >

    )

}

export default TemperatureAnomalyChart;