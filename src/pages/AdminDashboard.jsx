import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useBooking } from '../context/BookingContext';
import { getPricePerKm, setPricePerKm } from '../utils/pricingLogic';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { UserPlus, LayoutDashboard } from 'lucide-react';
import { Modal } from '../components/ui/Modal';

export const AdminDashboard = () => {
  const { user, isAuthenticated, createAdmin } = useAuth();
  const { bookings, updateBookingStatus, deleteBooking, updateBookingRoute } = useBooking();
  const navigate = useNavigate();
  const [isCreateAdminOpen, setIsCreateAdminOpen] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [pricePerKm, setPricePerKmState] = useState(() => String(getPricePerKm()));
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editFrom, setEditFrom] = useState('');
  const [editTo, setEditTo] = useState('');
  const [isSavingRoute, setIsSavingRoute] = useState(false);
  const isAdmin = user?.role === 'admin';
  const isDriver = user?.role === 'driver';
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      const created = await createAdmin({ email: newAdminEmail });
      setNewAdminEmail('');
      setIsCreateAdminOpen(false);
      alert(
        `Account autista creato per ${created.email}. Password iniziale: driver123`
      );
    } catch (error) {
      alert(error.message || 'Errore nella creazione dell\'account autista');
    }
  };

  const handleSavePricePerKm = (e) => {
    e.preventDefault();
    const value = parseFloat(pricePerKm);
    if (Number.isNaN(value) || value <= 0) {
      alert('Inserisci una tariffa valida maggiore di 0');
      return;
    }
    setPricePerKm(value);
    alert(`Tariffa aggiornata a ${value}€/km`);
  };

  const handleDeleteBooking = (id) => {
    const confirmDelete = window.confirm('Sei sicuro di voler eliminare questa prenotazione?');
    if (!confirmDelete) return;
    deleteBooking(id);
  };

  const openEditBooking = (booking) => {
    setEditingBooking(booking);
    setEditFrom(booking.from);
    setEditTo(booking.to);
    setIsEditBookingOpen(true);
  };

  const handleSaveRoute = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;
    setIsSavingRoute(true);
    await updateBookingRoute(editingBooking.id, editFrom, editTo);
    setIsSavingRoute(false);
    setIsEditBookingOpen(false);
    setEditingBooking(null);
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-navy-900 text-slate-300 flex flex-col">
      <Navbar />

      <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <LayoutDashboard className="text-gold-500" />
                {isAdmin ? 'Admin Dashboard' : 'Driver Dashboard'}
              </h1>
              <p className="text-slate-400 mt-1">Welcome back, {user?.name}</p>
            </div>
            
            {isAdmin && (
              <Button onClick={() => setIsCreateAdminOpen(true)}>
                <UserPlus className="h-4 w-4" />
                Crea account autista
              </Button>
            )}
          </div>

          {isAdmin && (
            <form
              onSubmit={handleSavePricePerKm}
              className="flex flex-col md:flex-row items-start md:items-center gap-4 bg-navy-800 border border-navy-700 rounded-lg p-4"
            >
              <div>
                <p className="text-sm text-slate-400">Tariffa corrente</p>
                <p className="text-lg font-semibold text-gold-500">
                  {pricePerKm} €/km
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={pricePerKm}
                  onChange={(e) => setPricePerKmState(e.target.value)}
                  className="bg-navy-900 border border-navy-700 rounded px-3 py-2 text-sm text-white w-28"
                />
                <span className="text-sm text-slate-400">€/km</span>
              </div>
              <Button type="submit" size="sm">
                Aggiorna tariffa
              </Button>
            </form>
          )}
        </div>

        {/* Bookings Table */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden shadow-xl">
          <div className="p-6 border-b border-navy-700">
            <h3 className="text-lg font-bold text-white">Recent Bookings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-navy-900/50 text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-semibold">ID</th>
                  <th className="px-6 py-4 font-semibold">Route</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Vehicle</th>
                  <th className="px-6 py-4 font-semibold">Driver</th>
                  <th className="px-6 py-4 font-semibold">Price</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  {isAdmin && (
                    <th className="px-6 py-4 font-semibold">Azioni</th>
                  )}
                  {isDriver && (
                    <th className="px-6 py-4 font-semibold">Aggiorna</th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-8 text-center text-slate-400 text-sm"
                    >
                      No bookings yet. New bookings will appear here.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="hover:bg-navy-700/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-white font-mono">
                        #{booking.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-white text-sm">
                            {booking.from}
                          </span>
                          <span className="text-xs text-slate-500">to</span>
                          <span className="text-white text-sm">
                            {booking.to}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {booking.date}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {booking.vehicleType}
                      </td>
                      <td className="px-6 py-4 text-slate-300">
                        {booking.driver}
                      </td>
                      <td className="px-6 py-4 text-gold-500 font-bold">
                        €{booking.price}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${booking.status === 'Completed' || booking.status === 'Completato' ? 'bg-green-900/50 text-green-400 border border-green-800' : ''}
                        ${booking.status === 'Confirmed' || booking.status === 'In-Corso' ? 'bg-blue-900/50 text-blue-400 border border-blue-800' : ''}
                        ${booking.status === 'Pending' ? 'bg-yellow-900/50 text-yellow-400 border border-yellow-800' : ''}
                        ${booking.status === 'Rifiutato' ? 'bg-red-900/50 text-red-400 border border-red-800' : ''}
                        ${booking.status === 'Non-Disponibile' ? 'bg-slate-800/70 text-slate-200 border border-slate-600' : ''}
                      `}
                        >
                          {booking.status}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-4 space-x-2">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => openEditBooking(booking)}
                          >
                            Modifica tragitto
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            className="text-red-400 border-red-500/70 hover:bg-red-500/10"
                            onClick={() => handleDeleteBooking(booking.id)}
                          >
                            Elimina
                          </Button>
                        </td>
                      )}
                      {isDriver && (
                        <td className="px-6 py-4">
                          <select
                            className="bg-navy-900 border border-navy-700 text-slate-200 text-xs rounded px-2 py-1"
                            defaultValue=""
                            onChange={(e) => {
                              if (!e.target.value) return;
                              updateBookingStatus(booking.id, e.target.value);
                              e.target.value = '';
                            }}
                          >
                            <option value="" disabled>
                              Seleziona stato
                            </option>
                            <option value="Rifiutato">Rifiutato</option>
                            <option value="Completato">Completato</option>
                            <option value="Non-Disponibile">Non-Disponibile</option>
                            <option value="In-Corso">In-Corso</option>
                          </select>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isAdmin && (
        <>
          <Modal
            isOpen={isCreateAdminOpen}
            onClose={() => setIsCreateAdminOpen(false)}
            title="Crea nuovo account autista"
          >
            <form onSubmit={handleCreateAdmin} className="space-y-6">
              <Input
                label="Email autista"
                type="email"
                placeholder="driver@ncc.it"
                value={newAdminEmail}
                onChange={(e) => setNewAdminEmail(e.target.value)}
                required
              />
              <p className="text-xs text-slate-400">
                Password iniziale: <span className="font-mono">driver123</span>
              </p>
              <Button type="submit" className="w-full">
                Crea account
              </Button>
            </form>
          </Modal>

          <Modal
            isOpen={isEditBookingOpen}
            onClose={() => setIsEditBookingOpen(false)}
            title="Modifica tragitto prenotazione"
          >
            <form onSubmit={handleSaveRoute} className="space-y-4">
              <Input
                label="Partenza"
                type="text"
                value={editFrom}
                onChange={(e) => setEditFrom(e.target.value)}
                required
              />
              <Input
                label="Arrivo"
                type="text"
                value={editTo}
                onChange={(e) => setEditTo(e.target.value)}
                required
              />
              <Button type="submit" className="w-full" disabled={isSavingRoute}>
                {isSavingRoute ? 'Salvataggio...' : 'Salva tragitto e aggiorna prezzo'}
              </Button>
            </form>
          </Modal>
        </>
      )}

      <Footer />
    </div>
  );
};
