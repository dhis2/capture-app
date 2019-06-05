// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import i18n from '@dhis2/d2-i18n';
import { getProgramFromProgramIdThrowIfNotFound, TrackerProgram } from '../../metaData';

const getStyles = () => ({
    container: {
        padding: 24,
    },
    contents: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
        paddingBottom: 50,
    },
    linkContainer: {
        paddingLeft: 5,
    },
});

type Props = {
    programId: string,
    orgUnitId: string,
    children: React.Node,
    classes: Object,
};

class TrackerProgramHandler extends React.Component<Props> {
    getUrl() {
        const { programId, orgUnitId } = this.props;
        const baseUrl = `${(process.env.TRACKER_CAPTURE_APP_PATH || '..').replace(/\/$/, '')}/#/?`;
        const params = `program=${programId}&ou=${orgUnitId}`;
        return baseUrl + params;
    }

    render() {
        const { programId, children, classes } = this.props;

        const program = getProgramFromProgramIdThrowIfNotFound(programId);
        if (program instanceof TrackerProgram) {
            return (
                <div className={classes.container}>
                    <Paper
                        elevation={0}
                    >
                        <div
                            className={classes.contents}
                        >
                            {i18n.t('To work with the selected program,')}
                            <span
                                className={classes.linkContainer}
                            >
                                <a
                                    href={this.getUrl()}
                                    target="_blank"
                                >
                                    {i18n.t('open the Tracker Capture app')}
                                </a>
                            </span>
                        </div>
                    </Paper>
                </div>
            );
        }

        return children;
    }
}

export default withStyles(getStyles)(TrackerProgramHandler);
