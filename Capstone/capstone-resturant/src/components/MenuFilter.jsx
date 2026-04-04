import { Input, Label, FormGroup } from 'reactstrap';

export default function MenuFilter({ currentCategory, setCategory }) {
    return (
        <FormGroup className="mb-4" style={{ maxWidth: '300px' }}>
            <Label for="categoryFilter" className="fw-bold">Filter by Category:</Label>
            <Input
                id="categoryFilter"
                type="select"
                value={currentCategory}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option value="All">All</option>
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
            </Input>
        </FormGroup>
    );
}