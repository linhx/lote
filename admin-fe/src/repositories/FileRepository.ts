import ResFileDto from '../dtos/ResFileDto';
import api from './Api'

export default {
  uploadTempFile(file: File): Promise<ResFileDto> {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('files/temp', formData);
  }
}
