import { useState, useEffect, useContext } from 'react';

import { AppContext } from './AppContext';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Accordion from 'react-bootstrap/Accordion';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionButton } from 'react-bootstrap/AccordionButton';
import Card from 'react-bootstrap/Card';
import Navbar from 'react-bootstrap/Navbar';

import { Icon } from '@mdi/react';
import { mdiThermometer, mdiWeatherPouring, mdiFactory, mdiLandPlots } from '@mdi/js';

import LocationBar from './LocationBar';
import Navigator from './Navigator';
import LocationInfoPanel from './LocationInfoPanel';

// TEMPERATURE
import TEMPMonthlyAverageChart from './TEMPMonthlyAverageChart';
import TEMPMonthlyBreakdownChart from './TEMPMonthlyBreakdownChart';
import TEMPAnnualTable from './TEMPAnnualTable';
import TEMPAnomalyChart from './TEMPAnomalyChart';

// RAINFALL
import PRECIPMonthlyChart from './PRECIPMonthlyChart';
import PRECIPMonthlyBreakdownChart from './PRECIPMonthlyBreakdownChart';
import PRECIPAnnualTable from './PRECIPAnnualTable';

// AIRE QUALITY
import AQMonthlyChart from './AQMonthlyChart';
import AQChart from './AQChart';
import AQMap from './AQMap';


import SocialShare from './SocialShare';


import './app.scss';

