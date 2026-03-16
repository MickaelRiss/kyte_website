"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function LicenceDisplay({ licenceKey }: { licenceKey: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(licenceKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative bg-black/40 border border-primary/30 rounded-xl p-5 text-left">
      <p className="font-mono text-primary text-xs break-all leading-relaxed pr-10">
        {licenceKey}
      </p>
      <button
        onClick={handleCopy}
        aria-label="Copy licence key"
        className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors"
      >
        {copied ? (
          <Check className="h-4 w-4" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
      {copied && (
        <p className="text-primary/70 text-xs mt-2 text-right">Copied!</p>
      )}
    </div>
  );
}
