import { FileFieldsInterceptor } from '@nestjs/platform-express';

export const AudioFilesInterceptor = (_fields: string[]) =>
  FileFieldsInterceptor(
    _fields.map((x) => ({ name: x, maxCount: 1 })),
    {
      fileFilter(_req, _file, _cb) {
        if (_file.mimetype.match(/^audio\/((x-)?wav|(x-)?flac|mpeg)$/))
          _cb(null, true);
        else _cb(null, false);
      },
    },
  );
