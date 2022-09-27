import React, {useState, useEffect, FormEvent} from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import {RouteComponentProps} from 'react-router-dom'
import useLogin from '../service.admin/login/useLogin'

const AdminLoginPage = React.memo<RouteComponentProps>(({history}) => {
	const { logIn, isAuthenticated } = useLogin()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	useEffect(() => {
		if (isAuthenticated) history.push('/adminpage')
	}, [isAuthenticated, history])

	const onSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		logIn(email, password)
	}

	return (
		<Container >
			<Row className="mt-5 justify-content-center">
				<Col lg={4} md={5} sm={6} className="bg-light p-5">
					<Form onSubmit={onSubmit}>
						<Form.Group controlId="formBasicEmail">
							<Form.Label className="float-left">Kasutajatunnus</Form.Label>
							<Form.Control
								type="email"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Enter email" />
						</Form.Group>
						<Form.Group controlId="formBasicPassword">
							<Form.Label className="float-left">Salasõna</Form.Label>
							<Form.Control
								type="password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
							/>
						</Form.Group>
						<Button variant="secondary" type="submit" value="login ">Logi sisse</Button>
					</Form>
				</Col>
			</Row>
		</Container>
	)
})

export default AdminLoginPage
