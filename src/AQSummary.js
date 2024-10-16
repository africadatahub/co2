import { useEffect, useContext, useState } from "react";
import { AppContext } from "./AppContext";

import ReactCountryFlag from 'react-country-flag';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';

import { linearRegression } from 'simple-statistics';

import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

import { Icon } from '@mdi/react';
import { mdiCog, mdiDownload, mdiShare, mdiShareVariant } from '@mdi/js';

import SocialShare from "./SocialShare";



const AQSummary = () => {

    const { cities, city, country, convertCountry, address, currentData, dateRange, monthNames, downloadData, airQualityData, airQuality } = useContext(AppContext);

    const [chartData, setChartData] = useState([]);

    const [trend, setTrend] = useState(0);

    const [showTrendline, setShowTrendline] = useState(true);

    

    useEffect(() => {

        let chartData = [];

        airQualityData.forEach((d) => {
            if(d.year >= dateRange[0] && d.year <= dateRange[1]) {
                chartData.push({year: d.year, value: parseFloat(d.aod_mean), trendline: 0});
            }
        });

        // calculate trendline
        let trendline = linearRegression(chartData.map((d,i) => [i, d.value]));

        setTrend(trendline);

        // fill for all
        let thetrendline = [];
        for (let i = 0; i < chartData.length; i++) {
            chartData[i].trendline = parseFloat(trendline.m * i + trendline.b);
        }

        setChartData(chartData);

    }, [airQualityData]);

    useEffect(() => {
        console.log(chartData);
    }, [chartData]);
   
    useEffect(() => {
        console.log(trend);
    }, [trend]);

    return (
            
        <header>
            {<h3>
                {
                    <>Air quality was {airQuality} in <span className="location-highlight">
                            <div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3',country).iso2} svg /></div> 
                            <span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : address }</span>
                        </span> from {dateRange[0] < 2002 ? 2002 : dateRange[0]} to {dateRange[1]}</>
                }
            </h3>}
        </header>

            
            
                
            
        

    )

}

export default AQSummary;