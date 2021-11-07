export default interface NoteUpdateDto {
  id: string;
  permalink: string;
  title: string;
  banner?: string;
  overview: string;
  content: string;
  tags: string[];
  category: number;
}
