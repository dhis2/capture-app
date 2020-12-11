// @flow

type Props = {
  currentListIsModified: boolean,
  text: string,
  isSelectedTemplate: boolean,
};

const TemplateSelectorChipContent = (props: Props) => {
  const { currentListIsModified, text, isSelectedTemplate } = props;

  const truncatedText = text.length > 30 ? `${text.substring(0, 27)}...` : text;
  const content =
    isSelectedTemplate && currentListIsModified ? `${truncatedText} *` : truncatedText;

  return content;
};

export default TemplateSelectorChipContent;
