'use client';

import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

interface ShareButtonsProps {
  title: string;
  url: string;
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  return (
    <section className="mb-10 border-t pt-6" aria-label="Share this article">
      <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Share2 className="size-4 text-amber-500" />
        Share This Article
      </h2>
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            window.open(
              `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
              '_blank'
            );
          }}
        >
          Twitter
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
              '_blank'
            );
          }}
        >
          LinkedIn
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
              '_blank'
            );
          }}
        >
          Facebook
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-xs"
          onClick={() => {
            navigator.clipboard.writeText(url);
          }}
        >
          Copy Link
        </Button>
      </div>
    </section>
  );
}