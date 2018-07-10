// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';

const theme = createMuiTheme({
    palette: {
        primary: blue,
        secondary: {
            light: green[400],
            main: green[700],
            dark: green[900],
        },
    },
});

theme.typography.formFieldTitle = {
    fontSize: theme.typography.pxToRem(12),
};

// delete theme.typography.button.textTransform;

theme.palette.warning = {
    light: '#FFF66',
    main: '#FFCC00',
    dark: '#FF9900',
};

theme.palette.input = {
    bottomLine: 'rgba(0, 0, 0, 0.42)',
};

export default theme;
