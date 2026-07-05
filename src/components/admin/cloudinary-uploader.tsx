'use client';

import { useRef, useState } from 'react';
import { ImagePlus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { toWebpUrl } from '@/lib/format';
import { cn } from '@/lib/utils';
import { PLACEHOLDER_IMAGE } from '@/lib/constants';
import { toast } from 'sonner';

interface Props {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function CloudinaryUploader({ value, onChange, label = 'Ảnh' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh.');
      return;
    }
    setUploading(true);
    setProgress(0);
    const loading = toast.loading('Đang tải ảnh lên Cloudinary...');
    try {
      const url = await uploadToCloudinary(file, setProgress);
      const webp = toWebpUrl(url) || url;
      onChange(webp);
      toast.dismiss(loading);
      toast.success('Tải ảnh thành công.');
    } catch (err) {
      toast.dismiss(loading);
      toast.error(
        err instanceof Error ? err.message : 'Tải ảnh thất bại.'
      );
    } finally {
      setUploading(false);
      setProgress(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'relative flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          dragOver
            ? 'border-primary bg-primary/5'
            : 'border-border bg-secondary/30 hover:border-primary/40'
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {value ? (
          <div className="relative w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value || PLACEHOLDER_IMAGE}
              alt="preview"
              className="mx-auto h-32 w-auto rounded-md object-contain"
            />
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-0 top-0 rounded-full bg-destructive p-1 text-destructive-foreground shadow"
              aria-label="Xóa ảnh"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
              {uploading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <ImagePlus className="h-5 w-5" />
              )}
            </div>
            <p className="text-sm font-medium text-foreground">
              {uploading
                ? `Đang tải... ${progress}%`
                : `Kéo thả ảnh vào đây hoặc bấm chọn`}
            </p>
            <p className="text-xs text-muted-foreground">
              Hỗ trợ JPG, PNG, WebP – tối đa 5MB
            </p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Chọn ảnh
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Hoặc dán URL ảnh"
          className="text-xs"
        />
      </div>
      <p className="text-[11px] text-muted-foreground">
        Ảnh sẽ tự động chuyển sang định dạng .webp để tối ưu SEO.
      </p>
    </div>
  );
}