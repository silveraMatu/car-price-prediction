import { useState } from 'react'
import './App.css'

const BRANDS = [
  'Maruti', 'Hyundai', 'Mahindra', 'Tata', 'Honda', 'Toyota',
  'Ford', 'Renault', 'Volkswagen', 'BMW', 'Audi', 'Mercedes-Benz',
  'Kia', 'MG', 'Skoda', 'Jeep', 'Nissan', 'Mitsubishi', 'Fiat',
  'Datsun', 'Isuzu', 'Land Rover', 'Jaguar', 'Volvo',
]

const FUELS = ['Petrol', 'Diesel', 'CNG', 'LPG', 'Electric']
const SELLER_TYPES = ['Individual', 'Dealer', 'Trustmark Dealer']
const TRANSMISSIONS = ['Manual', 'Automatic']
const OWNERS = [
  'First Owner', 'Second Owner', 'Third Owner',
  'Fourth & Above Owner', 'Test Drive Car',
]

const INITIAL_FORM = {
  year: '',
  km_driven: '',
  mileage: '',
  engine: '',
  max_power: '',
  brand: '',
  fuel: '',
  seller_type: '',
  transmission: '',
  owner: '',
}

function formatINR(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatUSD(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function App() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    const payload = {
      year: parseInt(form.year),
      km_driven: parseFloat(form.km_driven),
      mileage: parseFloat(form.mileage),
      engine: parseFloat(form.engine),
      max_power: parseFloat(form.max_power),
      brand: form.brand,
      fuel: form.fuel,
      seller_type: form.seller_type,
      transmission: form.transmission,
      owner: form.owner,
    }

    try {
      const res = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || `Error ${res.status}`)
      }

      const data = await res.json()
      setResult({ ...data, formSnapshot: { ...form } })
    } catch (err) {
      setError(err.message || 'No se pudo conectar con el servidor. Asegurate de tener el backend corriendo en http://localhost:8000')
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = Object.values(form).every(v => v !== '')

  const INR_TO_USD = 0.012

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <div className="logo-icon">🚗</div>
          <span className="logo-text">CarPredict AI</span>
        </div>
        <div className="header-badge">
          <span className="badge-dot" />
          Modelo Gradient Boosting
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {/* Hero */}
        <div className="hero">
          <div className="hero-tag">✦ Machine Learning · Predicción de precios</div>
          <h1>Estimá el valor de<br /><span>cualquier auto</span></h1>
          <p>
            Completá los datos del vehículo y nuestro modelo de IA te dará una
            estimación precisa del precio de mercado.
          </p>
        </div>

        {/* Content */}
        <div className="content-grid">
          {/* Form card */}
          <div className="card">
            <div className="card-title">
              <div className="icon icon-indigo">📋</div>
              Datos del vehículo
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                {/* Marca */}
                <div className="form-group">
                  <label htmlFor="brand">Marca</label>
                  <select id="brand" name="brand" value={form.brand} onChange={handleChange} required>
                    <option value="">Seleccioná una marca</option>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                {/* Año */}
                <div className="form-group">
                  <label htmlFor="year">Año de fabricación</label>
                  <input
                    id="year" name="year" type="number"
                    placeholder="Ej: 2018"
                    min="1990" max="2024"
                    value={form.year} onChange={handleChange} required
                  />
                </div>

                {/* KM */}
                <div className="form-group">
                  <label htmlFor="km_driven">Kilómetros recorridos</label>
                  <input
                    id="km_driven" name="km_driven" type="number"
                    placeholder="Ej: 45000"
                    min="0"
                    value={form.km_driven} onChange={handleChange} required
                  />
                </div>

                {/* Mileage */}
                <div className="form-group">
                  <label htmlFor="mileage">Consumo (km/l)</label>
                  <input
                    id="mileage" name="mileage" type="number"
                    placeholder="Ej: 18.5"
                    step="0.1" min="0"
                    value={form.mileage} onChange={handleChange} required
                  />
                </div>

                {/* Engine */}
                <div className="form-group">
                  <label htmlFor="engine">Cilindrada (CC)</label>
                  <input
                    id="engine" name="engine" type="number"
                    placeholder="Ej: 1200"
                    min="100"
                    value={form.engine} onChange={handleChange} required
                  />
                </div>

                {/* Max power */}
                <div className="form-group">
                  <label htmlFor="max_power">Potencia máxima (bhp)</label>
                  <input
                    id="max_power" name="max_power" type="number"
                    placeholder="Ej: 88.5"
                    step="0.1" min="0"
                    value={form.max_power} onChange={handleChange} required
                  />
                </div>

                {/* Fuel */}
                <div className="form-group">
                  <label htmlFor="fuel">Combustible</label>
                  <select id="fuel" name="fuel" value={form.fuel} onChange={handleChange} required>
                    <option value="">Seleccioná</option>
                    {FUELS.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Transmission */}
                <div className="form-group">
                  <label htmlFor="transmission">Transmisión</label>
                  <select id="transmission" name="transmission" value={form.transmission} onChange={handleChange} required>
                    <option value="">Seleccioná</option>
                    {TRANSMISSIONS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Seller type */}
                <div className="form-group">
                  <label htmlFor="seller_type">Tipo de vendedor</label>
                  <select id="seller_type" name="seller_type" value={form.seller_type} onChange={handleChange} required>
                    <option value="">Seleccioná</option>
                    {SELLER_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Owner */}
                <div className="form-group">
                  <label htmlFor="owner">Historial de dueños</label>
                  <select id="owner" name="owner" value={form.owner} onChange={handleChange} required>
                    <option value="">Seleccioná</option>
                    {OWNERS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
              </div>

              {error && (
                <div className="error-banner" role="alert">
                  ⚠️ {error}
                </div>
              )}

              <button
                id="btn-predict"
                type="submit"
                className="btn-predict"
                disabled={loading || !isFormValid}
              >
                {loading ? (
                  <><div className="spinner" /> Calculando precio...</>
                ) : (
                  <>✦ Predecir precio</>
                )}
              </button>
            </form>
          </div>

          {/* Result panel */}
          <div className="result-section">
            {result ? (
              <>
                <div className="result-card">
                  <div className="result-label">Precio estimado</div>
                  <div className="result-price">{formatINR(result.predicted_price)}</div>
                  <div className="result-currency">Rupias Indias (INR)</div>
                  <div className="result-divider" />
                  <div className="result-usd">
                    Equivalente en USD: <strong>{formatUSD(result.predicted_price * INR_TO_USD)}</strong>
                  </div>
                </div>

                <div className="info-card">
                  <h3>📌 Resumen del vehículo</h3>
                  {[
                    ['Marca', result.formSnapshot.brand],
                    ['Año', result.formSnapshot.year],
                    ['Kilómetros', `${parseInt(result.formSnapshot.km_driven).toLocaleString()} km`],
                    ['Combustible', result.formSnapshot.fuel],
                    ['Transmisión', result.formSnapshot.transmission],
                    ['Potencia', `${result.formSnapshot.max_power} bhp`],
                    ['Motor', `${result.formSnapshot.engine} CC`],
                    ['Vendedor', result.formSnapshot.seller_type],
                    ['Dueños previos', result.formSnapshot.owner],
                  ].map(([key, val]) => (
                    <div key={key} className="info-row">
                      <span className="key">{key}</span>
                      <span className="val">{val}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">🔍</div>
                <h3>Tu predicción aparecerá aquí</h3>
                <p>
                  Completá todos los datos del vehículo en el formulario
                  y presioná <strong>Predecir precio</strong>.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        CarPredict AI · Modelo entrenado con Gradient Boosting · Dataset indio de vehículos usados
      </footer>
    </div>
  )
}
