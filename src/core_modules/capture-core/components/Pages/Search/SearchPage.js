// @flow
import React, { useState } from 'react';
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
        // marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
        marginBottom: 2000,

    },
});

type Props = {
  classes: {
    container: string,
    header: string,
    dataEntryPaper: string,
  },
}

const SearchPage = ({ classes }: Props) => {
    const [selectedOption, choseSelected] = useState();
    return (<>
        <LockedSelector />
        <div className={classes.container}>
            <Paper className={classes.dataEntryPaper}>
                <div className={classes.header}>
                    {i18n.t('Search')}
                </div>

                <SingleSelect onChange={({ selected }) => { choseSelected(selected); }} selected={selectedOption} >
                    <h5>Group 1</h5>
                    <SingleSelectOption value="1" label="option one" />
                    <SingleSelectOption value="2" label="option two" />
                    <SingleSelectOption value="3" label="option three" />
                    <SingleSelectOption value="4" label="option four" />
                    <SingleSelectOption value="5" label="option five" />
                    <SingleSelectOption value="6" label="option six" />
                    <h5>Group 2</h5>
                    <SingleSelectOption value="7" label="option seven" />
                    <SingleSelectOption value="8" label="option eight" />
                    <SingleSelectOption value="9" label="option nine" />
                    <SingleSelectOption value="10" label="option ten" />
                    <SingleSelectOption value="11" label="option eleven" />
                    <SingleSelectOption value="12" label="option twelve" />
                </SingleSelect>
            </Paper>
        </div>
    </>);
};

export default withStyles(getStyles)(SearchPage);
