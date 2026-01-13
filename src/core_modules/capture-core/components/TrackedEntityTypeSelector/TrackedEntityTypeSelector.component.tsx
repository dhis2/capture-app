import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from 'capture-core-utils/styles';
import { spacers, SimpleSingleSelect, Field } from '@dhis2/ui';
import type { Props, SelectOption } from './TrackedEntityTypeSelector.types';
import { scopeTypes } from '../../metaData';
import { useTrackedEntityTypesWithCorrelatedPrograms, useCurrentTrackedEntityTypeId } from '../../hooks';

const styles: Readonly<any> = ({ typography }: any) => ({
    searchRow: {
        maxWidth: typography.pxToRem(450),
        marginBottom: spacers.dp24,

    },
});

type ComponentProps = Props & WithStyles<typeof styles>;

export const TrackedEntityTypeSelectorPlain =
    ({ classes, onSelect, onSetTrackedEntityTypeIdOnUrl, accessNeeded, footerText }: ComponentProps) => {
        const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
        const selectedSearchScopeId = useCurrentTrackedEntityTypeId();

        const options: SelectOption[] = useMemo(() =>
            Object.values(trackedEntityTypesWithCorrelatedPrograms)
                .filter(({ trackedEntityTypeAccess }: any) => {
                    if (accessNeeded === 'write') {
                        return trackedEntityTypeAccess?.data?.write;
                    }
                    if (accessNeeded === 'read') {
                        return trackedEntityTypeAccess?.data?.read;
                    }
                    return false;
                })
                .map(({ trackedEntityTypeName, trackedEntityTypeId }: any) => ({
                    value: trackedEntityTypeId,
                    label: trackedEntityTypeName,
                })),
        [accessNeeded, trackedEntityTypesWithCorrelatedPrograms],
        );

        const selectedOption = useMemo(() => {
            if (!selectedSearchScopeId) {
                return undefined;
            }
            return options.find(opt => opt.value === selectedSearchScopeId);
        }, [selectedSearchScopeId, options]);

        const handleSelectionChange = (value: string) => {
            onSelect(value, scopeTypes.TRACKED_ENTITY_TYPE as keyof typeof scopeTypes);
            onSetTrackedEntityTypeIdOnUrl({ trackedEntityTypeId: value });
        };

        return (
            <div className={classes.searchRow}>
                <Field helpText={footerText}>
                    <SimpleSingleSelect
                        name="tracked-entity-type-selector"
                        options={options}
                        selected={selectedOption}
                        placeholder={i18n.t('Select tracked entity type')}
                        onChange={handleSelectionChange}
                        empty={i18n.t('No tracked entity types available')}
                        dataTest="dhis2-simplesingleselect"
                    />
                </Field>
            </div>
        );
    };

export const TrackedEntityTypeSelectorComponent = withStyles(styles)(TrackedEntityTypeSelectorPlain) as ComponentType<Props>;
