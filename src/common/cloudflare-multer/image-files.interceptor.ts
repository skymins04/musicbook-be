import { FileFieldsInterceptor } from '@nestjs/platform-express';

export const ImgFilesInterceptor = (_fields: string[]) =>
  FileFieldsInterceptor(
    _fields.map((x) => ({ name: x, maxCount: 1 })),
    {
      fileFilter(_req, _file, _cb) {
        if (_file.mimetype.match(/^image\/(gif|png|jpeg|webp|svg\+xml)$/))
          _cb(null, true);
        else _cb(null, false);
      },
    },
  );
