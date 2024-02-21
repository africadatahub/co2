import { useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

import ReactCountryFlag from 'react-country-flag';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Placeholder from 'react-bootstrap/Placeholder';

import { Icon } from '@mdi/react';
import { mdiThermometer, mdiWeatherPouring, mdiFactory, mdiLandPlots } from '@mdi/js';

const LocationInfoPanel = () => {

    const { country, convertCountry, cities, city, address, annualAvgTemperature, annualAvgPrecipitation, loading } = useContext(AppContext);

    
    return (
        <>
            
            {

            loading ?     
                <h2><Placeholder style={{width: '100px'}} /></h2>
            :
            (city != '' && city != 'location') ? 
                <h2><div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3', country).iso2} svg /></div><span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }, {convertCountry('iso3', country).location}</span></h2> : 
            address ?
                <h2><div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3', country).iso2} svg /></div><span>{address}</span>, <span>{convertCountry('iso3', country).location}</span></h2> : ''
            }

            <br />
            
            

            <h5 className="mt-5">Summary of the latest year's (2023) data:</h5>

            <div className="country-snapshot mt-4">
                <Row className="mb-3">
                    <Col><Icon path={mdiThermometer} size={1} /> Average annual <a href="#temperature">temperature</a>:</Col>
                    <Col xs="auto">
                        {loading ? <Placeholder style={{width: '50px'}} /> : (annualAvgTemperature == null ? '-' : annualAvgTemperature.toFixed(2) + '°C')}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col><Icon path={mdiWeatherPouring} size={1} /> Average annual <a href="#rainfall">rainfall</a>:</Col>
                    <Col xs="auto">
                        {loading ? <Placeholder style={{width: '50px'}} /> : (annualAvgPrecipitation == null ? '-' : annualAvgPrecipitation.toFixed(2) + 'mm')}
                    </Col>
                </Row>
                {/* <Row className="mb-3" style={{opacity: 0.4}}>
                    <Col><Icon path={mdiFactory} size={1} /> Annual CO<sub>2</sub> <a href="#emissions">emissions</a>:</Col>
                    <Col xs="auto">-Gt</Col>
                </Row> */}
            </div>


            
            
        </>
    )
}

export default LocationInfoPanel;