// @flow
import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui';
import type { Props } from './TrackedEntityTypeSelector.types';
import { scopeTypes } from '../../metaData';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';
import { useCurrentTrackedEntityTypeId } from '../../hooks/useCurrentTrackedEntityTypeId';
import { InfoIconText } from '../InfoIconText';

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
  ({ classes, onSelect, onSetTrackedEntityTypeIdOnUrl }: Props) => {
      const trackedEntityTypesWithCorrelatedPrograms = useTrackedEntityTypesWithCorrelatedPrograms();
      const selectedSearchScopeId = useCurrentTrackedEntityTypeId();

      const handleSelectionChange = ({ selected }) => {
          onSelect(selected, scopeTypes.TRACKED_ENTITY_TYPE);
          onSetTrackedEntityTypeIdOnUrl({ trackedEntityTypeId: selected });
      };

      return (<>
          <div className={classes.header}>
              { i18n.t('Search for')}
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
                              .map(({ trackedEntityTypeName, trackedEntityTypeId }) =>
                                  (<SingleSelectOption
                                      key={trackedEntityTypeId}
                                      value={trackedEntityTypeId}
                                      label={trackedEntityTypeName}
                                  />),
                              ), [trackedEntityTypesWithCorrelatedPrograms])
                      }
                  </SingleSelect>
              </div>
          </div>
          {
              !selectedSearchScopeId &&
              <div className={classes.informativeIcon}>
                  <InfoIconText
                      text={i18n.t('You can also choose a program from the top bar and search in that program')}
                  />
              </div>
          }
      </>
      );
  };

export const TrackedEntityTypeSelectorComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(TrackedEntityTypeSelectorPlain);
