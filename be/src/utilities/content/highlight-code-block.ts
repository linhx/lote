import hljs from 'highlight.js';
import * as unescapeHTML from 'underscore.string/unescapeHTML';
import emojiUnicodeMap from './emoji-unicode-map';

const REGEX_CODEBLOCK = /<pre><code class=\"language-([A-Za-z0-9\-]+)\">(.+?)<\/code><\/pre>/gs;

const REGEX_EMOJI = /<span class=\"em em-([a-z0-9\-]+)">(.+?)<\/span>/gs;

const escapeEmoji = (codeContent) => {
  const mapEmoji = new Map();
  const newCodeContent = codeContent.replace(REGEX_EMOJI, (match, emojiName, emojiContent) => {
    const emojiUnicode = emojiUnicodeMap.get(emojiName);
    mapEmoji.set(emojiUnicode, match);
    return emojiUnicode;
  });
  return {
    content: newCodeContent,
    mapEmoji
  }
}

export const highlightCodeBlock = (contentStr: string) => {
  return contentStr.replace(REGEX_CODEBLOCK, (match, language, codeContent) => {
    const {
      content: contentWoEmoji,
      mapEmoji
    } = escapeEmoji(codeContent);
    const contentUnescapeHTML = unescapeHTML(contentWoEmoji);
    const contentHighlight = hljs.highlight(contentUnescapeHTML, { language }).value;
    let contentWEmoji = contentHighlight
    mapEmoji.forEach((val, key) => {
      contentWEmoji = contentWEmoji.replace(new RegExp(key, 'gs'), val);
    })
    return `<pre><code class="language-${language}">${contentWEmoji}</code></pre>`;
  });
};
