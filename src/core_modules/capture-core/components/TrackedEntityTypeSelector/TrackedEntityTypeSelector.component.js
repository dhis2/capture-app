// @flow
import React, { useMemo, type ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Grid from '@material-ui/core/Grid';
import {
    SingleSelect,
    SingleSelectOption,
    colors,
} from '@dhis2/ui';
import type { Props } from './TrackedEntityTypeSelector.types';
import { scopeTypes } from '../../metaData';
import { useTrackedEntityTypesWithCorrelatedPrograms } from '../../hooks/useTrackedEntityTypesWithCorrelatedPrograms';
import { useCurrentTrackedEntityTypeId } from '../../hooks/useCurrentTrackedEntityTypeId';

const styles = ({ typography }) => ({
    searchDomainSelectorSection: {
        margin: typography.pxToRem(10),
    },
    header: {
        paddingLeft: 8,
    },
    searchRow: {
        maxWidth: typography.pxToRem(400),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        padding: '8px 0',
    },
    searchRowSelectElement: {
        marginLeft: 8,
        marginRight: 8,
        marginBottom: 8,
        width: '100%',
    },
    gridContainerInformativeText: {
        marginLeft: 8,
        marginTop: 4,
        marginBottom: 12,
    },
    gridItemInformativeText: {
        fontSize: 14,
        marginLeft: 8,
        color: colors.grey800,
    },
    customEmpty: {
        textAlign: 'center',
        padding: '8px 24px',
    },
});

const InfoOutlinedIconWithStyles = withStyles({
    root: {
        fontSize: 14,
        color: colors.grey800,
        transformBox: 'view-box',
        position: 'relative',
        top: '2px',
    },
})(InfoOutlinedIcon);

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
                  <Grid container direction="row" alignItems="center" className={classes.gridContainerInformativeText}>
                      <Grid item>
                          <InfoOutlinedIconWithStyles />
                      </Grid>
                      <Grid item className={classes.gridItemInformativeText}>
                          {i18n.t('You can also choose a program from the top bar and search in that program')}
                      </Grid>
                  </Grid>
          }
      </>
      );
  };

export const TrackedEntityTypeSelectorComponent: ComponentType<$Diff<Props, CssClasses>> = withStyles(styles)(TrackedEntityTypeSelectorPlain);
