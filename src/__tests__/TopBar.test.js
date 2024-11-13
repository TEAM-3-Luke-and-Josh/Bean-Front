import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TopBar from './TopBar';
import { DateProvider, DateContext } from './TopBar';
import { ColorModeContext } from '../../theme';
import { useTheme } from '@mui/material';

// Mock Clock component
jest.mock('../../components/clock', () => () => <span>12:00 PM</span>);

// Mock fetch API
// global.fetch = jest.fn(() =>
//   Promise.resolve({
//     ok: true,
//     json: () => Promise.resolve([
//       { id: 1, PAX: 4, Start: "2023-01-01T12:00:00Z" },
//       { id: 2, PAX: 2, Start: "2023-01-01T13:00:00Z" }
//     ]),
//   })
// );

// describe('TopBar Component', () => {
//   const renderTopBar = () => {
//     const colorMode = { toggleColorMode: jest.fn() };
//     render(
//       <ColorModeContext.Provider value={colorMode}>
//         <DateProvider>
//           <TopBar />
//         </DateProvider>
//       </ColorModeContext.Provider>
//     );
//   };

//   beforeEach(() => {
//     fetch.mockClear();
//   });

//   test('renders logo and key elements', () => {
//     renderTopBar();

//     expect(screen.getByAltText(/Bean Scene Logo/i)).toBeInTheDocument();
//     expect(screen.getByText(/Covers/i)).toBeInTheDocument();
//     expect(screen.getByText('josh@beanscene.com.au')).toBeInTheDocument();
//   });

//   test('displays loading indicator before data is fetched', () => {
//     renderTopBar();
//     expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
//   });

//   test('displays reservation count after data is fetched', async () => {
//     renderTopBar();

//     // Wait for the fetch to complete
//     expect(await screen.findByText(/6 Covers/i)).toBeInTheDocument();
//   });

//   test('displays the current date and allows date navigation', () => {
//     renderTopBar();
    
//     // Check if today's date appears
//     const todayDate = new Date().toLocaleDateString('en-US', {
//       weekday: 'short', year: 'numeric', month: 'short', day: '2-digit'
//     });
//     expect(screen.getByText(todayDate)).toBeInTheDocument();

//     // Navigate to the next day
//     const nextButton = screen.getByRole('button', { name: /chevron right/i });
//     fireEvent.click(nextButton);

//     const tomorrowDate = new Date();
//     tomorrowDate.setDate(tomorrowDate.getDate() + 1);
//     const formattedTomorrow = tomorrowDate.toLocaleDateString('en-US', {
//       weekday: 'short', year: 'numeric', month: 'short', day: '2-digit'
//     });

//     expect(screen.getByText(formattedTomorrow)).toBeInTheDocument();
//   });

//   test('allows toggling the color mode', () => {
//     const colorModeMock = jest.fn();
//     render(
//       <ColorModeContext.Provider value={{ toggleColorMode: colorModeMock }}>
//         <DateProvider>
//           <TopBar />
//         </DateProvider>
//       </ColorModeContext.Provider>
//     );

//     const toggleButton = screen.getByRole('button', { name: /color lens icon/i });
//     fireEvent.click(toggleButton);
//     expect(colorModeMock).toHaveBeenCalled();
//   });

//   test('handles fetch error and sets covers to 0', async () => {
//     fetch.mockImplementationOnce(() => Promise.reject(new Error('Fetch error')));
//     renderTopBar();

//     expect(await screen.findByText('0 Covers')).toBeInTheDocument();
//   });
// });