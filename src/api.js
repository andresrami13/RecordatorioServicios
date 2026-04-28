// Reemplaza esta URL con la de tu Google Apps Script Web App
const BASE_URL = 'https://script.google.com/macros/s/AKfycbx-drBGWaZQ1QYlhebQPcRMcVNU2Fff6lnENf8pwx53JbODvqr4YYXK3qzenmVBHlDzDQ/exec'

export async function fetchRecibos() {
  const res = await fetch(`${BASE_URL}?accion=listar`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}

export async function marcarPagado(id) {
  const res = await fetch(`${BASE_URL}?accion=marcar&id=${encodeURIComponent(id)}`)
  if (!res.ok) throw new Error(`Error ${res.status}`)
  return res.json()
}
