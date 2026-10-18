// Ejecutar con: npm test  (usa el ejecutor de pruebas que ya trae Node, sin dependencias).
import test from 'node:test'
import assert from 'node:assert/strict'
import { ApiError } from './apiError.js'
import { UNCONFIRMED, confirmCreatedRequest } from './contract.js'
import { createServiceRequest } from './mockApi.js'

const valid = {
  message: 'Solicitud creada correctamente',
  data: { id: 12, professional_id: 1, status: 'pending' },
}

function assertRejected(status, body, professionalId = 1) {
  assert.throws(
    () => confirmCreatedRequest(status, body, professionalId),
    (err) => err instanceof ApiError && err.message === UNCONFIRMED,
  )
}

test('201 con id, professional_id y status válidos es éxito', () => {
  assert.equal(confirmCreatedRequest(201, valid, 1), valid)
})

test('el mensaje "message" no es obligatorio para el éxito', () => {
  const body = { data: valid.data }
  assert.equal(confirmCreatedRequest(201, body, 1), body)
})

test('200 con { data: { id: 12 } } NO es éxito (caso reportado)', () => {
  assertRejected(200, { data: { id: 12 } })
})

test('200 con un cuerpo completo tampoco es éxito: debe ser 201 exacto', () => {
  assertRejected(200, valid)
  assertRejected(202, valid)
})

test('201 con respuesta incompleta NO es éxito', () => {
  assertRejected(201, { data: { id: 12 } })
  assertRejected(201, { data: { id: 12, professional_id: 1 } })
  assertRejected(201, { data: { id: 12, status: 'pending' } })
  assertRejected(201, { data: { professional_id: 1, status: 'pending' } })
  assertRejected(201, { message: 'Solicitud creada correctamente' })
  assertRejected(201, { data: null })
  assertRejected(201, {})
  assertRejected(201, null) // el cuerpo no era JSON
  assertRejected(201, [])
})

test('201 con campos de tipo incorrecto NO es éxito', () => {
  assertRejected(201, { data: { id: '12', professional_id: 1, status: 'pending' } })
  assertRejected(201, { data: { id: 12, professional_id: '1', status: 'pending' } })
  assertRejected(201, { data: { id: 0, professional_id: 1, status: 'pending' } })
  assertRejected(201, { data: { id: 12, professional_id: 1, status: '' } })
  assertRejected(201, { data: { id: 12, professional_id: 1, status: 123 } })
})

test('201 de otro profesional distinto al solicitado NO es éxito', () => {
  assertRejected(201, valid, 2)
})

test('la respuesta del modo demostración cumple el mismo contrato de éxito', async () => {
  const simulated = await createServiceRequest({ professional_id: 3 })
  assert.equal(confirmCreatedRequest(201, simulated, 3), simulated)
  // No afirma que se guardó algo realmente.
  assert.match(simulated.message, /simulad/i)
  assert.doesNotMatch(simulated.message, /creada correctamente/i)
})
