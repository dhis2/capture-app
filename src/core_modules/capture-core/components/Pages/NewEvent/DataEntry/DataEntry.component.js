// @flow
import React, { Component } from 'react';
import { withStyles, withTheme } from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import i18n from '@dhis2/d2-i18n';
import DataEntry from '../../../DataEntry/DataEntry.container';
import withCancelButton from '../../../DataEntry/withCancelButton';
import withDataEntryField from '../../../DataEntry/dataEntryField/withDataEntryField';
import withDataEntryNotesHandler from '../../../DataEntry/dataEntryNotes/withDataEntryNotesHandler';
import Notes from '../../../Notes/Notes.component';
import withDataEntryRelationshipsHandler from '../../../DataEntry/dataEntryRelationships/withDataEntryRelationshipsHandler';
import Relationships from '../../../Relationships/Relationships.component';
import getEventDateValidatorContainers from './fieldValidators/eventDate.validatorContainersGetter';
import { type RenderFoundation } from '../../../../metaData';
import withMainButton from './withMainButton';
import getNoteValidatorContainers from './fieldValidators/note.validatorContainersGetter';
import { withSaveHandler, placements, withCleanUpHOC } from '../../../DataEntry';
import {
  withInternalChangeHandler,
  withLabel,
  withFocusSaver,
  DateField,
  TrueOnlyField,
  CoordinateField,
  PolygonField,
  withCalculateMessages,
  withDisplayMessages,
  withFilterProps,
  withDefaultFieldContainer,
  withDefaultShouldUpdateInterface,
  orientations,
} from '../../../FormFields/New';
import { Assignee } from './Assignee';

import withFeedbackOutput from '../../../DataEntry/dataEntryOutput/withFeedbackOutput';
import inMemoryFileStore from '../../../DataEntry/file/inMemoryFileStore';
import withIndicatorOutput from '../../../DataEntry/dataEntryOutput/withIndicatorOutput';
import withErrorOutput from '../../../DataEntry/dataEntryOutput/withErrorOutput';
import withWarningOutput from '../../../DataEntry/dataEntryOutput/withWarningOutput';
import newEventSaveTypes from './newEventSaveTypes';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import withDataEntryFieldIfApplicable from '../../../DataEntry/dataEntryField/withDataEntryFieldIfApplicable';
import { makeWritableRelationshipTypesSelector } from './dataEntry.selectors';
import { withTransformPropName } from '../../../../HOC';

const getStyles = (theme) => ({
  savingContextContainer: {
    paddingTop: theme.typography.pxToRem(10),
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.grey.dark,
    fontSize: theme.typography.pxToRem(13),
  },
  savingContextText: {
    paddingLeft: theme.typography.pxToRem(10),
  },
  savingContextNames: {
    fontWeight: 'bold',
  },
  topButtonsContainer: {
    display: 'flex',
    flexFlow: 'row-reverse',
  },
  horizontal: {
    padding: theme.typography.pxToRem(10),
    paddingTop: theme.typography.pxToRem(20),
    paddingBottom: theme.typography.pxToRem(15),
  },
  fieldLabelMediaBased: {
    [theme.breakpoints.down(523)]: {
      paddingTop: '0px !important',
    },
  },
  dataEntryVerticalContainer: {
    padding: theme.typography.pxToRem(8),
  },
});

const dataEntrySectionNames = {
  BASICINFO: 'BASICINFO',
  STATUS: 'STATUS',
  COMMENTS: 'COMMENTS',
  RELATIONSHIPS: 'RELATIONSHIPS',
  ASSIGNEE: 'ASSIGNEE',
};

const overrideMessagePropNames = {
  errorMessage: 'validationError',
};

const getCancelOptions = () => ({
  color: 'primary',
});

const baseComponentStyles = {
  labelContainerStyle: {
    flexBasis: 200,
  },
  inputContainerStyle: {
    flexBasis: 150,
  },
};
const baseComponentStylesVertical = {
  labelContainerStyle: {
    width: 150,
  },
  inputContainerStyle: {
    width: 150,
  },
};

