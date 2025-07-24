import * as React from 'react';
import { withStyles, type WithStyles, type Theme } from '@material-ui/core/styles';
import { StickyOnScroll } from '../Sticky/StickyOnScroll.component';
import { ErrorsSection } from './ErrorsSection/ErrorsSection.container';
import { WarningsSection } from './WarningsSection/WarningsSection.container';
import { FeedbacksSection } from '../Pages/ViewEvent/RightColumn/FeedbacksSection/FeedbacksSection.container';
import { IndicatorsSection } from '../Pages/ViewEvent/RightColumn/IndicatorsSection/IndicatorsSection.container';

type OwnProps = {
    onLink: (teiId: string, values: Record<string, unknown>) => void;
};

const getStyles = (theme: Theme): Readonly<any> => ({
    stickyOnScroll: {
        position: 'relative',
        flexGrow: 1,
        width: theme.typography.pxToRem(300),
        margin: theme.typography.pxToRem(10),
        marginTop: 0,
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
                <div>
                    {componentContainers.map(c => this.renderComponent(c, passOnProps))}
                </div>
            </StickyOnScroll>
        );
    }
}

export const DataEntryWidgetOutputComponent = withStyles(getStyles)(DataEntryWidgetOutputPlain);
