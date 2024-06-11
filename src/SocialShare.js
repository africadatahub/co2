import { useEffect, useContext, useState } from "react";
import { AppContext } from './AppContext';

import Dropdown from 'react-bootstrap/Dropdown';
import Toast from 'react-bootstrap/Toast';
import ToastContainer from 'react-bootstrap/ToastContainer';


import { Icon } from '@mdi/react';
import { mdiShareVariant, mdiContentPaste } from '@mdi/js';



export const SocialShare = (props) => {

    const { country, convertCountry, cities, city, address, extraLocation } = useContext(AppContext);
    const [showToast, setShowToast] = useState(false);


    const openSharing = (platform) => {

        let url = document.URL;

        if(props.chart != undefined) {

            // if url already has a hash, remove it and everything after it
            if(url.includes('#')) {
                url = url.substring(0, url.indexOf('#'));
            }
            url = url + '#' + props.chart;
        }

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
                '&url=' + encodeURIComponent(url) +
                '&via=Africa_DataHub' + 
                '&description=' + encodeURIComponent(description);
            window.open(twitterIntentUrl, '', 'width=600,height=800');
        }
        if(platform == 'facebook') {
            const facebookIntentUrl = 'https://www.facebook.com/sharer/sharer.php?' +
                'u=' + encodeURIComponent(url) +
                '&quote=' + encodeURIComponent(title + '. ' + description) + 
                '&picture=' + encodeURIComponent("https://example.com/image.jpg"); 
            window.open(facebookIntentUrl, '', 'width=600,height=800');
        }
        if(platform == 'linkedin') {
            const linkedinIntentUrl = 'https://www.linkedin.com/shareArticle?' +
                'url=' + encodeURIComponent(url) +
                '&title=' + encodeURIComponent(title) + 
                '&summary=' + encodeURIComponent(description)
            window.open(linkedinIntentUrl, '', 'width=600,height=800');
        }

        if(platform == 'copylink') {
            navigator.clipboard.writeText(url);
            setShowToast(true);

        }
    }

    return (
    <>
    <Dropdown className="social-share-btn">
        <Dropdown.Toggle>
            <Icon path={ mdiShareVariant } size={1} /> Share
        </Dropdown.Toggle>

        <Dropdown.Menu>
            <Dropdown.Item onClick={() => openSharing('twitter')}>Twitter</Dropdown.Item>
        
            <Dropdown.Item onClick={() => openSharing('facebook')}>Facebook</Dropdown.Item>
    
            <Dropdown.Item onClick={() => openSharing('linkedin')}>LinkedIn</Dropdown.Item>

            <Dropdown.Item onClick={() => openSharing('copylink')}>Copy Link</Dropdown.Item>
        </Dropdown.Menu>
    </Dropdown>
    <ToastContainer position="top-center" className="p-3 position-fixed" style={{ zIndex: 9999 }}>
        <Toast onClose={() => setShowToast(false)} show={showToast} delay={3000} autohide style={{backgroundColor: 'rgb(17, 65, 81)'}}>
            <Toast.Body className="fw-bold text-white"><Icon path={ mdiContentPaste } size={1} /> Link copied to clipboard</Toast.Body>
        </Toast>
    </ToastContainer>
    </>
    )


}

export default SocialShare;
