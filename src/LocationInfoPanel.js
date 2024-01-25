import { useContext } from 'react';
import { AppContext } from './AppContext';

import getCountryISO2 from 'country-iso-3-to-2';
import ReactCountryFlag from 'react-country-flag';


const LocationInfoPanel = () => {

    const { cities, city, country, address } = useContext(AppContext);


    return (
        <>
            
            {
            country ? 
                <h2><ReactCountryFlag countryCode={getCountryISO2(country)} svg /><span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' },{country}</span></h2> : 
            address ?
                <h2><ReactCountryFlag style={{position: 'relative', top: '-1px'}} countryCode={address.address.country_code} svg /><span>{ city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : '' }, {address.address.country}</span></h2> : ''
            }

            <br />
            
            <p>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. 
            </p>

            <h5>Summary of the latest year's (2023) data:</h5>




            
            
        </>
    )
}

export default LocationInfoPanel;