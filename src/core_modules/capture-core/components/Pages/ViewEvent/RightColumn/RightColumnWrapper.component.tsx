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

type Props = WithStyles<typeof getStyles> & {
    hideWidgets?: {
        feedback?: boolean;
        indicator?: boolean;
    };
};

type ComponentContainer = {
    id: string;
    Component: React.ComponentType<any>;
    shouldHideWidget?: (props: Record<string, any>) => boolean;
};

const componentContainers: Array<ComponentContainer> = [
    { id: 'ErrorsSection', Component: ErrorsSection },
    { id: 'WarningsSection', Component: WarningsSection },
    {
        id: 'WidgetFeedback',
        Component: WidgetFeedback,
        shouldHideWidget: ({ hideWidgets }: any) => hideWidgets?.feedback,
    },
    {
        id: 'WidgetIndicator',
        Component: WidgetIndicator,
        shouldHideWidget: ({ hideWidgets }: any) => hideWidgets?.indicator,
    },
    { id: 'AssigneeSection', Component: AssigneeSection },
    { id: 'RelationshipsSection', Component: RelationshipsSection },
    { id: 'NotesSection', Component: NotesSection },
];

class RightColumnWrapperPlain extends React.Component<Props> {
    renderComponent = (
        container: ComponentContainer,
        props: Record<string, any>,
    ) => {
        const { shouldHideWidget } = container;
        const hideWidget = shouldHideWidget?.(props);
        if (hideWidget) return null;
        return <container.Component key={container.id} {...props} />;
    }

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
