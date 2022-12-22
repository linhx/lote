import { NoteDocument } from '../../note/entities/note.entity';
import { TodayILearnedDocument } from '../../today-i-learned/entities/today-i-learned.entity';
import { addHeadingAnchor, TableOfContentItem } from './add-heading-anchor';
import { highlightCodeBlock } from './highlight-code-block';

export const createTableOfContents = (data: Array<TableOfContentItem>) => {
  return data.reduce(( toc, item ) => {
    return toc + `<a href="#${item.id}" class="note__toc__item note__toc__level_${item.level}">${item.content}</a>`
  }, '');
}

export const formatContent = (_content: string) => {
  const {
    content,
    tableOfContents
  } = addHeadingAnchor(highlightCodeBlock(_content));

  return {
    content,
    tableOfContents: createTableOfContents(tableOfContents),
  }
}

export const create = (
  note: NoteDocument | TodayILearnedDocument,
  bannerUrl?: string,
  timeZone?: string,
) => {
  const tagsHTML = note.tags?.reduce((tags, tag) => tags + `<span class="tag">${tag}</span>`, '');
  const publishedAt = note.publishedAt.toLocaleDateString('vi-VN', { timeZone });
  const {
    content,
    tableOfContents,
  } = formatContent(note.content);

  let banner = '';
  if (bannerUrl) {
    banner = `<div class="note__banner" style="background-image: url(${bannerUrl})"></div>
  <hr class="note__hr"/>
`
  }

  return `${banner}<div class="note__header">
  <h2 class="note__header__title">${note.title}</h2>

  <div class="note__tags">
    <span class="note__published-date">${publishedAt}</span>
    ${tagsHTML}
  </div>
</div>
<div class="note__content-wrapper ck ck-editor">
  <div class="note__toc">
    <div>
      ${tableOfContents}
    </div>
  </div>
  <div class="note__content ck ck-content">
    ${content}
  </div>
</div>
`;
};
