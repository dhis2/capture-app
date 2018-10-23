// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';

const primary = {
    main: '#1976D2',
    dark: '#004BA0',
    light: '#63A4FF',
    lightest: '#EAF4FF',
};


const theme = createMuiTheme({
    overrides: {
        MuiButton: { // Name of the component ⚛️ / style sheet
            raisedPrimary: { // Name of the rule
                '&:hover': { backgroundColor: primary.main },
                backgroundColor: primary.dark, // Some CSS
            },
            flatPrimary: {
                '&:hover': { backgroundColor: primary.lightest },
                color: primary.dark,
            },
        },
    },
    palette: {
        primary,
        secondary: {
            main: '#00796B',
            dark: '#004C40',
            light: '#48A999',
            lightest: '#B2DFDB',
        },
        error: {
            main: '#E53935',
        },
        warning: {
            main: '#F19C02',
        },
        success: {
            main: '#3D9305',
        },
        info: {
            main: '#EAF4FF',
        },
        grey: {
            main: '#9E9E9E',
            light: '#E0E0E0',
            dark: '#494949',
        },
        black: '#000000',
        blueGray: '#ECEFF1',
        snow: '#F4F6F8',
    },
});

theme.typography.formFieldTitle = {
    fontSize: theme.typography.pxToRem(12),
};

theme.palette = {
    ...theme.palette,
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
