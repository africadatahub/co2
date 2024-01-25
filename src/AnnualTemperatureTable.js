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
import Table from 'react-bootstrap/Table';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';






export default AnnualTemperaturetable = () => {

    const { cities, countries, city, country, datasets, dateRange } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [selectedYear, setSelectedYear] = useState(2022);

    const changeYear = () => {

        let yearData = datasets.data.filter(item => parseInt(item.time) == parseInt(selectedYear));

        setChartData(yearData);
    
    
    }

    useEffect(() => {

        changeYear();        
    
    }, [datasets]);

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Annual temperatures in <span className="location-highlight">
                                <ReactCountryFlag countryCode={getCountryISO2(country)} svg /> 
                                <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }</span>
                            </span> compared to longterm average</>
                    }
                </h3>}
            </header>
            
            <div className="chart-controls">
                <Row className="justify-content-between">
                    <Col xs="auto">
                        <Form.Select onChange={e => changeMonthlyBreakdown(e.target.value)}>
                            <option value="0" selected>January</option>
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
           
            <div className="table-container">
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Mean avg</th>
                            <th>2022</th>
                            <th>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            chartData.map((row, i) => {
                                return (
                                    <tr key={i}>
                                        <td>{row.month_number}</td>
                                        <td>{row.avg_climatology.toFixed(2)}&deg;</td>
                                        <td>{row.avg_temperature.toFixed(2)}&deg;</td>
                                        <td>{row.avg_anomaly.toFixed(2)}&deg;</td>
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