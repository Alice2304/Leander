"use client"
import { useState, useEffect } from "react"
import { Calendar, MapPin, Clock, Users, Star, Ticket, Plus, X } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

const EventsSection = () => {
  const [events, setEvents] = useState([])

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { fetchEvents } = await import("../lib/fetch/events");
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
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
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

  const handleCreateEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.time && newEvent.location) {
      try {
        const { createEvent, fetchEvents } = await import("../lib/fetch/events");
        await createEvent({
          title: newEvent.title,
          description: newEvent.description,
          date: newEvent.date,
          location: newEvent.location,
        });
        // Recargar eventos después de crear uno nuevo
        const data = await fetchEvents();
        setEvents(data.events || data);
        setNewEvent({
          title: "",
          description: "",
          date: "",
          time: "",
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
      }
    }
  }

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
          <button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center mx-auto"
            style={{ position: 'absolute', right: 0, top: 0 }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear evento
          </button>
        </div>

        {/* Dialog para crear evento */}
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
              <div className="flex gap-2">
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-1/2 bg-transparent border-b border-slate-600 text-white focus:outline-none p-1"
                />
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                  className="w-1/2 bg-transparent border-b border-slate-600 text-white focus:outline-none p-1"
                />
              </div>
              <input
                type="text"
                value={newEvent.location}
                onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                className="w-full bg-transparent border-b border-slate-600 text-white focus:outline-none p-1"
                placeholder="Ubicación"
              />
              <button
                onClick={handleCreateEvent}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-2"
                disabled={!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location}
              >
                Crear evento
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className=" rounded-lg border bg-slate-800 p-6 hover:shadow-lg transition-shadow duration-300 relative group"
            >
              {/* Category Icon */}
              <div className="absolute top-4 left-4">{getCategoryIcon(event.category)}</div>

              {/* Featured Badge */}
              {event.featured && (
                <div className="absolute top-4 right-4">
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
                    <span>{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-sm ">
                    <Clock size={14} className="mr-2" />
                    <span>{formatTime(event.time)}</span>
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
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center">
                    <Ticket size={14} className="mr-1" />
                    Reservar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

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
