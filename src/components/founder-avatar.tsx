"use client";

import { useState } from "react";
import Image from "next/image";

export function FounderAvatar({
  src,
  initials,
  alt,
  avatarGradient,
}: {
  src: string;
  initials: string;
  alt: string;
  avatarGradient: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${avatarGradient} p-px`}>
      <div className="relative h-full w-full overflow-hidden rounded-[14px] bg-[#0e101a]">
        <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white/80">
          {initials}
        </div>
        {!imgFailed && (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            onError={() => setImgFailed(true)}
          />
        )}
      </div>
    </div>
  );
}
