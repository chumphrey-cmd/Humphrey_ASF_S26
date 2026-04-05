import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Button, Alert } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// 1. Simplified Schema (Removed the strict phone regex that often blocks submissions)
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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitSuccessful },
        reset,
        clearErrors
    } = useForm({
        resolver: yupResolver(schema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            partySize: '',
            date: '',
            time: '',
            seating: '',
            dietaryNotes: '',
            newsletter: false
        }
    });

    // 2. Add the Auto-Dismiss Timer (5 seconds)
// Add this safely directly below your other useEffect!
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset({
                firstName: '', lastName: '', email: '', phone: '',
                partySize: '', date: '', time: '', seating: '',
                dietaryNotes: '', newsletter: false
            });
        }
    }, [isSubmitSuccessful, reset]);

    const errorMessages = Object.values(errors).map(error => error.message);

    const onSubmit = (data) => {
        console.log("--- New Reservation Submitted ---", data);
        setSuccessData(data);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // The diagnostic catcher
    const onError = (errors) => {
        console.log("--- SUBMISSION BLOCKED BY YUP! ---");
        console.log("Here are the hidden errors preventing the submit:", errors);
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

                    {/* SUCCESS MESSAGE */}
                    {successData && (
                        // Toggle to generate the "X" button
                        <Alert color="success" className="shadow-sm mb-4" toggle={() => setSuccessData(null)}>
                            <i className="fa-solid fa-circle-check me-2"></i>
                            <strong>Reservation Received!</strong><br /><br />
                            Thank you, {successData.firstName}. Your reservation for a party of <strong>{successData.partySize}</strong> on <strong>{successData.date}</strong> has been confirmed. Details are being sent to <strong>{successData.email}</strong>.
                        </Alert>
                    )}

                    {/* TOP LEVEL ERRORS */}
                    {Object.keys(errors).length > 0 && !successData && (
                        <div className="mb-4">
                            {/* 4. We now map over Object.entries so we have the specific 'field' name (e.g., 'firstName') */}
                            {Object.entries(errors).map(([field, error]) => (
                                <Alert
                                    color="danger"
                                    key={field}
                                    className="shadow-sm py-2"
                                    toggle={() => clearErrors(field)} // 5. The "X" clears this specific error!
                                >
                                    <i className="fa-solid fa-circle-exclamation me-2"></i> {error.message}
                                </Alert>
                            ))}
                        </div>
                    )}

                    <div className="bg-light p-4 p-md-5 rounded shadow-sm">
                        <p className="text-center mb-4 text-muted">
                            Please provide your reservation details below. Fields marked with * are required.
                        </p>

                        <form onSubmit={handleSubmit(onSubmit, onError)}>

                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="firstName">First Name*</Label>
                                        {/* Using native HTML inputs with Bootstrap classes instead of Reactstrap <Input> */}
                                        <input
                                            id="firstName"
                                            type="text"
                                            className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                            placeholder="e.g. Jane"
                                            {...register('firstName')}
                                        />
                                        {errors.firstName && <div className="invalid-feedback">{errors.firstName.message}</div>}
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
                                        {errors.lastName && <div className="invalid-feedback">{errors.lastName.message}</div>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup>
                                <Label for="email">Email Address*</Label>
                                <input
                                    id="email"
                                    type="email"
                                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                    placeholder="Enter your email"
                                    {...register('email')}
                                />
                                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="phone">Phone Number (Optional)</Label>
                                <input
                                    id="phone"
                                    type="tel"
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    placeholder="Enter your phone number"
                                    {...register('phone')}
                                />
                                {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="partySize">Party Size (Including Yourself)*</Label>
                                <select
                                    id="partySize"
                                    className={`form-select ${errors.partySize ? 'is-invalid' : ''}`}
                                    {...register('partySize')}
                                >
                                    <option value="">Select party size...</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                        <option key={num} value={num}>{num}</option>
                                    ))}
                                </select>
                                {errors.partySize && <div className="invalid-feedback">{errors.partySize.message}</div>}
                            </FormGroup>

                            <Row>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="date">Date of Reservation*</Label>
                                        <input
                                            id="date"
                                            type="date"
                                            className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                                            {...register('date')}
                                        />
                                        {errors.date && <div className="invalid-feedback">{errors.date.message}</div>}
                                    </FormGroup>
                                </Col>
                                <Col md="6">
                                    <FormGroup>
                                        <Label for="time">Reservation Time*</Label>
                                        <input
                                            id="time"
                                            type="time"
                                            className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                                            {...register('time')}
                                        />
                                        {errors.time && <div className="invalid-feedback">{errors.time.message}</div>}
                                    </FormGroup>
                                </Col>
                            </Row>

                            <FormGroup tag="fieldset">
                                <legend className="col-form-label fw-bold pb-2">Seating Preference*</legend>
                                <div className="form-check">
                                    <input type="radio" id="indoor" value="Indoor" className={`form-check-input ${errors.seating ? 'is-invalid' : ''}`} {...register('seating')} />
                                    <Label check for="indoor" className="form-check-label">Indoor</Label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" id="outdoor" value="Outdoor" className={`form-check-input ${errors.seating ? 'is-invalid' : ''}`} {...register('seating')} />
                                    <Label check for="outdoor" className="form-check-label">Outdoor</Label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" id="bar" value="Bar" className={`form-check-input ${errors.seating ? 'is-invalid' : ''}`} {...register('seating')} />
                                    <Label check for="bar" className="form-check-label">Bar</Label>
                                </div>
                                {errors.seating && <div className="text-danger small mt-1">{errors.seating.message}</div>}
                            </FormGroup>

                            <FormGroup>
                                <Label for="dietaryNotes">Dietary Notes (optional)</Label>
                                <textarea
                                    id="dietaryNotes"
                                    rows="4"
                                    className={`form-control ${errors.dietaryNotes ? 'is-invalid' : ''}`}
                                    placeholder="Type your message"
                                    {...register('dietaryNotes')}
                                />
                                {errors.dietaryNotes && <div className="invalid-feedback">{errors.dietaryNotes.message}</div>}
                            </FormGroup>

                            <FormGroup className="form-check mb-4">
                                <input type="checkbox" id="newsletter" className="form-check-input" {...register('newsletter')} />
                                <Label for="newsletter" className="form-check-label">Opt-in for newsletter</Label>
                            </FormGroup>

                            <div className="d-flex gap-3">
                                <Button color="dark" type="submit" className="w-50 fw-bold py-2">
                                    Submit <i className="fa-solid fa-arrow-up-from-bracket ms-2"></i>
                                </Button>
                                <Button color="secondary" outline type="button" className="w-50 fw-bold py-2" onClick={() => { reset(); setSuccessData(null); clearErrors(); }}>
                                    Reset <i className="fa-solid fa-arrows-rotate ms-2"></i>
                                </Button>
                            </div>

                        </form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}