function defaultFilterProps(props: Object) {
  const { formHorizontal, fieldOptions, validationError, modified, ...passOnProps } = props;
  return passOnProps;
}

const getBaseComponentProps = (props: Object) => ({
  fieldOptions: props.fieldOptions,
  formHorizontal: props.formHorizontal,
  styles: props.formHorizontal ? baseComponentStylesVertical : baseComponentStyles,
});

const createComponentProps = (props: Object, componentProps: Object) => ({
  ...getBaseComponentProps(props),
  ...componentProps,
});

const getCalendarAnchorPosition = (formHorizontal: ?boolean) =>
  formHorizontal ? 'center' : 'left';

const buildReportDateSettingsFn = () => {
  const reportDateComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
      withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
          withLabel({
            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
            onGetCustomFieldLabeClass: (props: Object) =>
              `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.dateLabel}`,
          })(
            withDisplayMessages()(
              withInternalChangeHandler()(withFilterProps(defaultFilterProps)(DateField)),
            ),
          ),
        ),
      ),
    ),
  );
  const reportDateSettings = {
    getComponent: () => reportDateComponent,
    getComponentProps: (props: Object) =>
      createComponentProps(props, {
        width: props && props.formHorizontal ? 150 : '100%',
        label: props.formFoundation.getLabel('eventDate'),
        required: true,
        calendarWidth: props.formHorizontal ? 250 : 350,
        popupAnchorPosition: getCalendarAnchorPosition(props.formHorizontal),
      }),
    getPropName: () => 'eventDate',
    getValidatorContainers: () => getEventDateValidatorContainers(),
    getMeta: () => ({
      placement: placements.TOP,
      section: dataEntrySectionNames.BASICINFO,
    }),
  };

  return reportDateSettings;
};

const pointComponent = withCalculateMessages(overrideMessagePropNames)(
  withFocusSaver()(
    withDefaultFieldContainer()(
      withDefaultShouldUpdateInterface()(
        withLabel({
          onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
          onGetCustomFieldLabeClass: (props: Object) =>
            `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.coordinateLabel}`,
        })(
          withDisplayMessages()(
            withInternalChangeHandler()(withFilterProps(defaultFilterProps)(CoordinateField)),
          ),
        ),
      ),
    ),
  ),
);

const polygonComponent = withCalculateMessages(overrideMessagePropNames)(
  withFocusSaver()(
    withDefaultFieldContainer()(
      withDefaultShouldUpdateInterface()(
        withLabel({
          onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
          onGetCustomFieldLabeClass: (props: Object) =>
            `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.polygonLabel}`,
        })(
          withDisplayMessages()(
            withInternalChangeHandler()(withFilterProps(defaultFilterProps)(PolygonField)),
          ),
        ),
      ),
    ),
  ),
);

const getOrientation = (formHorizontal: ?boolean) =>
  formHorizontal ? orientations.VERTICAL : orientations.HORIZONTAL;

const buildGeometrySettingsFn = () => ({
  isApplicable: (props: Object) => {
    const { featureType } = props.formFoundation;
    return ['Polygon', 'Point'].includes(featureType);
  },
  getComponent: (props: Object) => {
    const { featureType } = props.formFoundation;
    if (featureType === 'Polygon') {
      return polygonComponent;
    }
    return pointComponent;
  },
  getComponentProps: (props: Object) => {
    const { featureType } = props.formFoundation;
    if (featureType === 'Polygon') {
      return createComponentProps(props, {
        width: props && props.formHorizontal ? 150 : 350,
        label: i18n.t('Area'),
        dialogLabel: i18n.t('Area'),
        required: false,
        orientation: getOrientation(props.formHorizontal),
      });
    }

    return createComponentProps(props, {
      width: props && props.formHorizontal ? 150 : 350,
      label: 'Coordinate',
      dialogLabel: 'Coordinate',
      required: false,
      orientation: getOrientation(props.formHorizontal),
      shrinkDisabled: props.formHorizontal,
    });
  },
  getPropName: () => 'geometry',
  getValidatorContainers: () => [],
  getMeta: () => ({
    placement: placements.TOP,
    section: dataEntrySectionNames.BASICINFO,
  }),
});

