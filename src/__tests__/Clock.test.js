import { render, screen } from '@testing-library/react';
import Clock from '../components/clock';

describe('Clock Component', () => {
    beforeEach(() => {
        // Mock the Date object to return a fixed time
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2024-02-14T12:30:00'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('renders time in correct format', () => {
        render(<Clock />);
        const timeElement = screen.getByText('12:30 PM');
        expect(timeElement).toBeInTheDocument();
    });
});