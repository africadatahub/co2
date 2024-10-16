import { useContext, useEffect } from 'react';
import { AppContext } from './AppContext';

import ReactCountryFlag from 'react-country-flag';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Placeholder from 'react-bootstrap/Placeholder';

import { Icon } from '@mdi/react';
import { mdiThermometer, mdiWeatherPouring, mdiFactory, mdiLandPlots } from '@mdi/js';

const LocationInfoPanel = () => {

    const { country, convertCountry, cities, city, address, extraLocation, position, annualAvgTemperature, annualAvgPrecipitation, annualAvgAQ, loading, airQualityScale } = useContext(AppContext);

    
    return (
        <>
            
            {

            loading ?     
                <h2><Placeholder style={{width: '100px'}} /></h2>
            :
            (city != '' && city != 'location') ? 
                <h2><div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3', country).iso2} svg /></div><span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }, {convertCountry('iso3', country).location}</span></h2> : 
            address ?
                <h2><div className="country-flag-circle"><ReactCountryFlag countryCode={convertCountry('iso3', country).iso2} svg /></div><span>{extraLocation != '' ? extraLocation : address}</span>, <span>{convertCountry('iso3', country).location}</span></h2> : ''
            }

            

            {

            loading ?     
                <h5 className="mt-4"><Placeholder style={{width: '100px'}} /></h5>
            :
            (city != '' && city != 'location') ? 
            <h5 className="mt-4">Summary of the latest year's (2023) data for { city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }, {convertCountry('iso3', country).location}</h5> : 
            address ?
            <h5 className="mt-4">Summary of the latest year's (2023) data for {extraLocation != '' ? extraLocation : address}, {convertCountry('iso3', country).location}</h5> : ''
            }
            
            

            

            <div className="country-snapshot mt-4">
                <Row className="mb-3">
                    <Col><Icon path={mdiThermometer} size={1} /> Average monthly <a href="#temperature">temperature</a>:</Col>
                    <Col xs="auto">
                        {loading ? <Placeholder style={{width: '50px'}} /> : (annualAvgTemperature == null ? '-' : annualAvgTemperature.toFixed(2) + '°C')}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col><Icon path={mdiWeatherPouring} size={1} /> Total <a href="#rainfall">rainfall</a> in last 12 months:</Col>
                    <Col xs="auto">
                        {loading ? <Placeholder style={{width: '50px'}} /> : (annualAvgPrecipitation == null ? '-' : annualAvgPrecipitation.toFixed(2) + 'mm')}
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col><Icon path={mdiFactory} size={1} /> Average <a href="#airquality">air quality</a> in last 12 months:</Col>
                    <Col xs="auto">
                        {loading ? <Placeholder style={{width: '50px'}} /> : (annualAvgAQ == null ? '-' : airQualityScale.find(aq => aq.min <= annualAvgAQ && aq.max >= annualAvgAQ)?.quality)}
                    </Col>
                </Row>
            </div>

            

            
            
        </>
    )
}

export default LocationInfoPanel;