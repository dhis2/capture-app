// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import NewEventDataEntry from './NewEventDataEntry.container';
import DataEntrySelectionsIncomplete from './DataEntrySelectionsIncomplete.container';
import { getTranslation } from '../../../../d2/d2Instance';
import { formatterOptions } from '../../../../utils/string/format.const';

const getStyles = theme => ({
    headerContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingBottom: 20,
    },
    header: {
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
    }
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
                    {getTranslation('new_event_header', formatterOptions.CAPITALIZE_FIRST_LETTER)}
                </div>
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
