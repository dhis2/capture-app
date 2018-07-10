// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: grey,
        success: green,
    },
});

theme.typography.formFieldTitle = {
    fontSize: theme.typography.pxToRem(12),
};

theme.palette.warning = {
    light: '#FFF66',
    main: '#FFCC00',
    dark: '#FF9900',
};

theme.palette.input = {
    bottomLine: 'rgba(0, 0, 0, 0.42)',
};

export default theme;
