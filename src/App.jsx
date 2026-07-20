import React, { useState, useEffect, useRef, useCallback } from 'react';
import Header from './components/Header.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import DivisionSelector from './components/DivisionSelector.jsx';

const API_BASE = '/api';

export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [division, setDivision] = useState(null);
  const [showDivisionSelector, setShowDivisionSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEngineerBtn, setShowEngineerBtn] = useState(false);
  const [config, setConfig] = useState(null);

  // Load config on mount
  useEffect(() => {
    fetch(`${API_BASE}/config`)
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(() => {
        // Fallback config
        setConfig({
          whatsappNumber: '6281234567890',
          divisions: [
            { id: 'printer', name: 'Printer', icon: '🖨️', description: 'Masalah printer, cetak dokumen' },
            { id: 'cctv', name: 'CCTV', icon: '📹', description: 'Kamera pengawas, DVR/NVR' },
            { id: 'telepon', name: 'Telepon', icon: '☎️', description: 'Telepon kantor, extension' },
            { id: 'radio', name: 'Radio Komunikasi', icon: '📻', description: 'Radio HT, repeater' },
            { id: 'windows', name: 'Windows', icon: '💻', description: 'Laptop, PC, sistem operasi' },
            { id: 'fttp', name: 'FTTP', icon: '🌐', description: 'Fiber to the premise, ONU' },
            { id: 'lan', name: 'LAN', icon: '🔌', description: 'Jaringan lokal, kabel LAN' },
            { id: 'wan', name: 'WAN', icon: '🌍', description: 'Jaringan luas, koneksi antar site' }
          ]
        });
      });
  }, []);

  // Start a new chat session
  const startNewSession = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/chat/new`, { method: 'POST' });
      const data = await res.json();

      if (data.success) {
        setSessionId(data.sessionId);
        setMessages([{
          role: 'assistant',
          content: data.message,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }]);
        setDivision(null);
        setShowEngineerBtn(false);
        setShowDivisionSelector(true);
      }
    } catch (error) {
      console.error('Failed to start session:', error);
      // Offline mode - create local session
      setSessionId('local-' + Date.now());
      setMessages([{
        role: 'assistant',
        content: `Selamat datang di **AI Helpdesk ICT** Pertamina EP Asset 1 Regional 1 Field Lirik! 👋\n\nSaya siap membantu Anda menyelesaikan permasalahan ICT. Silakan pilih **divisi layanan** yang ingin Anda tanyakan terlebih dahulu.`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
      setDivision(null);
      setShowEngineerBtn(false);
      setShowDivisionSelector(true);
    }
  }, []);

  // Init on mount
  useEffect(() => {
    startNewSession();
  }, [startNewSession]);

  // Handle division selection
  const handleDivisionSelect = async (selectedDivision) => {
    setShowDivisionSelector(false);
    setDivision(selectedDivision);

    try {
      const res = await fetch(`${API_BASE}/chat/division`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, division: selectedDivision.id })
      });
      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      const divName = selectedDivision.name;
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Anda memilih divisi **${divName}**. 👍\n\nSilakan ceritakan permasalahan yang Anda alami, dan saya akan membantu memberikan solusi.`,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    }
  };

  // Send message
  const handleSendMessage = async (message) => {
    if (!message.trim() || isLoading) return;

    // If no division selected, show selector
    if (!division) {
      setShowDivisionSelector(true);
      return;
    }

    const userMsg = {
      role: 'user',
      content: message,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message })
      });
      const data = await res.json();

      if (data.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }]);

        if (data.shouldEscalate) {
          setShowEngineerBtn(true);
        }

        if (data.isResolved) {
          setShowEngineerBtn(false);
        }
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Maaf, terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi.',
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Maaf, tidak dapat terhubung ke server. Pastikan server backend sedang berjalan.',
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle new chat
  const handleNewChat = () => {
    startNewSession();
  };

  // Handle engineer contact
  const handleEngineerContact = async () => {
    if (sessionId) {
      try {
        await fetch(`${API_BASE}/chat/escalate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        });
      } catch (e) {
        // Silent fail
      }
    }

    const waNumber = config?.whatsappNumber || '6281234567890';
    const waMessage = encodeURIComponent(
      `Halo Engineer ICT, saya membutuhkan bantuan terkait permasalahan ${division?.name || 'ICT'} yang tidak dapat diselesaikan melalui chatbot AI Helpdesk.`
    );
    window.open(`https://wa.me/${waNumber}?text=${waMessage}`, '_blank');
  };

  return (
    <div className="app-container">
      <Header
        division={division}
        onNewChat={handleNewChat}
      />

      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        showEngineerBtn={showEngineerBtn}
        onEngineerContact={handleEngineerContact}
      />

      <ChatInput
        onSend={handleSendMessage}
        isLoading={isLoading}
        disabled={!division}
        placeholder={
          !division
            ? 'Pilih divisi layanan terlebih dahulu...'
            : 'Ketik permasalahan Anda di sini...'
        }
      />

      {showDivisionSelector && config && (
        <DivisionSelector
          divisions={config.divisions}
          onSelect={handleDivisionSelect}
          onClose={() => division && setShowDivisionSelector(false)}
        />
      )}
    </div>
  );
}
