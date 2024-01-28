import { useState, useEffect } from 'react';
import { AppContext } from './AppContext';

import axios from 'axios';

import * as cities from './data/cities.json';
import * as countries from './data/countries.json';

export const AppProvider = ({ children }) => {

    const [dateRange, setDateRange] = useState([2012, 2022]);
	const [position, setPosition] = useState([-1.2920659, 36.8219462]);
	const [city, setCity] = useState('');
	const [country, setCountry] = useState('');
	const [address, setAddress] = useState('');
	const [interacted, setInteracted] = useState(false);
    const [datasets, setDatasets] = useState(
        {
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
            gpcc_precipitation: 'f308c5a0-d590-49c8-b673-ad8a5bb489f2',
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


    const changeDateRange = (type, value) => {

        const params = new URLSearchParams(window.location.search);
  
        
        if(params.get('daterange') == null) {
            params.set('daterange', `${dateRange[0]},${dateRange[1]}`);
        } else {
        
            if(type === 'start') {
                params.set('daterange', `${value},${params.get('daterange').split(',')[1]}`); 
            } else {
                params.set('daterange', `${params.get('daterange').split(',')[0]},${value}`);
            }

        }

        // history.push({ 
        //     pathname: window.location.pathname,
        //     search: params.toString()
        // });

        let search = params.toString();

        const newSearch = search.replace(/%2C/g, ',');

        window.location.search = newSearch;

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

        const promiseArr = [];

        ['avg_temperature', 'avg_climatology', 'max_temperature', 'max_climatology', 'min_temperature', 'min_climatology'].forEach(dataset => {

            let ds = datasets[dataset];
            
            promiseArr.push(
            axios.get('https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"' + ds + '"%20WHERE%20latitude%20%3E%3D%20' + (position[0] - 0.5) + '%20AND%20latitude%20%3C%3D%20' + (position[0] + 0.5) + '%20AND%20longitude%20%3E%3D%20' + (position[1] - 0.5) + '%20AND%20longitude%20%3C%3D%20' + (position[1] + 0.5) + '%20AND%20time%20%3E%3D%20' + dateRange[0] + '%20AND%20time%20%3C%3D%20' + (dateRange[1] + 1) + '%20', {
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

        const avgTemperatureData = await avgTemperatureResponse;
        const avgClimatologyData = await avgClimatologyResponse;
        const maxTemperatureData = await maxTemperatureResponse;
        const maxClimatologyData = await maxClimatologyResponse;
        const minTemperatureData = await minTemperatureResponse;
        const minClimatologyData = await minClimatologyResponse;

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

    }

    async function getPrecipData() {

        const promiseArr = [];

        let min = 0;
        let max = 0;

        ['gpcc_precipitation', 'gpcc_precipitation_avg'].forEach(dataset => {

            let ds = precipDatasets[dataset];

            let query = dataset == 'gpcc_precipitation' ? 'https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"' + ds + '"%20WHERE%20latitude%20%3E%3D%20' + (position[0] - 0.5) + '%20AND%20latitude%20%3C%3D%20' + (position[0] + 0.5) + '%20AND%20longitude%20%3E%3D%20' + (position[1] - 0.5) + '%20AND%20longitude%20%3C%3D%20' + (position[1] + 0.5) + '%20AND%20year%20%3E%3D%20' + dateRange[0] + '%20AND%20year%20%3C%3D%20' + (dateRange[1] + 1) + '%20' : 'https://ckandev.africadatahub.org/api/3/action/datastore_search_sql?sql=SELECT%20*%20from%20"' + ds + '"%20WHERE%20latitude%20%3E%3D%20' + (position[0] - 0.5) + '%20AND%20latitude%20%3C%3D%20' + (position[0] + 0.5) + '%20AND%20longitude%20%3E%3D%20' + (position[1] - 0.5) + '%20AND%20longitude%20%3C%3D%20' + (position[1] + 0.5) + '%20'
            
            promiseArr.push(
            axios.get(query, {
                headers: {
                    "Authorization": process.env.CKAN
                }
            })
                .then(response => {
                    let data = response.data.result.records;
                    
                    data.forEach(record => {
                        if(record.precip > max) max = record.precip;
                    });
                    
                    data.forEach(record => {
                        record.year = parseInt(record.year);
                        record.precip = parseFloat(record.precip);
                        record.month_number = parseInt(record.month_number);
                        record.precip_scale = (record.precip - min) / (max - min);
                    })

                    // sort data by year and then month
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
                    
                    return data;


                })
                .catch(e => console.log(e))
            );

        });

        const [
            gpccPrecipitationResponse,
            gpccPrecipitationAverageResponse,
        ] = await Promise.all(promiseArr);

        const gpccPrecipitationData = await gpccPrecipitationResponse;
        const gpccPrecipitationAverageData = await gpccPrecipitationAverageResponse;

        gpccPrecipitationData.forEach(record => {
                
            let avg = gpccPrecipitationAverageData.find(r => r.month_number == record.month_number);

            if(avg == undefined) {
                record.precip_avg = null;
            } else {
                record.precip_avg = avg.precip;
            }
                
        });


        setPrecipDatasets({...precipDatasets, data: gpccPrecipitationData});
        setMaxPrecipitation(max);
        
    }

  

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
                setPosition([lat, lon]);
                setInteracted(true);
            }

            let place = positionsearch.split('position=')[1];

            // TODO: position can be a string so we need to check if it's a string or a latlng
            // if it's a string, we need to get the latlng from the string

            axios.get(`https://nominatim.openstreetmap.org/search?q=${place}&format=json&polygon=1&addressdetails=1`)
                .then(function (response) {
                    setAddress(response.data[0]);
                    setCity('location');
                })


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
            setInteracted(true);
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
            
            
        }
    }, [city]);

    useEffect(() => {
        getTempData();
        getPrecipData();

    },[position])
    

    const values = {
        cities,
        countries,
        dateRange,
        setDateRange,
        position,
        setPosition,
        city,
        setCity,
        country,
        setCountry,
        address,
        setAddress,
        interacted,
        setInteracted,
        changeDateRange,
        datasets,
        precipDatasets,
        temperatureScale,
        getAnomalyColor,
        monthNames,
        annualAvgTemperature,
        annualAvgPrecipitation,
        maxPrecipitation
    };

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    );
}