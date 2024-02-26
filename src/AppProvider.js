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
    const [dateRange, setDateRange] = useState([1993, 2022]);
	const [position, setPosition] = useState([]);
    const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
    const [datasets, setDatasets] = useState(
        {
            locations: '9d764714-2094-4455-8754-63b87d1fdce0',
            max_climatology: '45a41685-5be5-4da1-ac97-1c9bb74eacf1',
            max_temperature: 'c13119ab-750a-4c18-a146-8e9a477088fc',
            avg_climatology: 'bae363f7-1318-43d8-9d96-dc4aac27fc7b',
            avg_temperature: '66da171e-be57-4f16-aee2-0d86a6b69dd5',
            min_climatology: '1aba7d74-20a5-4d95-9d09-795fa0f6bf41',
            min_temperature: '036d381a-911d-4f6a-8964-920646bbe557',
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
    const [precipDatasets, setPrecipDatasets] = useState(
        {
            gpcc_precipitation: '21f718cd-e079-4dee-a353-7dafa811c008',
            // gpcc_precipitation: '40034efe-ffa7-4094-9c33-991e2b5f6ce0',
            gpcc_precipitation_avg: 'b159ff95-c3d0-461d-a95f-0afd5d2c20ed',
            data: []
        }
    );
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

    

    convertCountry = (type, value) => {

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

    

    async function getTempData() {

        setLoading(true);

        const promiseArr = [];

        ['avg_temperature', 'avg_climatology', 'max_temperature', 'max_climatology', 'min_temperature', 'min_climatology'].forEach(dataset => {

            let ds = datasets[dataset];

            
            
            promiseArr.push(
            axios.get('https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"' + ds + '"%20WHERE%20latitude%20%3E%3D%20' + (parseFloat(position[0]) - 0.5) + '%20AND%20latitude%20%3C%3D%20' + (parseFloat(position[0]) + 0.5) + '%20AND%20longitude%20%3E%3D%20' + (parseFloat(position[1]) - 0.5) + '%20AND%20longitude%20%3C%3D%20' + (parseFloat(position[1]) + 0.5) + '%20AND%20time%20%3E%3D%20' + dateRange[0] + '%20AND%20time%20%3C%3D%20' + (dateRange[1] + 1) + '%20', {
                headers: {
                    "Authorization": process.env.CKAN
                }
            })
                .then(response => {
                    let data = response.data.result.records;


                    if (['max_temperature', 'avg_temperature', 'min_temperature'].includes(dataset)) {

                        data.forEach(record => {

                            let date = record.time.split('.');

                            if(date[1] == '0416666666663') {
                                date[1] = 0;
                            } else if(date[1] == '125') {
                                date[1] = 1;
                            } else if(date[1] == '2083333333333') {
                                date[1] = 2;
                            } else if(date[1] == '2916666666663') {
                                date[1] = 3;
                            } else if(date[1] == '375') {
                                date[1] = 4;
                            } else if(date[1] == '4583333333333') {
                                date[1] = 5;
                            } else if(date[1] == '5416666666663') {
                                date[1] = 6;
                            } else if(date[1] == '625') {
                                date[1] = 7;
                            } else if(date[1] == '7083333333333') {
                                date[1] = 8;
                            } else if(date[1] == '7916666666663') {
                                date[1] = 9;
                            } else if(date[1] == '875') {
                                date[1] = 10;
                            } else if(date[1] == '9583333333333') {
                                date[1] = 11;
                            }

                            record.month_number = date[1];
                            record.time = date[0];
                            record.date = (record.month_number + 1) + '/' + record.time;

                        });
                    } else {
                        data.forEach(record => {
                            record.date = (record.month_number + 1) + '/' + record.time;
                        })
                    }

                    
                   
                    return data;


                })
                .catch(e => console.log(e))
            );

        });
        
        const [
            avgTemperatureResponse,
            avgClimatologyResponse,
            maxTemperatureResponse,   
            maxClimatologyResponse, 
            minTemperatureResponse,
            minClimatologyResponse 
        ] = await Promise.all(promiseArr);

        const avgTemperatureData = await avgTemperatureResponse || [];
        const avgClimatologyData = await avgClimatologyResponse || [];
        const maxTemperatureData = await maxTemperatureResponse || [];
        const maxClimatologyData = await maxClimatologyResponse || [];
        const minTemperatureData = await minTemperatureResponse || [];
        const minClimatologyData = await minClimatologyResponse || [];

        

        avgTemperatureData.forEach(avgt => {

            avgt.avg_anomaly = parseFloat(avgt.temperature);
            avgt.avg_climatology = mergeClimateData(avgt, avgClimatologyData, 'climatology');
            avgt.max_climatology = mergeClimateData(avgt, maxClimatologyData, 'climatology');
            avgt.min_climatology = mergeClimateData(avgt, minClimatologyData, 'climatology');

            avgt.max_anomaly = mergeClimateData(avgt, maxTemperatureData, 'temperature');
            avgt.min_anomaly = mergeClimateData(avgt, minTemperatureData, 'temperature');

            
            
        });
        
        // sort by time and month_number
        avgTemperatureData.sort((a, b) => {

            const aTime = parseInt(a.time);
            const bTime = parseInt(b.time);
          
            const aMonth = parseInt(a.month_number); 
            const bMonth = parseInt(b.month_number);
          
            if(aTime < bTime) return -1;
            if(aTime > bTime) return 1;
            
            if(aMonth < bMonth) return -1; 
            if(aMonth > bMonth) return 1;
          
            return 0;
          
        });

        avgTemperatureData.forEach(avgt => {
            avgt.avg_temperature = avgt.avg_anomaly + avgt.avg_climatology;
            avgt.max_temperature = avgt.max_anomaly + avgt.max_climatology;
            
            avgt.min_temperature = avgt.min_anomaly + avgt.min_climatology;
            avgt.maxmin_temperature = [avgt.max_temperature, avgt.min_temperature];
        });

        setDatasets({...datasets, data: avgTemperatureData});
        setLoading(false);

    }

    async function getPrecipData() {

        let min = 0;
        let max = 0;

        try {
      
          setLoading(true);
      
          const precipDataPromise = axios.get('https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"' + precipDatasets.gpcc_precipitation + '"%20WHERE%20latitude%20%3E%3D%20' + (parseFloat(position[0]) - 0.5) + '%20AND%20latitude%20%3C%3D%20' + (parseFloat(position[0]) + 0.5) + '%20AND%20longitude%20%3E%3D%20' + (parseFloat(position[1]) - 0.5) + '%20AND%20longitude%20%3C%3D%20' + (parseFloat(position[1]) + 0.5) + '%20AND%20year%20%3E%3D%20' + dateRange[0] + '%20AND%20year%20%3C%3D%20' + (dateRange[1] + 1) + '%20', {
            headers: {
                "Authorization": process.env.CKAN
            }
        });
          const avgDataPromise = axios.get('https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"' + precipDatasets.gpcc_precipitation_avg + '"%20WHERE%20latitude%20%3E%3D%20' + (parseFloat(position[0]) - 0.5) + '%20AND%20latitude%20%3C%3D%20' + (parseFloat(position[0]) + 0.5) + '%20AND%20longitude%20%3E%3D%20' + (parseFloat(position[1]) - 0.5) + '%20AND%20longitude%20%3C%3D%20' + (parseFloat(position[1]) + 0.5) + '%20', {
            headers: {
                "Authorization": process.env.CKAN
            }
        });
          
          const [precipResponse, avgResponse] = await Promise.all([
            precipDataPromise, avgDataPromise
          ]);
      
          let precipData = precipResponse.data.result; 
          let avgData = avgResponse.data.result;

          console.log(precipData, avgData);
      
          // Throw error if data is unexpected format
          if(!precipData.records || !avgData.records) {
            throw new Error('Unexpected data format');
          }
      
          // Sort precipitation data
          precipData.records.sort((a, b) => {
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
      
          // Loop through precip data and find avg
          precipData.records.forEach(record => {
      
            const avg = avgData.records.find(r => r.month_number === record.month_number);

            if(parseFloat(record.precip) > max) {
                max = record.precip;
            }
      
            if(avg) {
                record.precip = parseFloat(record.precip);
              record.precip_avg = parseFloat(avg.precip);
              record.precip_scale = (parseFloat(record.precip) - min) / (max - min);  
            }
      
          });

          setPrecipDatasets({
            ...precipDatasets, 
            data: precipData.records 
          });
      
          setMaxPrecipitation(max);
          setLoading(false);
      
        } catch (error) {
          console.error(error);
          setLoading(false);
        }
      
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
            if(record.time == '2021') {
                annualAvg += parseFloat(record.avg_temperature);
            }
        });

        annualAvg = annualAvg / 12;

        return annualAvg;

    
    }

    const getAnnualPrecipitation = () => {

        let annualAvg = 0;

        precipDatasets.data.forEach(record => {
            if(record.year == 2020) {
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
                    csvContent += monthNames[record.month_number] + ',' + record.time + ',' + record.avg_temperature + ',' + record.avg_climatology + ',' + record.max_temperature + ',' + record.min_temperature + ',' + record.max_climatology + ',' + record.min_climatology + '\n';
                });
            } else if(set == 'monthly-temperature-anomaly') {
                csvContent += "Month,Year,Average Anomaly";
                datasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number] + ',' + record.time + ',' + record.avg_anomaly + '\n';
                });
            } else if(set == 'monthly-temperature-breakdown') {
                csvContent += "Month,Year,Average Temperature,Historical Average,Max Temperature,Min Temperature,Historical Max,Historical Min\n";
                datasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number] + ',' + record.time + ',' + record.avg_temperature + ',' + record.avg_climatology + ',' + record.max_temperature + ',' + record.min_temperature + ',' + record.max_climatology + ',' + record.min_climatology + '\n';
                });
                month = monthNames[month];
            } else if(set == 'monthly-precipitation') {
                csvContent += "Month,Year,Precipitation";
                precipDatasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number-1] + ',' + record.year + ',' + record.precip + '\n';
                });
                month = monthNames[month];
            } else if(set == 'monthly-precipitation-breakdown') {
                csvContent += "Month,Year,Precipitation";
                precipDatasets.data.forEach(record => {
                    csvContent += monthNames[record.month_number-1] + ',' + record.year + ',' + record.precip + '\n';
                });
                month = monthNames[month];
            } else if(set == 'annual-temperature') {
                csvContent += "Year,Month,Average Temperature,Historical Average\n";
                datasets.data.forEach(record => {
                    csvContent += record.time + ',' + monthNames[record.month_number] + ',' + record.avg_temperature + ',' + record.avg_climatology + '\n';
                });
            } else if(set == 'annual-precipitation') {
                csvContent += "Year,Month,Precipitation,Historical Average\n";
                precipDatasets.data.forEach(record => {
                    csvContent += record.year + ',' + monthNames[record.month_number-1] + ',' + record.precip + ',' + record.precip_avg + '\n';
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
        }


    }, [datasets]);

    useEffect(() => {

        if(precipDatasets.data.length > 0) {
            setAnnualAvgPrecipitation(getAnnualPrecipitation());
        }

    }, [precipDatasets]);


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
            getTempData();
            getPrecipData();
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
        precipDatasets,
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