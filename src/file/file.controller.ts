import {
  Controller,
  HttpCode,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Auth } from '@auth/decorators/auth.decorator';

interface MulterFile {
  originalname: string;
  buffer: Buffer;
  mimetype?: string;
  size?: number;
  fieldname?: string;
  encoding?: string;
}


@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @HttpCode(200)
  @UseInterceptors(FilesInterceptor('files'))
  @Auth()
  @Post()
  async saveFiles(
    @UploadedFiles() files: MulterFile[],
    @Query('folder') folder?: string,
  ) {
    return this.fileService.saveFiles(files, folder);
  }
}