const buildCompleteFieldSettingsFn = () => {
  const completeComponent = withCalculateMessages(overrideMessagePropNames)(
    withFocusSaver()(
      withDefaultFieldContainer()(
        withDefaultShouldUpdateInterface()(
          withLabel({
            onGetUseVerticalOrientation: (props: Object) => props.formHorizontal,
            onGetCustomFieldLabeClass: (props: Object) =>
              `${props.fieldOptions.fieldLabelMediaBasedClass} ${labelTypeClasses.trueOnlyLabel}`,
          })(
            withDisplayMessages()(
              withInternalChangeHandler()(withFilterProps(defaultFilterProps)(TrueOnlyField)),
            ),
          ),
        ),
      ),
    ),
  );
  const completeSettings = {
    getComponent: () => completeComponent,
    getComponentProps: (props: Object) =>
      createComponentProps(props, {
        label: 'Complete event',
        id: 'complete',
      }),
    getPropName: () => 'complete',
    getValidatorContainers: () => [],
    getMeta: () => ({
      placement: placements.BOTTOM,
      section: dataEntrySectionNames.STATUS,
    }),
    getPassOnFieldData: () => true,
  };

  return completeSettings;
};

const buildNotesSettingsFn = () => {
  const noteComponent = withCalculateMessages(overrideMessagePropNames)(
    withDefaultFieldContainer()(
      withDefaultShouldUpdateInterface()(
        withDisplayMessages()(
          withInternalChangeHandler()(
            withFilterProps(defaultFilterProps)(withDataEntryNotesHandler()(Notes)),
          ),
        ),
      ),
    ),
  );
  const notesSettings = {
    getComponent: () => noteComponent,
    getComponentProps: (props: Object) =>
      createComponentProps(props, {
        label: 'Comments',
        onAddNote: props.onAddNote,
        id: 'comments',
        dataEntryId: props.id,
      }),
    getPropName: () => 'note',
    getValidatorContainers: () => getNoteValidatorContainers(),
    getMeta: () => ({
      placement: placements.BOTTOM,
      section: dataEntrySectionNames.COMMENTS,
    }),
  };

  return notesSettings;
};

const buildAssigneeSettingsFn = () => {
  const assigneeComponent = withTransformPropName(['onBlur', 'onSet'])(
    withFocusSaver()(
      withFilterProps((props: Object) => {
        const defaultFiltred = defaultFilterProps(props);
        const { validationAttempted, touched, ...passOnProps } = defaultFiltred;
        return passOnProps;
      })(Assignee),
    ),
  );

  return {
    isApplicable: (props: Object) => {
      const enableUserAssignment = props.stage && props.stage.enableUserAssignment;
      return !!enableUserAssignment;
    },
    getComponent: () => assigneeComponent,
    getComponentProps: (props: Object) =>
      createComponentProps(
        {},
        {
          orientation: getOrientation(props.formHorizontal),
        },
      ),
    getPropName: () => 'assignee',
    getValidatorContainers: () => [],
    getMeta: () => ({
      section: dataEntrySectionNames.ASSIGNEE,
    }),
  };
};

const buildRelationshipsSettingsFn = () => {
  const writableRelationshipTypesSelector = makeWritableRelationshipTypesSelector();
  const relationshipsComponent = withDefaultFieldContainer()(
    withDefaultShouldUpdateInterface()(
      withFilterProps(defaultFilterProps)(withDataEntryRelationshipsHandler()(Relationships)),
    ),
  );
  const relationshipsSettings = {
    isApplicable: (props: Object) => {
      const hasRelationships =
        props.stage && props.stage.relationshipTypesWhereStageIsFrom.length > 0;
      return hasRelationships;
    },
    getComponent: () => relationshipsComponent,
    getComponentProps: (props: Object) =>
      createComponentProps(props, {
        id: 'relationship',
        dataEntryId: props.id,
        highlightRelationshipId: props.recentlyAddedRelationshipId,
        relationshipsRef: props.relationshipsRef,
        onOpenAddRelationship: props.onOpenAddRelationship,
        writableRelationshipTypes: writableRelationshipTypesSelector(props),
        fromEntity: 'PROGRAM_STAGE_INSTANCE',
        currentEntityId: 'newEvent',
      }),
    getValidatorContainers: () => [],
    getPropName: () => 'relationship',
    getMeta: () => ({
      placement: placements.BOTTOM,
      section: dataEntrySectionNames.RELATIONSHIPS,
    }),
  };

  return relationshipsSettings;
};

