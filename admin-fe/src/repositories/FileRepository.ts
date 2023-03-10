import { AxiosProgressEvent } from 'axios';
import ResFileDto from '../dtos/ResFileDto';
import api from './Api';

export const PATH = '/files';

export default {
  uploadFile(file: File, onUploadProgress?: (event: AxiosProgressEvent) => void): Promise<ResFileDto> {
    const formData = new FormData();
    formData.append('file', file);
    const config = {
      ...(onUploadProgress && { onUploadProgress } )
    }
    return api.post(PATH, formData, config);
  }
}
