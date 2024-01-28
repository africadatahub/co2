import { useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

import getCountryISO2 from 'country-iso-3-to-2';
import ReactCountryFlag from 'react-country-flag';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { Icon } from '@mdi/react';
import { mdiThermometer, mdiWeatherPouring, mdiFactory, mdiLandPlots } from '@mdi/js';

const LocationInfoPanel = () => {

    const { cities, city, country, address, annualAvgTemperature, annualAvgPrecipitation } = useContext(AppContext);

    
    return (
        <>
            
            {
            country ? 
                <h2><div className="country-flag-circle"><ReactCountryFlag countryCode={getCountryISO2(country)} svg /></div><span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' },{country}</span></h2> : 
            address ?
                <h2><div className="country-flag-circle"><ReactCountryFlag style={{position: 'relative', top: '-1px'}} countryCode={address.address.country_code} svg /></div><span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }, {address.address.country}</span></h2> : ''
            }

            <br />
            
            <p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. 
            </p>

            <h5 className="mt-5">Summary of the latest year's (2023) data:</h5>

            <div className="country-snapshot mt-4">
                <Row className="mb-3">
                    <Col><Icon path={mdiThermometer} size={1} /> Average annual <a href="#temperature">temperature</a>:</Col>
                    <Col xs="auto">{annualAvgTemperature == null ? '-' : annualAvgTemperature.toFixed(2)}&deg;</Col>
                </Row>
                <Row className="mb-3">
                    <Col><Icon path={mdiWeatherPouring} size={1} /> Average annual <a href="#rainfall">rainfall</a>:</Col>
                    <Col xs="auto">{annualAvgPrecipitation == null ? '-' : annualAvgPrecipitation.toFixed(2)}mm</Col>
                </Row>
                <Row className="mb-3" style={{opacity: 0.4}}>
                    <Col><Icon path={mdiFactory} size={1} /> Annual CO<sub>2</sub> <a href="#emissions">emissions</a>:</Col>
                    <Col xs="auto">-Gt</Col>
                </Row>
            </div>


            
            
        </>
    )
}

export default LocationInfoPanel;