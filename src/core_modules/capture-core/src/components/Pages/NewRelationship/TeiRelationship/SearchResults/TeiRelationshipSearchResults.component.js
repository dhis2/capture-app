// @flow

import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Avatar, Grid, withStyles } from '@material-ui/core';
import Button from '../../../../Buttons/Button.component';
import LoadingMask from '../../../../LoadingMasks/LoadingMaskElementCenter.component';
import { DataElement } from '../../../../../metaData';
import { convertValue } from '../../../../../converters/clientToList';
import { makeAttributesContainerSelector } from './teiRelationshipSearchResults.selectors';

type Props = {
    resultsLoading: ?boolean,
    teis: Array<any>,
    onAddRelationship: (entity: { id: string, displayName: string }) => void,
    onNewSearch: () => void,
    onEditSearch: () => void,
    classes: Object,
    trackedEntityTypeName: string,
    navigationElements: React.Element<any>,
}

type AttributesContainer = {
    attributeChunks: Array<Array<DataElement>>,
    profilePictureAttribute: ?DataElement,
}

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
    itemInnerContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    value: {
        padding: theme.typography.pxToRem(2),
    },
    itemValuesContainer: {
        flexGrow: 1,
        padding: theme.typography.pxToRem(10),
    },
    resultsContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
    emptyResultsContainer: {
        fontStyle: 'italic',
        padding: theme.typography.pxToRem(10),
    },
    attributeName: {
        paddingRight: theme.typography.pxToRem(10),
        fontWeight: 500,
    },
    profilePicture: {
        width: theme.typography.pxToRem(60),
        height: theme.typography.pxToRem(60),
    },
    profilePictureContainer: {
        margin: theme.typography.pxToRem(6),
        minWidth: theme.typography.pxToRem(70),
    },
    actionContainer: {
        margin: theme.typography.pxToRem(10),
        backgroundColor: theme.palette.grey.lighter,
    },
    actionButton: {
        margin: theme.typography.pxToRem(10),
        color: theme.palette.primary.dark,
        borderRadius: 0,
        border: `1px solid ${theme.palette.primary.dark}`,
    },
});

class TeiRelationshipSearchResults extends React.Component<Props> {
    getAttributesContainer: Function;
    trackedEntityTypeAttibutesSelector: Function;
    constructor(props: Props) {
        super(props);
        this.getAttributesContainer = makeAttributesContainerSelector();
    }

    renderChunkValues = (attributes: Array<DataElement>, values: Object, classes: Object) => attributes.map(attribute => (
        <div key={attribute.id} className={classes.value}>
            <span className={classes.attributeName}>{attribute.name}:</span>
            <span>{attribute.convertValue(values[attribute.id], convertValue)}</span>
        </div>
    ))

    renderChunks = (attributeChunks: any, values: Object, classes: Object) => attributeChunks.map((attrChunk, i) => (
        <Grid item xs={12} md={6} lg={3} key={i.toString()}>
            {this.renderChunkValues(attrChunk, values, classes)}
        </Grid>
    ));


    getDisplayName = (tei, attributeChunks) => {
        if (tei.displayName) return tei.displayName;
        const valueIds = Object.keys(tei.values);
        const attributes = attributeChunks && attributeChunks.length > 0 ? attributeChunks[0] : [];
        return attributes
            .filter(a => valueIds.some(id => id === a.id))
            .slice(0, 2)
            .map(a => tei.values[a.id])
            .join(' ');
    }

    renderValues = (values: any, attributeChunks: Array<Array<DataElement>>, classes: Object) => (
        <div className={classes.itemValuesContainer}>
            <Grid container spacing={16}>
                {this.renderChunks(attributeChunks, values, classes)}
            </Grid>
        </div>
    );

    renderProfilePicture = (values: any, profilePictureAttribute: ?DataElement, classes: Object) => {
        const pictureValue = profilePictureAttribute && values[profilePictureAttribute.id];
        return (
            <div className={classes.profilePictureContainer}>
                {pictureValue && <Avatar src={pictureValue.url} alt={pictureValue.name} className={classes.profilePicture} />}
            </div>
        );
    }

    renderItem = (tei: any, classes: Object, attributesContainer: AttributesContainer) => {
        const { attributeChunks, profilePictureAttribute } = attributesContainer;
        const displayName = this.getDisplayName(tei, attributesContainer.attributeChunks);
        return (
            <div
                key={tei.id}
                className={classes.itemContainer}
            >
                <div className={classes.itemInnerContainer}>
                    {this.renderProfilePicture(tei.values, profilePictureAttribute, classes)}
                    {this.renderValues(tei.values, attributeChunks, classes)}
                </div>
                <div>
                    <Button
                        onClick={() => this.props.onAddRelationship({ id: tei.id, displayName })}
                        color="primary"
                    >
                        {i18n.t('Link')}
                    </Button>
                </div>

            </div>
        );
    }

    renderLoading = (classes: Object) => (
        <div className={classes.loadingContainer}>
            <LoadingMask />
        </div>
    )

    renderResults = (teis: Array<any>, classes: Object) => {
        if (teis && teis.length > 0) {
            const attributesContainer = this.getAttributesContainer(this.props);
            return (
                <div className={classes.resultsContainer}>
                    {teis.map(tei => this.renderItem(tei, classes, attributesContainer))}
                    <div className={classes.pagination}>
                        {this.props.navigationElements}
                    </div>
                </div>
            );
        }

        return (
            <div className={classes.emptyResultsContainer}>
                {i18n.t('No {{trackedEntityType}} found', { trackedEntityType: this.props.trackedEntityTypeName })}
            </div>
        );
    }

    renderActions = (classes: Object) => (
        <div className={classes.actionContainer}>
            <Button onClick={this.props.onNewSearch} className={classes.actionButton}>New search</Button>
            <Button onClick={this.props.onEditSearch} className={classes.actionButton}>Edit search</Button>
        </div>
    );

    render() {
        const { teis, resultsLoading, classes } = this.props;
        return (
            <div>
                {resultsLoading ?
                    this.renderLoading(classes) :
                    <div>
                        {this.renderActions(classes)}
                        {this.renderResults(teis, classes)}
                    </div>
                }
            </div>
        );
    }
}

export default withStyles(getStyles)(TeiRelationshipSearchResults);
