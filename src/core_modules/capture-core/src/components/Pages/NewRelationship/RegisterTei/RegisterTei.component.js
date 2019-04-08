// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import DataEntry from './DataEntry/DataEntry.container';
import { RegistrationSection } from './RegistrationSection';
import GeneralOutput from './GeneralOutput/GeneralOutput.container';

const getStyles = () => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    leftContainer: {
        flexGrow: 2,
        flexBasis: 0,
    },
});

type Props = {
    classes: Object,
    onLink: (teiId: string) => void,
    onSave: Function,
};

class RegisterTei extends React.Component<Props> {
    render() {
        const { onSave, onLink, classes } = this.props;
        return (
            <div
                className={classes.container}
            >
                <div
                    className={classes.leftContainer}
                >
                    <RegistrationSection />
                    <DataEntry
                        onLink={onLink}
                        onSave={onSave}
                    />
                </div>
                <GeneralOutput
                    onLink={onLink}
                />
            </div>
        );
    }
}

export default withStyles(getStyles)(RegisterTei);
