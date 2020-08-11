// @flow

import * as React from 'react';
import { Avatar, Grid, withStyles } from '@material-ui/core';
import { DataElement } from '../../metaData';
import { convertValue } from '../../converters/clientToList';
import type { SearchResultItem } from '../Pages/Search/SearchResults/SearchResults.types';


type Props = {
    item: SearchResultItem,
    getCustomTopElements?: ?(props: Object) => React.Element<any>,
    getCustomBottomElements?: ?(props: Object) => React.Element<any>,
    imageDataElement: DataElement,
    dataElementChunks: Array<Array<DataElement>>,
    classes: Object,
};

const getStyles = (theme: Theme) => ({
    itemContainer: {
        display: 'flex',
        margin: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
        borderRadius: theme.typography.pxToRem(4),
        border: `2px solid ${theme.palette.grey.light}`,
        backgroundColor: theme.palette.grey.lighter,
        flexDirection: 'column',
    },
    itemDataContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    itemValuesContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        flexGrow: 1,
    },
    value: {
        padding: theme.typography.pxToRem(2),
    },
    elementName: {
        paddingRight: theme.typography.pxToRem(10),
        fontWeight: 500,
    },
    image: {
        width: theme.typography.pxToRem(60),
        height: theme.typography.pxToRem(60),
    },
    imageContainer: {
        margin: theme.typography.pxToRem(6),
        minWidth: theme.typography.pxToRem(70),
    },
});

class CardListItem extends React.Component<Props> {
    renderImageDataElement = (imageDataElement: DataElement) => {
        const { item, classes } = this.props;
        const imageValue = item.values[imageDataElement.id];
        return (
            <div className={classes.imageContainer}>
                {imageValue && <Avatar src={imageValue.url} alt={imageValue.name} className={classes.image} />}
            </div>
        );
    }

    renderChunks = (dataElementChunks: Array<Array<DataElement>>) =>
        dataElementChunks.map((chunk, index) => (
            <Grid
                item
                xs={12}
                md={6}
                lg={3}
                key={index.toString()}
            >
                {this.renderChunkValues(chunk)}
            </Grid>
        ));

    renderChunkValues = (dataElementChunks: Array<DataElement>) => {
        const { item, classes } = this.props;
        return dataElementChunks.map(element => (
            <div key={element.id} className={classes.value}>
                <span className={classes.elementName}>{element.name}:</span>
                <span>{element.convertValue(item.values[element.id], convertValue)}</span>
            </div>
        ));
    }

    render() {
        const {
            item,
            classes,
            imageDataElement,
            dataElementChunks,
            getCustomTopElements,
            getCustomBottomElements,
        } = this.props;
        return (
            <div
                data-test="dhis2-capture-card-list-item"
                key={item.id}
                className={classes.itemContainer}
            >
                {getCustomTopElements && getCustomTopElements(this.props)}
                <div className={classes.itemDataContainer}>
                    {imageDataElement && this.renderImageDataElement(imageDataElement)}
                    <div className={classes.itemValuesContainer}>
                        {this.renderChunks(dataElementChunks)}
                    </div>
                </div>
                {getCustomBottomElements && getCustomBottomElements(this.props)}
            </div>
        );
    }
}

export default withStyles(getStyles)(CardListItem);
