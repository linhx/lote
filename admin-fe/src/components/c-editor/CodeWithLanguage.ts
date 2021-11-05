import Quill from 'quill';

const CodeBlock = Quill.import('formats/code-block');

class CodeWithLanguage extends CodeBlock {
  static create(value: { lang: string }) {
    let domNode = super.create(true);
    domNode.dataset.lang = value.lang;
    return domNode;
  }

  formats() {
    return {
      [this.statics.blotName]: {
        lang: this.domNode.dataset.lang
      }
    }
  }
}

export default CodeWithLanguage;