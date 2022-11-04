import { JSDOM } from 'jsdom';
import { convertFreeTextToKebabCase } from './string-utils';

const HEADING_BLOCK = /<h(\d{1}) class=\"heading\">(.+?)<\/h\d{1}>/gs;
const LINK_ICON = '#';

function naiveInnerText(node: Node) {
  const Node = node;
  return [...node.childNodes]
    .map((node) => {
      switch (node.nodeType) {
        case Node.TEXT_NODE:
          return node.textContent;
        case Node.ELEMENT_NODE:
          return naiveInnerText(node);
        default:
          return '';
      }
    })
    .join('');
}

export type TableOfContentItem = {
  level: number;
  id: string;
  content: string;
}

export const addHeadingAnchor = (contentStr: string) => {
  const tableOfContents: Array<TableOfContentItem> = [];
  const headings = new Map<string, number>();
  const content = contentStr.replace(HEADING_BLOCK, (match, headingLevel, content) => {
    const dom = JSDOM.fragment(match);

    const contentText = naiveInnerText(dom);
    let id = convertFreeTextToKebabCase(contentText);

    // avoid duplicated id
    const duplicatedHeadingIndex = headings.get(id);
    if (duplicatedHeadingIndex != null) {
      const newDuplicatedHeadingIndex = duplicatedHeadingIndex + 1;
      headings.set(id, newDuplicatedHeadingIndex)
      id += `-${newDuplicatedHeadingIndex}`;
    } else {
      headings.set(id, 0);
    }

    tableOfContents.push({
      level: headingLevel,
      id: id,
      content,
    });
    return `<h${headingLevel} class="heading"><a class="heading-lnk" href="#${id}">${LINK_ICON}</a><span id="${id}" class="anchor"></span>${content}</h${headingLevel}>`;
  });

  return {
    content,
    tableOfContents,
  }
};
