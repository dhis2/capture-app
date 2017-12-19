// @flow
import { MuiThemeProvider, createMuiTheme } from 'material-ui-next/styles';
import blue from 'material-ui-next/colors/blue';

const theme = createMuiTheme({
    palette: {
        primary: blue,
    },
});

// theme.palette.common = Object.assign({}, theme.palette.common, {black: "red"});


// custom components
function includeCustomStyles(basicTheme: Object) {
    const customStyles = {
        section: {
            container: {

            },
        },
        sectionHeaderSimple: {
            container: {
                backgroundColor: basicTheme.palette.primary[500],
            },
            containerSecondary: {
                backgroundColor: basicTheme.palette.secondary[500],
            },
            title: basicTheme.typography.title,
        },
    };
    return { ...basicTheme, ...customStyles };
}

export default includeCustomStyles(theme);
