import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center px-6 min-h-below-navbar">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-8xl font-semibold text-primary mb-6">404</p>
        <h1 className="text-3xl font-bold text-white mb-4">Page not found</h1>
        <p className="text-gray-400 text-base/7 mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="text-primary hover:text-primary/80 text-sm font-semibold transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
