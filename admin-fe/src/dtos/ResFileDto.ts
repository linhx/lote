export default interface ResFileDto {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  isTemp: boolean;
  createdAt: Date;
  updatedAt: Date;
}
