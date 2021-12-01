// @flow
import {
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui';
import withStyles from '@material-ui/core/styles/withStyles';
import React, { useMemo, type ComponentType } from 'react';
import { useCurrentTrackedEntityTypeId } from '../../hooks/useCurrentTrackedEntityTypeId';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';
import { scopeTypes } from '../../metaData';
import { InfoIconText } from '../InfoIconText';
import type { Props } from './TrackedEntityTypeSelector.types';

const styles = ({ typography }) => ({
    header: {
        paddingLeft: 8,
    },
    searchRow: {
        maxWidth: typography.pxToRem(400),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        paddingTop: '8px',
    },
    searchRowSelectElement: {
        marginLeft: 8,
        marginRight: 8,
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
          <div className={classes.header}>
              { headerText }
          </div>

          <div className={classes.searchRow}>
              <div className={classes.searchRowSelectElement}>
                  <SingleSelect
                      onChange={handleSelectionChange}
                      selected={selectedSearchScopeId}
                      empty={<div className={classes.customEmpty}>Custom empty component</div>}
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
                  </SingleSelect>
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
