"use client"
import { useState, useEffect } from "react"
import { Calendar, MapPin, Clock, Users, Star, Ticket, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {fetchEvents, attendEvent, unattendEvent, deleteEvent} from "../lib/fetch/events"
import { isAdmin, getUserId } from "../lib/global";
const EventsSection = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await fetchEvents();
        // Si la respuesta es { events: [...] }
        setEvents(data.events || data);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    };
    loadEvents();
  }, []);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  // Estado para spinner de creación de evento
  const [isCreatingEvent, setIsCreatingEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    datetime: "",
    location: "",
    attendees: 0,
    category: "conferencia",
    featured: false,
    price: "",
  })

  const getCategoryIcon = (category) => {
    const iconProps = { size: 16, className: "text-gray-500" }

    switch (category) {
      case "conferencia":
        return <Users {...iconProps} />
      case "taller":
        return <Star {...iconProps} />
      case "networking":
        return <Users {...iconProps} />
      case "webinar":
        return <Calendar {...iconProps} />
      case "encuentro":
        return <Coffee {...iconProps} />
      case "festival":
        return <Star {...iconProps} />
      default:
        return <Calendar {...iconProps} />
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  const formatTime12h = (timeString) => {
    if (!timeString) return '';
    // Espera formato HH:mm o HH:mm:ss
    const [hour, minute] = timeString.split(":");
    let h = parseInt(hour, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    if (h === 0) h = 12;
    return `${h}:${minute} ${ampm}`;
  }

  const formatDateAndTime12h = (dateString) => {
    if (!dateString) return '';
    const dateObj = new Date(dateString);
    // Fecha
    const fecha = dateObj.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    // Hora
    let hour = dateObj.getHours();
    const minute = dateObj.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    if (hour === 0) hour = 12;
    const hora = `${hour}:${minute} ${ampm}`;
    return `${fecha} - ${hora}`;
  }

  const handleCreateEvent = async () => {
    if (!newEvent.title || !newEvent.datetime || !newEvent.location) {
      alert("Por favor, completa todos los campos requeridos: título, fecha/hora y ubicación.");
      return;
    }
    setIsCreatingEvent(true);
    try {
      const { createEvent, fetchEvents } = await import("../lib/fetch/events");
      // Separar fecha y hora de datetime-local
      const [date, time] = newEvent.datetime.split("T");
      await createEvent({
        title: newEvent.title,
        description: newEvent.description,
        date: newEvent.datetime,
        time: time,
        location: newEvent.location,
      });
      // Recargar eventos después de crear uno nuevo
      const data = await fetchEvents();
      setEvents(data.events || data);
      setNewEvent({
        title: "",
        description: "",
        datetime: "",
        location: "",
        attendees: 0,
        category: "conferencia",
        featured: false,
        price: "",
      });
      setIsCreateDialogOpen(false);
      alert("¡Evento creado exitosamente!");
    } catch (error) {
      alert("Error al crear el evento");
    } finally {
      setIsCreatingEvent(false);
    }
  }

  // Estado para eventos reservados por el usuario
  const [reservedEvents, setReservedEvents] = useState([]);

  // Función para reservar o quitar reservación de un evento
  const handleToggleAttendEvent = async (eventId) => {
    if (reservedEvents.includes(eventId)) {
      // Quitar reservación
      try {
        await unattendEvent(eventId);
        setReservedEvents((prev) => prev.filter(id => id !== eventId));
      } catch (error) {
        alert("Error al quitar la reservación del evento");
      }
    } else {
      // Reservar
      try {
        await attendEvent(eventId);
        setReservedEvents((prev) => [...prev, eventId]);
      } catch (error) {
        alert("Error al reservar el evento");
      }
    }
  };

  // Estado para el modal de confirmación y el id del evento a borrar
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState(null);

  // Estado para el modal de asistentes
  const [isAttendeesDialogOpen, setIsAttendeesDialogOpen] = useState(false);
  const [selectedEventAttendees, setSelectedEventAttendees] = useState([]);
  const [selectedEventTitle, setSelectedEventTitle] = useState("");


  return (
    <section className="py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 flex flex-col gap-4 relative">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre eventos increíbles, conecta con profesionales y expande tus conocimientos
            </p>
          </div>
          {isAdmin() && (
            <button
              onClick={() => setIsCreateDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center mx-auto"
              style={{ position: 'absolute', right: 0, top: 0 }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear evento
            </button>
          )}
        </div>

        {/* Dialog para crear evento solo para admin */}
        {isAdmin() && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
              <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <DialogTitle className="text-xl font-bold">Crear evento</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-transparent border-b border-slate-600 text-white text-lg focus:outline-none mb-2 p-1"
                  placeholder="Título del evento"
                />
                <Textarea
                  value={newEvent.description}
                  onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="bg-transparent border-none text-white text-lg resize-none focus:ring-0 focus:outline-none p-0"
                  placeholder="Descripción"
                  rows={2}
                />
                <input
                  type="datetime-local"
                  value={newEvent.datetime}
                  onChange={e => setNewEvent({ ...newEvent, datetime: e.target.value })}
                  className="w-full bg-transparent border-b border-slate-600 text-white focus:outline-none p-1"
                  placeholder="Fecha y hora"
                />
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full bg-transparent border-b border-slate-600 text-white focus:outline-none p-1"
                  placeholder="Ubicación"
                />
                <button
                  onClick={handleCreateEvent}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2 flex items-center justify-center"
                  disabled={isCreatingEvent}
                >
                  {isCreatingEvent ? (
                    <>
                      <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v8z"></path>
                      </svg>
                      Creando...
                    </>
                  ) : (
                    "Crear evento"
                  )}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event._id}
              className="rounded-lg border bg-slate-800 p-6 hover:shadow-lg transition-shadow duration-300 relative group cursor-pointer"
              onClick={e => {
                if (!isAdmin()) return; // Solo admin puede abrir el modal
                // Evitar abrir modal si se hace click en los botones de eliminar o reservar
                if (
                  e.target.closest("button") ||
                  e.target.closest(".modal-ignore-click")
                ) return;
                setSelectedEventAttendees(event.attendees || []);
                setSelectedEventTitle(event.title || "");
                setIsAttendeesDialogOpen(true);
              }}
            >
              {/* Category Icon */}
              <div className="absolute top-4 left-4">{getCategoryIcon(event.category)}</div>

              {/* Botón eliminar evento (arriba derecha) con modal */}
              {isAdmin() && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEventIdToDelete(event._id);
                      setIsConfirmDialogOpen(true);
                    }}
                    className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all modal-ignore-click"
                    title="Eliminar evento"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  {/* Modal de confirmación para eliminar evento */}
                  <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-bold">¿Eliminar evento?</DialogTitle>
                      </DialogHeader>
                      <div className="py-4 text-center">
                        <p>¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.</p>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          className="border border-gray-500 text-gray-300 hover:bg-gray-700 rounded px-4 py-2"
                          onClick={() => {
                            setIsConfirmDialogOpen(false);
                            setEventIdToDelete(null);
                          }}
                        >
                          Cancelar
                        </button>
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2"
                          onClick={async () => {
                            if (!eventIdToDelete) return;
                            try {
                              await deleteEvent(eventIdToDelete);
                              const data = await fetchEvents();
                              setEvents(data.events || data);
                              setIsConfirmDialogOpen(false);
                              setEventIdToDelete(null);
                              alert("Evento eliminado exitosamente");
                            } catch (error) {
                              alert("Error al eliminar el evento");
                            }
                          }}
                        >
                          Eliminar
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </>
              )}

              {/* Featured Badge */}
              {event.featured && (
                <div className="absolute top-4 right-12">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    Destacado
                  </span>
                </div>
              )}

              {/* Event Content */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold  mb-2">{event.title}</h3>
                <p className="text-blue-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                {/* Event Details */}
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm ">
                    <Calendar size={14} className="mr-2" />
                    <span>{formatDateAndTime12h(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm ">
                    <MapPin size={14} className="mr-2" />
                    <span>{event.location}</span>
                  </div>
                </div>

                {/* Logo/Icon Area */}
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="w-8 h-8 bg-black rounded-sm transform rotate-45 relative">
                      <div className="absolute inset-1 bg-white rounded-sm transform -rotate-45"></div>
                    </div>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold">{event.price}</div>
                  <button
                    className={
                      event.attendees && event.attendees.some(att => att._id === getUserId())
                        ? "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center modal-ignore-click"
                        : "bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center modal-ignore-click"
                    }
                    onClick={async e => {
                      e.stopPropagation();
                      try {
                        if (event.attendees && event.attendees.some(att => att._id === getUserId())) {
                          await unattendEvent(event._id);
                        } else {
                          await attendEvent(event._id);
                        }
                        const data = await fetchEvents();
                        setEvents(data.events || data);
                      } catch (error) {
                        alert("Error al actualizar la reservación del evento");
                      }
                    }}
                  >
                    <Ticket size={14} className="mr-1" />
                    {event.attendees && event.attendees.some(att => att._id === getUserId())
                      ? "Reservado (Cancelar)"
                      : "Reservar"}
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal de asistentes (solo visible para admin) */}
        {isAdmin() && (
          <Dialog open={isAttendeesDialogOpen} onOpenChange={setIsAttendeesDialogOpen}>
            <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">Asistentes a "{selectedEventTitle}"</DialogTitle>
              </DialogHeader>
              <div className="py-4 max-h-72 overflow-y-auto">
                {selectedEventAttendees.length === 0 ? (
                  <p className="text-center text-gray-400">No hay asistentes registrados.</p>
                ) : (
                  <ul className="space-y-3">
                    {selectedEventAttendees.map(person => (
                      <li key={person._id} className="flex items-center gap-3">
                        <img
                          src={person.image}
                          alt={person.name}
                          className="w-10 h-10 rounded-full object-cover border border-gray-600"
                          onError={e => { e.target.src = '/placeholder.png'; }}
                        />
                        <span className="font-medium">{person.name} {person.surname}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded px-4 py-2"
                  onClick={() => setIsAttendeesDialogOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-medium transition-colors duration-200">
            Ver Todos los Eventos
          </button>
        </div>
      </div>
    </section>
  )
}

// Coffee icon component
const Coffee = ({ size = 16, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
    <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
    <line x1="6" y1="1" x2="6" y2="4" />
    <line x1="10" y1="1" x2="10" y2="4" />
    <line x1="14" y1="1" x2="14" y2="4" />
  </svg>
)

export default EventsSection
