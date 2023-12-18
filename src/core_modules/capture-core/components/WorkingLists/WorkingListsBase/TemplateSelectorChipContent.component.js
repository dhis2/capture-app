// @flow

type Props = {
    currentListIsModified: boolean,
    maxCharacters: number,
    text: string,
    isSelectedTemplate: boolean,
};

export const TemplateSelectorChipContent = (props: Props) => {
    const {
        currentListIsModified,
        text,
        maxCharacters,
        isSelectedTemplate,
    } = props;

    const truncatedText = text.length > maxCharacters ? `${text.substring(0, maxCharacters - 3)}...` : text;
    const content = isSelectedTemplate && currentListIsModified ? `${truncatedText} *` : truncatedText;

    return content;
};
