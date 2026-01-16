import * as React from 'react';
import { spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { ErrorsSection } from './ErrorsSection/ErrorsSection.container';
import { WarningsSection } from './WarningsSection/WarningsSection.container';
import { WidgetFeedback } from '../../../WidgetFeedback';
import { WidgetIndicator } from '../../../WidgetIndicator';
import { RelationshipsSection } from './RelationshipsSection/RelationshipsSection.container';
import { NotesSection } from './NotesSection/NotesSection.container';
import { AssigneeSection } from './AssigneeSection';

const getStyles = (theme: any) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        flexBasis: theme.typography.pxToRem(0),
        flexGrow: 1,
        minWidth: theme.typography.pxToRem(300),
        gap: spacers.dp16,
    },
}) as const;

type Props = WithStyles<typeof getStyles>;

const componentContainers = [
    { id: 'ErrorsSection', Component: ErrorsSection },
    { id: 'WarningsSection', Component: WarningsSection },
    { id: 'FeedbacksSection', Component: WidgetFeedback },
    { id: 'IndicatorsSection', Component: WidgetIndicator },
    { id: 'AssigneeSection', Component: AssigneeSection },
    { id: 'RelationshipsSection', Component: RelationshipsSection },
    { id: 'NotesSection', Component: NotesSection },
];

class RightColumnWrapperPlain extends React.Component<Props> {
    renderComponent = (
        container: { id: string, Component: React.ComponentType<any> },
        props: Record<string, any>,
    ) => <container.Component key={container.id} {...props} />


    render() {
        const { classes, ...passOnProps } = this.props;
        return (
            <div className={this.props.classes.container}>
                {componentContainers.map(c => this.renderComponent(c, passOnProps))}
            </div>
        );
    }
}

export const RightColumnWrapper = withStyles(getStyles)(RightColumnWrapperPlain);
