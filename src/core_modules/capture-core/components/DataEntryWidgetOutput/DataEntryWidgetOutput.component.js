
// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import StickyOnScroll from '../Sticky/StickyOnScroll.component';
import ErrorsSection from './ErrorsSection/ErrorsSection.container';
import WarningsSection from './WarningsSection/WaningsSection.container';
import FeedbacksSection from '../Pages/ViewEvent/RightColumn/FeedbacksSection/FeedbacksSection.container';
import IndicatorsSection from '../Pages/ViewEvent/RightColumn/IndicatorsSection/IndicatorsSection.container';

type Props = {
    onLink: (teiId: string) => void,
    classes: {
        stickyOnScroll: string,
    }
};

const getStyles = (theme: Theme) => ({
    stickyOnScroll: {
        position: 'relative',
        flexGrow: 1,
        width: theme.typography.pxToRem(300),
        margin: theme.typography.pxToRem(10),
        marginTop: 0,
    },
});

const componentContainers = [
    { id: 'ErrorsSection', Component: ErrorsSection },
    { id: 'WarningsSection', Component: WarningsSection },
    { id: 'FeedbacksSection', Component: FeedbacksSection },
    { id: 'IndicatorsSection', Component: IndicatorsSection },
];

class DataEntryWidgetOutputComponent extends React.Component<Props> {
    renderComponent = (container: {id: string, Component: React.ComponentType<any> }, props: Object) => {
        const { onLink, ...otherProps } = props;
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
                containerClass={classes.stickyOnScroll}
            >
                <div>
                    {componentContainers.map(c => this.renderComponent(c, passOnProps))}
                </div>
            </StickyOnScroll>
        );
    }
}

export default withStyles(getStyles)(DataEntryWidgetOutputComponent);

