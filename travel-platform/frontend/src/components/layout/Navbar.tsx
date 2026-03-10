import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const base = 'px-3 py-2 text-sm';
  const active = ({ isActive }: { isActive: boolean }) =>
    `${base} ${isActive ? 'font-semibold underline' : 'text-slate-600'}`;

  return (
    <header className="sticky top-0 z-20 border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="font-bold">✈️ TravelPlan</Link>
        <button className="md:hidden" onClick={() => setOpen((v) => !v)}>☰</button>
        <nav className={`${open ? 'flex' : 'hidden'} md:flex flex-col md:flex-row md:items-center gap-1 absolute md:static top-14 right-4 bg-white p-2 md:p-0 rounded shadow md:shadow-none`}>
          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={active}>Dashboard</NavLink>
              <NavLink to="/flights/search" className={active}>Flights</NavLink>
              <NavLink to="/trips" className={active}>Trips</NavLink>
              <NavLink to="/destinations" className={active}>Destinations</NavLink>
              <button onClick={logout} className="px-3 py-2 text-sm text-red-600">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={active}>Login</NavLink>
              <NavLink to="/register" className={active}>Register</NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
