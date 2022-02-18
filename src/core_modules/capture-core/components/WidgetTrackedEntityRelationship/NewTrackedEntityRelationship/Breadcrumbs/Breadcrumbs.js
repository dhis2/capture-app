// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { spacers } from '@dhis2/ui';
import { withStyles } from '@material-ui/core';
import { LinkButton } from '../../../Buttons/LinkButton.component';
import { NewTEIRelationshipStatuses } from '../../WidgetTrackedEntityRelationship.const';

const styles = {
    container: {
        padding: `${spacers.dp8} 0`,
    },
    slash: {
        padding: 5,
    },
};

const BreadcrumbsPlain = ({
    selectedRelationshipType,
    onResetRelationshipType,
    pageStatus,
    classes,
}) => {
    const initialText = i18n.t('New TEI Relationship');
    const renderSlash = () => (<span className={classes.slash}>/</span>);

    return (
        <div className={classes.container}>
            {pageStatus === NewTEIRelationshipStatuses.MISSING_RELATIONSHIP_TYPE && (
                <span>{initialText}</span>
            )}

            {pageStatus === NewTEIRelationshipStatuses.MISSING_CREATION_MODE && (
                <>
                    <LinkButton onClick={onResetRelationshipType}>{initialText}</LinkButton>
                    {renderSlash()}
                    <span>{selectedRelationshipType.displayName}</span>
                </>
            )}
        </div>
    );
};

export const Breadcrumbs = withStyles(styles)(BreadcrumbsPlain);
