// @flow
import * as React from 'react';
import { Chip } from '@dhis2/ui-core';
import TemplateSelectorChipContent from './TemplateSelectorChipContent.component';
import type { WorkingListTemplate } from './workingLists.types';

type PassOnProps = {
  currentListIsModified: boolean,
};

type Props = {
  ...PassOnProps,
  template: WorkingListTemplate,
  currentTemplateId: string,
  onSelectTemplate: Function,
};

const TemplateSelectorChip = (props: Props) => {
  const { template, currentTemplateId, onSelectTemplate, ...passOnProps } = props;
  const { displayName, id } = template;

  const selectTemplateHandler = React.useCallback(() => {
    onSelectTemplate(template);
  }, [onSelectTemplate, template]);

  return (
    <Chip
      dataTest="workinglist-template-selector-chip"
      selected={id === currentTemplateId}
      onClick={selectTemplateHandler}
    >
      <TemplateSelectorChipContent
        {...passOnProps}
        text={displayName}
        isSelectedTemplate={id === currentTemplateId}
      />
    </Chip>
  );
};

export default TemplateSelectorChip;
