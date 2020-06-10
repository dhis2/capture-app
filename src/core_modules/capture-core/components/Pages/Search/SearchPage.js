// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { LockedSelector } from '../../LockedSelector';
import Paper from '@material-ui/core/Paper/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { SingleSelect, SingleSelectOption } from '@dhis2/ui-core';

const getStyles = (theme: Theme) => ({
    container: {
        padding: '10px 24px 24px 24px',
    },
    header: {
        flexGrow: 1,
        fontSize: 18,
        fontWeight: 500,
        paddingLeft: 8,
    },
    dataEntryPaper: {
        marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
    },
});

type Props = {
  classes: {
    headerContainer: string,
    header: string,
    dataEntryPaper: string,
    showAllEvents: string,
  },
}

const SearchPage = ({ classes }: Props) => (
    <>
        <LockedSelector />
        <div className={classes.container}>
            <Paper className={classes.dataEntryPaper}>
                <div className={classes.header}>
                    {i18n.t('Search')}
                </div>

                <SingleSelect className="select">
                    <optgroup label="Firefox">
                        <option value="2.0 or higher">
                            Firefox 2.0 or higher
                        </option>
                        <option value="1.5.x">Firefox 1.5.x</option>
                        <option value="1.0.x">Firefox 1.0.x</option>
                    </optgroup>
                    <optgroup label="Microsoft Internet Explorer">
                        <SingleSelectOption value="1" label="option one" />
                        <SingleSelectOption value="2" label="option two" />
                        <SingleSelectOption value="3" label="option three" />
                    </optgroup>
                </SingleSelect>
            </Paper>
        </div>
    </>
);

export default withStyles(getStyles)(SearchPage);
