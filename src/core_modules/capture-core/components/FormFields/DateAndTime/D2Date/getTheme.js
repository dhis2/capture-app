// @flow

export const getTheme = (theme: Theme) => ({
    accentColor: theme.palette.secondary.main,
    floatingNav: {
        background: 'rgba(0, 30, 64, 0.8)',
        chevron: 'rgb(145, 203, 193)',
        color: 'white',
    },
    headerColor: theme.palette.primary.main,
    todayColor: theme.palette.secondary.main,
    selectionColor: theme.palette.primary.main,
    weekdayColor: theme.palette.primary.main,
});
