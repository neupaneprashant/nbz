import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-3xl font-bold">404 — Page Not Found</h1>
      <Link className="mt-4 inline-block text-sky-600" to="/dashboard">
        Back to dashboard
      </Link>
    </div>
  );
}
