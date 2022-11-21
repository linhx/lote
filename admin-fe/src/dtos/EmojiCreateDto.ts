export default interface EmojiCreateDto {
  group: string;
  category: string;
  key: string;
  name: string;
  file?: File;
}
