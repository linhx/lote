import hljs from 'highlight.js';
import * as unescapeHTML from 'underscore.string/unescapeHTML';

const REGEX_CODEBLOCK = /<pre><code class=\"language-([A-Za-z0-9\-]+)\">(.+?)<\/code><\/pre>/gs;

const REGEX_EMOJI = /<img class=\"em\"(.*?) alt=\"(.+?)\"(.*?)>/gs;

const escapeEmoji = (codeContent) => {
  const mapEmoji = new Map();
  const newCodeContent = codeContent.replace(REGEX_EMOJI, (match, _, emojiKey) => {
    mapEmoji.set(emojiKey, match);
    return emojiKey;
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
