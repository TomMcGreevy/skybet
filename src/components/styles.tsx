
import { makeStyles } from '@material-ui/core/styles';
const styles = makeStyles({
    center: {
    justifyContent: "center",
        textAlign:"center",
    },
    centerVertical: {
        display:"flex",
        flexDirection: "column",
    justifyContent: "center",

    },
    primaryColor: {
        background:"white",
        color: "black",
    },
    secondaryColor: {
        background:"#00107b",
        color: "white",
    },
    evenSpacing: {
        justify: "space-between",
    },
    primaryTextcolor: {
        color:"white",
    },
    betslip: {
        minWidth: "20vw",
    },
    suspended: {
        color: "red",
    }
})
export default styles;