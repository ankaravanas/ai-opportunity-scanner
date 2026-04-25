import Image from 'next/image';

export default function Header() {
  return (
    <header className="py-5 border-b border-border-light bg-bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4">
        <Image
          src="/logo.png"
          alt="Liberators AI"
          width={160}
          height={40}
          priority
          className="h-9 w-auto"
        />
      </div>
    </header>
  );
}
