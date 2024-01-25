import { useState, useEffect } from 'react';
import { AppContext } from './AppContext';

import axios from 'axios';

import * as cities from './data/cities.json';
import * as countries from './data/countries.json';

export const AppProvider = ({ children }) => {

    const [dateRange, setDateRange] = useState([2018, 2022]);
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


    changeDateRange = (type, value) => {

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

    mergeClimateData = (baseset, temperatures, indicator) => {

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
        datasets
    };

    return (
        <AppContext.Provider value={values}>
            {children}
        </AppContext.Provider>
    );
}