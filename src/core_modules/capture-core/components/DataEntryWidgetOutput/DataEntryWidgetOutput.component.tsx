import * as React from 'react';
import { withStyles, type WithStyles } from '@material-ui/core/styles';
import { spacers } from '@dhis2/ui';
import { StickyOnScroll } from '../Sticky/StickyOnScroll.component';
import { ErrorsSection } from './ErrorsSection/ErrorsSection.container';
import { WarningsSection } from './WarningsSection/WarningsSection.container';
import { FeedbacksSection } from '../WidgetFeedback';
import { IndicatorsSection } from '../WidgetIndicator';

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

type Props = OwnProps & WithStyles<typeof getStyles>;

const componentContainers = [
    { id: 'ErrorsSection', Component: ErrorsSection },
    { id: 'WarningsSection', Component: WarningsSection },
    { id: 'FeedbacksSection', Component: FeedbacksSection },
    { id: 'IndicatorsSection', Component: IndicatorsSection },
];

class DataEntryWidgetOutputPlain extends React.Component<Props> {
    renderComponent = (container: {id: string, Component: React.ComponentType<any> }, props: Record<string, any>) => {
        const { renderCardActions, ...otherProps } = props;

        const passOnProps = container.id === 'WarningsSection' ? props : otherProps;
        return (
            <container.Component key={container.id} {...passOnProps} />
        );
    }

    render() {
        const { classes, ...passOnProps } = this.props;
        return (
            <StickyOnScroll
                offsetTop={50}
                minViewpointWidth={768}
                containerClass={classes.stickyOnScroll}
            >
                <div className={classes.container}>
                    {componentContainers.map(c => this.renderComponent(c, passOnProps))}
                </div>
            </StickyOnScroll>
        );
    }
}

export const DataEntryWidgetOutputComponent = withStyles(getStyles)(DataEntryWidgetOutputPlain);
