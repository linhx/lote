import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import * as StringUtils from '../../utilites/StringUtils';

export default {
  deltaToPublishedHtml(delta: any, note: { permalink: string }, noteUrlBase: string) {
    const converter = new QuillDeltaToHtmlConverter(delta.ops);
    converter.renderCustomWith(function (customOp, contextOp) {
      const val = customOp.insert.value;
      if (customOp.insert.type === 'imagec') {
        const attrs = customOp.attributes;
        const imageUrl = StringUtils.joinUrl(
          noteUrlBase,
          `/note-img/${note.permalink}/${val.name}`,
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
      } else if (customOp.insert.type === 'emoji') {
        return `<span class="ap ap-${val}"></span>`;
      }
    });
    return converter.convert();
  },

  deltaToPreviewHtml(delta: any) {
    const converter = new QuillDeltaToHtmlConverter(delta.ops);
    converter.renderCustomWith(function (customOp, contextOp) {
      const val = customOp.insert.value;
      if (customOp.insert.type === 'imagec') {
        const attrs = customOp.attributes;
        return (
          `<img src="${val.url}" ` +
          (attrs.alt ? `alt="${attrs.alt}" ` : '') +
          (attrs.height ? `height="${attrs.height}" ` : '') +
          (attrs.width ? `width="${attrs.width}" ` : '') +
          (attrs.class ? `class="${attrs.class}" ` : '') +
          (attrs.style ? `style="${attrs.style}" ` : '') +
          '>'
        );
      } else if (customOp.insert.type === 'emoji') {
        return `<span class="ap ap-${val}"></span>`;
      }
    });
    return converter.convert();
  },
};
