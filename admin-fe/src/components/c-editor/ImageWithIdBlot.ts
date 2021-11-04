import Quill from "quill";
import ResFileDto from "../../dtos/ResFileDto";

const ATTRIBUTES = [
  'alt',
  'height',
  'width',
  'class', // attribute of quill-blot-formatter
  'style' // attribute of quill-blot-formatter
];
export default class ImageWithIdBlot extends Quill.import('formats/image') {
  static create(value: ResFileDto) {
    const node = super.create(value.url);
    node.dataset.imgId = value.id;
    return node;
  }

  static value(domNode: HTMLImageElement) {
    return {
      url: domNode.getAttribute('src'),
      id: domNode.dataset.imgId
    }
  }

  static formats(domNode: HTMLImageElement) {
    return ATTRIBUTES.reduce((formats, attribute) => {
      const copy: { [key: string]: any } = { ...formats };

      if (domNode.hasAttribute(attribute)) {
        copy[attribute] = domNode.getAttribute(attribute);
      }

      return copy;
    }, {});
  }

  format(name: string, value: any) {
    if (ATTRIBUTES.indexOf(name) > -1) {
      if (value) {
        this.domNode.setAttribute(name, value);
      } else {
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}