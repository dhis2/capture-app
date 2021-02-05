
// @flow
import * as React from 'react';
import { withStyles } from '@material-ui/core/styles';
import StickyOnScroll from '../Sticky/StickyOnScroll.component';
import ErrorsSection from './OutputSection/ErrorsSection/ErrorsSection.container';
import WarningsSection from './OutputSection/WarningsSection/WaningsSection.container';
import FeedbacksSection from './OutputSection/FeedbacksSection/FeedbacksSection.container';
import IndicatorsSection from './OutputSection/IndicatorsSection/IndicatorsSection.container';
import AssigneeSection from './OutputSection/AssigneeSection/AssigneeSection.container';
import RelationshipsSection from './OutputSection/RelationshipsSection/RelationshipsSection.container';
import NotesSection from './OutputSection/NotesSection/NotesSection.container';

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
        minWidth: theme.typography.pxToRem(300),
        marginTop: 0,
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

class DataEntryWidgetOutputClass extends React.Component<Props> {
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

export const DataEntryWidgetOutputComponent =
  withStyles(getStyles)(DataEntryWidgetOutputClass);

