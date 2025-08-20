import * as React from 'react';
import i18n from '@dhis2/d2-i18n';
import { Button, IconSearch24, IconAdd24, spacersNum } from '@dhis2/ui';
import { withStyles, type WithStyles } from '@material-ui/core/styles';

import type { SelectedRelationshipType } from '../newRelationship.types';
import { RegisterTei } from '../RegisterTei';
import { TeiSearch } from '../../../TeiSearch/TeiSearch.container';
import { TeiRelationshipSearchResults } from './SearchResults/TeiRelationshipSearchResults.component';
import { makeTrackedEntityTypeSelector } from './teiRelationship.selectors';
import { findModes } from '../findModes';
import { getDisplayName } from '../../../../trackedEntityInstances/getDisplayName';
import { ResultsPageSizeContext } from '../../shared-contexts';
import type { EnrollmentPayload } from
    '../../../DataEntries/EnrollmentRegistrationEntry/EnrollmentRegistrationEntry.types';
import type { TeiPayload } from
    '../../common/TEIRelationshipsWidget/RegisterTei/DataEntry/TrackedEntityInstance/dataEntryTrackedEntityInstance.types';
import type { TrackedEntityType } from '../../../../metaData';

type OwnProps = {
    findMode?: typeof findModes[keyof typeof findModes];
    onOpenSearch: (trackedEntityTypeId: string, programId?: string) => void;
    onSelectFindMode: (findMode: typeof findModes[keyof typeof findModes]) => void;
    onAddRelationship: (entity: any) => void;
    onCancel: () => void;
    selectedRelationshipType: SelectedRelationshipType;
    onGetUnsavedAttributeValues?: (() => Record<string, unknown>) | null;
};

type Props = OwnProps & WithStyles<typeof getStyles>;

const getStyles = (theme: any) => ({
    container: {},
    modeSelectionsContainer: {
        display: 'flex',
    },
    button: {
        margin: theme.typography.pxToRem(10),
        padding: theme.typography.pxToRem(10),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        backgroundColor: theme.palette.grey[500],
    },
    buttonIcon: {
        marginRight: spacersNum.dp8,
    },
}) as const;

const defaultTrackedEntityTypeName = 'Tracked entity instance';

class TeiRelationshipPlain extends React.Component<Props> {
    trackedEntityTypeSelector: (props: any) => TrackedEntityType;
    constructor(props: Props) {
        super(props);
        this.trackedEntityTypeSelector = makeTrackedEntityTypeSelector();
    }

    getTrackedEntityTypeName = () => {
        const trackedEntityType = this.trackedEntityTypeSelector(this.props);
        if (!trackedEntityType) {
            return defaultTrackedEntityTypeName;
        }
        return trackedEntityType.name;
    }

    handleAddRelationship = (teiId: string, values: any) => {
        const trackedEntityType = this.trackedEntityTypeSelector(this.props);
        this.props.onAddRelationship({
            id: teiId,
            name: getDisplayName(values, trackedEntityType.attributes, trackedEntityType.name),
        });
    }

    handleAddRelationshipWithNewTei = (
        itemId: string,
        dataEntryId: string,
        payload: EnrollmentPayload | TeiPayload,
    ) => {
        this.props.onAddRelationship({
            itemId,
            dataEntryId,
            data: payload,
            id: payload?.trackedEntity,
        });
    }

    renderModeSelections = () => {
        const { classes } = this.props;
        const trackedEntityTypeName = this.getTrackedEntityTypeName();
        return (
            <div
                className={classes.modeSelectionsContainer}
            >
                <div className={classes.button}>
                    <Button
                        large
                        dataTest="find-relationship-button"
                        color="primary"
                        onClick={() => this.props.onSelectFindMode(findModes.TEI_SEARCH)}
                    >
                        <span className={classes.buttonIcon}> <IconSearch24 /> </span>
                        {i18n.t(
                            'Link to an existing {{trackedEntityType}}',
                            { trackedEntityType: trackedEntityTypeName },
                        )}
                    </Button>
                </div>
                <div className={classes.button}>
                    <Button
                        large
                        dataTest="create-relationship-button"
                        color="primary"
                        onClick={() => this.props.onSelectFindMode(findModes.TEI_REGISTER)}
                    >
                        <span className={classes.buttonIcon}> <IconAdd24 /> </span>
                        {i18n.t('Create new {{trackedEntityType}}', {
                            trackedEntityType: trackedEntityTypeName, interpolation: { escapeValue: false },
                        })}
                    </Button>
                </div>
            </div>

        );
    }

    renderSearch = (props: any) => {
        const { selectedRelationshipType, onAddRelationship, ...passOnProps } = props;
        const trackedEntityTypeName = this.getTrackedEntityTypeName();
        return (
            <TeiSearch
                resultsPageSize={5}
                id="relationshipTeiSearch"
                getResultsView={viewProps => (
                    <TeiRelationshipSearchResults
                        trackedEntityTypeName={trackedEntityTypeName}
                        onAddRelationship={this.handleAddRelationship}
                        {...viewProps}
                    />
                )}
                {...passOnProps}
            />
        );
    }

    renderRegister = () => (
        <ResultsPageSizeContext.Provider value={{ resultsPageSize: 5 }}>
            <RegisterTei
                onLink={this.handleAddRelationship}
                onSave={this.handleAddRelationshipWithNewTei}
                onCancel={this.props.onCancel}
                onGetUnsavedAttributeValues={this.props.onGetUnsavedAttributeValues}
            />
        </ResultsPageSizeContext.Provider>
    );

    renderByMode = (findMode: any, props: any) => {
        if (findMode === findModes.TEI_SEARCH) {
            return this.renderSearch(props);
        }
        if (findMode === findModes.TEI_REGISTER) {
            return this.renderRegister();
        }
        return null;
    }

    render() {
        const { classes, findMode, onOpenSearch, onSelectFindMode, ...passOnProps } = this.props;

        return (
            <div className={classes.container}>
                {findMode ?
                    this.renderByMode(findMode, passOnProps) :
                    this.renderModeSelections()
                }
            </div>
        );
    }
}

export const TeiRelationship = withStyles(getStyles)(TeiRelationshipPlain);
