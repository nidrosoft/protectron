"use client";

import { useState, useRef } from "react";
import { UploadCloud02 } from "@untitledui/icons";
import { DialogTrigger as AriaDialogTrigger, Heading as AriaHeading } from "react-aria-components";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { FileUpload, getReadableFileSize, type FileListItemProps } from "@/components/application/file-upload/file-upload-base";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { FeaturedIcon } from "@/components/foundations/featured-icon/featured-icon";
import { BackgroundPattern } from "@/components/shared-assets/background-patterns";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  failed?: boolean;
}

interface UploadModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description?: string;
  accept?: string;
  allowsMultiple?: boolean;
  maxSize?: number;
  onUpload?: (files: UploadedFile[]) => void;
  uploadButtonText?: string;
  cancelButtonText?: string;
  aiSystemId?: string;
  requirementId?: string;
  uploadToApi?: boolean;
}

// Simulated upload for UI feedback
const simulateUpload = (file: File, onProgress: (progress: number) => void) => {
  let progress = 0;
  const interval = setInterval(() => {
    onProgress(++progress);
    if (progress === 100) {
      clearInterval(interval);
    }
  }, 50);
};

// Actual API upload
const uploadFileToApi = async (
  file: File, 
  aiSystemId: string, 
  requirementId?: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("ai_system_id", aiSystemId);
    if (requirementId) {
      formData.append("requirement_id", requirementId);
    }

    // Simulate progress for UX (actual upload doesn't provide progress easily)
    onProgress?.(30);
    
    const response = await fetch("/api/v1/evidence/upload", {
      method: "POST",
      body: formData,
    });

    onProgress?.(80);

    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, error: errorData.error || "Upload failed" };
    }

    const result = await response.json();
    onProgress?.(100);
    
    return { success: true, data: result.data };
  } catch (error) {
    return { success: false, error: "Network error" };
  }
};

