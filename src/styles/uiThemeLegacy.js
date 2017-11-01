import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { fade } from 'material-ui/utils/colorManipulator';
import {
    blue500,
    blue700,
    blue900,
    grey100,
    grey200,
    grey300,
    grey500,
    white,
    darkBlack,
    fullBlack,
} from 'material-ui/styles/colors';

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
