import react from 'react';
import ReactDOM from 'react-dom';
import Events from './../Events.tsx';
import { render, screen } from '@testing-library/react';
let eventdata = {"eventId":21249939,"name":"Shanghai Shenhua 0 v 0 Shandong Luneng Taishan","displayOrder":-1000,"sort":"MTCH","linkedEventId":21228740,"classId":5,"className":"Football","typeId":10003971,"typeName":"Football Live","linkedEventTypeId":10005942,"linkedEventTypeName":"Chinese Super League","startTime":"2017-09-19T11:35:23.000Z","scores":{"home":0,"away":0},"competitors":[{"name":"Shanghai Shenhua","position":"home"},{"name":"Shandong Luneng Taishan","position":"away"}],"status":{"active":true,"started":true,"live":true,"resulted":false,"finished":false,"cashoutable":true,"displayable":true,"suspended":false,"requestabet":false},"boostCount":0,"superBoostCount":0,"markets":[93649849]};
let marketdata = [{"marketId":93649849,"eventId":21249939,"name":"Both Score No Draw","displayOrder":-32496,"type":"standard","status":{"active":true,"resulted":false,"cashoutable":false,"displayable":true,"suspended":false,"noExtraTime":false,"live":true},"liabilities":{"livePriceLimit":2500},"spAvail":false,"outcomes":[367530493,367530501]}];
let outcomedata = [{"outcomeId":367530493,"marketId":93649849,"eventId":21249939,"name":"Yes","displayOrder":10,"result":{"place":0,"result":"-","favourite":false},"price":{"decimal":"7","num":"6","den":"1"},"status":{"active":true,"resulted":false,"cashoutable":false,"displayable":true,"suspended":false,"result":"-"}}];
let oddsView = true;

it("Renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Events eventdata={eventdata} marketdata={marketdata} outcomedata={outcomedata} handleAddToBetslip={() => {}} loadMarkets={() => {}} loadOutcomes={() => {}} loadAllMarkets={() => {}} oddsView={oddsView} toggleNotification={() => {} } handleError={() => {}}></Events>, div)
});
it("Renders correctly", () => {
    render(<Events eventdata={eventdata} marketdata={marketdata} outcomedata={outcomedata} handleAddToBetslip={() => {}} loadMarkets={() => {}} loadOutcomes={() => {}} loadAllMarkets={() => {}} oddsView={oddsView} toggleNotification={() => {}} handleError={() => {}}></Events>);
    expect(screen.getByText("Shanghai Shenhua 0 v 0 Shandong Luneng Taishan")).toBeInTheDocument;
    expect(screen.queryByText("Both Score No Draw")).not.toBeInTheDocument;
    expect(screen.queryByText("Yes")).not.toBeInTheDocument;
    expect(screen.queryByText("7")).not.toBeInTheDocument;
});
it("Button Click works correctly", () => {
    const component = render(<Events eventdata={eventdata} marketdata={marketdata} outcomedata={outcomedata} handleAddToBetslip={() => {}} loadMarkets={() => {}} loadOutcomes={() => {}} loadAllMarkets={() => {}} oddsView={oddsView} toggleNotification={() => {}} handleError={() => {}}></Events>)
    component.getByTestId("loadmarketsbutton").click();
    expect(component.getByText("Show All Markets")).toBeInTheDocument;
    expect(component.getByText("Shanghai Shenhua 0 v 0 Shandong Luneng Taishan")).toBeInTheDocument;
    expect(component.getByText("Both Score No Draw")).toBeInTheDocument;
    expect(component.getByText("Yes")).toBeInTheDocument;
    expect(component.getByText("7")).toBeInTheDocument;
})
it("oddsView affects odds display", () => {
    const component = render(<Events eventdata={eventdata} marketdata={marketdata} outcomedata={outcomedata} handleAddToBetslip={() => {}} loadMarkets={() => {}} loadOutcomes={() => {}} loadAllMarkets={() => {}} oddsView={false} toggleNotification={() => {}} handleError={() => {}}></Events>)
    component.getByTestId("loadmarketsbutton").click();
    expect(component.getByText("6 / 1")).toBeInTheDocument; 
});
it("Expect error on wrong data type", () => {
    let errors;
        const component = render(<Events eventdata={"hello"} marketdata={marketdata} outcomedata={outcomedata} handleAddToBetslip={() => {}} loadMarkets={() => {}} loadOutcomes={() => {}} loadAllMarkets={() => {}} oddsView={false} toggleNotification={() => {}} handleError= {(error) => {errors = error}}></Events>);
        expect(errors).not.toEqual(null);
})
