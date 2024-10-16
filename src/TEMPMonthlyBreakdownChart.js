import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

import SocialShare from "./SocialShare";


import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';






const TEMPMonthlyBreakdownChart = () => {

    const { cities, countries, city, country, convertCountry, address, currentData, dateRange, monthNames, downloadData } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState(1);

    const [showClimatology, setShowClimatology] = useState(true);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Container className="custom-tooltip">
                    <div className="tooltip-date">{monthNames[payload[0].payload.month_number - 1]}  {label}</div>
                    <Row style={{color: "#bd00ff"}}>
                        <Col className="tooltip-item-name">Average Temperature</Col>
                        <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.tavg_temperature).toFixed(2)}&deg;</Col>
                    </Row>
                    <Row style={{color: "#ed8f38"}}>
                        <Col className="tooltip-item-name">Historical Average</Col>
                        <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.tavg_climatology).toFixed(2)}&deg;</Col>
                    </Row>
                </Container>
            );
        }
    };

    const changeMonthlyBreakdown = (month) => {
       
        let monthData = currentData.filter(item => item.month_number == parseInt(month));

        setChartData(monthData);
        setSelectedMonth(month);
        
    }

    useEffect(() => {
        changeMonthlyBreakdown(selectedMonth);
        
    }, [currentData]);

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Monthly temperature breakdown in <span className="location-highlight">
                                <div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3',country).iso2} svg /></div> 
                                <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : address }</span>
                            </span> from {dateRange[0]} to {dateRange[1]}</>
                    }
                </h3>}
            </header>
            
            <div className="chart-controls">
                <Row className="justify-content-between">
                    <Col xs="auto">
                        <Form.Select value={selectedMonth} onChange={e => changeMonthlyBreakdown(e.target.value)}>
                            <option value="1">January</option>
                            <option value="2">February</option>
                            <option value="3">March</option>
                            <option value="4">April</option>
                            <option value="5">May</option>
                            <option value="6">June</option>
                            <option value="7">July</option>
                            <option value="8">August</option>
                            <option value="9">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </Form.Select>
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
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <Icon path={mdiDownload} size={1} /> Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => downloadData('csv','monthly-temperature-breakdown',selectedMonth)}>CSV</Dropdown.Item>
                                        <Dropdown.Item onClick={() => downloadData('png','monthly-temperature-breakdown',selectedMonth)}>PNG</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <SocialShare chart="monthly-temperature-breakdown" />
                            </Col>
                        </Row>
                    </Col>
                </Row>                
            </div>
           
            <div className="chart-export" id="monthly-temperature-breakdown">
                
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
                        
                        <XAxis dataKey="year" angle={-90} interval={1}/>
                        <YAxis label={{ 
                            value: `°C`,
                            style: { textAnchor: 'middle' },
                            angle: -90,
                            position: 'left',
                            offset: -20, }}
                        />
                        <Tooltip content={CustomTooltip}/>
                        <CartesianGrid stroke="#f5f5f5" />
                        <Line type="linear" dataKey="tavg_temperature" stroke="#bd00ff" dot={false} strokeWidth="1"/>
                        {
                            showClimatology &&
                            <Line type="linear" dataKey="tavg_climatology" stroke="#ed8f38" dot={false} strokeWidth="1" strokeDasharray="2"/>
                        }
                    </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <footer>
                    <Row>
                        <Col>
                            <div className="legend-item">
                                <div className="legend-item-color" style={{backgroundColor: '#bd00ff'}}></div>
                                <div className="legend-item-label">{monthNames[selectedMonth]} Avg</div>
                            </div>
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

export default TEMPMonthlyBreakdownChart;