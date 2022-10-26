import {Expose} from 'class-transformer';

export default class UploadPreviewResponse {
  @Expose()
  public previewImage!: string;
}
