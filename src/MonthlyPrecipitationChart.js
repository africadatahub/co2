import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

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

import { Heatmap, HeatmapSeries, SequentialLegend } from 'reaviz';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';




const MonthlyPrecipitationChart = () => {

    const { cities, city, country, convertCountry, address, precipDatasets, dateRange, monthNames, maxPrecipitation } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [hintValue, setHintValue] = useState(null);

    


    
    useEffect(() => {

        let heatmapData = [];

        for (let i = 1; i <= 12; i++) {
            heatmapData.push({key: monthNames[i-1], data: []});
        }

        precipDatasets.data.forEach((d) => {
            heatmapData.filter(h => h.key ==  monthNames[d.month_number-1])[0].data.push({key: d.year, data: d.precip});
        })
        
        


        setChartData(heatmapData);
    
    }, [precipDatasets]);

    

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
                {/* {
                    chartData.length > 0 &&
                    <XYPlot
                        width={document.querySelector('.chart-container') != null ? (document.querySelector('.chart-container').getBoundingClientRect().width - 50) : 1000}
                        height={(dateRange[1] - dateRange[0]) > 10 ? 500 : 300}
                        xType="ordinal"
                        xDomain={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]}
                        yType="ordinal"
                        yDomain={Array.from({length: dateRange[1] - dateRange[0] + 1}, (_, i) => dateRange[0] + i).filter(year => year <= dateRange[1])}
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
                                        color: d.precip == null ? '#ccc' : interpolateYlGnBu(parseFloat(d.precip_scale)),
                                        precip: parseFloat(d.precip),
                                    }
                                    
                                })
                            }
                            // onValueMouseOver={e => setHintValue(e)}
                            // onValueMouseOut={e => setHintValue(null)}
                        />
                        {hintValue && (
                            <Hint value={hintValue} style={{background: 'rgba(0,0,0,0.6)', borderRadius: '5px', padding: '0.2em', color: '#fff'}}>
                                {parseFloat(hintValue.precip).toFixed(2)}mm
                            </Hint>
                        )}
                    </XYPlot>
                } */}
                <Heatmap
                    height={(dateRange[1] - dateRange[0]) > 10 ? 500 : 300}
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