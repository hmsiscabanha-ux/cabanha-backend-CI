import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { randomUUID } from 'crypto';

@Controller('uploads')
@UseGuards(JwtAuthGuard)
export class UploadsController {
  private s3: S3Client;
  private bucket: string;

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      region: this.config.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY')!,
      },
    });

    this.bucket = this.config.get<string>('AWS_S3_BUCKET')!;
  }

  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: multerS3({
        s3: new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
          },
        }),
        bucket: process.env.AWS_S3_BUCKET!,
        key: (_req, file, cb) => {
          const ext = file.originalname.split('.').pop();
          cb(null, `animals/${randomUUID()}.${ext}`);
        },
        contentType: multerS3.AUTO_CONTENT_TYPE,
      }),
    }),
  )
  upload(@UploadedFile() file: any) {
    return {
      imageUrl: file.location,
    };
  }
}
