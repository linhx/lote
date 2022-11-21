export default interface EmojiUpdateDto {
  id: string;
  group: string;
  category: string;
  key: string;
  name: string;
  url: string;
  file?: File;
}