const saveHandlerConfig = {
  onIsCompleting: (props: Object) => props.completeDataEntryFieldValue,
  onFilterProps: (props: Object) => {
    const { completeDataEntryFieldValue, ...passOnProps } = props;
    return passOnProps;
  },
};

const dataEntryFilterProps = (props: Object) => {
  const {
    stage,
    onScrollToRelationships,
    recentlyAddedRelationshipId,
    relationshipsRef,
    ...passOnProps
  } = props;
  return passOnProps;
};

const CleanUpHOC = withCleanUpHOC()(withFilterProps(dataEntryFilterProps)(DataEntry));
const AssigneeField = withDataEntryFieldIfApplicable(buildAssigneeSettingsFn())(CleanUpHOC);
const RelationshipField = withDataEntryFieldIfApplicable(buildRelationshipsSettingsFn())(
  AssigneeField,
);
const CommentField = withDataEntryField(buildNotesSettingsFn())(RelationshipField);
const GeometryField = withDataEntryFieldIfApplicable(buildGeometrySettingsFn())(CommentField);
const ReportDateField = withDataEntryField(buildReportDateSettingsFn())(GeometryField);
const FeedbackOutput = withFeedbackOutput()(ReportDateField);
const IndicatorOutput = withIndicatorOutput()(FeedbackOutput);
const WarningOutput = withWarningOutput()(IndicatorOutput);
const ErrorOutput = withErrorOutput()(WarningOutput);
const CancelableDataEntry = withCancelButton(getCancelOptions)(ErrorOutput);
const SaveableDataEntry = withSaveHandler(saveHandlerConfig)(withMainButton()(CancelableDataEntry));
const WrappedDataEntry = withDataEntryField(buildCompleteFieldSettingsFn())(SaveableDataEntry);

type Props = {
  formFoundation: RenderFoundation,
  programName: string,
  orgUnitName: string,
  onUpdateField: (innerAction: ReduxAction<any, any>) => void,
  onStartAsyncUpdateField: Object,
  onSetSaveTypes: (saveTypes: ?Array<$Values<typeof newEventSaveTypes>>) => void,
  onSave: (eventId: string, dataEntryId: string, formFoundation: RenderFoundation) => void,
  onSaveAndAddAnother: (
    eventId: string,
    dataEntryId: string,
    formFoundation: RenderFoundation,
  ) => void,
  onAddNote: (itemId: string, dataEntryId: string, note: string) => void,
  onCancel: () => void,
  classes: {
    savingContextContainer: string,
    savingContextText: string,
    savingContextNames: string,
    topButtonsContainer: string,
    horizontalPaper: string,
    dataEntryVerticalContainer: string,
    fieldLabelMediaBased: string,
    horizontal: string,
  },
  theme: Theme,
  formHorizontal: ?boolean,
  recentlyAddedRelationshipId?: ?string,
};
type DataEntrySection = {
  placement: $Values<typeof placements>,
  name: string,
};

const dataEntrySectionDefinitions = {
  [dataEntrySectionNames.BASICINFO]: {
    placement: placements.TOP,
    name: i18n.t('Basic info'),
  },
  [dataEntrySectionNames.STATUS]: {
    placement: placements.BOTTOM,
    name: i18n.t('Status'),
  },
  [dataEntrySectionNames.COMMENTS]: {
    placement: placements.BOTTOM,
    name: i18n.t('Comments'),
  },
  [dataEntrySectionNames.RELATIONSHIPS]: {
    placement: placements.BOTTOM,
    name: i18n.t('Relationships'),
  },
  [dataEntrySectionNames.ASSIGNEE]: {
    placement: placements.BOTTOM,
    name: i18n.t('Assignee'),
  },
};
class NewEventDataEntry extends Component<Props> {
  fieldOptions: { theme: Theme };

