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

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';






const MonthlyBreakdownChart = () => {

    const { cities, countries, city, country, address, datasets, dateRange, monthNames, downloadData } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [selectedMonth, setSelectedMonth] = useState(0);

    const [showClimatology, setShowClimatology] = useState(true);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Container className="custom-tooltip">
                    <div className="tooltip-date">{monthNames[payload[0].payload.month_number]}  {label}</div>
                    <Row style={{color: "#bd00ff"}}>
                        <Col className="tooltip-item-name">Average Temperature</Col>
                        <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.avg_temperature).toFixed(2)}&deg;</Col>
                    </Row>
                    <Row style={{color: "#ed8f38"}}>
                        <Col className="tooltip-item-name">Historical Average</Col>
                        <Col xs={3} className="tooltip-item-value">{parseFloat(payload[0].payload.avg_climatology).toFixed(2)}&deg;</Col>
                    </Row>
                </Container>
            );
        }
    };

    const changeMonthlyBreakdown = (month) => {
       
        let monthData = datasets.data.filter(item => item.month_number == parseInt(month));

        setChartData(monthData);
        setSelectedMonth(month);
        
    }

    useEffect(() => {
        changeMonthlyBreakdown(selectedMonth);
    }, [datasets]);

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Monthly Temperature Breakdown in <span className="location-highlight">
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
                            <option value="0">January</option>
                            <option value="1">February</option>
                            <option value="2">March</option>
                            <option value="3">April</option>
                            <option value="4">May</option>
                            <option value="5">June</option>
                            <option value="6">July</option>
                            <option value="7">August</option>
                            <option value="8">September</option>
                            <option value="9">October</option>
                            <option value="10">November</option>
                            <option value="11">December</option>
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
                        </Row>
                    </Col>
                </Row>                
            </div>
           
            <div className="chart-container" id="monthly-temperature-breakdown">
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
                    
                    <XAxis dataKey="time"  angle={-90}/>
                    <YAxis label={{ 
                        value: `°C`,
                        style: { textAnchor: 'middle' },
                        angle: -90,
                        position: 'left',
                        offset: -20, }}
                    />
                    <Tooltip content={CustomTooltip}/>
                    <CartesianGrid stroke="#f5f5f5" />
                    <Line type="linear" dataKey="avg_temperature" stroke="#bd00ff" dot={false} strokeWidth="2"/>
                    {
                        showClimatology &&
                        <Line type="linear" dataKey="avg_climatology" stroke="#ed8f38" dot={false} strokeWidth="2" strokeDasharray="8"/>
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
        
        </section >

    )

}

export default MonthlyBreakdownChart;