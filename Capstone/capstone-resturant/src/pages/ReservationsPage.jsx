import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useForm } from 'react-hook-form'; // 1. Import useForm

export default function ReservationsPage() {
    // 2. Initialize the hook
    const { register, handleSubmit } = useForm();

    // 3. Create a simple submit handler to see our data
    const onSubmit = (data) => {
        console.log("--- Form Data Captured! ---", data);
    };

    return (
        <Container className="my-5">
            <Row className="mb-4">
                <Col className="text-center">
                    <h2 className="fw-bold m-0" style={{ color: '#111827' }}>Reservations</h2>
                    <hr className="my-3 w-25 mx-auto" />
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col xs="12" md="8" lg="6">
                    <div className="bg-light p-4 p-md-5 rounded shadow-sm">
                        <p className="text-center mb-4 text-muted">
                            Please provide your reservation details below. Fields marked with * are required.
                        </p>

                        {/* 4. Wrap our onSubmit function with RHF's handleSubmit */}
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="firstName">First Name*</Label>
                                        {/* Switched to native <input> and added className="form-control" */}
                                        <input
                                            id="firstName"
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Jane"
                                            {...register('firstName')}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="lastName">Last Name</Label>
                                        {/* Switched to native <input> and added className="form-control" */}
                                        <input
                                            id="lastName"
                                            type="text"
                                            className="form-control"
                                            placeholder="e.g. Doe"
                                            {...register('lastName')}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup>
                                <Label for="email">Email Address*</Label>
                                <input id="email" type="email" className="form-control" placeholder="Enter your email" {...register('email')} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="phone">Phone Number (Optional)</Label>
                                <input id="phone" type="tel" className="form-control" placeholder="Enter your phone number" {...register('phone')} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="partySize">Party Size (Including Yourself)*</Label>
                                <select id="partySize" className="form-select" {...register('partySize')}>
                                    <option value="">Select party size...</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                            </FormGroup>

                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="date">Date of Reservation*</Label>
                                        <input id="date" type="date" className="form-control" {...register('date')} />
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="time">Reservation Time*</Label>
                                        <input id="time" type="time" className="form-control" {...register('time')} />
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup tag="fieldset">
                                <legend className="col-form-label fw-bold pb-2">Seating Preference*</legend>
                                <div className="d-flex gap-4">
                                    <FormGroup check>
                                        <input type="radio" id="indoor" value="Indoor" className="form-check-input" {...register('seating')} />
                                        <Label check for="indoor">Indoor</Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <input type="radio" id="outdoor" value="Outdoor" className="form-check-input" {...register('seating')} />
                                        <Label check for="outdoor">Outdoor</Label>
                                    </FormGroup>
                                    <FormGroup check>
                                        <input type="radio" id="bar" value="Bar" className="form-check-input" {...register('seating')} />
                                        <Label check for="bar">Bar</Label>
                                    </FormGroup>
                                </div>
                            </FormGroup>

                            <FormGroup>
                                <Label for="dietaryNotes">Dietary Notes (optional)</Label>
                                <textarea id="dietaryNotes" rows="4" className="form-control" placeholder="Type your message" {...register('dietaryNotes')}></textarea>
                            </FormGroup>

                            <FormGroup check className="mb-4">
                                <input id="newsletter" type="checkbox" className="form-check-input" {...register('newsletter')} />
                                <Label check for="newsletter">Opt-in for newsletter</Label>
                            </FormGroup>

                            <div className="d-flex gap-3">
                                {/* 6. Make sure the button type is "submit" so it triggers the form */}
                                <Button color="dark" type="submit" className="w-50 fw-bold py-2">
                                    Submit <i className="fa-solid fa-arrow-up-from-bracket ms-2"></i>
                                </Button>
                                <Button color="secondary" outline type="button" className="w-50 fw-bold py-2">
                                    Reset <i className="fa-solid fa-arrows-rotate ms-2"></i>
                                </Button>
                            </div>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}