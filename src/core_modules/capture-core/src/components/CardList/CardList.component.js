// @flow

import * as React from 'react';
import { withStyles } from '@material-ui/core';
import LoadingMask from '../LoadingMasks/LoadingMaskElementCenter.component';
import { DataElement } from '../../metaData';
import CardListItem from './CardListItem.component';
import makeDataElementsContainerSelector from './CardList.selectors';


export type ItemValues = {
    [elementId: string]: any,
}

export type Item = {
    id: string,
    values: ItemValues,
}

type Props = {
    itemsLoading: ?boolean,
    items: ?Array<Item>,
    getCustomItemTopElements?: ?(itemProps: Object) => React.Element<any>,
    getCustomItemBottomElements?: ?(itemProps: Object) => React.Element<any>,
    classes: {
        noItemsContainer: string,
        loadingContainer: string,
    },
    noItemsText: string,
    dataElements: Array<DataElement>,
}

const getStyles = (theme: Theme) => ({
    noItemsContainer: {
        fontStyle: 'italic',
        padding: theme.typography.pxToRem(10),
    },
});

class CardList extends React.Component<Props> {
    static defaultProps = {
        itemTypeName: 'item',
    }
    getDataElementsContainer: Function;
    trackedEntityTypeAttibutesSelector: Function;
    constructor(props: Props) {
        super(props);
        this.getDataElementsContainer = makeDataElementsContainerSelector();
    }

    renderLoading = () => (
        <div className={this.props.classes.loadingContainer}>
            <LoadingMask />
        </div>
    );

    renderItems = () => {
        const {
            items,
            getCustomItemBottomElements,
            getCustomItemTopElements,
        } = this.props;
        if (!items || items.length === 0) {
            return this.renderNoItems();
        }

        const dataElementsContainer = this.getDataElementsContainer(this.props);

        return items.map(item => (
            <CardListItem
                item={item}
                getCustomTopElements={getCustomItemTopElements}
                getCustomBottomElements={getCustomItemBottomElements}
                {...dataElementsContainer}
            />
        ));
    }


    renderNoItems = () => {
        const { classes, noItemsText } = this.props;
        return (
            <div className={classes.noItemsContainer}>
                {noItemsText}
            </div>
        );
    }

    render() {
        const { itemsLoading } = this.props;
        return (
            <div>
                {itemsLoading ?
                    this.renderLoading() :
                    this.renderItems()
                }
            </div>
        );
    }
}

export default withStyles(getStyles)(CardList);
