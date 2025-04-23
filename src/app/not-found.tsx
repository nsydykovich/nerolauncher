import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex h-screen min-h-[calc(100vh-3.5rem)] items-center justify-center bg-background text-foreground">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <h1 className="mb-4 font-display text-7xl font-bold tracking-tight lg:text-9xl">
            404
          </h1>
          <p className="mb-8 text-lg">
            It looks like the page you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link href="/">Go Back Home</Link>
        </div>
      </div>
    </div>
  );
}
