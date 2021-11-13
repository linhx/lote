import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as StringUtils from '../../utilites/StringUtils';
import * as FileUtils from '../../utilites/FileUtils';

export default {
  deltaToHtml(delta: any, noteUrl: string) {
    const converter = new QuillDeltaToHtmlConverter(delta.ops);
    converter.renderCustomWith(function (customOp, contextOp) {
      if (customOp.insert.type === 'imagec') {
        const val = customOp.insert.value;
        const attrs = customOp.attributes;
        const imageUrl = StringUtils.joinUrl(
          noteUrl,
          `img/${val.id}.${FileUtils.getExt(val.name)}`,
        );
        return (
          `<img src="${imageUrl}" ` +
          (attrs.alt ? `alt="${attrs.alt}" ` : '') +
          (attrs.height ? `height="${attrs.height}" ` : '') +
          (attrs.width ? `width="${attrs.width}" ` : '') +
          (attrs.class ? `class="${attrs.class}" ` : '') +
          (attrs.style ? `style="${attrs.style}" ` : '') +
          '>'
        );
      }
    });
    return converter.convert();
  },
};
