
import React from 'react';
import {IconButton, Grid, AppBar, Toolbar, Typography} from '@material-ui/core/';
import styles from './styles';
import CloseIcon from '@material-ui/icons/Close';

type BetslipProps = {
    eventdata: Array<any>;
    marketdata: Array<any>;
    outcomedata: Array<any>;
    handleAddToBetslip: (selectedOutcome: string) => void;
    oddsView: boolean;
    handleError: (error:string) => void;
}


const Betslip = (props : BetslipProps) => {
    const classes = styles();

    function renderOutcomes() {
        return props.outcomedata.map(outcome => {
            return props.marketdata.map(market => {
                if(market["marketId"] === outcome["marketId"]) {
               return props.eventdata.map(event => {
                    if(event["eventId"] === outcome["eventId"]) {

                    return (
                            <Toolbar key={outcome["outcomeId"] }id={outcome["outcomeId"] }className={outcome["status"]["suspended"] ?classes.suspended : classes.center}>
                        <Grid className={classes.center} container direction="row">
                            <Grid className={classes.centerVertical} item xs={4}><Typography>{event["name"]}</Typography></Grid>
                            <Grid className={classes.centerVertical} item xs={2}><Typography>{market["name"]}</Typography></Grid>
                            <Grid className={classes.centerVertical} item xs={2}><Typography>{outcome["name"]}</Typography></Grid>
                            <Grid className={classes.centerVertical} item xs={2}><Typography>{props.oddsView ? outcome["price"]["decimal"] : outcome["price"]["num"] + " / " + outcome["price"]["den"]}</Typography></Grid>
                            <Grid className={classes.centerVertical} item xs={1}><IconButton onClick={() => {
                                props.handleAddToBetslip(outcome["outcomeId"]);
                            }}><CloseIcon /></IconButton></Grid>
                        </Grid>                                
                            </Toolbar>


                    )                        
                    } else {
                        return null;
                    }

                })                    
                
                } else {
                    return null;
                }
            })
        })
    }
    
    try{
    return (
        <div>
        
        <AppBar position="static" className={`${classes.secondaryColor} ${classes.betslip}`} >
            <Toolbar className={classes.center}>
                <Grid container direction="row">
                    <Grid item xs={12}className={classes.centerVertical}>
                        <Typography>Betslip</Typography>                       
                    </Grid>
                </Grid>
            </Toolbar>
            
            </AppBar>
            {renderOutcomes()}
        </div>




    )} catch (error) {
        props.handleError("Unable to render betslip. ");
        return <div>Error Occurred.</div>
        
    }
}
export default Betslip;