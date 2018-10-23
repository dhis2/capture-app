// @flow
import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import { Paper } from '@material-ui/core';
import Button from '../../../Buttons/Button.component';
import DataEntry from '../DataEntry/DataEntry.container';
import EventsList from '../RecentlyAddedEventsList/RecentlyAddedEventsList.container';
import RenderFoundation from '../../../../metaData/RenderFoundation/RenderFoundation';


const getStyles = (theme: Theme) => ({
    container: {
        padding: 24,
    },
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    header: {
        flexGrow: 1,
        ...theme.typography.title,
        fontSize: 16,
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
        container: string,
    },
    formHorizontal: ?boolean,
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void,
    formFoundation: ?RenderFoundation,
};

class SelectionsComplete extends Component<Props> {
    renderHeaderButtons() {
        const { formFoundation } = this.props;
        if (!formFoundation || formFoundation.customForm) {
            return null;
        }

        return (
            <Button
                color="primary"
                onClick={() => this.props.onFormLayoutDirectionChange(!this.props.formHorizontal)}
            >
                {this.props.formHorizontal ? i18n.t('Switch to form view') : i18n.t('Switch to row view')}
            </Button>
        );
    }

    renderHeader() {
        return (
            <div
                className={this.props.classes.headerContainer}
            >
                <div
                    className={this.props.classes.header}
                >
                    {i18n.t('New event')}
                </div>
                <div>
                    {this.renderHeaderButtons()}
                </div>
            </div>
        );
    }

    render() {
        const { classes, formFoundation, formHorizontal } = this.props;
        return (
            <div>
                <div
                    className={classes.container}
                >
                    <Paper className={classes.dataEntryPaper}>
                        {this.renderHeader()}
                        <DataEntry
                            formFoundation={formFoundation}
                            formHorizontal={formHorizontal}
                        />
                    </Paper>

                    <EventsList />
                </div>
            </div>
        );
    }
}

export default withStyles(getStyles)(SelectionsComplete);
