"use client";

import Form from "next/form";
import { useState } from "react";
import { Button } from "./ui/button";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormStatus {
  type: "idle" | "loading" | "success" | "error";
  message?: string;
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<FormStatus>({ type: "idle" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: "loading" });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus({
        type: "success",
        message: "Message sent successfully! We'll get back to you soon.",
      });

      setFormData({ name: "", email: "", subject: "", message: "" });

      setTimeout(() => setStatus({ type: "idle" }), 5000);
    } catch (error) {
      setStatus({
        type: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="bg-card/60 border border-border rounded-xl p-8 max-w-2xl mx-auto mt-20 md:mt-30">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Get in Touch</h2>
        <p className="text-muted">
          Have questions? We&apos;d love to hear from you. Send us a message and
          we&apos;ll respond as soon as possible.
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="space-y-6" action="#">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Name <span className="text-primary">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/10 focus:border-primary transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Email <span className="text-primary">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/10 focus:border-primary transition-all"
              placeholder="john@example.com"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Subject <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            required
            value={formData.subject}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/10 focus:border-primary transition-all"
            placeholder="How can we help?"
          />
        </div>

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium text-foreground mb-2"
          >
            Message <span className="text-primary">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            value={formData.message}
            onChange={handleChange}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-primary/10 focus:border-primary transition-all resize-none"
            placeholder="Tell us more about your question or feedback..."
          />
        </div>

        {status.type === "success" && (
          <div className="flex items-center gap-3 bg-primary/10 border border-primary/30 rounded-lg px-4 py-3">
            <CheckCircle2 size={20} className="text-primary shrink-0" />
            <p className="text-sm text-primary">{status.message}</p>
          </div>
        )}

        {status.type === "error" && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
            <AlertCircle size={20} className="text-red-500 shrink-0" />
            <p className="text-sm text-red-500">{status.message}</p>
          </div>
        )}

        <Button
          type="submit"
          disabled={status.type === "loading"}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status.type === "loading" ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              <span>Sending...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Send Message</span>
            </>
          )}
        </Button>
      </Form>

      <div className="mt-8 pt-8 border-t border-border">
        <p className="text-sm text-muted text-center">
          Or email us directly at{" "}
          <a
            href="mailto:support@kyte.io"
            className="text-primary hover:underline"
          >
            support@kyte.io
          </a>
        </p>
      </div>
    </div>
  );
}
