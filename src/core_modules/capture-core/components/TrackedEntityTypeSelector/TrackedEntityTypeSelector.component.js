// @flow
import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    SingleSelectField,
    SingleSelectOption,
    spacers,
} from '@dhis2/ui';
import type { Props } from './TrackedEntityTypeSelector.types';
import { scopeTypes } from '../../metaData';
import { useTrackedEntityTypesWithCorrelatedPrograms, useCurrentTrackedEntityTypeId } from '../../hooks';
import { InfoIconText } from '../InfoIconText';

const styles = ({ typography }) => ({
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


export const TrackedEntityTypeSelectorPlain =
  ({ classes, onSelect, onSetTrackedEntityTypeIdOnUrl, accessNeeded, headerText, footerText }: Props) => {
      const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
      const selectedSearchScopeId = useCurrentTrackedEntityTypeId();

      const handleSelectionChange = ({ selected }) => {
          onSelect(selected, scopeTypes.TRACKED_ENTITY_TYPE);
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
                              // $FlowFixMe https://github.com/facebook/flow/issues/2221
                              .filter(({ trackedEntityTypeAccess }) => {
                                  if (accessNeeded === 'write') {
                                      return trackedEntityTypeAccess
                                        && trackedEntityTypeAccess.data
                                        && trackedEntityTypeAccess.data.write;
                                  }
                                  if (accessNeeded === 'read') {
                                      return trackedEntityTypeAccess
                                        && trackedEntityTypeAccess.data
                                        && trackedEntityTypeAccess.data.read;
                                  }
                                  return false;
                              })
                              // $FlowFixMe https://github.com/facebook/flow/issues/2221
                              .map(({ trackedEntityTypeName, trackedEntityTypeId }) =>
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

export const TrackedEntityTypeSelectorComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(TrackedEntityTypeSelectorPlain);
