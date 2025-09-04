'use client';

import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';

interface ImageUploadProps {
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
  existingImages?: string[];
  onRemoveExistingImage?: (index: number) => void;
}

interface UploadedFile {
  file: File;
  preview: string;
  id: string;
  status: 'uploading' | 'success' | 'error';
  progress: number;
}

export function ImageUpload({
  onFilesChange,
  maxFiles = 5,
  maxSize = 5, // 5MB default
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
  className,
  disabled = false,
  existingImages = [],
  onRemoveExistingImage
}: ImageUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    if (!acceptedTypes.includes(file.type)) {
      return `Format file tidak didukung. Gunakan: ${acceptedTypes.map(type => type.split('/')[1]).join(', ')}`;
    }
    if (file.size > maxSize * 1024 * 1024) {
      return `Ukuran file terlalu besar. Maksimal ${maxSize}MB`;
    }
    return null;
  };

  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const currentCount = uploadedFiles.length + existingImages.length;
    
    if (currentCount + fileArray.length > maxFiles) {
      setError(`Maksimal ${maxFiles} gambar yang dapat diunggah`);
      return;
    }

    setError(null);
    const validFiles: File[] = [];
    const newUploadedFiles: UploadedFile[] = [];

    fileArray.forEach((file) => {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      const id = Math.random().toString(36).substr(2, 9);
      const preview = URL.createObjectURL(file);
      
      newUploadedFiles.push({
        file,
        preview,
        id,
        status: 'uploading',
        progress: 0
      });
      
      validFiles.push(file);
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newUploadedFiles]);
      
      // Upload files to server
      try {
        const formData = new FormData();
        validFiles.forEach((file) => {
          formData.append('images', file);
        });

        const response = await fetch('/api/upload/images', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        
        // Update upload status to success
        setUploadedFiles(prev => 
          prev.map(uploadedFile => 
            newUploadedFiles.find(nuf => nuf.id === uploadedFile.id)
              ? { ...uploadedFile, status: 'success' as const, progress: 100 }
              : uploadedFile
          )
        );

        // Pass the uploaded file URLs to parent component
        const uploadedUrls = result.data.map((file: any) => file.url);
        onFilesChange([...uploadedFiles.map(f => f.file), ...validFiles]);
        
        // Also notify parent about the uploaded URLs
        if (typeof onFilesChange === 'function') {
          // Create a custom event to pass URLs
          const event = new CustomEvent('filesUploaded', { detail: uploadedUrls });
          window.dispatchEvent(event);
        }
        
      } catch (error) {
        console.error('Upload error:', error);
        setError('Gagal mengunggah gambar. Silakan coba lagi.');
        
        // Update upload status to error
        setUploadedFiles(prev => 
          prev.map(uploadedFile => 
            newUploadedFiles.find(nuf => nuf.id === uploadedFile.id)
              ? { ...uploadedFile, status: 'error' as const }
              : uploadedFile
          )
        );
      }
    }
  }, [uploadedFiles, existingImages.length, maxFiles, maxSize, acceptedTypes, onFilesChange]);



  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(file => file.id !== fileId);
      onFilesChange(updated.map(f => f.file));
      return updated;
    });
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 cursor-pointer',
          isDragOver && !disabled
            ? 'border-blue-500 bg-blue-50 scale-105'
            : 'border-gray-300 hover:border-gray-400',
          disabled && 'opacity-50 cursor-not-allowed',
          'group'
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="flex flex-col items-center justify-center text-center">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-colors',
            isDragOver && !disabled
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
          )}>
            <Upload className="w-6 h-6" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">
              {isDragOver ? 'Lepaskan file di sini' : 'Drag & drop gambar atau klik untuk memilih'}
            </p>
            <p className="text-xs text-gray-500">
              Maksimal {maxFiles} file, ukuran maksimal {maxSize}MB per file
            </p>
            <p className="text-xs text-gray-400">
              Format: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
            </p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Existing Images */}
      {existingImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Gambar Saat Ini</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {existingImages.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={imageUrl}
                    alt={`Existing image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg" />
                
                {/* Remove Button for Existing Images */}
                {onRemoveExistingImage && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveExistingImage(index);
                    }}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
                
                {/* Image Info */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-xs truncate">
                    Gambar {index + 1}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Uploaded Files Preview */}
      {uploadedFiles.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">File yang Diunggah</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {uploadedFiles.map((uploadedFile) => (
              <div key={uploadedFile.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={uploadedFile.preview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Upload Progress Overlay */}
                  {uploadedFile.status === 'uploading' && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <div className="text-white text-center">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                        <p className="text-xs">{Math.round(uploadedFile.progress)}%</p>
                      </div>
                    </div>
                  )}
                  
                  {/* Success Overlay */}
                  {uploadedFile.status === 'success' && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Remove Button */}
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 left-2 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(uploadedFile.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
                
                {/* File Info */}
                <div className="mt-2">
                  <p className="text-xs text-gray-600 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Upload Summary */}
      {(uploadedFiles.length > 0 || existingImages.length > 0) && (
        <div className="text-sm text-gray-500">
          {existingImages.length + uploadedFiles.length} dari {maxFiles} gambar
        </div>
      )}
    </div>
  );
}