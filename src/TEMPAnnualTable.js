import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Table from 'react-bootstrap/Table';

import SocialShare from "./SocialShare";


import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';






const TEMPAnnualTable = () => {

    const { cities, countries, city, country, convertCountry, address, currentData, dateRange, temperatureScale, getAnomalyColor, monthNames, downloadData } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [selectedYear, setSelectedYear] = useState(dateRange[1]);

    const changeYear = () => {

        let yearData = currentData.filter(item => parseInt(item.year) == parseInt(selectedYear));

        setChartData(yearData);
    
    }

    useEffect(() => {

        changeYear();        
    
    }, [currentData, selectedYear]);

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Monthly temperatures in <span className="location-highlight">
                                <div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3',country).iso2} svg /></div> 
                                <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : address }</span>
                            </span> compared to longterm average</>
                    }
                </h3>}
            </header>
            
            <div className="chart-controls">
                <Row className="justify-content-between">
                    <Col xs="auto">
                        <Form.Select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                            {
                                Array.from({length: (dateRange[1] - dateRange[0]) + 1}, (v, k) => k + dateRange[0]).map((year, i) => {
                                    return (
                                        <option key={i} value={year}>{year}</option>
                                    )
                                })
                            }
                        </Form.Select>
                    </Col>
                    <Col xs="auto">
                        <Row>
                            
                            <Col xs="auto">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <Icon path={mdiDownload} size={1} /> Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => downloadData('csv','annual-temperature')}>CSV</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <SocialShare chart="annual-temperature" />
                            </Col>
                        </Row>
                    </Col>
                </Row>                
            </div>
           
            <div className="table-container">
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th style={{width: '100px', maxWidth: '100px'}} className="text-end">Avg</th>
                            <th  style={{width: '100px', maxWidth: '100px'}} className="text-end">{selectedYear}</th>
                            <th style={{width: '100px', maxWidth: '100px'}} className="text-end">Anomaly</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            chartData.map((row, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{monthNames[row.month_number-1]}</td>
                                        <td className="text-end">{row.tavg_climatology}&deg;C</td>
                                        <td className="text-end">{row.tavg_temperature}&deg;C</td>
                                        <td className="text-end">
                                            {row.tavg_anomaly}&deg;C
                                            <div className="legend-box" style={{backgroundColor: getAnomalyColor(row.tavg_anomaly) }}></div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        
                    </tbody>
                </Table>
                
                
            </div>

            <footer>
                <Row>
                    <Col>
                        {
                            temperatureScale.map((item, i) => {
                                return (
                                    <div key={i} className="legend-item">
                                        <div className="legend-item-color" style={{backgroundColor: item.color}}></div>
                                        <div className="legend-item-label">{item.min == -Infinity ? -1.5 : item.min}&deg;C <strong>-</strong> {item.max == Infinity ? 1.5 : item.max}&deg;C</div>
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

export default TEMPAnnualTable;