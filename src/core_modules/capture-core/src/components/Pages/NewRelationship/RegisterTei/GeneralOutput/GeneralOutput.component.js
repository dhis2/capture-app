
// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core';
import ErrorsSection from '../../../ViewEvent/RightColumn/ErrorsSection/ErrorsSection.container';
import WarningsSection from './WarningSection/WaningSection.container';
import FeedbacksSection from '../../../ViewEvent/RightColumn/FeedbacksSection/FeedbacksSection.container';
import IndicatorsSection from '../../../ViewEvent/RightColumn/IndicatorsSection/IndicatorsSection.container';

type Props = {
    classes: {
        container: string,
    }
};

const getStyles = (theme: Theme) => ({
    container: {
        flexBasis: theme.typography.pxToRem(0),
        flexGrow: 1,
    },
});

const componentContainers = [
    { id: 'ErrorsSection', Component: ErrorsSection },
    { id: 'WarningsSection', Component: WarningsSection },
    { id: 'FeedbacksSection', Component: FeedbacksSection },
    { id: 'IndicatorsSection', Component: IndicatorsSection },
];

class GeneralOutput extends React.Component<Props> {
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

export default withStyles(getStyles)(GeneralOutput);

