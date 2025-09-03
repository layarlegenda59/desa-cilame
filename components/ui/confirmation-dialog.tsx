'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'destructive' | 'default';
  isLoading?: boolean;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Aksi',
  description = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'default',
  isLoading = false
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            {variant === 'destructive' ? (
              <AlertTriangle className="h-5 w-5 text-red-500" />
            ) : null}
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {isLoading ? 'Memproses...' : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// Hook untuk delete confirmation
export function useDeleteConfirmation() {
  return {
    title: 'Hapus Data',
    description: 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.',
    confirmText: 'Ya, Hapus',
    cancelText: 'Batal',
    variant: 'destructive' as const
  };
}

// Hook untuk save confirmation
export function useSaveConfirmation() {
  return {
    title: 'Simpan Perubahan',
    description: 'Apakah Anda yakin ingin menyimpan perubahan ini?',
    confirmText: 'Ya, Simpan',
    cancelText: 'Batal',
    variant: 'default' as const
  };
}

// Hook untuk publish confirmation
export function usePublishConfirmation() {
  return {
    title: 'Publikasikan Konten',
    description: 'Apakah Anda yakin ingin mempublikasikan konten ini? Konten akan terlihat oleh publik.',
    confirmText: 'Ya, Publikasikan',
    cancelText: 'Batal',
    variant: 'default' as const
  };
}

// Hook untuk unpublish confirmation
export function useUnpublishConfirmation() {
  return {
    title: 'Batalkan Publikasi',
    description: 'Apakah Anda yakin ingin membatalkan publikasi konten ini? Konten tidak akan terlihat oleh publik.',
    confirmText: 'Ya, Batalkan',
    cancelText: 'Batal',
    variant: 'destructive' as const
  };
}