// @flow
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { SelectorButton } from './SelectorButton';
import { RestMenu } from './RestMenu';

import type { Column } from './selectors.types';

const getStyles = (theme: Theme) => ({
    selectorButtonContainer: {
        paddingRight: theme.typography.pxToRem(theme.spacing.unit),
        paddingBottom: theme.typography.pxToRem(theme.spacing.unit / 2),
        paddingTop: theme.typography.pxToRem(theme.spacing.unit / 2),
    },
    container: {
        display: 'flex',
        backgroundColor: 'white',
        padding: 50,
    },
});

type Props = {
    individualElementsArray: Array<Column>,
    restElementsArray: Array<Column>,
    classes: Object,
};

type State = {
    individualElementsArray: Array<Column>,
    restElementsArray: Array<Column>,
    openSelectorId?: string,
};

class Index extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            individualElementsArray: props.individualElementsArray,
            restElementsArray: props.restElementsArray,
        };
    }

    renderIndividualFilterButtons = () => {
        const { individualElementsArray } = this.state;
        return individualElementsArray
            .map(
                element => (
                    <div
                        key={element.id}
                        className={this.props.classes.selectorButtonContainer}
                    >
                        <SelectorButton
                            listId={'dontWorryAboutThis'}
                            itemId={element.id}
                            type={element.type}
                            title={element.header}
                            optionSet={element.optionSet}
                            singleSelect={element.singleSelect}
                        />
                    </div>
                ),
            );
    }

    renderRestButton = () => {
        const { restElementsArray } = this.state;
        return restElementsArray.length > 0 ? (
            <div
                className={this.props.classes.selectorButtonContainer}
            >
                <RestMenu
                    key={'restMenu'}
                    listId={'dontWorryAboutThis'}
                    columns={restElementsArray}
                />
            </div>
        ) : null;
    }

    render() {
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                {this.renderIndividualFilterButtons()}
                {this.renderRestButton()}
            </div>
        );
    }
}
Index.displayName = 'Selectors';
export const Selectors = withStyles(getStyles)(Index);
