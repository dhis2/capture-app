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
            lighter: '#fbeae5',
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
            lighter: yellow[100],
            light: yellow[300],
            main: yellow[600],
            dark: yellow[900],
        },
    },
});

theme.typography.formFieldTitle = {
    fontSize: theme.typography.pxToRem(12),
};

theme.palette = {
    ...theme.palette,
    grey: {
        ...theme.palette.grey,
        '30': '#FBFBFB', // eslint-disable-line
    },
    accent: {
        lighter: blue[50],
        light: blue[100],
        main: blue[300],
        dark: blue[500],
        contrastText: '#000000',
    },
    input: {
        bottomLine: 'rgba(0, 0, 0, 0.42)',
    },
    dividerForm: '#f2f4f5',
    required: red[500],
};

export default theme;
