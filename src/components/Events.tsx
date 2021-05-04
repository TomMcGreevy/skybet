
import React, {useState} from 'react';
import {Button, IconButton, Grid, AppBar, Toolbar, Typography} from '@material-ui/core/';
import styles from './styles';
import Moment from 'moment';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import NotificationsOffIcon from '@material-ui/icons/NotificationsOff';
import NotificationsActiveIcon from '@material-ui/icons/NotificationsActive';

type EventsProps = {
    eventdata: {[key: string]: any};
    marketdata: any[];
    outcomedata: any[];
    handleAddToBetslip: (selectedOutcome: string) => void;
    loadMarkets: (eventid: string) => void;
    loadOutcomes: (marketId: string) => void;
    loadAllMarkets: (eventid: string,  loaded: Array<any>) => void;
    oddsView: boolean;
    toggleNotification: (eventid:string) => void;
    handleError: (error:string) => void;
}


const Events = (props : EventsProps) => {
    const classes = styles();
    const [display, flipDisplay] = useState(false);
    const [ExtendedButton, flipExtendedButton] = useState(true);     
    const [shownMarkets, showMarkets] = useState(props.eventdata["markets"]); 
    const [notifications, setNotifications] = useState(false); 

    //Function to render outcomes as buttons for a specific market.
    function renderButtons() {
            
            return props.marketdata.map(market =>{
                if(market["status"]["displayable"]) {
                return(
                    <Grid key={market["marketId"]} container direction="column">
                        <Grid item xs={12}>
                            <AppBar position="static" className={classes.secondaryColor}>
                                <Toolbar variant="dense" className={classes.center}>
                                    <Button className={classes.primaryTextcolor} onClick={() => {   
                                        if(shownMarkets.includes(market["marketId"])) {
                                            showMarkets(shownMarkets.filter((arrayitem: string) => arrayitem !== market["marketId"]))                                           
                                        } else {
                                            showMarkets(([] as Array<string>).concat(shownMarkets, market["marketId"]));
                                        }
                                        props.loadOutcomes(market["marketId"]);
                                        }}>
                                        <Typography className={classes.primaryTextcolor}>{market["name"]}</Typography>{shownMarkets.includes(market["marketId"]) ? <ExpandLessIcon className={classes.primaryTextcolor}/> : <ExpandMoreIcon className={classes.primaryTextcolor}/>}
                                    </Button>

                                </Toolbar> 
                            </AppBar>
                           
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container direction="row" justify="space-evenly" alignItems="center" className={classes.center}>
                                {shownMarkets.includes(market["marketId"]) ? props.outcomedata.map(outcome => {
                                    if(outcome["marketId"] === market["marketId"]) {
                                    return ( 
                                    <Grid key={outcome["outcomeId"]} item xs={4}>
                                        <Button key={outcome["outcomeId"]} onClick={() => props.handleAddToBetslip(outcome["outcomeId"])} >
                                            <Grid container direction="column">
                                                <Grid item>
                                                    <Typography>{outcome["name"]}</Typography>                                
                                                </Grid>
                                                <Grid item>
                                                    <Typography>{props.oddsView ? outcome["price"]["decimal"] : outcome["price"]["num"] + " / " + outcome["price"]["den"]}</Typography>                                
                                                </Grid>
                                                {outcome["status"]["suspended"] ?<Grid item><Typography className={classes.suspended}>SUSPENDED</Typography></Grid>:null}

                                            </Grid>
                                        </Button>                            
                                    </Grid>
                                    )} else {
                                         return null;
                                        }}) : null}
                            </Grid>

                        </Grid>
                    </Grid>

                )

                } else {
                    return null;
                }}
                
            )
            

    }
    try {
    return (
        <div>
        <AppBar position="static" className={classes.primaryColor}>
            <Toolbar>
                <Grid container direction="row">
                    <Grid item xs={1}>
                        <IconButton data-testid="loadmarketsbutton" onClick={() => {
                            props.loadMarkets(props.eventdata["eventId"]);
                            flipDisplay(!display);
                        }}>{display ?<ExpandLessIcon /> : <ExpandMoreIcon />}
                        </IconButton>   
                    </Grid>
                    <Grid item xs={7}className={classes.centerVertical}>
                        <Typography>{props.eventdata["name"]}</Typography>                        
                    </Grid>
                    <Grid item xs={3}className={classes.centerVertical}>
                        <Typography>{"Started: " + Moment(new Date(props.eventdata["startTime"])).fromNow()}</Typography>                        
                    </Grid>
                    <Grid item xs={1}className={classes.centerVertical}>
                        <IconButton onClick= {() => {
                            setNotifications(!notifications);
                            props.toggleNotification(props.eventdata["eventId"]);
                        }}>{notifications ? <NotificationsActiveIcon/> : <NotificationsOffIcon/>}</IconButton>                      
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>

        {props.marketdata.length !== 0 && display === true && ExtendedButton ? (
            <Grid item xs={12}className={classes.center}>
            <Button onClick= {() => {
                let loaded: Array<any> = []
                props.marketdata.forEach(market => {
                    loaded.push(market["marketId"]);
                });
                flipExtendedButton(!ExtendedButton);
                props.loadAllMarkets(props.eventdata["eventId"], loaded);
                }}>Show All Markets <ExpandMoreIcon />
            </Button>
            </Grid>   
        ) : null}   
        {props.marketdata.length !== 0 && display === true? renderButtons() : null}           
        </div>
    )
    }  catch (error) {
        props.handleError("Unable to render Event.");
        return <div>Error Occurred.</div>
        
    }
}
export default Events;