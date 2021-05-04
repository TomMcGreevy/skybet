import react from 'react';
import ReactDOM from 'react-dom';
import Betslip from './../Betslip.tsx';
import { render, screen } from '@testing-library/react';
let eventdata = [{"eventId":21249939,"name":"Shanghai Shenhua 0 v 0 Shandong Luneng Taishan","displayOrder":-1000,"sort":"MTCH","linkedEventId":21228740,"classId":5,"className":"Football","typeId":10003971,"typeName":"Football Live","linkedEventTypeId":10005942,"linkedEventTypeName":"Chinese Super League","startTime":"2017-09-19T11:35:23.000Z","scores":{"home":0,"away":0},"competitors":[{"name":"Shanghai Shenhua","position":"home"},{"name":"Shandong Luneng Taishan","position":"away"}],"status":{"active":true,"started":true,"live":true,"resulted":false,"finished":false,"cashoutable":true,"displayable":true,"suspended":false,"requestabet":false},"boostCount":0,"superBoostCount":0,"markets":[93649849]}];
let marketdata = [{"marketId":93649849,"eventId":21249939,"name":"Both Score No Draw","displayOrder":-32496,"type":"standard","status":{"active":true,"resulted":false,"cashoutable":false,"displayable":true,"suspended":false,"noExtraTime":false,"live":true},"liabilities":{"livePriceLimit":2500},"spAvail":false,"outcomes":[367530493,367530501]}];
let outcomedata = [{"outcomeId":367530493,"marketId":93649849,"eventId":21249939,"name":"Yes","displayOrder":10,"result":{"place":0,"result":"-","favourite":false},"price":{"decimal":"7","num":"6","den":"1"},"status":{"active":true,"resulted":false,"cashoutable":false,"displayable":true,"suspended":false,"result":"-"}}];
let oddsView = true;

it("Renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<Betslip eventdata={eventdata} marketdata={marketdata} outcomedata={outcomedata} oddsView = {oddsView} handleAddToBetslip = {() => {}} handleError= {() => {}}></Betslip>, div)
});
it("Renders correctly", () => {
render(<Betslip eventdata={eventdata} marketdata={marketdata} outcomedata={outcomedata} oddsView = {oddsView} handleAddToBetslip = {() => {}} handleError= {() => {}}></Betslip>);
    expect(screen.getByText("Shanghai Shenhua 0 v 0 Shandong Luneng Taishan")).toBeInTheDocument;
    expect(screen.getByText("Both Score No Draw")).toBeInTheDocument;
    expect(screen.getByText("Yes")).toBeInTheDocument;
    expect(screen.getByText("7")).toBeInTheDocument;
});
it("oddsView affects odds display", () => {
    render(<Betslip eventdata={eventdata} marketdata={marketdata} outcomedata={outcomedata} oddsView = {false} handleAddToBetslip = {() => {}} handleError= {() => {}}></Betslip>);
    expect(screen.getByText("6 / 1")).toBeInTheDocument;
});
it("Expect error on wrong data type", () => {
    let errors;
        render(<Betslip eventdata={"hello"} marketdata={marketdata} outcomedata={outcomedata} oddsView = {oddsView} handleAddToBetslip = {() => {}} handleError= {(error) => {errors = error}}></Betslip>);
    expect(errors).not.toEqual(null);
})