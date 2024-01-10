import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import axios from 'axios';
import getCountryISO2 from 'country-iso-3-to-2';







const LocationBar = ({countries, cities, city, position, address}) => {

    const [searchResults, setSearchResults] = React.useState([]);

    const searchRef = React.useRef(null);


    React.useEffect(() => {
        if(address != '' && address != undefined) {
            searchRef.current.value = address;
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

                axios.get(`https://nominatim.openstreetmap.org/search?q=${e}&format=json&polygon=1&addressdetails=1&countrycodes=${countries.map(country => getCountryISO2(country.iso_code)).join(',')}`)
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

    const changeLocation = (type, value) => {
        if(value != 'location') {
            if(type == 'city') {
                document.location.search = '?city=' + value;
            } else {
                document.location.search = '?position=' + value.join(',');
            }
        }
    }

   


    return (
        <Row>
            <Col>
                <h1 className="text-nowrap"><a href="/" className="text-decoration-none">African Climate Observer</a></h1>
            </Col>
            <Col xs={1}></Col>
            <Col>
                <Row>
                    <Col xs="auto">
                        <Form.Label column sm="auto" className="mt-1">Select city</Form.Label>
                    </Col>
                    <Col>
                        <Form.Select onChange={(e) =>changeLocation('city', e.target.value)} value={city} className="py-2">
                            <option>Choose a city</option>
                            {
                                // cities sort
                                cities.sort((a, b) => {
                                    if(a.city > b.city) return 1;
                                    if(a.city < b.city) return -1;
                                    return 0;
                                }).map(cty => {
                                    return <option key={cty.city.replace(' ','-').toLowerCase()} value={cty.city.replace(' ','-').toLowerCase()}>{cty.city}</option>
                                })
                            }
                            <option hidden value="location">Custom Location</option>
                        </Form.Select>
                    </Col>
                </Row>
            </Col>
            <Col>
                <div className="position-relative">
                    <Form.Control className="py-2" type="text" placeholder="Search for a specific location" onChange={(e) => addressLookup(e.target.value)} ref={searchRef}/>
                    <div className="search-results">
                        <ul>
                            {
                                searchResults.map(result => {
                                    return <li key={result.place_id} onClick={() => changeLocation('position', [result.lat, result.lon])}>{result.display_name}</li>
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