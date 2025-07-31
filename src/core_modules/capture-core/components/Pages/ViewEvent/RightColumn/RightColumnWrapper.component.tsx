import * as React from 'react';
import { spacers } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import type { Theme } from '@material-ui/core/styles';
import { ErrorsSection } from './ErrorsSection/ErrorsSection.container';
import { WarningsSection } from './WarningsSection/WarningsSection.container';
import { FeedbacksSection } from './FeedbacksSection/FeedbacksSection.container';
import { IndicatorsSection } from './IndicatorsSection/IndicatorsSection.container';
import { RelationshipsSection } from './RelationshipsSection/RelationshipsSection.container';
import { NotesSection } from './NotesSection/NotesSection.container';
import { AssigneeSection } from './AssigneeSection';
import type { PlainProps } from './RightColumnWrapper.types';

const getStyles = (theme: Theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column' as const,
        flexBasis: theme.typography.pxToRem(0),
        flexGrow: 1,
        minWidth: theme.typography.pxToRem(300),
        gap: spacers.dp16,
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

type Props = PlainProps & WithStyles<typeof getStyles>;

class RightColumnWrapperPlain extends React.Component<Props> {
    renderComponent = (container: any, props: any) => (
        <container.Component key={container.id} {...props} />
    )

    render() {
        const { classes, ...passOnProps } = this.props;
        return (
            <div className={classes.container}>
                {componentContainers.map(c => this.renderComponent(c, passOnProps))}
            </div>
        );
    }
}

export const RightColumnWrapper = withStyles(getStyles)(RightColumnWrapperPlain);
