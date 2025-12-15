import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core';

import { spacers } from '@dhis2/ui';
import { SimpleSingleSelect } from '@dhis2-ui/select';
import type { Props } from './TrackedEntityTypeSelector.types';
import { scopeTypes } from '../../metaData';
import { useTrackedEntityTypesWithCorrelatedPrograms, useCurrentTrackedEntityTypeId } from '../../hooks';
import { InfoIconText } from '../InfoIconText';

const styles: Readonly<any> = ({ typography }: any) => ({
    searchRow: {
        maxWidth: typography.pxToRem(400),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        marginBottom: spacers.dp8,
    },
    searchRowSelectElement: {
        width: '100%',
    },
    informativeIcon: {
        marginLeft: 8,
    },
    customEmpty: {
        textAlign: 'center',
        padding: '8px 24px',
    },
});

type ComponentProps = Props & WithStyles<typeof styles>;

export const TrackedEntityTypeSelectorPlain =
  ({ classes, onSelect, onSetTrackedEntityTypeIdOnUrl, accessNeeded, headerText, footerText }: ComponentProps) => {
      const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
      const selectedSearchScopeId = useCurrentTrackedEntityTypeId();

      const options = useMemo(() =>
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

      const selectedOption = selectedSearchScopeId
          ? options.find(opt => opt.value === selectedSearchScopeId) ?? null
          : null;

      const handleSelectionChange = (nextValue: string | { label: string; value: string }) => {
          // Handle both string and object (implementation sends object, types say string)
          const value = typeof nextValue === 'string' ? nextValue : nextValue?.value || '';
          onSelect(value, scopeTypes.TRACKED_ENTITY_TYPE as keyof typeof scopeTypes);
          onSetTrackedEntityTypeIdOnUrl({ trackedEntityTypeId: value });
      };

      return (<>

          <div className={classes.searchRow}>
              <div className={classes.searchRowSelectElement}>
                  {headerText && (
                      <div style={{ display: 'block', marginBottom: '8px' }}>
                          {headerText}
                      </div>
                  )}
                  <SimpleSingleSelect
                      name="tracked-entity-type-selector"
                      options={options}
                      // @ts-expect-error - selected is not typed correctly
                      selected={selectedOption}
                      placeholder={i18n.t('Select tracked entity type')}
                      onChange={handleSelectionChange}
                      empty={
                          <div className={classes.customEmpty}>
                              {i18n.t('No tracked entity types available')}
                          </div>
                      }
                  />
              </div>
          </div>
          {
              !selectedSearchScopeId &&
              <div className={classes.informativeIcon}>
                  <InfoIconText>
                      { footerText }
                  </InfoIconText>
              </div>
          }
      </>
      );
  };

export const TrackedEntityTypeSelectorComponent = withStyles(styles)(TrackedEntityTypeSelectorPlain) as ComponentType<Props>;
