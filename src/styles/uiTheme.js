// @flow
import { MuiThemeProvider, createMuiTheme } from 'material-ui-next/styles';

const theme = createMuiTheme({
   
});

theme.typography = { ...theme.typography,
    formFieldTitle: {
        fontSize: theme.typography.pxToRem(12),
    },
};
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
