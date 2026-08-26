import * as React from 'react';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { spacers } from '@dhis2/ui';
import { StickyOnScroll } from '../Sticky/StickyOnScroll.component';
import { ErrorsSection } from './ErrorsSection/ErrorsSection.container';
import { WarningsSection } from './WarningsSection/WarningsSection.container';
import { WidgetFeedback } from '../WidgetFeedback';
import { WidgetIndicator } from '../WidgetIndicator';
import { useHideWidgetByRuleLocations } from '../../hooks';

type OwnProps = {
    onLink: (teiId: string, values: Record<string, unknown>) => void;
};

const getStyles = (): Readonly<any> => ({
    stickyOnScroll: {
        position: 'relative',
        flexGrow: 1,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: spacers.dp16,
    },
});

type Props = OwnProps & WithStyles<typeof getStyles> & {
    programRules?: Array<any>;
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
];

const DataEntryWidgetOutputPlain = (props: Props) => {
    const { classes, programRules, ...passOnProps } = props;

    const hideWidgets = useHideWidgetByRuleLocations(programRules || []);

    const renderComponent = (
        container: ComponentContainer,
        componentProps: Record<string, any>,
    ) => {
        const { shouldHideWidget } = container;
        const hideWidget = shouldHideWidget?.(componentProps);
        if (hideWidget) return null;
        return <container.Component key={container.id} {...componentProps} />;
    };

    return (
        <StickyOnScroll
            offsetTop={50}
            minViewpointWidth={768}
            containerClass={classes.stickyOnScroll}
        >
            <div className={classes.container}>
                {componentContainers.map(c => renderComponent(c, { ...passOnProps, hideWidgets }))}
            </div>
        </StickyOnScroll>
    );
};

export const DataEntryWidgetOutputComponent = withStyles(getStyles)(DataEntryWidgetOutputPlain);
