// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import yellow from '@material-ui/core/colors/yellow';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        error: {
            ...red,
            light: red[300],
            main: red[500],
            dark: red[700],
            contrastText: '#fff',
        },
        secondary: {
            light: green[400],
            main: green[700],
            dark: green[900],
        },
        success: green,
        warning: {
            ...yellow,
            light: yellow[300],
            main: yellow[500],
            dark: yellow[700],
        },
    },
});

theme.typography.formFieldTitle = {
    fontSize: theme.typography.pxToRem(12),
};

theme.palette.input = {
    bottomLine: 'rgba(0, 0, 0, 0.42)',
};

export default theme;
