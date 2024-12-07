// @flow
import React from 'react';
import i18n from '@dhis2/d2-i18n';
import { DateField,
    withDefaultFieldContainer,
    withLabel,
    withDisplayMessages,
    withInternalChangeHandler,
} from 'capture-core/components/FormFields/New';
import labelTypeClasses from './dataEntryFieldLabels.module.css';
import { convertStringToDateFormat } from '../../../utils/converters/date';


const LabelledRequiredDateField = withDefaultFieldContainer()(
    withLabel({
        onGetCustomFieldLabeClass: () => labelTypeClasses.dateLabel,
    })(
        withDisplayMessages()(
            withInternalChangeHandler()(
                DateField,
            ),
        ),
    ),
);

type Props = {
    scheduleDate: ?string,
    setScheduleDate: (dateString: ?string) => void,
    hideDueDate?: boolean,
};

export const ScheduleDate = ({
    scheduleDate,
    setScheduleDate,
    hideDueDate,
}: Props) => (
    <>
        {!hideDueDate && (
            <LabelledRequiredDateField
                label={i18n.t('Schedule date / Due date')}
                required
                value={scheduleDate}
                width="100%"
                calendarWidth={350}
                onSetFocus={() => { }}
                onFocus={() => { }}
                onRemoveFocus={() => { }}
                onBlur={(e) => { setScheduleDate(convertStringToDateFormat(e)); }}
            />
        )}
    </>
);
