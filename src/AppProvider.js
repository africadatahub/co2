import { useState, useEffect, useRef } from 'react';
import { AppContext } from './AppContext';

import axios from 'axios';

import {svgAsPng} from 'svg-to-png';
import { saveAs } from 'file-saver';
import {toPng} from 'dom-to-image-more';
import html2canvas from 'html2canvas';

import * as cities from './data/cities.json';
import * as countries from './data/countries.json';

export const AppProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState([1993, 2023]);
	const [position, setPosition] = useState([]);
    const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
    const [datasets, setDatasets] = useState(
        {
            locations: '9d764714-2094-4455-8754-63b87d1fdce0',
            all_data: '6bbc647c-350c-4ae0-8b4d-9011e50a1ad5',
            data: [],
            labels: {
                avg_temperature: 'Average Temperature',
                max_temperature: 'Maximum Temperature',
                min_temperature: 'Minimum Temperature',
                avg_climatology: 'Average Climatology',
                max_climatology: 'Maximum Climatology',
                min_climatology: 'Minimum Climatology'
            }
        }
    );
    const [annualAvgTemperature, setAnnualAvgTemperature] = useState(null);
    const [annualAvgPrecipitation, setAnnualAvgPrecipitation] = useState(null);
    const [maxPrecipitation, setMaxPrecipitation] = useState(null);
    
    
    const temperatureScale = [
        {min: -Infinity, max: -1, color: '#08306b'},
        {min: -1, max: -0.5, color: '#6baed6'},
        {min: -0.5, max: 0, color: '#deebf7'},
        {min: 0, max: 0.5, color: '#fee0d2'},
        {min: 0.5, max: 1, color: '#fdcc8a'},
        {min: 1, max: 1.5, color: '#fc9272'},
        {min: 1.5, max: Infinity, color: '#67000d'}
    ]

    const getAnomalyColor = (anomaly) => {

        if (anomaly < -1) return '#08306b';
        if (anomaly < -0.5) return '#6baed6'; 
        if (anomaly < 0) return '#deebf7';
        if (anomaly < 0.5) return '#fee0d2';
        if (anomaly < 1) return '#fdcc8a';
        if (anomaly < 1.5) return '#fc9272';
      
        return '#67000d';
      
    }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    
    

    const findAddress = (middlePoint) => {

        axios.get('https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"' + datasets.locations + '"%20WHERE%20latitude%20%3E%3D%20' + (parseFloat(middlePoint[0]) - 0.5) + '%20AND%20latitude%20%3C%3D%20' + (parseFloat(middlePoint[0]) + 0.5) + '%20AND%20longitude%20%3E%3D%20' + (parseFloat(middlePoint[1]) - 0.5) + '%20AND%20longitude%20%3C%3D%20' + (parseFloat(middlePoint[1]) + 0.5) + '%20', {
            headers: {
                "Authorization": process.env.CKAN
            }
        }).then(response => {


            let data = response.data.result.records;

            
            if(data.length > 0) {
                setAddress(
                    data[0].city != '' ? data[0].city :
                    data[0].town != '' ? data[0].town :
                    data[0].village != '' ? data[0].village :
                    data[0].hamlet != '' ? data[0].hamlet :
                    data[0].county != '' ? data[0].county :
                    data[0].region != '' ? data[0].region :
                    data[0].state != '' ? data[0].state :
                    ''
                );
                setCity('location');
                setCountry(convertCountry('iso2', data[0].country_code).iso3);
                
            } else {
                setAddress('');
                setCity('');
                setCountry('');
            }

            setPosition(middlePoint);


            
        }).catch(e => console.log(e));

    }

    

    const convertCountry = (type, value) => {

        if(value == '' || value == undefined) return '';

        let country = countries.filter(c => c[type].toUpperCase() == value.toUpperCase())[0];

        if(country == undefined) {
            return '';
        } else {
            return country;
        }
    
    }

    const changeDateRange = (type, value) => {
        
        if(type == 'start') {
            setDateRange([parseInt(value), dateRange[1]]);
        } else {
            setDateRange([dateRange[0], parseInt(value)]);
        }
        
        
    }

    const mergeClimateData = (baseset, temperatures, indicator) => {

        let t = temperatures.find(t => {
            return parseInt(t.time) === parseInt(baseset.time) && parseInt(t.month_number) === parseInt(baseset.month_number);
        });

        if(t == undefined) {
            return null;
        } else {
            return parseFloat(t[indicator]);
        }
    
    }

    async function getAllData() {
        setLoading(true);
        axios.get('https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"' + datasets.all_data + '"%20WHERE%20latitude%20%3E%3D%20' + (parseFloat(position[0]) - 0.5) + '%20AND%20latitude%20%3C%3D%20' + (parseFloat(position[0]) + 0.5) + '%20AND%20longitude%20%3E%3D%20' + (parseFloat(position[1]) - 0.5) + '%20AND%20longitude%20%3C%3D%20' + (parseFloat(position[1]) + 0.5) + '%20AND%20year%20%3E%3D%20' + dateRange[0] + '%20AND%20year%20%3C%3D%20' + (dateRange[1] + 1) + '%20', {
                headers: {
                    "Authorization": process.env.CKAN
                }
            })
            .then(response => {

                let max = 0;

                let data = response.data.result.records;

                console.log(data);

                // sort
                data.sort((a, b) => {

                    const aYear = parseInt(a.year);
                    const bYear = parseInt(b.year);
                  
                    const aMonth = parseInt(a.month_number); 
                    const bMonth = parseInt(b.month_number);
                  
                    if(aYear < bYear) return -1;
                    if(aYear > bYear) return 1;
                    
                    if(aMonth < bMonth) return -1; 
                    if(aMonth > bMonth) return 1;
                  
                    return 0;
                  
                });

                data.forEach(record => {
                        
                    if(parseFloat(record.precip) > max) {
                        max = parseFloat(record.precip);
                    }
                
                })

                console.log(max);

                setMaxPrecipitation(max);
                setDatasets({...datasets, data: data});
                setLoading(false);

            })
            
    }
    

    // INIT

    useEffect(() => {

        let searchTerms = document.location.search.split('&');

        let daterangesearch = searchTerms.filter(term => term.includes('daterange='))[0];

        if (document.location.search.includes('daterange=')) {

            let date_range = daterangesearch.split('=')[1];

            if (date_range.includes(',')) {
                let start = parseInt(date_range.split(',')[0]);
                let end = parseInt(date_range.split(',')[1]);
                setDateRange([start, end]);
            }
        }

        if (document.location.search.includes('position=')) {

            let positionsearch = searchTerms.filter(term => term.includes('position='))[0];

            let position = positionsearch.split('=')[1];

            if (position.includes(',')) {
                let lat = parseFloat(position.split(',')[0]);
                let lon = parseFloat(position.split(',')[1]);
                findAddress([lat, lon]);
                setPosition([lat, lon]);
            }


        } else if (document.location.search.includes('city=')) {


            let citysearch = searchTerms.filter(term => term.includes('city='))[0];

            let city = citysearch.split('=')[1];

            city = city.replace('?city=', '').replaceAll('-', ' ');

            if (city == 'abomey calavi') city = 'abomey-calavi';
            if (city == 'mbuji mayi') city = 'mbuji-mayi';
            if (city == 'pointe noire') city = 'pointe-noire';
            if (city == 'cape town') city = 'cape-town';
            if (city == 'addis ababa') city = 'addis-ababa';
            if (city == 'dar es salaam') city = 'dar-es-salaam';
            if (city == 'port harcourt') city = 'port-harcourt';
            if (city == 'bobo dioulasso') city = 'bobo-dioulasso';
            if (city == 'west rand') city = 'west-rand';
            if (city == 'benin city') city = 'benin-city';

            setCity(city);
        } else {
            let randomCity = cities[Math.floor(Math.random() * cities.length)];
            setCity(randomCity.city.replaceAll(' ', '-').toLowerCase());

        }

    }, []);
    

    const getAnnualAvgTemperature = () => {
            
        let annualAvg = 0;

        datasets.data.forEach(record => {
            if(parseInt(record.year) == 2023) {
                annualAvg += parseFloat(record.TAVG_temperature);
            }
        });

        annualAvg = annualAvg / 12;

        return annualAvg;

    
    }

    const getAnnualPrecipitation = () => {

        let annualAvg = 0;

        datasets.data.forEach(record => {
            if(parseInt(record.year) == 2023) {
                annualAvg += parseFloat(record.precip);
            }
        });

        annualAvg = annualAvg / 12;

        return annualAvg;

    }

    async function downloadData(type,set,month = null) {

        if(type == 'png') {

            let svgContainer = document.getElementById(set);
            let svg = svgContainer.getElementsByTagName('svg')[0];

            html2canvas(svgContainer).then(canvas => {
                const link = document.createElement('a');
                link.download = set + '-' + position[0] + '-' + position[1] + '-' + dateRange[0] + '-' + dateRange[1] + '.png'; 
                link.href = canvas.toDataURL();
                link.click();
            });
           
        } else {

            let csvContent = "data:text/csv;charset=utf-8,";

            if(set == 'monthly-temperature') {
                csvContent += "Month,Year,Average Temperature,Historical Average,Max Temperature,Min Temperature,Historical Max,Historical Min\n";
                datasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number-1] + ',' + record.year + ',' + record.TAVG_temperature + ',' + record.TAVG_climatology + ',' + record.TMAX_temperature + ',' + record.TMIN_temperature + ',' + record.TMAX_climatology + ',' + record.TMIN_climatology + '\n';
                });
            } else if(set == 'monthly-temperature-anomaly') {
                csvContent += "Month,Year,Average Anomaly";
                datasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number-1] + ',' + record.year + ',' + record.TAVG_anomaly + '\n';
                });
            } else if(set == 'monthly-temperature-breakdown') {
                csvContent += "Month,Year,Average Temperature,Historical Average,Max Temperature,Min Temperature,Historical Max,Historical Min\n";
                datasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number-1] + ',' + record.year + ',' + record.TAVG_temperature + ',' + record.TAVG_climatology + ',' + record.TMAX_temperature + ',' + record.TMIN_temperature + ',' + record.TMAX_climatology + ',' + record.TMIN_climatology + '\n';
                });
                month = monthNames[month];
            } else if(set == 'monthly-precipitation') {
                csvContent += "Month,Year,Precipitation";
                datasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number-1] + ',' + record.year + ',' + record.precip + '\n';
                });
                month = monthNames[month];
            } else if(set == 'monthly-precipitation-breakdown') {
                csvContent += "Month,Year,Precipitation";
                datasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number-1] + ',' + record.year + ',' + record.precip + '\n';
                });
                month = monthNames[month];
            } else if(set == 'annual-temperature') {
                csvContent += "Year,Month,Average Temperature,Historical Average\n";
                datasets.data.forEach(record => {
                    csvContent += record.time + ',' + monthNames[record.month_number-1] + ',' + record.TAVG_temperature + ',' + record.TAVG_climatology + '\n';
                });
            } else if(set == 'annual-precipitation') {
                csvContent += "Year,Month,Precipitation,Historical Average\n";
                datasets.data.forEach(record => {
                    csvContent += record.year + ',' + monthNames[record.month_number-1] + ',' + record.precip + ',' + record.precip_hist + '\n';
                });
            }



            // save the csvContent to a file and download
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            
            

            if(city != 'location') {
                link.setAttribute("download", `${set}${month != null ? '-' + month : ''}.${city}.${dateRange[0]}-${dateRange[1]}.csv`);
            } else {
                link.setAttribute("download", `${set}${month != null ? '-' + month : ''}.${position[0]},${position[1]}.${dateRange[0]}-${dateRange[1]}.csv`);
            }
            document.body.appendChild(link); 
            link.click();
        }

        
    }

    
    

    useEffect(() => {

        if(datasets.data.length > 0) {
            setAnnualAvgTemperature(getAnnualAvgTemperature());
            setAnnualAvgPrecipitation(getAnnualPrecipitation());
        }


    }, [datasets]);

   


    useEffect(() => {
        if (city != '' && city != 'location') {
            let city_data = cities.filter(c => c.city.replaceAll(' ', '-').toLowerCase() == city)[0];

            if(city_data == undefined) {
                setCity('');
                return;
            }

            setCountry(city_data.iso_code);
            setPosition([city_data.lat, city_data.lon]);


            window.history.pushState(
                {}, 
                '', 
                `${window.location.pathname}?city=${city}`
            );
        }
    }, [city]);

    useEffect(() => {

        if(position.length > 0) {
            // getTempData();
            // getPrecipData();
            getAllData();
        }

    },[position, dateRange])


    useEffect(() => {
        // window.history.pushState(
        //     {}, 
        //     '', 
        //     window.location.pathname.includes('?') ? window.location.pathname + '&daterange=' + dateRange.join(',') : window.location.pathname + '?daterange=' + dateRange.join(',')
        // );
    }, [dateRange]);

    const values = {
        loading,
        cities,
        countries,
        convertCountry,
        dateRange,
        setDateRange,
        position,
        setPosition,
        city,
        setCity,
        country,
        setCountry,
        address,
        findAddress,
        changeDateRange,
        datasets,
        temperatureScale,
        getAnomalyColor,
        monthNames,
        annualAvgTemperature,
        annualAvgPrecipitation,
        maxPrecipitation,
        downloadData
    };

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    );
}