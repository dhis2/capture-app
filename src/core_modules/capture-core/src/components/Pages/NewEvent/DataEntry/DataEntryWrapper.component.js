// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import i18n from '@dhis2/d2-i18n';
import NewEventDataEntry from './NewEventDataEntry.container';
import DataEntrySelectionsIncomplete from './DataEntrySelectionsIncomplete.container';
import Button from '../../../Buttons/Button.component';

const getStyles = theme => ({
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    header: {
        flexGrow: 1,
        ...theme.typography.title,
        fontSize: 16,
        fontWeight: 500,
    },
});

type Props = {
    isSelectionsComplete: boolean,
    classes: {
        headerContainer: string,
        header: string,
    },
    formHorizontal: boolean,
    onFormLayoutDirectionChange: (formHorizontal: boolean) => void,
};

class DataEntryWrapper extends React.Component<Props> {
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
                {this.props.isSelectionsComplete &&
                    <div>
                        <Button
                            color="primary"
                            onClick={() => this.props.onFormLayoutDirectionChange(!this.props.formHorizontal)}
                        >
                            {this.props.formHorizontal ? i18n.t('Switch to form view') : i18n.t('Switch to row view')}
                        </Button>
                    </div>
                }
                <div>
                    {/* print form? */ }
                </div>
            </div>
        );
    }

    renderContents() {
        const { isSelectionsComplete } = this.props;

        if (!isSelectionsComplete) {
            return (
                <DataEntrySelectionsIncomplete />
            );
        }

        return (
            <NewEventDataEntry />
        );
    }
    render() {
        return (
            <div>
                {this.renderHeader()}
                {this.renderContents()}
            </div>
        );
    }
}

export default withStyles(getStyles)(DataEntryWrapper);
