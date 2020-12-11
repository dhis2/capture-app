// @flow

export default function capitalizeFirstLetterInWords(text: string) {
  return text
    .split(' ')
    .map((word) => word.charAt(0).toLocaleUpperCase() + word.slice(1))
    .reduce(
      (accCapitalizedText: string, capitalizedWord: string) =>
        `${accCapitalizedText} ${capitalizedWord}`,
      '',
    );
}
