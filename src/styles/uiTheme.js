// @flow
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme();

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
