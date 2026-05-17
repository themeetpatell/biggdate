import type { ImagePickerAsset } from 'expo-image-picker';

jest.mock('expo-image-manipulator', () => ({
  manipulateAsync: jest.fn(async (uri: string) => ({ uri: `${uri}#resized`, width: 1200, height: 1500 })),
  SaveFormat: { JPEG: 'jpeg', PNG: 'png' },
}));

jest.mock('@biggdate/shared', () => ({
  resolveApiBaseUrl: () => 'https://example.test',
}));

jest.mock('./env', () => ({ env: { apiUrl: 'https://example.test' } }));

jest.mock('./supabase', () => ({
  supabase: { auth: { getSession: async () => ({ data: { session: null } }) } },
}));

import { prepareImageForUpload } from './upload-photo';

function asset(over: Partial<ImagePickerAsset> = {}): ImagePickerAsset {
  return {
    uri: 'file:///tmp/photo.jpg',
    width: 800,
    height: 1000,
    mimeType: 'image/jpeg',
    fileName: 'photo.jpg',
    fileSize: 200_000,
    type: 'image',
    ...(over as object),
  } as ImagePickerAsset;
}

describe('prepareImageForUpload', () => {
  it('rejects an oversized file before any manipulator work', async () => {
    await expect(prepareImageForUpload(asset({ fileSize: 50 * 1024 * 1024 }))).rejects.toThrow(
      /under 10 MB/,
    );
  });

  it('rejects an unsupported mime type', async () => {
    await expect(
      prepareImageForUpload(asset({ mimeType: 'image/gif' })),
    ).rejects.toThrow(/not supported/);
  });

  it('skips manipulator when the image is already small and a safe format', async () => {
    const manipulator = jest.requireMock('expo-image-manipulator') as {
      manipulateAsync: jest.Mock;
    };
    manipulator.manipulateAsync.mockClear();
    const prepared = await prepareImageForUpload(asset());
    expect(manipulator.manipulateAsync).not.toHaveBeenCalled();
    expect(prepared.uri).toBe('file:///tmp/photo.jpg');
    expect(prepared.mime).toBe('image/jpeg');
  });

  it('resizes when the longest edge is larger than 1200px', async () => {
    const manipulator = jest.requireMock('expo-image-manipulator') as {
      manipulateAsync: jest.Mock;
    };
    manipulator.manipulateAsync.mockClear();
    const prepared = await prepareImageForUpload(
      asset({ width: 4000, height: 3000 }),
    );
    expect(manipulator.manipulateAsync).toHaveBeenCalledTimes(1);
    expect(prepared.uri).toContain('#resized');
  });

  it('converts HEIC to JPEG even when dimensions are small', async () => {
    const manipulator = jest.requireMock('expo-image-manipulator') as {
      manipulateAsync: jest.Mock;
    };
    manipulator.manipulateAsync.mockClear();
    const prepared = await prepareImageForUpload(
      asset({ mimeType: 'image/heic', fileName: 'IMG_1234.HEIC' }),
    );
    expect(manipulator.manipulateAsync).toHaveBeenCalledTimes(1);
    expect(prepared.mime).toBe('image/jpeg');
  });
});
