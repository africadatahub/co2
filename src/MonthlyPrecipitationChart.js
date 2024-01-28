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

import { interpolateYlGnBu, interpolateRdBu } from 'd3-scale-chromatic';

import { XYPlot, XAxis, YAxis, VerticalGridLines, HorizontalGridLines, LineMarkSeries, MarkSeries, VerticalBarSeries, LineSeries, AreaSeries, Hint, GradientDefs, HeatmapSeries, LabelSeries, Crosshair, ContinuousColorLegend, Treemap } from 'react-vis';
import '../node_modules/react-vis/dist/style.css';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';




const MonthlyPrecipitationChart = () => {

    const { cities, city, country, precipDatasets, dateRange, monthNames, maxPrecipitation } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [hintValue, setHintValue] = useState(null);

    


    
    useEffect(() => {

        setChartData(precipDatasets.data);
    
    }, [precipDatasets]);

    

    return (
        <section className="chart-wrapper">
            
            <header>
                {<h3>
                    {
                        <>Monthly Rainfall in <span className="location-highlight">
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
                                        <Dropdown.Item href="#/action-2">PNG</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                           
                        </Row>
                    </Col>
                </Row>                
            </div>
           
            <div className="chart-container precipitation-chart-container">
                {
                    chartData.length > 0 &&
                    <XYPlot
                        width={document.querySelector('.chart-container') != null ? (document.querySelector('.chart-container').getBoundingClientRect().width - 50) : 1000}
                        height={300}
                        xType="ordinal"
                        xDomain={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                        yType="ordinal"
                        yDomain={Array.from({length: dateRange[1] - dateRange[0] + 1}, (_, i) => dateRange[0] + i).filter(year => year < 2021)}
                    >
                        <XAxis tickFormat={i => monthNames[i].substring(0,3)}/>

                        <YAxis />
                        <HeatmapSeries
                            colorType="literal"
                            data={
                                chartData.map((d) => {
                                    
                                    return { 
                                        x: parseInt(d.month_number),
                                        y: parseInt(d.year),
                                        color: d.precip == null ? '#ccc' : interpolateYlGnBu(d.precip_scale),
                                        precip: d.precip,
                                    }
                                    
                                })
                            }
                            onValueMouseOver={e => setHintValue(e)}
                            onValueMouseOut={e => setHintValue(null)}
                        />
                        {hintValue && (
                            <Hint value={hintValue} style={{background: 'rgba(0,0,0,0.6)', borderRadius: '5px', padding: '0.2em', color: '#fff'}}>
                                {hintValue.precip.toFixed(2)}mm
                            </Hint>
                        )}
                    </XYPlot>
                }
            </div>

            <footer>
                <Row>
                    <Col>
                        <div className="legend-item">
                            <div className="legend-item-color" style={{backgroundColor: '#fdfed4'}}></div>
                            <div className="legend-item-label">&lt;1mm</div>
                        </div>
                        <div className="legend-item">
                            <div className="legend-item-color" style={{backgroundColor: '#081d58'}}></div>
                            <div className="legend-item-label">{maxPrecipitation}</div>
                        </div>
                    </Col>
                    <Col xs="auto">
                        Data source: <a target="_blank" href="https://gpcc.dwd.de/">GPCC</a>
                    </Col>
                </Row>
            </footer>
        
        </section >

    )

}

export default MonthlyPrecipitationChart;