  dataEntrySections: {
    [$Values<typeof dataEntrySectionNames>]: DataEntrySection,
  };

  relationshipsInstance: ?HTMLDivElement;

  constructor(props: Props) {
    super(props);
    this.fieldOptions = {
      theme: props.theme,
      fieldLabelMediaBasedClass: props.classes.fieldLabelMediaBased,
    };
    this.dataEntrySections = dataEntrySectionDefinitions;
  }

  UNSAFE_componentWillMount() {
    this.props.onSetSaveTypes(null);
  }

  componentDidMount() {
    if (this.relationshipsInstance && this.props.recentlyAddedRelationshipId) {
      this.relationshipsInstance.scrollIntoView();
      // $FlowFixMe[prop-missing] automated comment
      this.props.onScrollToRelationships();
    }
  }

  componentWillUnmount() {
    inMemoryFileStore.clear();
  }

  setRelationshipsInstance = (instance: ?HTMLDivElement) => {
    this.relationshipsInstance = instance;
  };

  handleSave = (
    itemId: string,
    dataEntryId: string,
    formFoundation: RenderFoundation,
    saveType?: ?string,
  ) => {
    if (saveType === newEventSaveTypes.SAVEANDADDANOTHER) {
      if (!this.props.formHorizontal) {
        this.props.onSetSaveTypes([
          newEventSaveTypes.SAVEANDADDANOTHER,
          newEventSaveTypes.SAVEANDEXIT,
        ]);
      }
      this.props.onSaveAndAddAnother(itemId, dataEntryId, formFoundation);
    } else if (saveType === newEventSaveTypes.SAVEANDEXIT) {
      this.props.onSave(itemId, dataEntryId, formFoundation);
    }
  };

  getSavingText() {
    const { classes, orgUnitName, programName } = this.props;
    const firstPart = `${i18n.t('Saving to')} `;
    const secondPart = ` ${i18n.t('in')} `;

    return (
      <span>
        {firstPart}
        <span className={classes.savingContextNames}>{programName}</span>
        {secondPart}
        <span className={classes.savingContextNames}>{orgUnitName}</span>
      </span>
    );
  }

  renderHorizontal = () => {
    const { classes } = this.props;
    return <div className={classes.horizontal}>{this.renderContent()}</div>;
  };

  renderVertical = () => (
    <div className={this.props.classes.dataEntryVerticalContainer}>{this.renderContent()}</div>
  );

  renderContent = () => {
    const {
      onUpdateField,
      onStartAsyncUpdateField,
      programName, // eslint-disable-line
      orgUnitName, // eslint-disable-line
      classes,
      onSave,
      onSetSaveTypes,
      onSaveAndAddAnother,
      theme,
      ...passOnProps
    } = this.props;
    return (
      <div>
        <div data-test="dhis2-capture-data-entry-container">
          {/* $FlowFixMe[cannot-spread-inexact] automated comment */}
          <WrappedDataEntry
            id="singleEvent"
            onUpdateFormField={onUpdateField}
            onUpdateFormFieldAsync={onStartAsyncUpdateField}
            onSave={this.handleSave}
            fieldOptions={this.fieldOptions}
            dataEntrySections={this.dataEntrySections}
            relationshipsRef={this.setRelationshipsInstance}
            {...passOnProps}
          />
        </div>
        <div className={classes.savingContextContainer}>
          <InfoIcon />
          <div className={classes.savingContextText}>{this.getSavingText()}</div>
        </div>
      </div>
    );
  };

  render() {
    return <div>{this.props.formHorizontal ? this.renderHorizontal() : this.renderVertical()}</div>;
  }
}

export default withStyles(getStyles)(withTheme()(NewEventDataEntry));
