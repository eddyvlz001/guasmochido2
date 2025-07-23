const express = require('express');
const router = express.Router();

// Mock ESP32 data storage
let sessions = [];
let speakers = [
  { id: 1, name: 'Speaker 01', position: 'North side', status: 'active' },
  { id: 2, name: 'Speaker 02', position: 'South side', status: 'active' },
  { id: 3, name: 'Speaker 03', position: 'Center', status: 'active' }
];

let sessionId = 1;
let measurementId = 1;

// Get speaker status
router.get('/speaker-status/:id', (req, res) => {
  const speakerId = parseInt(req.params.id);
  const speaker = speakers.find(s => s.id === speakerId);
  
  if (!speaker) {
    return res.status(404).json({ message: 'Speaker not found' });
  }
  
  res.json({
    status: {
      speaker: speaker,
      isActive: speaker.status === 'active'
    }
  });
});

// Get active session for speaker
router.get('/active-session/speaker/:id', (req, res) => {
  const speakerId = parseInt(req.params.id);
  const activeSession = sessions.find(s => 
    s.speakerId === speakerId && s.status === 'active'
  );
  
  if (activeSession) {
    const speaker = speakers.find(s => s.id === speakerId);
    res.json({
      session: {
        id: activeSession.id,
        speakerId: activeSession.speakerId,
        startTime: activeSession.startTime,
        speaker: speaker,
        energyMeasurements: activeSession.energyMeasurements || []
      }
    });
  } else {
    res.json({ session: null });
  }
});

// Start session
router.post('/start-session', (req, res) => {
  const { speakerId, userId, initialBatteryPercentage } = req.body;
  
  // Validate speaker exists
  const speaker = speakers.find(s => s.id === speakerId);
  if (!speaker) {
    return res.status(404).json({ message: 'Speaker not found' });
  }
  
  // Check if there's already an active session for this speaker
  const existingSession = sessions.find(s => 
    s.speakerId === speakerId && s.status === 'active'
  );
  
  if (existingSession) {
    return res.status(400).json({ message: 'Ya existe una sesión activa para este parlante' });
  }
  
  // Create new session
  const newSession = {
    id: sessionId++,
    speakerId: speakerId,
    userId: userId || 1,
    startTime: new Date().toISOString(),
    status: 'active',
    initialBatteryPercentage: initialBatteryPercentage || 100,
    energyMeasurements: []
  };
  
  sessions.push(newSession);
  
  res.json({
    message: 'Sesión iniciada exitosamente',
    data: newSession
  });
});

// End session
router.post('/end-session/:id', (req, res) => {
  const sessionIdParam = parseInt(req.params.id);
  const { finalBatteryPercentage } = req.body;
  
  const session = sessions.find(s => s.id === sessionIdParam);
  if (!session) {
    return res.status(404).json({ message: 'Sesión no encontrada' });
  }
  
  session.status = 'completed';
  session.endTime = new Date().toISOString();
  session.finalBatteryPercentage = finalBatteryPercentage || 0;
  
  res.json({
    message: 'Sesión terminada exitosamente',
    data: session
  });
});

// Get current session data
router.get('/current-session/:id', (req, res) => {
  const sessionIdParam = parseInt(req.params.id);
  const session = sessions.find(s => s.id === sessionIdParam);
  
  if (!session) {
    return res.status(404).json({ message: 'Sesión no encontrada' });
  }
  
  // Add some mock real-time data
  if (session.status === 'active') {
    const newMeasurement = {
      id: measurementId++,
      timestamp: Math.floor((Date.now() - new Date(session.startTime).getTime()) / 1000),
      voltage_V: (3.3 + Math.random() * 0.4).toFixed(2),
      current_mA: (150 + Math.random() * 50).toFixed(1),
      power_mW: (500 + Math.random() * 200).toFixed(1),
      battery_remaining_percent: Math.max(20, 100 - Math.floor(Math.random() * 10)),
      total_consumed_mAh: (Math.random() * 100).toFixed(1),
      sample_index: session.energyMeasurements.length + 1
    };
    
    session.energyMeasurements.push(newMeasurement);
    
    // Keep only last 50 measurements to prevent memory issues
    if (session.energyMeasurements.length > 50) {
      session.energyMeasurements = session.energyMeasurements.slice(-50);
    }
  }
  
  res.json({
    data: session
  });
});

// Get all sessions (history)
router.get('/sessions', (req, res) => {
  const sessionsWithSpeakers = sessions.map(session => {
    const speaker = speakers.find(s => s.id === session.speakerId);
    return {
      ...session,
      speaker: speaker
    };
  });
  
  res.json({
    sessions: sessionsWithSpeakers,
    total: sessions.length
  });
});

module.exports = router;