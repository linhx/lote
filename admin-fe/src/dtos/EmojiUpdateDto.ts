export default interface EmojiUpdateDto {
  id: string;
  group: string;
  key: string;
  name: string;
  url: string;
  file?: File;
}
