// @flow
import { createMuiTheme } from '@material-ui/core/styles';
import { colors } from '@dhis2/ui';

const primary = {
    main: '#1976D2',
    dark: '#004BA0',
    light: colors.blue600,
    lightest: '#EAF4FF',
};


export const theme = createMuiTheme({
    overrides: {
        MuiDialog: {
            paperWidthLg: {
                width: 800,
            },
        },
        MuiSvgIcon: {
            colorAction: {
                color: '#494949',
            },
        },
        MuiCircularProgress: {
            colorPrimary: {
                color: colors.blue600,
            },
        },
    },
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary,
        secondary: {
            main: colors.teal600,
            dark: '#004C40',
            light: '#48A999',
            lightest: colors.teal200,
        },
        error: {
            red200: colors.red200,
            lighter: '#FBEAE5',
            light: colors.red300,
            main: '#E53935',
            dark: colors.red500,
        },
        warning: {
            lighter: '#FFF9C4',
            light: '#FFF176',
            main: '#F19C02',
            dark: '#F57F17',
        },
        success: {
            main: '#3D9305',
            green600: colors.green600,
        },
        green: {

        },
        info: {
            main: '#EAF4FF',
        },
        grey: {
            main: '#9E9E9E',
            light: '#E0E0E0',
            lighter: '#F6F6F6',
            lightest: '#FBFBFB',
            dark: '#494949',
            blueGrey: '#ECEFF1',
            snow: '#F4F6F8',
            black: '#000000',
        },
    },
});

theme.typography.formFieldTitle = {
    fontSize: theme.typography.pxToRem(12),
};

theme.palette = {
    ...theme.palette,
    accent: {
        lighter: colors.blue100,
        light: '#BBDEFB',
        main: '#64b5F6',
        dark: colors.blue500,
        contrastText: '#000000',
    },
    input: {
        bottomLine: 'rgba(0, 0, 0, 0.42)',
    },
    dividerForm: '#f2f4f5',
    dividerDarker: 'rgba(0, 0, 0, 1)',
    dividerLighter: 'rgba(224, 224, 224, 1)',
    required: colors.red400,
};
