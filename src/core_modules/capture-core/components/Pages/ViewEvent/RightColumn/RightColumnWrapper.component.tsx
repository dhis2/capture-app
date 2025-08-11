import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { ErrorsSection } from './ErrorsSection/ErrorsSection.container';
import { WarningsSection } from './WarningsSection/WarningsSection.container';
import { FeedbacksSection } from './FeedbacksSection/FeedbacksSection.container';
import { IndicatorsSection } from './IndicatorsSection/IndicatorsSection.container';
import { RelationshipsSection } from './RelationshipsSection/RelationshipsSection.container';
import { NotesSection } from './NotesSection/NotesSection.container';
import { AssigneeSection } from './AssigneeSection';

const styles: Readonly<any> = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: 0,
        flexGrow: 1,
        minWidth: 300,
        gap: '16px',
    },
};

type Props = WithStyles<typeof styles>;

const componentContainers = [
    { id: 'ErrorsSection', Component: ErrorsSection },
    { id: 'WarningsSection', Component: WarningsSection },
    { id: 'FeedbacksSection', Component: FeedbacksSection },
    { id: 'IndicatorsSection', Component: IndicatorsSection },
    { id: 'AssigneeSection', Component: AssigneeSection },
    { id: 'RelationshipsSection', Component: RelationshipsSection },
    { id: 'NotesSection', Component: NotesSection },
];

class RightColumnWrapperPlain extends React.Component<Props> {
    renderComponent = (container: {id: string, Component: React.ComponentType<any> }, props: any) => (
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

export const RightColumnWrapper = withStyles(styles)(RightColumnWrapperPlain);
