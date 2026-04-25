import Image from 'next/image';

export default function Header() {
  return (
    <header className="py-6 border-b border-border-light">
      <div className="max-w-5xl mx-auto px-4">
        <Image
          src="/logo.png"
          alt="Liberators AI"
          width={180}
          height={48}
          priority
          className="h-10 w-auto"
        />
      </div>
    </header>
  );
}
