"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

interface InstallModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function InstallModal({ open, onOpenChange }: InstallModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>How to install Kyte</DialogTitle>
          <DialogDescription>
            Follow the steps below for your operating system.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 mt-2">
          <div>
            <h3 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <img src="/ios.svg" alt="macOS" className="size-5" />
              macOS
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>Open the downloaded <span className="text-white/70">.dmg</span> file</li>
              <li>Drag Kyte into your Applications folder</li>
              <li>
                If blocked, go to{" "}
                <span className="text-white/70">
                  System Settings &rarr; Privacy &amp; Security
                </span>
              </li>
              <li>
                Click{" "}
                <span className="text-white/70">&quot;Open Anyway&quot;</span>
              </li>
            </ol>
          </div>

          <div className="border-t border-white/10" />

          <div>
            <h3 className="font-semibold text-white/90 mb-3 flex items-center gap-2">
              <img src="/microsoft.svg" alt="Windows" className="size-5" />
              Windows
            </h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
              <li>Run the downloaded <span className="text-white/70">.exe</span> file</li>
              <li>
                If Windows SmartScreen appears, click{" "}
                <span className="text-white/70">&quot;More info&quot;</span>
              </li>
              <li>
                Then click{" "}
                <span className="text-white/70">&quot;Run anyway&quot;</span>
              </li>
            </ol>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