const Co2 = () => {

    const { cities, city, country, convertCountry, address, dateRange, changeDateRange, airQuality } = useContext(AppContext);


    useEffect(() => {
        const navbar = document.querySelector('.navbar');

        const handleScroll = () => {

            const navbarTop = navbar.getBoundingClientRect().top;

            if (navbarTop < 0) {
                navbar.classList.add('sticking');
            } else {
                navbar.classList.remove('sticking');
            }
           
        }

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, []);



    const ContextAwareToggle = ({ children, eventKey, callback }) => {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey),
        );

        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <Row onClick={decoratedOnClick}>
                <Col>
                    {children}
                </Col>
                <Col xs="auto">
                    {
                        isCurrentEventKey ? '-' : '+'
                    }
                </Col>
            </Row>
        );
    }

    

    return (
        <>  
            <Container className="py-4">

                <LocationBar />

                <div className="my-5">
                    <Row>
                        <Col lg={5} className="d-flex flex-column locationPanel">
                            <div className="introduction">
                                <strong>The Africa Data Hub Climate Observer</strong> is designed to help journalists and academics reporting and researching climate change in Africa.
                            </div>

                            <LocationInfoPanel />
                            <div className="mt-5">
                                <SocialShare/>
                            </div>

                            <div className="mt-auto info-block">
                                Location data is mapped to grid squares which measure <strong>1x1 degree latitude and longitude</strong> and all positions are rounded to the nearest 1x1 square. These squares are approximately 100km x 100km in size.
                            </div>
                        </Col>
                        <Col>
                            <Navigator />
                        </Col>
                    </Row>
                </div>

            </Container>

                <Navbar sticky="top">

                    <Container className="justify-content-between">
                
                        <Row>
                            <Col xs="auto">
                                <Row>
                                    <Col xs="auto" className="pt-2"><Form.Label>Jump to section:</Form.Label></Col>
                                    <Col>
                                        <a href="#temperature" className="section-jump-btn"><Icon path={mdiThermometer} size={1} /> Temperature</a>
                                        <a href="#rainfall" className="section-jump-btn"><Icon path={mdiWeatherPouring} size={1} /> Rainfall</a>
                                        <a href="#airquality" className="section-jump-btn"><Icon path={mdiFactory} size={1} /> Air Quality</a>
                                        {/* <a href="#" className="section-jump-btn disabled"><Icon path={mdiLandPlots} size={1} /> Land cover</a> */}
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs="auto">
                                <Row>
                                    <Col xs="auto" className="pt-2">
                                        <Form.Label>Adjust date range:</Form.Label>
                                    </Col>
                                    <Col xs="auto">
                                        <Form.Select aria-label="Default select example" value={dateRange[0]} onChange={(e) => changeDateRange('start', e.target.value)}>
                                            {
                                                [...Array(2024 - 1993 + 1)].map((_, i) => {
                                                    let year = 1993 + i;
                                                    return <option key={year} value={year}>{year}</option>
                                                })
                                            }
                                        </Form.Select>
                                    </Col>
                                    <Col xs="auto" className="pt-2"><Form.Label>TO</Form.Label></Col>
                                    <Col xs="auto">
                                        <Form.Select aria-label="Default select example" value={dateRange[1]} onChange={(e) => changeDateRange('end', e.target.value)}>
                                            {
                                                [...Array(2024 - 1993 + 1)].map((_, i) => {
                                                    let year = 1993 + i;
                                                    return <option key={year} value={year}>{year}</option>
                                                })
                                            }
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>

                    </Container>

                </Navbar>

            
            <Container className="co2-header">
                <header>
                    <h3><a name="temperature"><Icon path={mdiThermometer} size={1} /> Temperature</a></h3>
                </header>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4><a name="average-monthly-temperature">Average Monthly Temperature</a></h4>
                            <p>
                                This chart shows the average monthly temperature for { city != '' && city != 'location' ? cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0].city : address }, {convertCountry('iso3', country).location}. The red and blue areas show average maximum and minimum temperatures for that month.
                            </p>
                            <h5>Frequently Asked Questions</h5>
                            
                            <Accordion className="faq">
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="0">Where does this data come from?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>This data comes from Berkeley Earth's climate repository, which is one of the largest datasets relating to historical temperature in the world. It's important to remember that a lot of the data is modelled rather than directly observed, and other data sources may differ in exact estimations of temperature.<p className="mt-3 mb-0">It's important to remember that a lot of the data is modelled rather than directly observed, which means the data for a specific location may be calculated based on measurements taken nearby, and other sources may differ in their estimations of temperature.</p>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="1">How is the historical average calculated?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>Many climatologists use historical averages to compare temperatures, and usually take an average of a 30 year period. In our case, the historical average calculated over the period 1950-1980 - and there are very few months in the last 30 years which have been below that measurement.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="2">How do I use this chart?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>This chart can help you quickly identify key temperature metrics for any given place in Africa, for any month. You can compare the temperature today, for example, with a past date to understand whether or not it is unusually hot or cold.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="3">Should I embed this chart for readers?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body>Probably not, if we're honest. It's hard to decipher any narrative in this chart without close inspection, and the only easy to understand story is that the year has seasons. Seeing the impact of global heating is here is not easy. It's a data explorer, not a storytelling device.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>

                        </Col>
                        <Col>
                            <TEMPMonthlyAverageChart />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4><a name="monthly-temperature-breakdown">Monthly Temperature Breakdown</a></h4>
                            <p>
                                To make the temperature data a little easier to communicate, we've broken it down by months in this chart. Comparing the average monthly temperature for every August for the last 30 years, for example, is more visually revealing than looking at all the data for all seasons.
                            </p>
                            <h5>Frequently Asked Questions</h5>
                            <Accordion className="faq">
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="0">Where does this data come from?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>This is also generated using the Berkeley Earth dataset. You should cite Berkeley Earth and Africa Data Hub when using this data in a story.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="1">How can I use this data?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>This chart would be useful to include in a story to show a pattern of increasing temperatures over time, since it is comparing like for like. We've included a trend line to show change over time, and a line marking the historical average temperature.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col>
                            <TEMPMonthlyBreakdownChart />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4><a name="annual-temperature">Annual Temperature</a></h4>
                            <p>
                                To assist you with your own analysis, we've also prepared the temperature record as a table. Here we are showing the "climate anomaly" in the fourth column. This tells you exactly how much hotter or colder than the historical average a month was.
                            </p>
                        </Col>
                        <Col>
                            <TEMPAnnualTable />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4><a name="temperature-anomaly">Temperature Anomaly</a></h4>
                            <p>
                                This chart is created using the anomaly described above, and is based on the work of Ed Hawkins and <a href="https://showyourstripes.info/" target="_blank">#ShowYourStripes</a>. Red bars show years in which the temperature has been higher than the historical average, blue bars years in which it has been colder.
                            </p>
                            <h5>Frequently Asked Questions</h5>
                            <Accordion className="faq">
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="0">What is a temperature anomaly?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>The anomaly shows the difference between the monthly recorded temperature and the historical average (see above), is used to illustrate the underlying trends of the changing climate. Red bars show years in which the temperature has been higher than the historical average, blue bars years in which it has been colder.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="1">What trend can I see here?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>The internationally agreed objective is to try and keep temperature change to below <a target="_blank" href="https://unfccc.int/process-and-meetings/the-paris-agreement">1.5 degrees difference to the pre-industrial era</a>. You can see from the size and number of red lines just how hard this objective is, and that rather than slowing the rate of change, things are still heating up.
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="2">What can we do about it?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>The climate crisis is a systemic issue which requires action at all levels, both to limit and mitigate the impact of a warming world. While there are things individuals can do to minimise their own carbon footprint, for example, tackling issues such as <a href="https://unsettleddebt.africadatahub.org/" target="_blank">climate debt</a> can only be done through collaboration and co-ordinated action.
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col>
                            <TEMPAnomalyChart />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container className="co2-header">
                <header>
                    <h3><a name="rainfall"><Icon path={mdiWeatherPouring} size={1} /> Rainfall</a></h3>
                </header>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4><a name="monthly-actual-rainfall">Monthly Actual Rainfall</a></h4>
                            <p>
                                Historical baseline rainfall data (1950 - 1980) comes from the <a href="https://gpcc.dwd.de/" target="_blank">Global Precipitation Climatology Centre (GPCC)</a>. Recent rainfall data comes from <a href="https://www.gloh2o.org/" target="_blank">GloH2O</a>. As with the temperature data above, this data is modelled at the global scale to estimate rainfall at any given moment in time. It is measured in millimetres of rain per month (mm).
                            </p>
                            <Accordion className="faq">
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="0">How does the heatmap work?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>This graphic shows months on the x-axis and years on the y-axis. Wetter months are a darker blue in colour. It gives you a high level overview of rainfall patterns in a region - which is the rainy months, for example? - and years that may be of interest.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="1">Can I use this data? </ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>You certainly can. Our full dataset is downloadable here, and you can share this graphic by clicking the download or share buttons.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="2">Should I use this graphic in a story?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>Probably not. Again, this is a very high level view of what is happening relating to rainfall. It requires some effort to see details. Readers may be better served with a more simple visualisation, like below.
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="3">How is the historical average calculated?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body>Just as with the temperature data, we use the GPCC dataset to calculate the average monthly rainfall for each location based on the period 1950-1980.
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col>
                            <PRECIPMonthlyChart />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4><a name="monthly-rainfall-breakdown">Monthly Rainfall Breakdown</a></h4>
                            <p>
                                This chart also shows the GPCC data for your location, but in this case we have illustrated it as a line chart showing a single month over time. 
                            </p>
                            <Accordion className="faq">
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="0">Why is this a better chart for storytelling?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>It's likely that most of your reporting will be around specific incidents or time periods. Using a line chart helps readers to focus on details, such as whether this June was unusually wet, or if an unexpected storm really was an anomaly.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="1">Can I change the timeframe?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>You can, and you should before including this in your work. Sometimes you may want to show all the data - to demonstrate changing seasonal patterns. But to illustrate that this month was unusually wet you'll probably want a more focussed image with the historical average (which we've also included).
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="2">Where is the wettest place in Africa? </ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>Glad you asked. That honour goes to San Antonio de Ureca, in Equatorial  Guinea. It receives a <a href="https://www.africadatahub.org/data-resources/climate-observer?position=3.2553153,8.584609" target="_blank">staggering 10 450mm of rain a year</a>. That's almost 20 times more rain than London!
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="3">How is the historical average calculated? </ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body>Just as with the temperature data, we use the GPCC dataset to calculate the average monthly rainfall for each location based on the period 1950-1980.
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col>
                            <PRECIPMonthlyBreakdownChart />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4><a name="annual-rainfall">Annual Rainfall</a></h4>
                            <p>
                             We've also included the rainfall data as an interactive table for you, which shows the difference between a particular month and the historical average. 
                            </p>
                            <Accordion className="faq">
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="0">What's the driest place in sub-Saharan Africa?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>The Namib desert in Namibia is the driest place in sub-Saharan Africa, and it's reckoned that some parts of the Namib receive less than 2mm of rain a year.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                
                            </Accordion>
                        </Col>
                        <Col>
                            <PRECIPAnnualTable />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container className="co2-header">
                <header>
                    <h3><a name="airquality"><Icon path={mdiFactory} size={1} /> Air Quality</a></h3>
                </header>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4><a name="air-quality">Air Quality</a></h4>
                            <p>
                                Aerosol Optical Depth (AOD) data can be used as a proxy to suggest air quality, specifically to infer particulate matter concentrations (like PM2.5). AOD represents the degree to which particles in the atmosphere (dust, smoke, pollutants) prevent sunlight from passing through the atmosphere. Higher AOD values generally indicate higher levels of aerosols, which can correspond to poorer air quality.
                            </p>
                            <p>AOD can be used as a proxy for air quality, with higher values indicating worse air quality. This chart shows the average AOD for the time period.</p>
                            <Accordion className="faq">
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="0">Is Aerosol Optical Depth a reliable indicator?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>AOD measures air thickness which can indicate the presence of pollutants. AOD by itself does not take into account cloud cover, weather conditions and other factors that might affect the air thickness and should be considered alongside ground-station measurements.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="1">What unit is AOD measured in?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>NASA's MODIS satellite data measures AOD on a scale between 0 and 5000. Higher values indicate more light scattering due to aerosols in the atmosphere.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="2">What is PM2.5?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body><p>PM2.5 refers to particulate matter that is 2.5 micrometers (µm) or smaller in diameter. These tiny particles are about 30 times smaller than the width of a human hair and can be made up of various substances, including organic chemicals, metals, dust, soot, and liquid droplets.</p>

                                        <p>Because of their small size, PM2.5 particles can be easily inhaled deep into the lungs and even enter the bloodstream, posing significant health risks, especially to the respiratory and cardiovascular systems. Long-term exposure to elevated PM2.5 levels has been linked to serious health issues like asthma, lung disease, heart attacks, and premature death.</p>
                                        
                                        <p>An AOD value <strong>between 0 and 100</strong> would be an indication of clean air, minimal aerosols, equivalent to PM2.5 levels under 12 µg/m³ (good air quality).</p>
                                        <p>An AOD value bwteeen <strong>601 and 1000</strong> would indicate significant air pollution, equating to PM2.5 levels between 55–150 µg/m³, affecting most of the population.</p>
                                        <p>An AOD value <strong>higher than 2000</strong> would indicate extremely high levels of pollution, likely corresponding to events like wildfires or dust storms. PM2.5 values in this range could exceed 250 µg/m³, severely impacting health and visibility.</p>
                                        
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="3">How can I get details about specific pollutants??</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="3">
                                        <Card.Body><p>As discussed, this data is a proxy for air quality, but more accurate information about different gases and particles can be obtained from sensor networks, the largest of which is at <a target="_blank" href="https://www.aqicn.org/">www.aqicn.org</a>. We will be including this data in future iterations of the Africa Climate Observer.</p>
                                        
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col>
                            <AQChart />
                            {/* <AirQualityMap /> */}
                            <div className="mt-4">
                                <AQMonthlyChart />
                            </div>
                        </Col>
                    </Row>
                </Container>
            </Container>




            
        </>
    )

};

export default Co2;