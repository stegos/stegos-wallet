import { clipboard, remote } from 'electron';

const { Menu, MenuItem } = remote;

const menu = new Menu();
menu.append(
  new MenuItem({
    id: 'copy',
    label: 'Copy',
    click() {
      clipboard.writeText(window.getSelection().toString());
    }
  })
);
menu.append(new MenuItem({ type: 'separator' }));
menu.append(
  new MenuItem({
    id: 'paste',
    label: 'Paste',
    click() {
      const { activeElement } = document;
      const { value, selectionStart, selectionEnd } = activeElement;
      const resultStringBegin = value.substring(0, selectionStart);
      const resultStringEnd = value.substring(selectionEnd, value.length);
      const clipboardText = clipboard.readText();
      setNativeValue(
        activeElement,
        resultStringBegin + clipboardText + resultStringEnd
      );
      activeElement.dispatchEvent(new Event('change', { bubbles: true }));
      setCaretPosition(activeElement, selectionStart + clipboardText.length);
    }
  })
);

// hack for setting value with triggering change method
// https://github.com/facebook/react/issues/10135#issuecomment-314441175
const setNativeValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(
    prototype,
    'value'
  ).set;

  if (valueSetter && valueSetter !== prototypeValueSetter) {
    prototypeValueSetter.call(element, value);
  } else {
    valueSetter.call(element, value);
  }
};

const setCaretPosition = (element, caretPos) => {
  if (element.createTextRange) {
    const range = element.createTextRange();
    range.move('character', caretPos);
    range.select();
  } else if (element.selectionStart) {
    element.focus();
    element.setSelectionRange(caretPos, caretPos);
  } else element.focus();
};

export default menu;
