import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { fade } from 'material-ui/utils/colorManipulator';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import common from '@material-ui/core/colors/common';
const blue500 = blue['500'];
const blue700 = blue['700'];
const blue900 = blue['900'];
const grey100 = grey['100'];
const grey200 = grey['200'];
const grey300 = grey['300'];
const grey500 = grey['500'];
const white = common.white;
const darkBlack = common.darkBlack;
const fullBlack = common.fullBlack;

export default getMuiTheme({
    palette: {
        primary1Color: 'rgb(39, 102, 150)',
        primary2Color: blue900,
        primary3Color: grey200,
        accent1Color: blue700,
        accent2Color: grey100,
        accent3Color: grey500,
        textColor: darkBlack,
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: blue500,
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack,
    },
});
