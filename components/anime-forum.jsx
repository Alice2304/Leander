"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ArrowUp,
  ArrowDown,
  MessageCircle,
  Share,
  Search,
  Archive,
  Award,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react"

export default function AnimeForum() {
  const [votes, setVotes] = useState({ main: 2, comment1: 5, comment2: 3 })
  const [userVotes, setUserVotes] = useState({})

  const handleVote = (postId, type) => {
    const currentVote = userVotes[postId]
    let newVote = null
    let voteChange = 0

    if (currentVote === type) {
      // Si ya votó lo mismo, quitar voto
      newVote = null
      voteChange = type === "up" ? -1 : 1
    } else if (currentVote) {
      // Si ya votó diferente, cambiar voto
      newVote = type
      voteChange = type === "up" ? 2 : -2
    } else {
      // Nuevo voto
      newVote = type
      voteChange = type === "up" ? 1 : -1
    }

    setUserVotes((prev) => ({ ...prev, [postId]: newVote }))
    setVotes((prev) => ({ ...prev, [postId]: prev[postId] + voteChange }))
  }

  const VoteButtons = ({ postId, count }) => (
    <div className="flex flex-col items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(postId, "up")}
        className={`p-1 h-8 w-8 ${
          userVotes[postId] === "up"
            ? "text-orange-500 bg-orange-500/10"
            : "text-slate-400 hover:text-orange-500 hover:bg-slate-700/50"
        }`}
      >
        <ArrowUp className="w-4 h-4" />
      </Button>

      <span
        className={`text-sm font-medium ${
          userVotes[postId] === "up"
            ? "text-orange-500"
            : userVotes[postId] === "down"
              ? "text-blue-500"
              : "text-slate-300"
        }`}
      >
        {count}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleVote(postId, "down")}
        className={`p-1 h-8 w-8 ${
          userVotes[postId] === "down"
            ? "text-blue-500 bg-blue-500/10"
            : "text-slate-400 hover:text-blue-500 hover:bg-slate-700/50"
        }`}
      >
        <ArrowDown className="w-4 h-4" />
      </Button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto p-4 bg-slate-900 min-h-screen">
      {/* Header del foro */}
      <div className="flex items-center gap-3 mb-6 text-slate-300">
        <Button variant="ghost" size="sm" className="p-2">
          <ArrowUp className="w-4 h-4 rotate-180" />
        </Button>
        <div className="flex items-center gap-2">
          <img src="https://img.freepik.com/psd-gratis/3d-ilustracion-persona-gafas-sol_23-2149436188.jpg?semt=ais_hybrid&w=740" alt="r/anime" className="w-8 h-8 rounded-full" />
          <div className="text-sm">
            <span className="text-slate-100 font-medium">r/anime</span>
            <span className="text-slate-400"> • hace 3 a</span>
          </div>
        </div>
        <span className="text-slate-400 text-sm">Large-Eggplant-2706</span>
      </div>

      {/* Post principal */}
      <Card className="bg-slate-800 border-slate-700 mb-6">
        <CardContent className="p-6">
          {/* Título y etiqueta */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">PREGUNTA</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 mb-3">¿Buenas ia para estudiantes?</h1>
            <p className="text-slate-300 text-sm">
              ¿Alguna gratis?
            </p>
          </div>

          {/* Aviso de archivado */}
          <div className="flex items-center gap-2 bg-slate-700/50 p-3 rounded-lg mb-4">
            <Archive className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 text-sm">
              Publicación archivada. No se pueden publicar nuevos comentarios ni emitir más votos.
            </span>
          </div>

          {/* Botones de interacción */}
          <div className="flex items-center gap-4">
            <VoteButtons postId="main" count={votes.main} />

            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-400 hover:bg-slate-700/50">
              <MessageCircle className="w-4 h-4" />
              <span>10</span>
            </Button>

            <Button variant="ghost" size="sm" className="flex items-center gap-2 text-slate-400 hover:bg-slate-700/50">
              <Share className="w-4 h-4" />
              <span>Compartir</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Controles de comentarios */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <span className="text-slate-400 text-sm">Ordenar por:</span>
          <Button variant="ghost" size="sm" className="text-slate-300 hover:bg-slate-700/50">
            Mejores <ChevronDown className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar comentarios"
            className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-500"
          />
        </div>
      </div>

      {/* Comentarios */}
      <div className="space-y-4">
        {/* Comentario principal */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <VoteButtons postId="comment1" count={votes.comment1} />

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <img src="https://getillustrations.b-cdn.net//photos/pack/3d-avatar-male_lg.png" alt="TimeForHugs" className="w-6 h-6 rounded-full" />
                  <span className="text-slate-100 font-medium text-sm">TimeForHugs</span>
                  <span className="text-slate-400 text-xs">• hace 3 a</span>
                </div>

                <p className="text-slate-300 text-sm mb-3 leading-relaxed">
                  Simplificar la investigación y la búsqueda de información: ChatGPT, Wolfram|Alpha, Research Rabbit. 
Organizar la información y las tareas de manera más eficiente: Notion AI, MyStudyLife, DeepSeek que es gratuita 
                </p>
                <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                  Espero que te ayuden.
                </p>

                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50 text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Premiar
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50 text-xs">
                    <Share className="w-3 h-3 mr-1" />
                    Compartir
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50 text-xs">
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Respuesta anidada */}
        <div className="ml-12">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <VoteButtons postId="comment2" count={votes.comment2} />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <img
                      src="https://img.freepik.com/psd-gratis/render-3d-personaje-avatar_23-2150611765.jpg?semt=ais_hybrid&w=740"
                      alt="Large-Eggplant-2706"
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-slate-100 font-medium text-sm">Large-Eggplant-2706</span>
                    <span className="bg-blue-600 text-white text-xs px-1 py-0.5 rounded">OP</span>
                    <span className="text-slate-400 text-xs">• hace 3 a</span>
                  </div>

                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">Um, a mi tambien me gusta la de google, Gemini es muy sencilla y practica para lo básico.</p>

                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50 text-xs">
                      <Award className="w-3 h-3 mr-1" />
                      Premiar
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50 text-xs">
                      <Share className="w-3 h-3 mr-1" />
                      Compartir
                    </Button>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50 text-xs">
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Indicador de más respuestas */}
        <div className="ml-12">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:bg-slate-700/50 text-xs">
            5 respuestas más
          </Button>
        </div>
      </div>
    </div>
  )
}
