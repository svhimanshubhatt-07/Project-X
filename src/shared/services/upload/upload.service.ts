export interface UploadResult {
  fileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export const uploadService = {
  async uploadFile(file: File): Promise<UploadResult> {
    // Simulated upload for mock environment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          fileId: `doc_${Date.now()}`,
          fileName: file.name,
          fileUrl: URL.createObjectURL(file),
          fileSize: file.size,
          mimeType: file.type,
          uploadedAt: new Date().toISOString(),
        });
      }, 600);
    });
  },
};
