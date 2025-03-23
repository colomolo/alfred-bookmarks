#!/usr/bin/env osascript -l JavaScript

function run(argv) {
  const list = argv[0].split('\n');
  const showChecked = argv[1] === 'true';
  const items = [];

  const mdCheckboxMatch = /(?:-|\*) \[(x| )\] (.+)$/i;
  const url =
    'https?:\\/\\/(?:[\\w-]+(\\.[\\w-]+)+|localhost|\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3})(:\\d+)?\\S*';
  const urlRegex = new RegExp(`^${url}$`, 'i');
  const mdLinkRegex = new RegExp(`\\[(.*)\]\\((${url})\\)`, 'i');

  function parseItem(str) {
    const checkboxedMatch = str.match(mdCheckboxMatch);

    const result = {
      raw: str,
      text: str,
      href: null,
      iconPath: null,
      isCheckbox: false,
      isChecked: false,
      checkboxLabel: null,
    };

    if (checkboxedMatch) {
      result.isCheckbox = true;
      result.isChecked = checkboxedMatch[1] === 'x';
      result.checkboxLabel = checkboxedMatch[2];
      result.text = checkboxedMatch[2];
    }

    const isURL = urlRegex.test(result.text);
    const mdLinkMatch = result.text.match(mdLinkRegex);

    result.iconPath = result.isCheckbox
      ? result.isChecked
        ? './checked.png'
        : './unchecked.png'
      : null;

    if (isURL) {
      result.href = result.text;
    } else if (mdLinkMatch) {
      result.text = mdLinkMatch[1];
      result.href = mdLinkMatch[2];
    }

    return result;
  }

  list
    .filter((item) => item.trim())
    .forEach((item) => {
      const parsedItem = parseItem(item);

      if (parsedItem.isChecked && !showChecked) {
        return;
      }

      items.push(parsedItem);
    });

  return JSON.stringify(items);
}
