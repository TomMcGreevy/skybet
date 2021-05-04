
import React, {useState} from 'react';
import Events from './Events';
import Betslip from './Betslip';
import styles from './styles';
import {useQuery} from 'react-query';
import {AppBar, IconButton, Toolbar, Drawer, Switch, FormControlLabel, Typography, Grid} from '@material-ui/core/';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Alert from '@material-ui/lab/Alert';
    //Create websocket connection
    const websocket = new WebSocket("ws://localhost:8889");  

    websocket.onopen = () => {
        console.log("connected")
    }
    type json = {[key: string]: any};
    //Create arrays to hold Json messages from websocket 

    let liveEventsData2: {[key: string]: any} = {};
    let extendedEventsData: Array<any> = []; 
    let extendedEventsData2: {[key: string]: any} = {}; 
    let liveMarketData2: {[key: string]: any} = {};
    let liveOutcomeData2: {[key: string]: any} = {};
    let loadedMarkets: Array<string> = [];
    let loadedExtendedMarkets: Array<string> = [];
    let loadedOutcomes: Array<string> = [];
    let subscriptions: Array<string> = [];

    //Sorts array by display order key then name alphabetically.
    function sortArray(array: Array<any>) {
            array.sort((a,b) => {
                if(a["displayOrder"] === b["displayOrder"]) {
                    if(a["name"] <= b["name"]) {
                        return -1;
                    }else {
                        return 1;
                    }
                } else {
                    if(a["displayOrder"] < b["displayOrder"]) {
                        return -1;
                    } else {
                        return 1;
                    }
                }
            })
    }

    // Function waits until websocket connection is open. Returns true on open and false if 200ms pass and request times out
    function waitUntilSocketOpen() {
          return new Promise((resolve, reject)=> {
              let maxAttempts = 5;
              let attemptsMade = 0;
            
              const testSocket = setInterval(() => {
                  if(attemptsMade < maxAttempts) {
                        if(websocket.readyState === 1) {
                            resolve(true)
                        }
                  } else {
                      clearInterval(testSocket)
                      reject(false)
                  }
              }, 200)
    });  
    }

