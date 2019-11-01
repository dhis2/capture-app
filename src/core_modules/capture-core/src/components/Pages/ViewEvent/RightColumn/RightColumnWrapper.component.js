
// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import ErrorsSection from './ErrorsSection/ErrorsSection.container';
import WarningsSection from './WarningsSection/WarningsSection.container';
import FeedbacksSection from './FeedbacksSection/FeedbacksSection.container';
import IndicatorsSection from './IndicatorsSection/IndicatorsSection.container';
import RelationshipsSection from './RelationshipsSection/RelationshipsSection.container';
import NotesSection from './NotesSection/NotesSection.container';
import AssigneeSection from './AssigneeSection/AssigneeSection.container';

type Props = {
    classes: {
        container: string,
    }
};

const getStyles = (theme: Theme) => ({
    container: {
        flexBasis: theme.typography.pxToRem(0),
        flexGrow: 1,
        minWidth: theme.typography.pxToRem(300),
    },
});

const componentContainers = [
    { id: 'ErrorsSection', Component: ErrorsSection },
    { id: 'WarningsSection', Component: WarningsSection },
    { id: 'FeedbacksSection', Component: FeedbacksSection },
    { id: 'IndicatorsSection', Component: IndicatorsSection },
    { id: 'AssigneeSection', Component: AssigneeSection },
    { id: 'RelationshipsSection', Component: RelationshipsSection },
    { id: 'NotesSection', Component: NotesSection },
];

class RightColumnWrapper extends React.Component<Props> {
    renderComponent = (container: {id: string, Component: React.ComponentType<any> }, props: Object) => (
        <container.Component key={container.id} {...props} />
    )

    render() {
        const { classes, ...passOnProps } = this.props;
        return (
            <div className={this.props.classes.container}>
                {componentContainers.map(c => this.renderComponent(c, passOnProps))}
            </div>
        );
    }
}

export default withStyles(getStyles)(RightColumnWrapper);
