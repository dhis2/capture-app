// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import Paper from '@material-ui/core/Paper/Paper';
import Button from '../../../Buttons/Button.component';
import DataEntry from '../DataEntry/DataEntry.container';
import EventsList from '../RecentlyAddedEventsList/RecentlyAddedEventsList.container';
import type { ProgramStage, RenderFoundation } from '../../../../metaData';


const getStyles = (theme: Theme) => ({
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    // $FlowFixMe[cannot-spread-inexact] automated comment
    header: {
        flexGrow: 1,
        ...theme.typography.title,
        fontSize: 18,
        fontWeight: 500,
        paddingLeft: 8,
    },
    dataEntryPaper: {
        marginBottom: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
    },
    showAllEvents: {
        marginBottom: 10,
    },
});

type Props = {
    classes: {
        headerContainer: string,
        header: string,
        dataEntryPaper: string,
        showAllEvents: string,
    },
    formHorizontal: ?boolean,
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void,
    formFoundation: ?RenderFoundation,
    stage: ?ProgramStage,
}


class NewEventDataEntryWrapper extends React.Component<Props> {
    cancelButtonInstance: ?any;

    handleGoBackToAllEvents = () => {
        this.cancelButtonInstance && this.cancelButtonInstance.handleCancel();
    }

    setCancelButtonInstance = (cancelButtonInstance: ?any) => {
        this.cancelButtonInstance = cancelButtonInstance;
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

    renderHeaderButtons() {
        const { formFoundation } = this.props;
        if (!formFoundation || formFoundation.customForm) {
            return null;
        }

        return (
            <Button
                onClick={() => this.props.onFormLayoutDirectionChange(!this.props.formHorizontal)}
                secondary
            >
                {this.props.formHorizontal ? i18n.t('Switch to form view') : i18n.t('Switch to row view')}
            </Button>
        );
    }

    render() {
        const { classes, formFoundation, formHorizontal, stage } = this.props;
        return (
            <div>
                <Button className={classes.showAllEvents} onClick={this.handleGoBackToAllEvents}>
                    <ChevronLeft />
                    {i18n.t('Show all events')}
                </Button>
                <Paper className={classes.dataEntryPaper} data-test="dhis2-capture-new-event-page">
                    {this.renderHeader()}
                    <DataEntry
                        stage={stage}
                        cancelButtonRef={this.setCancelButtonInstance}
                        formFoundation={formFoundation}
                        formHorizontal={formHorizontal}
                    />
                </Paper>
                <EventsList />
            </div>
        );
    }
}

export default withStyles(getStyles)(NewEventDataEntryWrapper);