const Dashboard = () => {
    const classes = styles();
    //Message count used as state. When a message is received from the websocket the LiveEvent will refresh.
    const [messageCount,setMessageCount] = useState(0);    
    //BetslipOpen holds whether the betslip should be shown and the outcomes that are selected are in betslipoutcomes.
    const [betslipOpen, setBetslipOpen] = useState(false);
    const [betslipOutcomes, setBetslipOutcomes] = useState<Array<string>>([]);
    //decimal holds a boolean that decides on decimal odds showing or fractional.
    const [decimal, setDecimal] = useState(true); 
    const [errors, setErrors] = useState<Array<string>>([]); 


    websocket.onmessage = async (event) => {
        await messageRouter(event.data);
        setMessageCount(messageCount + 1);
    }
    websocket.onerror = () => {
        setErrors(["Websocket connection error. "])
    }
    
    //Function parses json from websocket and routes it to the correct array
    async function messageRouter(message: string) {
        let messageJson = await JSON.parse(message);
        if(messageJson["type"] === "LIVE_EVENTS_DATA") {

        messageJson["data"].forEach((event: json)=> {
            liveEventsData2[event["eventId"]] = event;
        })
        } else if(messageJson["type"] === "MARKET_DATA") {
                liveMarketData2[messageJson["data"]["marketId"]] = messageJson["data"];
        } else if(messageJson["type"] === "OUTCOME_DATA") {
                liveOutcomeData2[messageJson["data"]["outcomeId"]] = messageJson["data"];
        } else if(messageJson["type"] === "EVENT_DATA") {
            extendedEventsData.push(messageJson["data"]);
                extendedEventsData2[messageJson["data"]["eventId"]] = messageJson["data"];
        } else if(messageJson["type"] === "MARKET_STATUS") {
            if(Object.keys(liveMarketData2).includes(messageJson["data"]["marketId"])) {
                liveMarketData2[messageJson["data"]["marketId"]]["status"] = messageJson["data"]["status"];
                 }
            // liveEventsData2[messageJson["data"]["eventId"]]["status"] = messageJson["data"]["status"];
        } else if(messageJson["type"] === "PRICE_CHANGE") {
            if(Object.keys(liveOutcomeData2).includes(messageJson["data"]["outcomeId"])) {
           liveOutcomeData2[messageJson["data"]["outcomeId"]]["price"] = messageJson["data"]["price"];
            }
        } else if(messageJson["type"] === "OUTCOME_STATUS") {
            if(Object.keys(liveOutcomeData2).includes(messageJson["data"]["outcomeId"])) {
           liveOutcomeData2[messageJson["data"]["outcomeId"]]["status"] = messageJson["data"]["status"];
            }
        } else if(messageJson["type"] === "ERROR") {
            setErrors([messageJson["data"]]);
        }  
    };
    //Function to request live data from websocket
    const fetchLiveEventData = async() => {
        let isReady = await waitUntilSocketOpen();

        if (isReady === true) {
            await websocket.send(JSON.stringify({ type: "getLiveEvents", primaryMarkets: true }));
        } else {
            setErrors(["Websocket did not open in time. "])
        }
        await waitUntilSocketOpen();

        return liveEventsData2;

    }
    //Function to request primary market information for a specific event
    const loadMarkets = async(eventId: string) => {
        if(!loadedMarkets.includes(eventId)) {
                liveEventsData2[eventId]["markets"].forEach(async (market: string) => {
                    let isReady = await waitUntilSocketOpen();
                    if (isReady === true) {
                        websocket.send(JSON.stringify({ type: "getMarket", id: market}));
                        fetchOutcomes(market);
                    } else {
                        setErrors(["Websocket did not open in time. "])
                    }
                })

        loadedMarkets.push(eventId);  
        }

    }
     //Function to request all market information for a specific event
    const loadAllMarkets = async(eventId: string, loaded: Array<any>) => {
        if(!loadedExtendedMarkets.includes(eventId)) {

            let isReady = await waitUntilSocketOpen();
            if (isReady === true) {
                websocket.send(JSON.stringify({ type: "getEvent", id: eventId}));
                await waitUntilSocketOpen();
                extendedEventsData.forEach(event => {
                    if(event["eventId"] === eventId) {
                        event["markets"].map(async (marketId:string)=> {
                            if(!loaded.includes(marketId)) {
                                let isReady = await waitUntilSocketOpen();
                                    if (isReady === true) {
                                        websocket.send(JSON.stringify({ type: "getMarket", id: marketId}));
                                    } else {
                                        setErrors(["Websocket did not open in time. "])
                                    }      
                            }
 
                        })
                    }
                })
            } else {
                setErrors(["Websocket did not open in time. "])
            }
        loadedExtendedMarkets.push(eventId);

        }

        
    }
    //Function to request outcome information for a market
    const fetchOutcomes = async(MarketId: string) => {
        if(!loadedOutcomes.includes(MarketId)) {
        await waitUntilSocketOpen();
        if(liveMarketData2[MarketId] !== null) {
            liveMarketData2[MarketId]["outcomes"].map(async (outcome: string) => {

                let isReady = await waitUntilSocketOpen();
                if (isReady === true) {
                    websocket.send(JSON.stringify({ type: "getOutcome", id: outcome}));

                } else {
                    setErrors(["Websocket did not open in time. "])
                }
            })
        }
        loadedOutcomes.push(MarketId);  
    }
    }

    //Creates an instance of Betslip.tsx using outcomes selected by user.
    function renderBetslip() {
        let selectedoutcomedata: any[] = [];
        let selectedmarketdata: any[] = [];
        let selectedeventdata: any[] = [];
        let selectedmarketid: string[] = [];
        let selectedeventid: string[] = [];
        betslipOutcomes.forEach((selectedoutcome: string) => {
            if(liveOutcomeData2[selectedoutcome] !== null) {
                selectedoutcomedata.push(liveOutcomeData2[selectedoutcome]);
                if(!selectedmarketid.includes(liveOutcomeData2[selectedoutcome]["marketId"])){
                                    selectedmarketid.push(liveOutcomeData2[selectedoutcome]["marketId"])
                }
                if(!selectedeventid.includes(liveOutcomeData2[selectedoutcome]["eventId"])){
                    selectedeventid.push(liveOutcomeData2[selectedoutcome]["eventId"])
                }
            }
        })
        selectedmarketid.forEach((selectedmarket:string) => {
            selectedmarketdata.push(liveMarketData2[selectedmarket]);
        })
        selectedeventid.forEach((selectedevent: string) => {
            selectedeventdata.push(liveEventsData2[selectedevent]);
        })
        return <Betslip eventdata={selectedeventdata} marketdata={selectedmarketdata} outcomedata={selectedoutcomedata} handleAddToBetslip={handleAddToBetslip} oddsView={decimal} handleError={(error)=> setErrors([error])}></Betslip>

}

    //Prepares all data for Event rendering and creates an event for each one. Class Id should be given to render events from a given category.
    function renderEvents(classid: number) {
        if (Object.keys(liveEventsData2).length === 0||liveEventsData2 === null) {
            return;
        } else {
            let sortedEvents: Array<{[key: string]: any}> = [];
            Object.keys(liveEventsData2).forEach((eventId: string) => {
                sortedEvents.push(liveEventsData2[eventId]);
            })
            sortArray(sortedEvents);



            return (sortedEvents.map((event: {[key: string]: any}) => {

                if(event["classId"] === classid) {
                    let eventmarketdata: Array<any> = [];
                    Object.keys(liveMarketData2).forEach((marketId:string) => {
                        if(liveMarketData2[marketId]["eventId"] === event["eventId"]){
                        eventmarketdata.push(liveMarketData2[marketId]);                            
                        }
                    })
                    sortArray(eventmarketdata);
                    let marketoutcomedata: any[] = [];
                    Object.keys(liveOutcomeData2).forEach((outcomeId:string) => {
                        if(liveOutcomeData2[outcomeId]["eventId"] === event["eventId"]){
                            marketoutcomedata.push(liveOutcomeData2[outcomeId]);                            
                        }
                    })


                              return (
                                  <Events key={event["eventId"]} eventdata={event} marketdata={eventmarketdata} outcomedata={marketoutcomedata} handleAddToBetslip={handleAddToBetslip} loadMarkets={loadMarkets} loadOutcomes={fetchOutcomes} loadAllMarkets={loadAllMarkets} oddsView={decimal} toggleNotification={toggleNotification} handleError={(error)=> setErrors([error])} ></Events>
                 )                 
     
                } else {
                    return null;
                }
            }))
        
        }

    }
    //Allows user to toggle notification settings for an event. Provides live updates on markets / outcomes associated.
    const toggleNotification = (eventid: string) => {
        if(subscriptions.includes(eventid)) {
            websocket.send(JSON.stringify({type: "unsubscribe", keys: ["e." + eventid], clearSubscription: false}));  
            subscriptions = subscriptions.filter((arrayitem: string) => arrayitem !== eventid);
        } else {
            
            websocket.send(JSON.stringify({type: "subscribe", keys: ["e." + eventid], clearSubscription: false}));  
            subscriptions.push(eventid);
        }
    }

    const {data} = useQuery<{[key: string]: any}>(
        'liveEvents', fetchLiveEventData
    );

    //Handles for add and removing outcomes to betslip.
    const handleAddToBetslip = (selectedOutcome: string) => {

        if(betslipOutcomes.includes(selectedOutcome)) {
            handleRemoveFromBetslip(selectedOutcome);                                          
        } else {
             setBetslipOutcomes(([] as Array<string>).concat(betslipOutcomes, selectedOutcome));
        }
    };

    const handleRemoveFromBetslip = (selectedOutcome: string) => {
        setBetslipOutcomes(betslipOutcomes.filter((arrayitem: string) => arrayitem !== selectedOutcome))    
    };

    
    return (
        <div>
            {errors.length > 0 ? <Drawer anchor="top" open = {errors.length > 0} onClose={() => setErrors([])}><Alert severity="error" onClose={() => {
                setErrors([]);
            }}> Errors: {errors.map(error => {
                return  error + " "
            })}</Alert></Drawer> : null}


            <Drawer anchor="right" open={betslipOpen} onClose={() => setBetslipOpen(false)}>
                {renderBetslip()}
            </Drawer>
            <Grid container spacing={1} direction="row">
                <AppBar position="sticky" className={`${classes.secondaryColor} ${classes.center}`}>
                    <Toolbar>
                        <Grid item xs={10}>
                            <Typography>Betting Website</Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <FormControlLabel control={<Switch data-testid="oddsswitch" size="small" checked={decimal} onChange={() => setDecimal(!decimal)} />} label= {decimal ? "Decimal" : "Fractional"} />
                        </Grid>
                        <Grid item xs={1}>
                        <IconButton data-testid="betslipbutton" onClick={() => setBetslipOpen(true)}className={classes.primaryTextcolor}>
                            <ReceiptIcon/> {betslipOutcomes.length}
                        </IconButton>
                        </Grid>     
                    </Toolbar>

                </AppBar>
                <Grid container spacing={2} direction="column">
                    {renderEvents(5)}
                </Grid>
            </Grid>
        </div>

    )
}
export default Dashboard;
