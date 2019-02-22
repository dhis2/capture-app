
// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import ErrorsSection from './ErrorsSection/ErrorsSection.container';
import WarningsSection from './WarningsSection/WarningsSection.container';
import FeedbacksSection from './FeedbacksSection/FeedbacksSection.container';
import IndicatorsSection from './IndicatorsSection/IndicatorsSection.container';
import RelationshipsSection from './RelationshipsSection/RelationshipsSection.container';
import NotesSection from './NotesSection/NotesSection.container';

type Props = {
    classes: {
        container: string,
    }
};

const getStyles = (theme: Theme) => ({
    container: {
        flexBasis: theme.typography.pxToRem(400),
        flexGrow: 1,
    },
});

const components = [
    ErrorsSection,
    WarningsSection,
    FeedbacksSection,
    IndicatorsSection,
    RelationshipsSection,
    NotesSection,
];

class RightColumnWrapper extends React.Component<Props> {

    renderComponent = (Component: React.ComponentType<any>, props: Object) => (
        <Component {...props} />
    )

    render() {
        const { classes, ...passOnProps } = this.props;
        return (
            <div className={this.props.classes.container}>
                {components.map(c => this.renderComponent(c, passOnProps))}
            </div>
        );
    }
}

export default withStyles(getStyles)(RightColumnWrapper);
