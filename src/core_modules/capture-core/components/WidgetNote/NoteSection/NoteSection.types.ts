import { colors, spacersNum } from '@dhis2/ui';

export type NoteType = {
    value: string;
    storedAt: string;
    createdBy?: {
        firstName: string;
        surname: string;
    };
};

export type Props = {
    notes: Array<NoteType>;
    handleAddNote: (text: string) => void;
    placeholder: string;
    emptyNoteMessage: string;
};

export const styles = {
    item: {
        padding: spacersNum.dp12,
        marginRight: spacersNum.dp4,
        background: colors.grey200,
        borderRadius: '5px',
        display: 'flex',
        fontSize: '14px',
        lineHeight: '19px',
        color: colors.grey900,
        '& + &': {
            marginTop: spacersNum.dp8,
        },
    },
    wrapper: {
        padding: `0 ${spacersNum.dp16}px`,
        marginBottom: spacersNum.dp16,
    },
    notesWrapper: {
        maxHeight: 400,
        overflowY: 'auto' as const,
    },
    editor: {
        paddingTop: spacersNum.dp16,
    },
    emptyNotes: {
        fontSize: 14,
        color: colors.grey600,
    },
    name: {
        fontSize: '13px',
        fontWeight: 500,
    },
    lastUpdated: {
        fontSize: '12px',
        marginLeft: '8px',
        color: colors.grey700,
    },
    body: {
        '& p': {
            margin: `${spacersNum.dp8}px 0 0 0`,
        },
    },
    newNoteButtonContainer: {
        paddingTop: spacersNum.dp4,
        display: 'flex',
        gap: '4px',
    },
    rightColumn: {
        flex: 1,
    },
    header: {
        display: 'flex',
        alignItems: 'center',
    },
    headerText: {
        display: 'inline-block',
    },
};
