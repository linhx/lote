export default interface NoteCreateDto {
  permalink: string;
  title: string;
  overview: string;
  content: string;
  tags: string[];
  category: number;
}
