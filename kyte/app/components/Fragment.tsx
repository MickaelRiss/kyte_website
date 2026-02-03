import { Button } from "./ui/button";
import { Download, Copy } from "lucide-react";

export default function Fragment() {
  return (
    <div className="w-full bg-background/80 border border-border rounded-lg px-4 py-4 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs font-semibold text-primary tracking-wider">
          FRAGMENT A
        </span>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted whitespace-nowrap">
            You keep this
          </span>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border text-foreground text-xs h-8 px-3"
          >
            <Download size={12} />
            <span>QR</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 border-border text-foreground text-xs h-8 px-3"
          >
            <Copy size={12} />
            <span>Copy</span>
          </Button>
        </div>
      </div>

      <div className="w-full bg-card/80 border border-border rounded-md p-3">
        <ol className="space-y-1.5 text-foreground list-decimal list-inside text-xs">
          <li>Click &quot;Download QR&quot;</li>
          <li>Print the QR code</li>
          <li>Store it somewhere safe</li>
        </ol>
      </div>

      <div className="w-full bg-card/80 border border-border rounded-md p-3 overflow-hidden">
        <div className="overflow-x-auto">
          <code className="text-xs text-muted break-all font-mono leading-relaxed block">
            {`{"i":1,"data":"f9b7d5dce30fc74ec5bcbaa0c788a1a21bdc9c6e9ad62b9ee6d4d12fd180feca1f4ab86dad470fb3907158e1dbf9a3b678dcbce354163a2e8e456c5bcbaa0c788a1a21bdc9c6e9ad62"}`}
          </code>
        </div>
      </div>
    </div>
  );
}
