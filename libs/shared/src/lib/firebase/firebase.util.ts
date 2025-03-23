import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import 'multer';
import { app } from './firebase.config';

const storage = getStorage(app);

export const uploadFile = ({
  file,
  folder = 'general',
}: {
  file: Express.Multer.File;
  folder?: string;
}): Promise<string> => {
  const fileName = `${Date.now()}-${file.originalname.split('.')[0]}.${
    file.mimetype.split('/')[1]
  }`;
  const contentType = file.mimetype;
  const metadata = {
    contentType,
  };

  const storageRef = ref(storage, folder + '/' + fileName);
  const uploadTask = uploadBytesResumable(
    storageRef,
    Buffer.from(file.buffer),
    metadata
  );

  return new Promise((res, rej) => {
    uploadTask.on('state_changed', null, rej, () => {
      getDownloadURL(uploadTask.snapshot.ref).then(res);
    });
  });
};

export const uploadFiles = ({
  files,
  folder = 'general',
}: {
  files: Express.Multer.File[];
  folder?: string;
}): Promise<Array<string>> => {
  return Promise.all(files.map((file) => uploadFile({ file, folder })));
};

export const uploadImageFromUrl = async ({
  imageUrl,
  folder = 'general',
}: {
  imageUrl: string;
  folder?: string;
}): Promise<string> => {
  try {
    // Tải ảnh từ URL
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();

    // Tạo tên file từ URL và timestamp
    const fileName = `${Date.now()}-${
      imageUrl.split('/').pop()?.split('?')[0] ?? 'image'
    }`;

    // Lấy mime type từ response headers
    const contentType = response.headers.get('content-type') ?? 'image/jpeg';
    const metadata = {
      contentType,
    };

    // Upload lên Firebase Storage
    const storageRef = ref(storage, folder + '/' + fileName);
    const uploadTask = uploadBytesResumable(storageRef, buffer, metadata);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed', null, reject, () => {
        getDownloadURL(uploadTask.snapshot.ref).then(resolve);
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Lỗi khi tải ảnh từ URL: ${error.message}`);
    }
    throw new Error('Lỗi khi tải ảnh từ URL');
  }
};
