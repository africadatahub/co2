import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

import { Heatmap, HeatmapSeries, SequentialLegend, TooltipTemplate, TooltipArea, Tooltip, ChartTooltip, HeatmapCell } from 'reaviz';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiFridgeIndustrialAlertOutline, mdiShare, mdiShareVariant } from '@mdi/js';

import SocialShare from "./SocialShare";




const MonthlyAirQualityChart = () => {

    const { cities, city, country, convertCountry, address, datasets, currentData, dateRange, monthNames, downloadData, airQualityData, airQuality, airQualityScale } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [hintValue, setHintValue] = useState(null);

    

    
    useEffect(() => {

        let heatmapData = [];

        for (let i = 1; i <= 12; i++) {
            heatmapData.push({key: monthNames[i-1], data: []});
        }

        airQualityData.forEach((d) => {
            if(d.year < 2025) {
                heatmapData.filter(h => h.key ==  monthNames[d.month_number-1])[0].data.push({key: d.year.toString(), data: parseFloat(d.Aerosol_Optical_Depth_Land_Ocean_Mean_Mean)});
            }
        })

        setChartData(heatmapData);
    
    }, [airQualityData]);

   


    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Monthly air quality in <span className="location-highlight">
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

                                    {/* <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => downloadData('csv','monthly-precipitation')}>CSV</Dropdown.Item>
                                        <Dropdown.Item onClick={() => downloadData('png','monthly-precipitation')}>PNG</Dropdown.Item>
                                    </Dropdown.Menu> */}
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <SocialShare chart="monthly-air-quality" />
                            </Col>
                           
                        </Row>
                    </Col>
                </Row>                
            </div>
           
            <div className="chart-export" id="monthly-air-quality">
                
                <div className="chart-container air-quality-chart-container">
                    <Heatmap
                        height={(dateRange[1] - 2002) > 10 ? 700 : 300}
                        width={document.querySelector('.chart-container') != null ? (document.querySelector('.chart-container').getBoundingClientRect().width - 50) : 1000}
                        data={chartData}
                        series={<HeatmapSeries colorScheme={airQualityScale.map(aq => aq.color)} cell={<HeatmapCell
                            tooltip={<ChartTooltip
                                content={d =>
                                    {
                                        return ReactHtmlParser('<strong>' + d.data.key + ' ' + d.data.x + '</strong><br/> ' + d.data.y)
                                    }
                                }
                            />
                            }
                        />}/>}
                        

                    />
                </div>

                <footer>
                    <Row className="justify-content-between">
                        <Col xs="6">
                            <SequentialLegend data={chartData} orientation="horizontal"  colorScheme={airQualityScale.map(aq => aq.color)}/>
                        </Col>
                        <Col xs="auto">
                            Data source: <a target="_blank" href="https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MYD08_M3#overview">MODIS</a>
                        </Col>
                    </Row>
                </footer>
            </div>
        
        </section >

    )

}

export default MonthlyAirQualityChart;