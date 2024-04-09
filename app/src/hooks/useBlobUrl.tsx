import { useReducer } from "react";

export type BlobWithUrl = {
  blob: Blob | null;
  url: string;
};

export const useBlobUrl = (initialBlob?: Blob) => {
  const getObjectFromBlob = (blob: Blob) => ({ blob: blob, url: URL.createObjectURL(blob) });

  return useReducer(
    (state: BlobWithUrl | null, blob: Blob | null | undefined): BlobWithUrl | null => {
      if (state?.url) {
        URL.revokeObjectURL(state.url);
      }
      if (!blob) {
        return null;
      }
      return getObjectFromBlob(blob);
    },
    initialBlob ? getObjectFromBlob(initialBlob) : null,
  );
};
