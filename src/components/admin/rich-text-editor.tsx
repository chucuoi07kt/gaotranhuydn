'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

const ReactQuill = dynamic(
  async () => {
    const mod = await import('react-quill');
    const Comp = mod.default;
    // @ts-ignore
    Comp.displayName = 'ReactQuill';
    return Comp;
  },
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-md bg-secondary" /> }
);

const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image'],
    ['clean'],
  ],
  clipboard: {
    matchVisual: false,
  },
};

const FORMATS = [
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'list',
  'bullet',
  'link',
  'image',
];

interface Props {
  value?: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  return (
    <div ref={containerRef} className="rich-text-wrapper">
      {mounted && (
        <ReactQuill
          theme="snow"
          value={value || ''}
          onChange={onChange}
          modules={MODULES}
          formats={FORMATS}
          placeholder="Nhập nội dung bài viết..."
          style={{ minHeight: '200px' }}
        />
      )}
      <style jsx global>{`
        .rich-text-wrapper .ql-toolbar {
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          border-color: hsl(var(--border));
          background: hsl(var(--card));
        }
        .rich-text-wrapper .ql-container {
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          border-color: hsl(var(--border));
          background: hsl(var(--card));
          min-height: 200px;
          font-size: 14px;
        }
        .rich-text-wrapper .ql-editor {
          min-height: 200px;
          color: hsl(var(--foreground));
        }
        .rich-text-wrapper .ql-snow .ql-stroke {
          stroke: hsl(var(--muted-foreground));
        }
        .rich-text-wrapper .ql-snow .ql-fill {
          fill: hsl(var(--muted-foreground));
        }
        .rich-text-wrapper .ql-snow .ql-picker {
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}