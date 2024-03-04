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


import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';






const AnnualPrecipTable = () => {

    const { cities, city, country, convertCountry, address, datasets, dateRange, monthNames, downloadData } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    


    const [selectedYear, setSelectedYear] = useState(dateRange[1]);

    const changeYear = () => {

        let yearData = datasets.data.filter(item => parseInt(item.year) == parseInt(selectedYear));

        setChartData(yearData);
    
    
    }

    useEffect(() => {

        changeYear();        
    
    }, [datasets, selectedYear]);

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Annual rainfall in <span className="location-highlight">
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
                            {/* <Col xs="auto">
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
                            </Col> */}
                            <Col xs="auto">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <Icon path={mdiDownload} size={1} /> Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => downloadData('csv','annual-precipitation')}>CSV</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
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
                            <th style={{width: '100px', maxWidth: '100px'}} className="text-end">{selectedYear}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            chartData.length == 0 &&

                            <tr>
                                <td colSpan="3" className="text-center">No data available</td>
                            </tr>

                        }
                        {
                            chartData.map((row, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{monthNames[row.month_number-1]}</td>
                                        <td className="text-end">{parseFloat(row.precip_hist).toFixed(2)}mm</td>
                                        <td className="text-end">{parseFloat(row.precip).toFixed(2)}mm</td>
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
                        
                    </Col>
                    <Col xs="auto">
                        Data source: <a target="_blank" href="https://www.gloh2o.org/mswep/">GloH2O</a>
                    </Col>
                </Row>
            </footer>
        
        </section >

    )

}

export default AnnualPrecipTable;