import { useEffect, useContext, useState } from "react";
import { AppContext } from './AppContext';

import Dropdown from 'react-bootstrap/Dropdown';
import { Icon } from '@mdi/react';
import { mdiShareVariant } from '@mdi/js';



export const SocialShare = () => {

    const { country, convertCountry, cities, city, address, extraLocation } = useContext(AppContext);


    const openSharing = (platform) => {

        let title = '';
        let description = "The Africa Data Hub Climate Observer is designed to help journalists and academics reporting and researching climate change in Africa.";

        if (city != '' && city != 'location') {
            title = cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city + ',' + convertCountry('iso3', country).location;
            description = "The Africa Data Hub Climate Observer is designed to help journalists and academics reporting and researching climate change in Africa and " + title + ".";
        } else if (address) {
            title = extraLocation != '' ? extraLocation : address + ',' + convertCountry('iso3', country).location;
            description = "The Africa Data Hub Climate Observer is designed to help journalists and academics reporting and researching climate change in Africa and " + title + ".";
        }

        if(platform == 'twitter') {
            const twitterIntentUrl = 'https://twitter.com/intent/tweet?' +
                'text=' + encodeURIComponent(title) +
                '&url=' + encodeURIComponent(document.URL) +
                '&via=Africa_DataHub' + 
                '&description=' + encodeURIComponent(description);
            window.open(twitterIntentUrl, '', 'width=600,height=800');
        }
        if(platform == 'facebook') {
            const facebookIntentUrl = 'https://www.facebook.com/sharer/sharer.php?' +
                'u=' + encodeURIComponent(document.URL) +
                '&quote=' + encodeURIComponent(title + '. ' + description) + 
                '&picture=' + encodeURIComponent("https://example.com/image.jpg"); 
            window.open(facebookIntentUrl, '', 'width=600,height=800');
        }
        if(platform == 'linkedin') {
            const linkedinIntentUrl = 'https://www.linkedin.com/shareArticle?' +
                'url=' + encodeURIComponent(document.URL) +
                '&title=' + encodeURIComponent(title) + 
                '&summary=' + encodeURIComponent(description)
            window.open(linkedinIntentUrl, '', 'width=600,height=800');
        }
    }

    return (
    <Dropdown className="social-share-btn">
        <Dropdown.Toggle>
            <Icon path={ mdiShareVariant } size={1} /> Share
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item onClick={() => openSharing('twitter')}>Twitter</Dropdown.Item>
        
            <Dropdown.Item onClick={() => openSharing('facebook')}>Facebook</Dropdown.Item>
    
            <Dropdown.Item onClick={() => openSharing('linkedin')}>LinkedIn</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>)


}

export default SocialShare;
