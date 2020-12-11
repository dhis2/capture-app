// @flow
import { darken, fade, lighten } from '@material-ui/core/styles/colorManipulator';

export default (theme: Theme) => ({
  accentColor: theme.palette.secondary.main,
  floatingNav: {
    background: fade(darken(theme.palette.primary.dark, 0.6), 0.8),
    chevron: lighten(theme.palette.secondary.light, 0.4),
    color: 'white',
  },
  headerColor: theme.palette.primary.main,
  todayColor: theme.palette.secondary.main,
  selectionColor: theme.palette.primary.main,
  weekdayColor: theme.palette.primary.main,
});
