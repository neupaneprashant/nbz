import { Link } from 'react-router-dom';
import DestinationCard from '../components/destinations/DestinationCard';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useAuth } from '../context/AuthContext';
import { useFeaturedDestinations } from '../hooks/useDestinations';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: featured, isLoading } = useFeaturedDestinations();

  const cards = [
    { title: '✈️ Search Flights', to: '/flights/search', desc: 'Find best route options quickly.' },
    { title: '📍 Explore Destinations', to: '/destinations', desc: `Discover ${featured?.length ?? 0}+ amazing places around the world` },
    { title: '🛫 Track Flight Status', to: '/flights/status', desc: 'See live updates and delays.' },
    { title: '🗺️ My Trips', to: '/trips', desc: 'Manage itineraries and plans.' },
  ];

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold">Welcome back, {user?.name ?? 'Traveler'}! 👋</h1>
        <p className="text-slate-600">What would you like to do today?</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.title} to={card.to} className="rounded-xl bg-white p-5 shadow hover:shadow-md">
            <h2 className="font-semibold">{card.title}</h2>
            <p className="text-sm text-slate-600">{card.desc}</p>
          </Link>
        ))}
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-bold">✨ Featured Destinations</h2>
          <Link to="/destinations" className="text-sm text-sky-600">View All Destinations</Link>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {isLoading && Array.from({ length: 4 }).map((_, i) => <div className="min-w-[250px]" key={i}><SkeletonCard /></div>)}
          {featured?.slice(0, 4).map((d) => (
            <div className="min-w-[280px]" key={d.id}><DestinationCard destination={d} /></div>
          ))}
        </div>
      </section>
    </div>
  );
}
