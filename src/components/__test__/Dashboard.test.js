import react from 'react';
import ReactDOM from 'react-dom';
import Dashboard from './../Dashboard.tsx';
import { render, screen } from '@testing-library/react';
import {QueryClient, QueryClientProvider} from 'react-query';


it("Renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(  <QueryClientProvider client={new QueryClient()}><Dashboard /></QueryClientProvider>, div)
});
it("Renders correctly", () => {
    const component = render(<QueryClientProvider client={new QueryClient()}><Dashboard /></QueryClientProvider>);
    expect(component.getByText("Betting Website")).toBeInTheDocument;
    expect(component.getByTestId("oddsswitch")).toBeInTheDocument;
    expect(component.getByTestId("betslipbutton")).toBeInTheDocument;
    
});

it("Odds switch works correctly.", () => {
    const component = render(<QueryClientProvider client={new QueryClient()}><Dashboard /></QueryClientProvider>);
    component.getByTestId("oddsswitch").click();
    expect(component.getByText("Fractional")).toBeInTheDocument;
    
});
it("Betslip renders correctly on button press.", () => {
    const component = render(<QueryClientProvider client={new QueryClient()}><Dashboard /></QueryClientProvider>);
    component.getByTestId("betslipbutton").click();
    expect(component.getByText("Betslip")).toBeInTheDocument;
    component.debug();
});