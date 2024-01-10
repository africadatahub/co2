import React from 'react';
import { createRoot } from 'react-dom/client';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Icon } from '@mdi/react';
import { mdiThermometer, mdiWeatherPouring, mdiFactory, mdiLandPlots } from '@mdi/js';

import axios from 'axios';

import LocationBar from './LocationBar';
import Navigator from './Navigator';
import LocationInfoPanel from './LocationInfoPanel';

import * as cities from './data/cities.json';
import * as countries from './data/countries.json';

import './app.scss';

function App() {
	const [dateRange, setDateRange] = React.useState([2000, 2020]);
	const [position, setPosition] = React.useState([-1.2920659, 36.8219462]);
	const [city, setCity] = React.useState('');
	const [country, setCountry] = React.useState('');
	const [address, setAddress] = React.useState('');
	const [interacted, setInteracted] = React.useState(false);


	React.useEffect(() => {

        let searchTerms = document.location.search.split('&');

        let daterangesearch = searchTerms.filter(term => term.includes('daterange='))[0];

        if(document.location.search.includes('daterange=')) {

            let date_range = daterangesearch.split('=')[1];

            if(date_range.includes(',')) {
                let start = parseInt(date_range.split(',')[0]);
                let end = parseInt(date_range.split(',')[1]);
				setDateRange([start, end]);
            }

        }

        if(document.location.search.includes('position=')) {

            let positionsearch = searchTerms.filter(term => term.includes('position='))[0];

            let position = positionsearch.split('=')[1];

            if(position.includes(',')) {
                let lat = parseFloat(position.split(',')[0]);
                let lon = parseFloat(position.split(',')[1]);
                setPosition([lat, lon]);
				setInteracted(true);
            }

			let place = positionsearch.split('position=')[1];

                axios.get(`https://nominatim.openstreetmap.org/search?q=${place}&format=json&polygon=1&addressdetails=1`)
                .then(function (response) {

					setAddress(response.data[0]);
					setCity('location');
					

                })




        } else if(document.location.search.includes('city=')) {

            
            let citysearch = searchTerms.filter(term => term.includes('city='))[0];

            let city = citysearch.split('=')[1];

            city = city.replace('?city=', '').replaceAll('-',' ');

            if(city == 'abomey calavi') city = 'abomey-calavi';
            if(city == 'mbuji mayi') city = 'mbuji-mayi';
            if(city == 'pointe noire') city = 'pointe-noire';
			if(city == 'cape town') city = 'cape-town';
			if(city == 'addis ababa') city = 'addis-ababa';
			if(city == 'dar es salaam') city = 'dar-es-salaam';
			if(city == 'port harcourt') city = 'port-harcourt';
			if(city == 'bobo dioulasso') city = 'bobo-dioulasso';
			if(city == 'west rand') city = 'west-rand';
			if(city == 'benin city') city = 'benin-city';
			
			setCity(city);
			setInteracted(true);
        }

	}, []);

	

	React.useEffect(() => {
		if(city != '' && city != 'location') {
			let city_data = cities.filter(c => c.city.replaceAll(' ','-').toLowerCase() == city)[0];
			setCountry(city_data.iso_code);
			setPosition([city_data.lat, city_data.lon]);
		}
	}, [city]);

	const updatePosition = (position) => {
		setPosition(position);
		setInteracted(true);
	}


	return (
		<>
		<Container className="py-4">
			
			<LocationBar
				countries={countries}
				cities={cities}
				city={city}
				position={position}
				address={address ? address.display_name : ''}
			/>
			
			<div className="my-5">
				<Row>
					<Col lg={5}>
						<LocationInfoPanel
							cities={cities}
							city={city}
							position={position}
							country={country}
							address={address}
						/>
					</Col>
					<Col>
						<Navigator
							countries={countries}
							cities={cities}
							city={city}
							position={position}
							setPosition={updatePosition}
							country={country}
							address={address}
							interacted={interacted}
						/>
					</Col>
				</Row>
			</div>

			<Row>
				<Col>
					<Row>
						<Col xs="auto">Jump to section:</Col>
						<Col>
							<a href="#temperature" className="section-jump-btn"><Icon path={mdiThermometer} size={1} /> Temperature</a>
							<a href="#rainfall" className="section-jump-btn"><Icon path={mdiWeatherPouring} size={1} /> Rainfall</a>
							<a href="#emissions" className="section-jump-btn"><Icon path={mdiFactory} size={1} />CO<sub>2</sub> Exmissions</a>
							<a href="#landcover" className="section-jump-btn"><Icon path={mdiLandPlots} size={1} /> Land cover</a>
						</Col>
					</Row>
				</Col>
				<Col>
					<Row>
						<Col xs="auto">
							Adjust date range:
						</Col>
						<Col md={2}>
							<Form.Select aria-label="Default select example" value={dateRange} onChange={(e) => setDateRange('start', e.target.value)}>
							{/* An option for each year starting on 1993 and ending on 2023 */}
							{
								[...Array(2023 - 1993 + 1)].map((_, i) => {
									let year = 1993 + i;
									return <option key={year} value={year}>{year}</option>
								})
							}
							</Form.Select>
						</Col>
						<Col xs="auto">-</Col>
						<Col md={2}>
							<Form.Select aria-label="Default select example" value={dateRange} onChange={(e) => setDateRange('start', e.target.value)}>
							{/* An option for each year starting on 1993 and ending on 2023 */}
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
		</Container>

		


			
		</>
	);
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);