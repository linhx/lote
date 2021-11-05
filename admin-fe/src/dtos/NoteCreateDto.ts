export default interface NoteCreateDto {
  permalink: string;
  title: string;
  banner: string;
  overview: string;
  content: Object;
  tags: string[];
  category: number;
}
