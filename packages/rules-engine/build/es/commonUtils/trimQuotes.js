import isString from 'd2-utilizr/lib/isString';
export function trimQuotes(input) {
  if (input && isString(input)) {
    let trimmingComplete = false;
    let beingTrimmed = input;

    while (!trimmingComplete) {
      const beforeTrimming = beingTrimmed;
      beingTrimmed = beingTrimmed.replace(/^'/, '').replace(/'$/, '');
      beingTrimmed = beingTrimmed.replace(/^"/, '').replace(/"$/, '');

      if (beforeTrimming.length === beingTrimmed.length) {
        trimmingComplete = true;
      }
    }

    return beingTrimmed;
  }

  return input;
}