import { CFileDocument } from 'src/file/entities/CFile';
import * as path from 'path';
import { URL } from 'url';

export default class FileDto {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  isTemp: boolean;
  createdAt: Date;
  updatedAt: Date;

  static fromEntity(file: CFileDocument) {
    const dto = new FileDto();
    dto.id = file._id;
    dto.name = file.name;
    dto.url = file.url.startsWith('/')
      ? new URL(file.url, process.env.BASE_URL).href
      : file.url;
    dto.type = file.type;
    dto.size = file.size;
    dto.isTemp = file.isTemp;
    dto.createdAt = file.createdAt;
    dto.updatedAt = file.updatedAt;
    return dto;
  }
}
