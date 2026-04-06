import { Container, Row, Col, Form, FormGroup, Label, Button, FormFeedback, Alert } from 'reactstrap';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
    firstName: yup.string().required('Please enter your first name.').max(20, 'Cannot exceed 20 characters.'),
    lastName: yup.string().max(20, 'Cannot exceed 20 characters.'),
    email: yup.string().required('Please enter an email.').email('Must be a valid email format.'),
    phone: yup.string(),
    partySize: yup.string().required('Please select your party size.'),
    date: yup.string().required('Please select a reservation date.'),
    time: yup.string().required('Please select a reservation time.'),
    seating: yup.string().required('Please select a seating preference.'),
    dietaryNotes: yup.string().max(30, 'Cannot exceed 30 characters.'),
    newsletter: yup.boolean()
});

export default function ReservationsPage() {
    const [successData, setSuccessData] = useState(null);
    const [formKey, setFormKey] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        reset
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        // CRITICAL: Inline defaultValues forces a perfect reset
        defaultValues: {
            firstName: '', lastName: '', email: '', phone: '',
            partySize: '', date: '', time: '', seating: '',
            dietaryNotes: '', newsletter: false
        }
    });

    // EFFECT 2: Auto-dismiss the success banner after 5 seconds
    useEffect(() => {
        if (successData) {
            const timer = setTimeout(() => {
                setSuccessData(null);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [successData]);

    const onSubmit = (data) => {
        console.log("--- New Reservation Submitted ---", data);
        setSuccessData(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Sanity Check Reset of Form
        reset(); // Wipes React Hook Form's internal memory
        setFormKey(prev => prev + 1); // Forces the HTML to instantly rebuild and reconnect the wires
    };

    const onError = (errors) => {
        // console.log("--- SUBMISSION BLOCKED! Here is what Yup sees: ---", errors);
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

                    {/* SUCCESS BANNER */}
                    {successData && (
                        <Alert color="success" className="shadow-sm mb-4" toggle={() => setSuccessData(null)}>
                            <i className="fa-solid fa-circle-check me-2"></i>
                            <strong>Reservation Received!</strong><br /><br />
                            Thank you, {successData.firstName}. Your reservation for a party of <strong>{successData.partySize}</strong> on <strong>{successData.date}</strong> has been confirmed. Details are being sent to <strong>{successData.email}</strong>.
                        </Alert>
                    )}

                    <div className="bg-light p-4 p-md-5 rounded shadow-sm">
                        <p className="text-center mb-4 text-muted">
                            Please provide your reservation details below. Fields marked with * are required.
                        </p>

                        {/* 4. Wrap our onSubmit function with RHF's handleSubmit */}
                        <Form key={formKey} onSubmit={handleSubmit(onSubmit, onError)}>
                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="firstName">First Name*</Label>
                                        <input
                                            id="firstName"
                                            type="text"
                                            // Conditionally add 'is-invalid' if there is an error
                                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Jane"
                                            {...register('firstName')}
                                        />
                                        {/* Error message format */}
                                        {errors.firstName && <FormFeedback>{errors.firstName.message}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="lastName">Last Name</Label>
                                        <input
                                            id="lastName"
                                            type="text"
                                            className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Doe"
                                            {...register('lastName')}
                                        />
                                        {errors.lastName && <FormFeedback>{errors.lastName.message}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup>
                                <Label for="email">Email Address*</Label>
                                <input
                                    id="email"
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="Enter your email" {...register('email')} />

                                {errors.email && <FormFeedback>{errors.email.message}</FormFeedback>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="phone">Phone Number (Optional)</Label>
                                <input
                                    id="phone"
                                    type="tel"
                                    className="form-control"
                                    placeholder="Enter your phone number" {...register('phone')} />
                            </FormGroup>

                            <FormGroup>
                                <Label for="partySize">Party Size (Including Yourself)*</Label>
                                <select
                                    id="partySize"
                                    className={`form-control ${errors.partySize ? 'is-invalid' : ''}`} {...register('partySize')}>
                                    <option
                                        value="">Select party size...
                                    </option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option
                                            key={num} value={num}>{num}
                                        </option>
                                    ))}
                                </select>

                                {errors.partySize && <FormFeedback >{errors.partySize.message}</FormFeedback>}
                            </FormGroup>

                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="date">Date of Reservation*</Label>
                                        <input
                                            id="date"
                                            type="date"
                                            className={`form-control ${errors.date ? 'is-invalid' : ''}`} {...register('date')} />

                                        {errors.date && <FormFeedback >{errors.date.message}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="time">Reservation Time*</Label>
                                        <input
                                            id="time"
                                            type="time"
                                            className={`form-control ${errors.time ? 'is-invalid' : ''}`} {...register('time')} />

                                        {errors.time && <FormFeedback >{errors.time.message}</FormFeedback>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup tag="fieldset">
                                <legend className="col-form-label fw-bold pb-2">Seating Preference*</legend>
                                <div className="d-flex gap-4">
                                    <FormGroup check>
                                        <input
                                            type="radio"
                                            id="indoor"
                                            value="Indoor"
                                            className={`form-check-input ${errors.seating ? 'is-invalid' : ''}`}
                                            {...register('seating')}
                                        />
                                        <Label check for="indoor">Indoor</Label>
                                    </FormGroup>

                                    <FormGroup check>
                                        <input
                                            type="radio"
                                            id="outdoor"
                                            value="Outdoor"
                                            className={`form-check-input ${errors.seating ? 'is-invalid' : ''}`}
                                            {...register('seating')}
                                        />
                                        <Label check for="outdoor">Outdoor</Label>
                                    </FormGroup>

                                    <FormGroup check>
                                        <input
                                            type="radio"
                                            id="bar"
                                            value="Bar"
                                            className={`form-check-input ${errors.seating ? 'is-invalid' : ''}`}
                                            {...register('seating')}
                                        />
                                        <Label check for="bar">Bar</Label>
                                    </FormGroup>
                                </div>

                                {/* Error message at the bottom of the group */}
                                {errors.seating && <div className="text-danger small mt-2">{errors.seating.message}</div>}
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


                                <Button
                                    color="secondary"
                                    outline
                                    type="button"
                                    className="w-50 fw-bold py-2"
                                    onClick={() => {
                                        reset(); // Wipe the brain
                                        setFormKey(prev => prev + 1); // Rebuild the HTML wires
                                        setSuccessData(null); // Clear the banner
                                    }}
                                >
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