"use client";

import Script from "next/script";
import { Button } from "./ui/button";
import { Mail, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function WaitlistDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group relative overflow-hidden border-border hover:border-primary/50 transition-all duration-300 cursor-pointer"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Mail size={16} />
            Join Waitlist
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-150 bg-card border-border p-0 gap-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card/50">
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <span className="bg-primary/10 p-2 rounded-lg">
              <Mail className="text-primary" size={24} />
            </span>
            Join the Kyte Pro Waitlist
          </DialogTitle>
        </DialogHeader>

        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <div className="rounded-lg px-4 overflow-hidden border border-border/50 bg-background py-2">
            <iframe
              data-tally-src="https://tally.so/embed/QKVq5g?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
              loading="lazy"
              width="100%"
              height="400"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title="Join the Kyte Pro Waitlist"
            />
          </div>
        </div>

        <div className="px-6 pb-6 pt-2">
          <div className="flex items-center justify-center gap-2 text-xs text-muted bg-card/50 rounded-lg p-3 border border-border/30">
            <Lock size={14} className="text-primary" />
            <span>We respect your privacy. Unsubscribe anytime.</span>
          </div>
        </div>

        <Script id="tally-js" src="https://tally.so/widgets/embed.js" />
      </DialogContent>
    </Dialog>
  );
}
