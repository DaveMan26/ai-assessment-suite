import { Link } from 'react-router-dom';

export default function TestLayout({ children, maxWidth = '560px' }) {
  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-40 px-4 pt-3 pb-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm text-[#888] hover:text-[#2D2D2D] transition-colors"
        >
          ← Zpět na menu
        </Link>
      </div>

      <div
        className="mx-auto px-4 sm:px-6 pb-16"
        style={{ maxWidth }}
      >
        {children}
      </div>
    </div>
  );
}
