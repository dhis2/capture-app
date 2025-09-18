import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import { withStyles, type WithStyles } from '@material-ui/core';

import {
    SingleSelectField,
    SingleSelectOption,
    spacers,
} from '@dhis2/ui';
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

export const TrackedEntityTypeSelectorPlain = ({
    classes,
    onSelect,
    onSetTrackedEntityTypeIdOnUrl,
    accessNeeded,
    headerText,
    footerText
}: ComponentProps) => {
      const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
      const selectedSearchScopeId = useCurrentTrackedEntityTypeId();

      const handleSelectionChange = ({ selected }: { selected: string }) => {
          onSelect(selected, scopeTypes.TRACKED_ENTITY_TYPE as keyof typeof scopeTypes);
          onSetTrackedEntityTypeIdOnUrl({ trackedEntityTypeId: selected });
      };

      return (<>

          <div className={classes.searchRow}>
              <div className={classes.searchRowSelectElement}>
                  <SingleSelectField
                      label={headerText}
                      onChange={handleSelectionChange}
                      selected={selectedSearchScopeId}
                      empty={
                          <div className={classes.customEmpty}>
                              {i18n.t('No tracked entity types available')}
                          </div>
                      }
                  >
                      {
                          useMemo(() => Object.values(trackedEntityTypesWithCorrelatedPrograms)
                              .filter(({ trackedEntityTypeAccess }: any) => {
                                  if (accessNeeded === 'write') {
                                      return trackedEntityTypeAccess?.data?.write;
                                  }
                                  if (accessNeeded === 'read') {
                                      return trackedEntityTypeAccess?.data?.read;
                                  }
                                  return false;
                              })
                              .map(({ trackedEntityTypeName, trackedEntityTypeId }: any) =>
                                  (<SingleSelectOption
                                      key={trackedEntityTypeId}
                                      value={trackedEntityTypeId}
                                      label={trackedEntityTypeName}
                                  />),
                              ), [
                              accessNeeded,
                              trackedEntityTypesWithCorrelatedPrograms,
                          ])
                      }
                  </SingleSelectField>
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
