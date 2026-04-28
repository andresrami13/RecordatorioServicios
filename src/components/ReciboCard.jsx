import { useState } from 'react'
import { marcarPagado } from '../api'

const ORDINAL = ['', '1ro', '2do', '3ro', '4to', '5to', '6to', '7mo', '8vo', '9no', '10mo',
  '11vo', '12vo', '13vo', '14vo', '15vo', '16vo', '17vo', '18vo', '19vo', '20vo',
  '21vo', '22vo', '23vo', '24vo', '25vo', '26vo', '27vo', '28vo', '29vo', '30vo', '31vo']

function diaLabel(dia) {
  return ORDINAL[dia] ?? `${dia}`
}

export default function ReciboCard({ recibo, onPagado }) {
  const [marking, setMarking] = useState(false)
  const [error, setError] = useState(null)

  const isPaid = recibo.pagado
  const isActive = recibo.activo
  const canMark = !isPaid && isActive

  async function handleMarcar() {
    setMarking(true)
    setError(null)
    try {
      await marcarPagado(recibo.id)
      onPagado(recibo.id)
    } catch (e) {
      setError('No se pudo marcar. Intenta de nuevo.')
    } finally {
      setMarking(false)
    }
  }

  return (
    <div
      className={`
        relative overflow-hidden transition-all duration-500
        ${isPaid ? 'glass-card-paid opacity-60' : 'glass-card'}
        p-5 flex flex-col gap-4
        animate-fade-in
      `}
      style={{ animationDelay: '0ms' }}
    >
      {/* Glow accent for pending */}
      {canMark && (
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            boxShadow: 'inset 0 0 40px rgba(124,58,237,0.06)',
            borderTop: '1px solid rgba(124,58,237,0.25)',
          }}
        />
      )}

      {/* Header row */}
      <div className="flex items-center gap-3">
        {/* Emoji icon */}
        <div
          className={`
            w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0
            ${isPaid
              ? 'bg-white/5'
              : 'bg-violet-600/20 shadow-lg shadow-violet-900/30'}
          `}
        >
          {recibo.emoji}
        </div>

        {/* Name + day */}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-base leading-tight truncate ${isPaid ? 'text-white/50' : 'text-white'}`}>
            {recibo.servicio}
          </p>
          <p className="text-xs text-white/30 mt-0.5">
            Vence el {diaLabel(recibo.diaInicio)} de cada mes
          </p>
        </div>

        {/* Badge */}
        <div className="flex-shrink-0">
          {isPaid ? (
            <span className="badge-paid flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              PAGADO
            </span>
          ) : (
            <span className="badge-pending flex items-center gap-1.5">
              <span className="pulse-dot" />
              PENDIENTE
            </span>
          )}
        </div>
      </div>

      {/* Action area */}
      {canMark && (
        <div className="flex flex-col gap-2">
          <button
            onClick={handleMarcar}
            disabled={marking}
            className="btn-primary w-full"
          >
            {marking ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Marcando...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Marcar como pagado
              </>
            )}
          </button>
          {error && (
            <p className="text-xs text-red-400 text-center">{error}</p>
          )}
        </div>
      )}

      {/* Paid checkmark overlay */}
      {isPaid && (
        <div className="flex items-center gap-2 text-emerald-400/70">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-xs">Pago registrado este mes</span>
        </div>
      )}
    </div>
  )
}
