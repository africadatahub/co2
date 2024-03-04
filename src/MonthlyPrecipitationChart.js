import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';


import { Heatmap, HeatmapSeries, SequentialLegend } from 'reaviz';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';




const MonthlyPrecipitationChart = () => {

    const { cities, city, country, convertCountry, address, datasets, dateRange, monthNames, downloadData } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [hintValue, setHintValue] = useState(null);

    


    
    useEffect(() => {

        let heatmapData = [];

        for (let i = 1; i <= 12; i++) {
            heatmapData.push({key: monthNames[i-1], data: []});
        }

        datasets.data.forEach((d) => {
            if(d.year < 2024) {
                heatmapData.filter(h => h.key ==  monthNames[d.month_number-1])[0].data.push({key: d.year, data: parseFloat(d.precip)});
            }
        })
        
        


        setChartData(heatmapData);
    
    }, [datasets]);

    

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Monthly Rainfall in <span className="location-highlight">
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
                                        <Icon path={mdiDownload} size={1} /> Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => downloadData('csv','monthly-precipitation')}>CSV</Dropdown.Item>
                                        <Dropdown.Item onClick={() => downloadData('png','monthly-precipitation')}>PNG</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                           
                        </Row>
                    </Col>
                </Row>                
            </div>
           
            <div className="chart-container precipitation-chart-container" id="monthly-precipitation">
                <Heatmap
                    height={(dateRange[1] - dateRange[0]) > 10 ? 700 : 300}
                    width={document.querySelector('.chart-container') != null ? (document.querySelector('.chart-container').getBoundingClientRect().width - 50) : 1000}
                    data={chartData}
                    series={<HeatmapSeries colorScheme="blues"/>}
                />
            </div>

            <footer>
                <Row className="justify-content-between">
                    <Col xs="6">
                        <SequentialLegend data={chartData} orientation="horizontal"  colorScheme="blues"/>
                    </Col>
                    <Col xs="auto">
                        Data source: <a target="_blank" href="https://www.gloh2o.org/mswep/">GloH2O</a>
                    </Col>
                </Row>
            </footer>
        
        </section >

    )

}

export default MonthlyPrecipitationChart;