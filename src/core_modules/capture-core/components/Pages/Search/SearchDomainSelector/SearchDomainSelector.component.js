// @flow
import React, { useMemo } from 'react';
import type { ComponentType } from 'react';
import i18n from '@dhis2/d2-i18n';
import withStyles from '@material-ui/core/styles/withStyles';
import {
    SingleSelect,
    SingleSelectOption,
} from '@dhis2/ui-core';
import { Section, SectionHeaderSimple } from '../../../Section';
import type { OwnProps, Props } from './SearchDomainSelector.types';

const styles = (theme: Theme) => ({
    searchDomainSelectorSection: {
        margin: theme.typography.pxToRem(10),
    },
    searchRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchRowTitle: {
        flexBasis: 200,
        marginLeft: 8,
    },
    searchRowSelectElement: {
        width: '100%',
    },
    customEmpty: {
        textAlign: 'center',
        padding: '8px 24px',
    },
    divider: {
        padding: '8px',
    },
});

export const Index =
  ({ trackedEntityTypesWithCorrelatedPrograms, classes, onSelect, selectedSearchScope }: Props) =>
      (<Section
          className={classes.searchDomainSelectorSection}
          header={
              <SectionHeaderSimple
                  containerStyle={{ paddingLeft: 8, borderBottom: '1px solid #ECEFF1' }}
                  title={i18n.t('Search scope')}
              />
          }
      >
          <div className={classes.searchRow} style={{ padding: '8px 0' }}>
              <div className={classes.searchRowTitle}>{ i18n.t('Find results from') }</div>
              <div className={classes.searchRowSelectElement} style={{ marginRight: 8 }}>
                  <SingleSelect
                      onChange={({ selected }) => { onSelect(selected); }}
                      selected={selectedSearchScope}
                      empty={<div className={classes.customEmpty}>Custom empty component</div>}
                  >
                      {
                          useMemo(() => Object.values(trackedEntityTypesWithCorrelatedPrograms)
                              // $FlowFixMe https://github.com/facebook/flow/issues/2221
                              .map(({ trackedEntityTypeName, trackedEntityTypeId, programs: tePrograms }) =>
                                  // SingleSelect component wont allow us to wrap the SingleSelectOption
                                  // in any other element and still make use of the default behaviour.
                                  // Therefore we are returning the group title and the
                                  // SingleSelectOption in an array.
                                  [
                                      <SingleSelectOption
                                          value={trackedEntityTypeId}
                                          label={trackedEntityTypeName}
                                      />,
                                      tePrograms.map(({ programName, programId }) =>
                                          (<SingleSelectOption value={programId} label={programName} />)),
                                      <div className={classes.divider} key={trackedEntityTypeId}>
                                          <hr />
                                      </div>,
                                  ],
                              ),
                          [
                              classes.divider,
                              trackedEntityTypesWithCorrelatedPrograms,
                          ])
                      }
                  </SingleSelect>
              </div>
          </div>
      </Section>
      );

export const SearchDomainSelector: ComponentType<OwnProps> = withStyles(styles)(Index);
