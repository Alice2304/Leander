import { Calendar, MapPin, Clock, Users, Star, Ticket } from "lucide-react"

const EventsSection = () => {
  const events = [
    {
      id: 1,
      title: "Conferencia de Tecnología 2025",
      description: "Únete a líderes de la industria para discusiones sobre tecnología de vanguardia y oportunidades de networking.",
      date: "2025-07-15",
      time: "09:00",
      location: "Nucleo Altagracia",
      attendees: 500,
      category: "conferencia",
      featured: true,
    },
    {
      id: 2,
      title: "Taller de Diseño",
      description: "Aprende principios de diseño moderno y técnicas prácticas de la mano de expertos.",
      date: "2024-07-20",
      time: "14:00",
      location: "Nucleo Altagracia",
      attendees: 50,
      category: "taller",
      featured: false,
    },
    {
      id: 3,
      title: "Networking para Startups",
      description: "Conecta con emprendedores, inversores e innovadores del ecosistema startup.",
      date: "2025-07-25",
      time: "18:00",
      location: "Nucleo Altagracia",
      attendees: 200,
      category: "networking",
      featured: true,
    },
    {
      id: 4,
      title: "IA y Aprendizaje Automático",
      description: "Explora los últimos avances en inteligencia artificial y machine learning.",
      date: "2025-08-01",
      time: "10:00",
      location: "Nucleo Altagracia",
      attendees: 300,
      category: "webinar",
      featured: false,
    },
    {
      id: 5,
      title: "Encuentro de Desarrolladores",
      description: "Reunión mensual para que desarrolladores compartan conocimientos y colaboren en proyectos.",
      date: "2025-08-05",
      time: "19:00",
      location: "Nucleo Altagracia",
      attendees: 80,
      category: "encuentro",
      featured: false,
    },
    {
      id: 6,
      title: "Cumbre de Marketing Digital",
      description: "Domina estrategias y herramientas de marketing digital para el crecimiento empresarial moderno.",
      date: "2025-08-10",
      time: "09:30",
      location: "Nucleo Altagracia",
      attendees: 400,
      category: "conferencia",
      featured: true,
    },
  ]

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

  return (
    <section className="py-6 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Próximos Eventos</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Descubre eventos increíbles, conecta con profesionales y expande tus conocimientos
          </p>
        </div>

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
                  <div className="flex items-center text-sm ">
                    <Users size={14} className="mr-2" />
                    <span>{event.attendees} asistentes</span>
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
