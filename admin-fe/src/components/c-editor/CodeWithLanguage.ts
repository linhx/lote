import Quill from 'quill';

const CodeBlock = Quill.import('formats/code-block');

class CodeWithLanguage extends CodeBlock {
  static create(value: string) {
    let domNode = super.create(true);
    domNode.dataset.lang = value;
    return domNode;
  }

  formats() {
    return {
      [this.statics.blotName]: this.domNode.dataset.lang
    }
  }
}

export default CodeWithLanguage;