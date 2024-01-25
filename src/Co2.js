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

import { Icon } from '@mdi/react';
import { mdiThermometer, mdiWeatherPouring, mdiFactory, mdiLandPlots } from '@mdi/js';

import LocationBar from './LocationBar';
import Navigator from './Navigator';
import LocationInfoPanel from './LocationInfoPanel';

import MonthlyAverageChart from './MonthlyAverageChart';
import MonthlyBreakdownChart from './MonthlyBreakdownChart';
import AnnualTemperatureTable from './AnnualTemperatureTable';
import TemperatureAnomalyChart from './TemperatureAnomalyChart';



import './app.scss';

const Co2 = () => {

    const { city, country, dateRange, changeDateRange } = useContext(AppContext);

    ContextAwareToggle = ({ children, eventKey, callback }) => {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey),
        );

        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            // <button
            //     type="button"
            //     style={{ backgroundColor: isCurrentEventKey ? 'red' : 'blue' }}
            //     onClick={decoratedOnClick}
            // >
            //     {children}
            // </button>
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
                        <Col lg={5}>
                            <LocationInfoPanel />
                        </Col>
                        <Col>
                            <Navigator />
                        </Col>
                    </Row>
                </div>


                <Row className="justify-content-between">
                    <Col xs="auto">
                        <Row>
                            <Col xs="auto" className="pt-2"><Form.Label>Jump to section:</Form.Label></Col>
                            <Col>
                                <a href="#temperature" className="section-jump-btn"><Icon path={mdiThermometer} size={1} /> Temperature</a>
                                <a href="#" className="section-jump-btn disabled"><Icon path={mdiWeatherPouring} size={1} /> Rainfall</a>
                                <a href="#" className="section-jump-btn disabled"><Icon path={mdiFactory} size={1} />CO<sub>2</sub> Exmissions</a>
                                <a href="#" className="section-jump-btn disabled"><Icon path={mdiLandPlots} size={1} /> Land cover</a>
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
                                        [...Array(2023 - 1993 + 1)].map((_, i) => {
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
                                        [...Array(2023 - 1993 + 1)].map((_, i) => {
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

            <Container className="co2-header">
                <header>
                    <h3><a name="temperature"><Icon path={mdiThermometer} size={1} /> Temperature</a></h3>
                </header>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4>Average Monthly Temperature</h4>
                            <p>
                                This chart shows the average monthly temperature for {city}, {country}. The red and blue areas show peak maximum and minimum temperatures for that month.
                            </p>
                            <h5>Frequently Asked Questions</h5>
                            
                            <Accordion className="faq">
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="0">Where does this data come from?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="0">
                                        <Card.Body>This data comes from Berkeley Earth's climate repository, which is one of the largest datasets relating to historical temperature in the world. It's important to remember that a lot of the data is modelled rather than directly observed, and other data sources may differ in exact estimations of temperature.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="1">How do I use this chart?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="1">
                                        <Card.Body>This chart can help you quickly identify key temperature metrics for any given place in Africa, for any month. You can compare the temperature today, for example, with a past date to understand whether or not it is unusually hot or cold.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="2">Should I embed this chart for readers?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>Probably not, if we're honest. It's hard to decipher any narrative in this chart without close inspection, and the only easy to understand story is that the year has seasons. Seeing the impact of global heating is here is not easy. It's a data explorer, not a storytelling device.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>

                        </Col>
                        <Col>
                            <MonthlyAverageChart />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4>Monthly Temperature Breakdown</h4>
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
                                        <Card.Body>This chart would be useful to include in a story to show a pattern of increasing temperatures over time, since it is comparing like for like. We’ve included a trend line to show change over time, and a line marking the historical average temperature.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                                <Card>
                                    <Card.Header>
                                        <ContextAwareToggle eventKey="2">How is the historical average calculated?</ContextAwareToggle>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey="2">
                                        <Card.Body>Many climatologists use historical averages to compare temperatures, and usually take an average of a 30 year period. In our case, the historical average calculated over the period 1950-1980 - and there are very few months in the last 30 years which have been below that measurement.</Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            </Accordion>
                        </Col>
                        <Col>
                            <MonthlyBreakdownChart />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4>Annual Temperature</h4>
                            <p>
                                To assist you with your own analysis, we've also prepared the temperature record as a table. Here we are showing the "climate anomaly" in the fourth column. This tells you exactly how much hotter or colder than the historical average a month was.
                            </p>
                        </Col>
                        <Col>
                            <AnnualTemperatureTable />
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4} className="section-info">
                            <h4>Temperature Anomaly</h4>
                            <p>
                                This chart is created using the anomaly described above, and is based on the work of Ed Hawkins and #ShowYourStripes. Red bars show years in which the temperature has been higher than the historical average, green bars years in which it has been colder.
                            </p>
                        </Col>
                        <Col>
                            <TemperatureAnomalyChart />
                        </Col>
                    </Row>
                </Container>
            </Container>

            {/* <Container className="co2-header">
                <header>
                    <h3><a name="rainfall"><Icon path={mdiWeatherPouring} size={1} /> Rainfall</a></h3>
                </header>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4}>
                            <h4>Lorem ipsum</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc.
                            </p>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container className="co2-header">
                <header>
                    <h3><a name="emissions"><Icon path={mdiFactory} size={1} /> Emissions</a></h3>
                </header>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4}>
                            <h4>Lorem ipsum</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc.
                            </p>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
            </Container>

            <Container className="co2-header">
                <header>
                    <h3><a name="landcover"><Icon path={mdiLandPlots} size={1} /> Land Cover</a></h3>
                </header>
            </Container>

            <Container fluid className="co2-section">
                <Container>
                    <Row>
                        <Col md={4}>
                            <h4>Lorem ipsum</h4>
                            <p>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc. Donec euismod, nisl eget ultricies ultrices, nunc nisl ultricies nunc, nec aliquam nisl nisl vitae nunc.
                            </p>
                        </Col>
                        <Col>
                        </Col>
                    </Row>
                </Container>
            </Container> */}
        </>
    )

};

export default Co2;