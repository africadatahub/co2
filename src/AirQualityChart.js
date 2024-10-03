import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import Badge from 'react-bootstrap/Badge';

import { linearRegression } from 'simple-statistics';

import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';

import SocialShare from "./SocialShare";



const AirQualityChart = () => {

    const { cities, city, country, convertCountry, address, datasets, currentData, dateRange, monthNames, downloadData, airQualityData, airQuality, airQualityScale } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [trend, setTrend] = useState(0);

    const [showTrendline, setShowTrendline] = useState(true);

    const [showMin, setShowMin] = useState(true);
    const [showMean, setShowMean] = useState(true);
    const [showMax, setShowMax] = useState(true);

    

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Container className="custom-tooltip">
                    <div className="tooltip-date">{monthNames[payload[0].payload.month_number-1]}  {label}</div>
                </Container>
            );
        }
    };


    useEffect(() => {

        let chartData = [];

        airQualityData.forEach((d) => {
            if(d.year >= dateRange[0] && d.year <= dateRange[1]) {
                chartData.push(
                    {
                        year: d.year, 
                        Aerosol_Optical_Depth_Land_Ocean_Mean_Min: parseFloat(d.Aerosol_Optical_Depth_Land_Ocean_Mean_Min),
                        Aerosol_Optical_Depth_Land_Ocean_Mean_Mean: parseFloat(d.Aerosol_Optical_Depth_Land_Ocean_Mean_Mean),
                        Aerosol_Optical_Depth_Land_Ocean_Mean_Max: parseFloat(d.Aerosol_Optical_Depth_Land_Ocean_Mean_Max),
                        trendline: 0
                    });
            }
        });

        // calculate trendline
        let trendline = linearRegression(chartData.map((d,i) => [i, d.Aerosol_Optical_Depth_Land_Ocean_Mean_Mean]));

        setTrend(trendline);

        // fill for all
        for (let i = 0; i < chartData.length; i++) {
            chartData[i].trendline = parseFloat(trendline.m * i + trendline.b);
        }

        setChartData(chartData);

    }, [airQualityData]);

    useEffect(() => {
        // console.log(chartData);
    }, [chartData]);
   
    useEffect(() => {
        // console.log(trend);
    }, [trend]);

    return (

        <>

        <section className="air-quality-summary mb-4 py-5">
            <Row>
            <Col>
                <div className="air-quality-guage">
                    <div className="air-quality-guage-needle"
                        style={{
                            left: `${(airQualityScale.findIndex(scale => scale.quality === airQuality) / (airQualityScale.length - 1)) * 100 + 8.333}%`
                        }}
                    ></div>
                    {
                        // for each airQualityScale item
                        airQualityScale.map((item, index) => {
                            return (
                                <div className="air-quality-guage-segment" key={index} style={{backgroundColor: item.color}}>
                                    {item.short_label}
                                </div>
                            )
                        })
                    }
                </div>
            </Col>

            </Row>
            <Row>
                <Col className="text-center pt-3 pb-1">
                        
                    Between <strong>{dateRange[0] < 2002 ? 2002 : dateRange[0]} to {dateRange[1]}</strong> the <strong>average</strong> air quality in <span className="location-highlight">
                        <div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3',country).iso2} svg /></div>
                    <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : address }</span>
                    </span> was <div className="quality-badge" style={{backgroundColor: airQualityScale.find(aq => aq.quality === airQuality)?.color}}>{airQuality}</div> and <strong>{trend.m > 0 ? 'worsening' : 'improving'}</strong>.   


                </Col>
            </Row>
        </section>

        <section className="chart-wrapper">

            
            <header>
                {<h3>
                    {
                        <>Air quality in <span className="location-highlight">
                                <div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3',country).iso2} svg /></div> 
                                <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : address }</span>
                            </span> from {dateRange[0] < 2002 ? 2002 : dateRange[0]} to {dateRange[1]}</>
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
                                        <Icon path={mdiCog} size={1} /> View Options
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setShowTrendline(!showTrendline)}><input type="checkbox" checked={showTrendline}/> Trendline</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setShowMin(!showMin)}><input type="checkbox" checked={showMin}/> Min</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setShowMean(!showMean)}><input type="checkbox" checked={showMean}/> Mean</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setShowMax(!showMax)}><input type="checkbox" checked={showMax}/> Max</Dropdown.Item>
                                    </Dropdown.Menu>

                                    
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <Dropdown>
                                    <Dropdown.Toggle>
                                        <Icon path={mdiDownload} size={1} /> Download
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => downloadData('csv','air-quality-chart', selectedMonth)}>CSV</Dropdown.Item>
                                        <Dropdown.Item onClick={() => downloadData('png','air-quality-chart')}>PNG</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Col>
                            <Col xs="auto">
                                <SocialShare chart="monthly-rainfall-breakdown" />
                            </Col>
                        </Row>
                    </Col>
                </Row>                
            </div>
            <div className="chart-export" id="air-quality-chart">
                
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
                        
                        <XAxis dataKey="year" angle={-90}/>
                        <YAxis />
                        <Tooltip content={CustomTooltip}/>
                        <CartesianGrid stroke="#f5f5f5" />
                        {
                            showMin && <Line type="linear" dataKey="Aerosol_Optical_Depth_Land_Ocean_Mean_Min" stroke="#a0c4fd" dot={false} strokeWidth="1"/>
                        }
                        {
                            showMax && <Line type="linear" dataKey="Aerosol_Optical_Depth_Land_Ocean_Mean_Max" stroke="#fca5a5" dot={false} strokeWidth="1"/>
                        }
                        {
                            showMean && <Line type="linear" dataKey="Aerosol_Optical_Depth_Land_Ocean_Mean_Mean" stroke="#bd00ff" dot={false} strokeWidth="1"/>
                        }
                       
                        {
                            showTrendline &&
                            <Line
                                type="linear"
                                dataKey="trendline"
                                dot={false} strokeWidth="1"
                                strokeDasharray="2"
                                stroke="#3182bd"
                            />
                        }
                        
                    </ComposedChart>
                    </ResponsiveContainer>
                </div>

                <footer>
                    <Row>
                        <Col>
                            
                        </Col>
                        <Col xs="auto">
                            Data source: <a target="_blank" href="https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MYD08_M3#overview">MODIS</a>
                        </Col>
                    </Row>
                </footer>
            </div>
        
        </section >

        </>

    )

}

export default AirQualityChart;