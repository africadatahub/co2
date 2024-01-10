import React from 'react';
import getCountryISO2 from 'country-iso-3-to-2';
import ReactCountryFlag from 'react-country-flag';


const LocationInfoPanel = ({ cities, city, position, country, address }) => {

    return (
        <>
            <h2>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }</h2>
            <br />
            
            <p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. 
            </p>

            <h5>Summary of the latest year's (2023) data:</h5>




            
            {
            country ? 
                <><ReactCountryFlag countryCode={getCountryISO2(country)} svg /><span>{country}</span></> : 
            address ?
                <><ReactCountryFlag style={{position: 'relative', top: '-1px'}} countryCode={address.address.country_code} svg /><span>{address.address.country}</span></> : ''
            }
        </>
    )
}

export default LocationInfoPanel;