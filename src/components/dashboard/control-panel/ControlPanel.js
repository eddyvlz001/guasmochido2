import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../../contexts/AuthContext';
import './ControlPanel.css';

// Interfaces para tipar los datos
const ControlPanel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Estado del componente
  const [showEnergy, setShowEnergy] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Datos del parlante y sesión
  const [speakerId, setSpeakerId] = useState(null);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const pollingRef = useRef(null);
  
  // Datos para mostrar en la UI
  const [speakerInfo, setSpeakerInfo] = useState({ name: 'Cargando...', position: 'Cargando...' });
  const [latestMetrics, setLatestMetrics] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  
  // Estadísticas calculadas
  const [averagePower, setAveragePower] = useState(0);
  const [peakPower, setPeakPower] = useState(0);
  const [sessionDuration, setSessionDuration] = useState('00:00:00');
  
  const API_URL = 'http://localhost:3000/esp32-data';

  useEffect(() => {
    console.log('ID obtenido de la URL:', id);
    
    if (!id) {
      setErrorMessage("No se encontró el ID del parlante en la URL.");
      setIsLoading(false);
      return;
    }
    
    const parsedId = parseInt(id, 10);
    console.log('ID parseado:', parsedId);
    
    // Validar que el ID sea un número válido y mayor que 0
    if (isNaN(parsedId) || parsedId < 1) {
      setErrorMessage(`ID de parlante inválido: ${id}. Debe ser un número entero mayor que 0.`);
      setIsLoading(false);
      return;
    }
    
    setSpeakerId(parsedId);
    console.log('SpeakerId establecido:', parsedId);
    checkInitialStatus(parsedId);
  }, [id]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, []);

  const checkInitialStatus = async (speakerIdParam) => {
    setIsLoading(true);
    console.log('Verificando estado inicial para speakerId:', speakerIdParam);
    
    // Validar que speakerId sea válido antes de hacer la petición
    if (!speakerIdParam || speakerIdParam < 1) {
      setErrorMessage("ID de parlante inválido para verificar estado.");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/active-session/speaker/${speakerIdParam}`);
      console.log('Respuesta del servidor:', response.data);
      
      if (response.data.session) {
        setIsConnected(true);
        setActiveSessionId(response.data.session.id);
        setSpeakerInfo({
          name: response.data.session.speaker.name,
          position: response.data.session.speaker.position
        });
        setSessionStartTime(response.data.session.startTime);
        
        // Procesar métricas existentes
        if (response.data.session.energyMeasurements?.length > 0) {
          processMetrics(response.data.session.energyMeasurements);
        }
        
        if (response.data.session.id !== null) {
          startPolling(response.data.session.id);
        }
      } else {
        setIsConnected(false);
        getSpeakerDetails(speakerIdParam);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error checking status:', err);
      console.error('Error details:', err.response?.data);
      setErrorMessage(err.response?.data?.message || "Error al verificar el estado del parlante.");
      setIsLoading(false);
    }
  };
  
  const getSpeakerDetails = async (speakerIdParam) => {
    console.log('Obteniendo detalles del parlante para speakerId:', speakerIdParam);
    
    // Validar que speakerId sea válido antes de hacer la petición
    if (!speakerIdParam || speakerIdParam < 1) {
      setSpeakerInfo({ name: 'ID Inválido', position: 'ID Inválido' });
      return;
    }
    
    try {
      const response = await axios.get(`${API_URL}/speaker-status/${speakerIdParam}`);
      console.log('Detalles del parlante obtenidos:', response.data);
      setSpeakerInfo(response.data.status.speaker);
    } catch (err) {
      console.error('Error obteniendo detalles del parlante:', err);
      setSpeakerInfo({ name: 'Desconocido', position: 'Desconocida' });
    }
  };

  const toggleStatus = () => {
    if (isConnected) {
      endSession();
    } else {
      startSession();
    }
  };

  const startSession = async () => {
    console.log('Iniciando sesión para speakerId:', speakerId);
    
    // Validar que speakerId sea válido antes de hacer la petición
    if (!speakerId || speakerId < 1) {
      setErrorMessage("ID de parlante inválido para iniciar sesión.");
      return;
    }
    
    const payload = {
      speakerId: speakerId,
      userId: 1, // Debería venir del AuthService
      initialBatteryPercentage: 100
    };

    console.log('Payload para iniciar sesión:', payload);

    try {
      const response = await axios.post(`${API_URL}/start-session`, payload);
      console.log('Sesión iniciada exitosamente:', response.data);
      setIsConnected(true);
      setActiveSessionId(response.data.data.id);
      setErrorMessage(null);
      setSessionStartTime(new Date().toISOString());
      resetMetrics();
      startPolling(response.data.data.id);
      console.log(`Sesión iniciada con ID: ${response.data.data.id}`);
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      console.error('Error details:', err.response?.data);
      setErrorMessage(err.response?.data?.message || "No se pudo iniciar la sesión.");
      setIsConnected(false);
    }
  };

  const endSession = async () => {
    if (!activeSessionId) return;

    const finalBattery = latestMetrics?.battery_remaining_percent || 0;
    const payload = { finalBatteryPercentage: finalBattery };

    try {
      await axios.post(`${API_URL}/end-session/${activeSessionId}`, payload);
      setIsConnected(false);
      setActiveSessionId(null);
      setErrorMessage(null);
      resetMetrics();
      stopPolling();
      console.log('Sesión terminada correctamente.');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || "No se pudo terminar la sesión.");
      setIsConnected(true);
    }
  };
  
  const startPolling = (sessionId) => {
    stopPolling();
    
    console.log(`🔄 Iniciando polling para sesión ${sessionId}`);
    
    pollingRef.current = setInterval(async () => {
      try {
        const response = await axios.get(`${API_URL}/current-session/${sessionId}`);
        if (response.data?.data?.energyMeasurements) {
          processMetrics(response.data.data.energyMeasurements);
          updateSessionDuration();
          console.log('📊 Datos actualizados:', response.data.data);
        }
      } catch (err) {
        console.error('Error en polling:', err);
        setErrorMessage('Error obteniendo datos de la sesión.');
        stopPolling();
      }
    }, 10000);
  };

  const processMetrics = (measurements) => {
    if (!measurements || measurements.length === 0) return;

    // Ordenar por timestamp descendente para obtener la más reciente
    const sortedMeasurements = [...measurements].sort((a, b) => b.timestamp - a.timestamp);
    setLatestMetrics(sortedMeasurements[0]);

    // Calcular estadísticas
    const powers = measurements.map(m => m.power_mW);
    setAveragePower(powers.reduce((sum, p) => sum + p, 0) / powers.length);
    setPeakPower(Math.max(...powers));
  };

  const updateSessionDuration = () => {
    if (!sessionStartTime) return;

    const start = new Date(sessionStartTime);
    const now = new Date();
    const diffMs = now.getTime() - start.getTime();
    
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
    
    setSessionDuration(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
  };

  const resetMetrics = () => {
    setLatestMetrics(null);
    setAveragePower(0);
    setPeakPower(0);
    setSessionDuration('00:00:00');
  };

  const stopPolling = () => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      console.log('⏹️ Polling detenido');
    }
  };

  const toggleEnergy = () => {
    setShowEnergy(!showEnergy);
  };

  const handleLogout = () => {
    logout();
  };

  // Métodos helper para el template
  const formatNumber = (value, decimals = 2) => {
    return value ? value.toFixed(decimals) : '0.00';
  };

  const getBatteryStatus = () => {
    if (!latestMetrics) return 'Desconocido';
    const battery = latestMetrics.battery_remaining_percent;
    if (battery > 80) return 'Excelente';
    if (battery > 50) return 'Bueno';
    if (battery > 20) return 'Bajo';
    return 'Crítico';
  };

  const getBatteryColor = () => {
    if (!latestMetrics) return '#666';
    const battery = latestMetrics.battery_remaining_percent;
    if (battery > 50) return '#28a745';
    if (battery > 20) return '#ffc107';
    return '#dc3545';
  };

  return (
    <div className="outer-wrapper">
      <div className="panel-wrapper">
        {isLoading && (
          <div className="info-box">
            <h3>🔄 Cargando...</h3>
            <p>Verificando estado del parlante...</p>
          </div>
        )}
        
        {errorMessage && (
          <div className="info-box" style={{borderColor: '#dc3545', background: '#f8d7da'}}>
            <h3 style={{color: '#721c24'}}>❌ Error</h3>
            <p style={{color: '#721c24'}}>{errorMessage}</p>
          </div>
        )}

        {!isLoading && (
          <>
            <h2 className="title">Control Panel</h2>

            {/* Información del Parlante */}
            <div className="info">
              <p>
                <strong>Nombre:</strong> 
                <span className="value">{speakerInfo.name}</span>
              </p>
              <p>
                <strong>Posición:</strong> 
                <span className="value">{speakerInfo.position}</span>
              </p>
              
              {/* Estado de la Sesión */}
              <div className="toggle-container">
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={isConnected} 
                    onChange={toggleStatus} 
                  />
                  <span className="slider"></span>
                </label>
                <span 
                  className="status-label" 
                  style={{ color: isConnected ? '#28a745' : '#dc3545' }}
                >
                  {isConnected ? 'Sesión Activa' : 'Sesión Inactiva'}
                </span>
              </div>

              {/* Duración de la Sesión */}
              {isConnected && (
                <div style={{marginTop: '10px'}}>
                  <p><strong>Duración:</strong> <span className="value">{sessionDuration}</span></p>
                </div>
              )}

              {/* Botón para mostrar/ocultar energía */}
              <button className="energy-button" onClick={toggleEnergy}>
                {showEnergy ? 'Ocultar Consumo de Energía ▲'
                            : 'Mostrar Consumo de Energía ▼'}
              </button>
            </div>

            {/* Sección de Energía */}
            <div 
              id="energySection"
              className={`metrics energy-content ${!showEnergy ? 'hidden' : ''}`}
            >
              {latestMetrics ? (
                <>
                  <label>Voltaje Actual</label>
                  <div className="metric-box">
                    {formatNumber(latestMetrics.voltage_V, 2)} V
                  </div>

                  <label>Corriente Actual</label>
                  <div className="metric-box">
                    {formatNumber(latestMetrics.current_mA, 1)} mA
                  </div>

                  <label>Potencia Actual</label>
                  <div className="metric-box">
                    {formatNumber(latestMetrics.power_mW, 1)} mW
                  </div>

                  <label>Batería Restante</label>
                  <div 
                    className="metric-box" 
                    style={{ backgroundColor: getBatteryColor(), color: 'white' }}
                  >
                    {formatNumber(latestMetrics.battery_remaining_percent, 1)}% 
                    ({getBatteryStatus()})
                  </div>

                  <label>Consumo Total</label>
                  <div className="metric-box">
                    {formatNumber(latestMetrics.total_consumed_mAh, 1)} mAh
                  </div>

                  <label>Muestra #</label>
                  <div className="metric-box">
                    {latestMetrics.sample_index}
                  </div>

                  {/* Última actualización */}
                  <div style={{textAlign: 'center', marginTop: '10px', fontSize: '12px', color: '#666'}}>
                    <p>Última actualización: {latestMetrics.timestamp}s desde el inicio</p>
                  </div>
                </>
              ) : (
                <div className="info-box" style={{textAlign: 'center'}}>
                  {isConnected ? '⏳ Esperando primeros datos del ESP32...' : '🔌 Inicia una sesión para ver los datos.'}
                </div>
              )}
            </div>

            {/* Detalles de Energía Expandidos */}
            {showEnergy && latestMetrics && (
              <div className="info-box">
                <h3>📊 Estadísticas de la Sesión</h3>
                <ul>
                  <li><strong>Estado de Batería:</strong> {getBatteryStatus()}</li>
                  <li><strong>Potencia Promedio:</strong> {formatNumber(averagePower, 1)} mW</li>
                  <li><strong>Pico de Carga:</strong> {formatNumber(peakPower, 1)} mW</li>
                  <li><strong>Duración de Sesión:</strong> {sessionDuration}</li>
                  <li><strong>Consumo Total:</strong> {formatNumber(latestMetrics.total_consumed_mAh, 1)} mAh</li>
                </ul>
              </div>
            )}

            {/* Información de Conectividad */}
            {isConnected && (
              <div className="info-box" style={{borderColor: '#28a745', background: '#d4edda'}}>
                <h3 style={{color: '#155724'}}>✅ ESP32 Conectado</h3>
                <p style={{color: '#155724'}}>
                  Recibiendo datos cada 10 segundos. 
                  <strong>ID de Sesión:</strong> {activeSessionId}
                </p>
              </div>
            )}

            {/* Botones de Acción */}
            <div className="button-group">
              <Link to="/dashboard/select-panel" className="back-button">Atrás</Link>
              <Link to="/dashboard/select-panel" className="save-button">Guardar</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;