import { useState, useEffect, useCallback } from 'react'
import { fetchRecibos } from './api'
import ReciboCard from './components/ReciboCard'
import SkeletonCard from './components/SkeletonCard'
import ErrorState from './components/ErrorState'

function Stats({ recibos }) {
  const total = recibos.filter(r => r.activo).length
  const pagados = recibos.filter(r => r.activo && r.pagado).length
  const pendientes = total - pagados
  const pct = total > 0 ? Math.round((pagados / total) * 100) : 0

  return (
    <div className="glass-card p-4 flex items-center gap-4">
      {/* Progress circle */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <circle
            cx="32" cy="32" r="26" fill="none"
            stroke={pct === 100 ? '#34d399' : '#7c3aed'}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 26}`}
            strokeDashoffset={`${2 * Math.PI * 26 * (1 - pct / 100)}`}
            style={{ transition: 'stroke-dashoffset 0.6s ease' }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
          {pct}%
        </span>
      </div>

      {/* Counters */}
      <div className="flex-1 grid grid-cols-2 gap-3">
        <div>
          <p className="text-2xl font-bold text-emerald-400 leading-none">{pagados}</p>
          <p className="text-xs text-white/40 mt-1">Pagados</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-amber-400 leading-none">{pendientes}</p>
          <p className="text-xs text-white/40 mt-1">Pendientes</p>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [recibos, setRecibos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const cargar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRecibos()
      setRecibos(data)
    } catch (e) {
      setError(e.message || 'No se pudo conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { cargar() }, [cargar])

  function handlePagado(id) {
    setRecibos(prev =>
      prev.map(r => r.id === id ? { ...r, pagado: true } : r)
    )
  }

  const activos = recibos.filter(r => r.activo)
  const pendientes = activos.filter(r => !r.pagado)
  const pagados = activos.filter(r => r.pagado)

  const now = new Date()
  const mesLabel = now.toLocaleString('es', { month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-[#0f0f1a]">
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-violet-700/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-purple-900/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg mx-auto px-4 pb-10">
        {/* Header */}
        <header className="pt-12 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/40 text-sm capitalize">{mesLabel}</p>
              <h1 className="text-3xl font-bold text-white mt-0.5 tracking-tight">
                Mis Recibos
              </h1>
            </div>
            <button
              onClick={cargar}
              disabled={loading}
              className="mt-1 p-2.5 rounded-xl bg-white/5 hover:bg-white/10 active:scale-95 transition-all disabled:opacity-40"
              title="Actualizar"
            >
              <svg
                className={`w-5 h-5 text-white/60 ${loading ? 'animate-spin' : ''}`}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Content */}
        {loading && (
          <div className="flex flex-col gap-3">
            <div className="skeleton h-24 rounded-2xl" />
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && error && (
          <ErrorState message={error} onRetry={cargar} />
        )}

        {!loading && !error && (
          <div className="flex flex-col gap-4">
            {/* Stats */}
            {activos.length > 0 && <Stats recibos={recibos} />}

            {/* Pendientes */}
            {pendientes.length > 0 && (
              <section>
                <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 px-1">
                  Pendientes · {pendientes.length}
                </h2>
                <div className="flex flex-col gap-3">
                  {pendientes.map((r, i) => (
                    <div key={r.id} style={{ animationDelay: `${i * 60}ms` }}>
                      <ReciboCard recibo={r} onPagado={handlePagado} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pagados */}
            {pagados.length > 0 && (
              <section className="mt-2">
                <h2 className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3 px-1">
                  Pagados · {pagados.length}
                </h2>
                <div className="flex flex-col gap-3">
                  {pagados.map((r, i) => (
                    <div key={r.id} style={{ animationDelay: `${i * 40}ms` }}>
                      <ReciboCard recibo={r} onPagado={handlePagado} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {activos.length === 0 && (
              <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
                <div className="text-5xl">📭</div>
                <p className="text-white/60 font-semibold">Sin recibos activos</p>
                <p className="text-white/30 text-sm">Agrega servicios desde la hoja de cálculo</p>
              </div>
            )}
          </div>
        )}

        {/* Versión — inyectada en build time desde package.json */}
        <footer className="text-center pt-6 pb-10">
          <span className="text-white/20 text-[10px] font-mono tracking-widest select-none">
            v{__APP_VERSION__}
          </span>
        </footer>
      </div>
    </div>
  )
}
