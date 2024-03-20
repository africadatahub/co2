import { useEffect, useContext, useState, useRef } from 'react';
import { AppContext } from './AppContext';


import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import axios from 'axios';
import getCountryISO2 from 'country-iso-3-to-2';




const LocationBar = () => {

    const { cities, countries, city, setCity, address, findAddress, extraLocation, setExtraLocation, position, setPosition } = useContext(AppContext);

    const [searchResults, setSearchResults] = useState([]);

    const searchRef = useRef(null);


    useEffect(() => {
        if(address != '' && address != undefined) {
            searchRef.current.value = address.display_name;
        }
    }, [address]);
  

    const addressLookup = (e) => {

        let timeout;

        let results = [];


        if (e.length > 3) {
            // Throttle the number of requests sent
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => {
                timeout = null;

                axios.get(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&polygon=1&addressdetails=1&countrycodes=${countries.map(country => getCountryISO2(country.iso3)).join(',')}`)
                .then(function (response) {

                    response.data.forEach(result => {
                        results.push({
                            place_id: result.place_id,
                            display_name: result.display_name,
                            lat: result.lat,
                            lon: result.lon
                        })
                    })

                    setSearchResults(results);
                
                }, 1000);
            })
        
        }

    }

    const useLocation = () => {
        if (window.navigator.geolocation) {
            window.navigator.geolocation.getCurrentPosition((position) => {
                changeLocation('position', [position.coords.latitude,position.coords.longitude]);
            })
        }
    }

    const changeLocation = (type, value, extra) => {

        setExtraLocation('');

        if(value != 'location' && value != '') {
            if(type == 'city') {
                searchRef.current.value = '';
                setCity(value);
            } else {
                window.history.pushState(
                    {}, 
                    '', 
                    window.location.pathname + '?position=' + value.join(',')
                );
                searchRef.current.value = '';
                setCity('location');
                if(extra == undefined || extra == '') {
                    findAddress(value);
                } else {
                    findAddress(value, extra);
                }
            }
        }
        searchRef.current.value = '';
        setSearchResults([]);
    }

   


    return (
        <Row>
            <Col>
                <h1 className="text-nowrap"><a href="/data-resources/climate-observer" className="text-decoration-none">African Climate Observer</a></h1>
            </Col>
            <Col xs={1}></Col>
            <Col>
                <Row>
                    <Col xs="auto">
                        <Form.Label column sm="auto" className="mt-1">Select city</Form.Label>
                    </Col>
                    <Col>
                        <Form.Select onChange={(e) =>changeLocation('city', e.target.value)} value={city} className="py-2">
                            <option value=''>Choose a city</option>
                            {
                                // cities sort
                                cities.sort((a, b) => {
                                    if(a.city > b.city) return 1;
                                    if(a.city < b.city) return -1;
                                    return 0;
                                }).map(cty => {
                                    return <option key={cty.city.replaceAll(' ','-').toLowerCase()} value={cty.city.replaceAll(' ','-').toLowerCase()}>{cty.city}</option>
                                })
                            }
                            <option hidden value="location">Custom Location</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Col>
            <Col>
                <div className="position-relative">
                    <Form.Control id="searchRef" className="py-2" type="text" placeholder="Search for a specific location" onChange={(e) => addressLookup(e.target.value) ? addressLookup(e.target.value) : ''} ref={searchRef} />
                    <div className="search-results">
                        <ul>
                            {
                                searchResults.map(result => {
                                    return <li key={result.place_id} onClick={() => changeLocation('position', [result.lat, result.lon], result.display_name)}>{result.display_name}</li>
                                })
                            }
                        </ul>
                    </div>
                </div>
            </Col>
            <Col xs="auto">
                <Button variant="primary" onClick={() => useLocation()}>Use Current Location</Button>
            </Col>
        </Row>
    )
}

export default LocationBar;