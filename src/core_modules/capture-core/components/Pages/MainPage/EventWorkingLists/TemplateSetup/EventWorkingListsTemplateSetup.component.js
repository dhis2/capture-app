// @flow
import React, { useMemo } from 'react';
import uuid from 'uuid/v4';
import { convertToEventFilterEventQueryCriteria } from '../helpers/eventFilters';
import { EventWorkingListsViewMenuSetup } from '../ViewMenuSetup';
import type { Props } from './eventWorkingListsTemplateSetup.types';

const useWorkingListsTemplates = (templates) =>
  useMemo(
    () =>
      (templates || []).map((template) => ({
        ...template,
        updating: !!template.nextCriteria,
      })),
    [templates],
  );

export const EventWorkingListsTemplateSetup = ({
  filters,
  columns,
  sortById,
  sortByDirection,
  program,
  onAddTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  templates,
  ...passOnProps
}: Props) => {
  const injectArgumentsForUpdateTemplate = React.useCallback(
    (template) => {
      const eventQueryCriteria = convertToEventFilterEventQueryCriteria({
        filters,
        // $FlowFixMe[incompatible-call] automated comment
        columns: new Map(columns.map((c) => [c.id, c])),
        // $FlowFixMe[incompatible-call] automated comment
        sortById,
        // $FlowFixMe[incompatible-call] automated comment
        sortByDirection,
      });
      onUpdateTemplate(template, eventQueryCriteria, {
        filters,
        visibleColumnIds: columns && columns.filter(({ visible }) => visible).map(({ id }) => id),
        sortById,
        sortByDirection,
        programId: program.id,
      });
    },
    [onUpdateTemplate, filters, columns, sortById, sortByDirection, program.id],
  );

  const injectArgumentsForAddTemplate = React.useCallback(
    (name, template) => {
      const eventQueryCriteria = convertToEventFilterEventQueryCriteria({
        filters,
        // $FlowFixMe[incompatible-call] automated comment
        columns: new Map(columns.map((c) => [c.id, c])),
        // $FlowFixMe[incompatible-call] automated comment
        sortById,
        // $FlowFixMe[incompatible-call] automated comment
        sortByDirection,
      });
      onAddTemplate(name, eventQueryCriteria, {
        template,
        filters,
        visibleColumnIds: columns && columns.filter(({ visible }) => visible).map(({ id }) => id),
        sortById,
        sortByDirection,
        clientId: uuid(),
        programId: program.id,
      });
    },
    [onAddTemplate, filters, columns, sortById, sortByDirection, program.id],
  );

  const injectArgumentsForDeleteTemplate = React.useCallback(
    (template) => onDeleteTemplate(template, program.id),
    [onDeleteTemplate, program.id],
  );

  return (
    <EventWorkingListsViewMenuSetup
      {...passOnProps}
      filters={filters}
      columns={columns}
      sortById={sortById}
      sortByDirection={sortByDirection}
      program={program}
      onAddTemplate={injectArgumentsForAddTemplate}
      onUpdateTemplate={injectArgumentsForUpdateTemplate}
      onDeleteTemplate={injectArgumentsForDeleteTemplate}
      templates={useWorkingListsTemplates(templates)}
    />
  );
};