export const UploadModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.csv,.png,.jpg,.jpeg",
  allowsMultiple = true,
  maxSize = 10 * 1024 * 1024,
  onUpload,
  uploadButtonText = "Upload",
  aiSystemId,
  requirementId,
  uploadToApi = false,
  cancelButtonText = "Cancel",
}: UploadModalProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileObjectsRef = useRef<Map<string, File>>(new Map());

  const handleDropFiles = (files: FileList) => {
    const newFiles = Array.from(files);
    const newFilesWithIds = newFiles.map((file) => ({
      id: Math.random().toString(),
      name: file.name,
      size: file.size,
      type: file.name.split(".").pop()?.toLowerCase() || "",
      progress: 0,
      fileObject: file,
    }));

    newFilesWithIds.forEach(({ id, fileObject }) => {
      fileObjectsRef.current.set(id, fileObject);
    });

    setUploadedFiles([...newFilesWithIds.map(({ fileObject: _, ...file }) => file), ...uploadedFiles]);

    newFilesWithIds.forEach(({ id, fileObject }) => {
      simulateUpload(fileObject, (progress) => {
        setUploadedFiles((prev) => 
          prev.map((uploadedFile) => 
            uploadedFile.id === id ? { ...uploadedFile, progress } : uploadedFile
          )
        );
      });
    });
  };

  const handleMaxSizeExceed = (files: FileList) => {
    console.log("Max size exceeded", files);
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== id));
    fileObjectsRef.current.delete(id);
  };

  const handleRetryFile = (id: string) => {
    const file = uploadedFiles.find((file) => file.id === id);
    if (!file) return;

    const fileObject = fileObjectsRef.current.get(id);
    if (fileObject) {
      simulateUpload(fileObject, (progress) => {
        setUploadedFiles((prev) => 
          prev.map((uploadedFile) => 
            uploadedFile.id === id ? { ...uploadedFile, progress, failed: false } : uploadedFile
          )
        );
      });
    } else {
      simulateUpload(new File([], file.name, { type: file.type }), (progress) => {
        setUploadedFiles((prev) => 
          prev.map((uploadedFile) => 
            uploadedFile.id === id ? { ...uploadedFile, progress, failed: false } : uploadedFile
          )
        );
      });
    }
  };

  const handleCancel = () => {
    setUploadedFiles([]);
    fileObjectsRef.current.clear();
    onOpenChange(false);
  };

  const handleUpload = async () => {
    const completedFiles = uploadedFiles.filter((f) => f.progress === 100);
    
    // If uploadToApi is enabled and we have an aiSystemId, upload to the API
    if (uploadToApi && aiSystemId) {
      const uploadPromises = completedFiles.map(async (file) => {
        const fileObject = fileObjectsRef.current.get(file.id);
        if (fileObject) {
          const result = await uploadFileToApi(fileObject, aiSystemId, requirementId);
          if (!result.success) {
            // Mark file as failed
            setUploadedFiles((prev) =>
              prev.map((f) => (f.id === file.id ? { ...f, failed: true } : f))
            );
          }
          return result;
        }
        return { success: false, error: "File not found" };
      });

      const results = await Promise.all(uploadPromises);
      const allSuccessful = results.every((r) => r.success);
      
      if (!allSuccessful) {
        // Don't close modal if some uploads failed
        return;
      }
    }
    
    onUpload?.(completedFiles);
    setUploadedFiles([]);
    fileObjectsRef.current.clear();
    onOpenChange(false);
  };

  const allFilesUploaded = uploadedFiles.length > 0 && uploadedFiles.every((f) => f.progress === 100);

  return (
    <AriaDialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalOverlay isDismissable>
        <Modal>
          <Dialog>
            <div className="relative w-full overflow-hidden rounded-2xl bg-primary shadow-xl sm:max-w-lg">
              <CloseButton
                onClick={handleCancel}
                theme="light"
                size="lg"
                className="absolute top-3 right-3 z-20"
              />
              <div className="flex flex-col gap-4 px-4 pt-5 sm:px-6 sm:pt-6">
                <div className="relative w-max">
                  <FeaturedIcon color="brand" size="lg" theme="light" icon={UploadCloud02} />
                  <BackgroundPattern
                    pattern="circle"
                    size="sm"
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                </div>
                <div className="z-10 flex flex-col gap-0.5">
                  <AriaHeading slot="title" className="text-md font-semibold text-primary">
                    {title}
                  </AriaHeading>
                  {description && <p className="text-sm text-tertiary">{description}</p>}
                </div>
              </div>

              <div className="z-10 px-4 pt-5 sm:px-6">
                <FileUpload.Root>
                  <FileUpload.DropZone
                    accept={accept}
                    hint={`Upload files to add (max. ${getReadableFileSize(maxSize)}).`}
                    allowsMultiple={allowsMultiple}
                    maxSize={maxSize}
                    onDropFiles={handleDropFiles}
                    onSizeLimitExceed={handleMaxSizeExceed}
                  />
                  {uploadedFiles.length > 0 && (
                    <FileUpload.List>
                      {uploadedFiles.map((file) => (
                        <FileUpload.ListItemProgressBar
                          key={file.id}
                          name={file.name}
                          size={file.size}
                          progress={file.progress}
                          failed={file.failed}
                          type={file.type as FileListItemProps["type"]}
                          onDelete={() => handleDeleteFile(file.id)}
                          onRetry={() => handleRetryFile(file.id)}
                        />
                      ))}
                    </FileUpload.List>
                  )}
                </FileUpload.Root>
              </div>

              <div className="z-10 flex flex-1 flex-col-reverse gap-3 p-4 pt-6 *:grow sm:grid sm:grid-cols-2 sm:px-6 sm:pt-8 sm:pb-6">
                <Button color="secondary" size="lg" onClick={handleCancel}>
                  {cancelButtonText}
                </Button>
                <Button
                  color="primary"
                  size="lg"
                  onClick={handleUpload}
                  isDisabled={!allFilesUploaded}
                >
                  {uploadButtonText}
                </Button>
              </div>
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </AriaDialogTrigger>
  );
};

export default UploadModal;
