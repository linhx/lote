import ResFileDto from '../dtos/ResFileDto';
import api from './Api'

export default {
  uploadFile(file: File): Promise<ResFileDto> {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('files', formData);
  }
}
