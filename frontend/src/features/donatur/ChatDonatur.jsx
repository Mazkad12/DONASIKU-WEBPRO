import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuthData } from '../../utils/localStorage';
import { chatAPI } from '../../services/api';
import { FiSend } from 'react-icons/fi';

const ChatDonatur = () => {
  const user = getAuthData();
  const location = useLocation();
  const [conversations, setConversations] = useState([]);
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const listRef = useRef(null);

  useEffect(() => {
    loadConversations();
  }, []);

  // Handle location state for checking passed peerId (e.g. "Chat With Donor")
  useEffect(() => {
    if (location.state?.peerId) {
       // If coming from another page with a specific person to chat with
       const targetId = location.state.peerId;
       // We'll set this as selected peer. 
       // If conversation doesn't exist yet, it will be blank, which is fine.
       setSelectedPeer(targetId);
    }
  }, [location.state]);

  useEffect(() => {
    let interval;
    if (selectedPeer) {
      loadMessages(selectedPeer);
      // Optional: Polling for new messages
      interval = setInterval(() => {
          loadMessages(selectedPeer, false);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [selectedPeer]);

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations();
      if (response.data.success) {
        setConversations(response.data.data);
        // If no peer selected yet, and we have conversations, select the first one (unless we have a targeted peer from location)
        if (!location.state?.peerId && response.data.data.length > 0 && !selectedPeer) {
          setSelectedPeer(response.data.data[0].peer.id);
        }
      }
    } catch (error) {
      console.error("Failed to load conversations", error);
    }
  };

  const loadMessages = async (peerId, scroll = true) => {
    try {
      const response = await chatAPI.getMessages(peerId);
      if (response.data.success) {
        setMessages(response.data.data);
        if (scroll) {
             setTimeout(()=> scrollToBottom(), 50);
        }
      }
    } catch (error) {
      console.error("Failed to messages", error);
    }
  };

  const handleSelect = (peerId) => {
    setSelectedPeer(peerId);
  };

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!text.trim() || !selectedPeer) return;

    try {
      const response = await chatAPI.sendMessage({
        receiver_id: selectedPeer,
        message: text.trim()
      });

      if (response.data.success) {
        setText('');
        // Reload messages to show the new one
        loadMessages(selectedPeer);
        // Reload conversations to update "last message" snippet
        loadConversations();
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const scrollToBottom = () => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  if (!user || !user.id) {
    return <div className="p-6">Silakan login untuk mengakses chat.</div>;
  }

  // Helper to find the peer object for selectedPeer ID
  const activePeerData = conversations.find(c => String(c.peer.id) === String(selectedPeer))?.peer || (location.state?.peerId == selectedPeer ? { id: selectedPeer, name: 'User ' + selectedPeer } : null);

  return (
    <div className="p-6 flex gap-6 min-h-[60vh]">
      {/* Left: Conversation list */}
      <aside className="w-72 bg-white rounded-xl shadow p-4">
        <h3 className="font-semibold mb-3">Percakapan</h3>
        <div className="space-y-2 max-h-[60vh] overflow-auto">
          {conversations.length === 0 && <div className="text-sm text-gray-500">Belum ada percakapan.</div>}
          {conversations.map((c) => (
            <button key={c.peer.id} onClick={() => handleSelect(c.peer.id)} className={`w-full text-left p-3 rounded-lg transition-colors ${String(selectedPeer)===String(c.peer.id) ? 'bg-gradient-to-r from-[#007EFF] to-[#0063FF] text-white' : 'hover:bg-gray-100'}`}>
              <div className="flex justify-between items-center">
                <div className="font-semibold text-sm">{c.peer.name || 'User ' + c.peer.id}</div>
                <div className={`text-xs ${String(selectedPeer)===String(c.peer.id) ? 'text-blue-100' : 'text-gray-400'}`}>{c.last_message ? new Date(c.last_message.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'}) : ''}</div>
              </div>
              <div className={`text-xs mt-1 truncate ${String(selectedPeer)===String(c.peer.id) ? 'text-blue-50' : 'text-gray-500'}`}>{c.last_message?.message || '-'}</div>
            </button>
          ))}
        </div>
      </aside>

      {/* Right: Messages */}
      <section className="flex-1 flex flex-col bg-white rounded-xl shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold">Chat dengan: {activePeerData ? (activePeerData.name || `User ${selectedPeer}`) : '...'}</h3>
        </div>

        <div className="flex-1 p-4 overflow-auto" ref={listRef} style={{ background: '#F7FAFC' }}>
          {(!selectedPeer) && <div className="text-sm text-gray-500">Pilih percakapan atau mulai pesan baru.</div>}
          {messages.map((m) => (
            <div key={m.id} className={`mb-3 flex ${String(m.sender_id) === String(user.id) ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] px-4 py-2 rounded-xl ${String(m.sender_id) === String(user.id) ? 'bg-[#007EFF] text-white' : 'bg-white text-gray-800 shadow'}`}>
                <div className="text-sm">{m.message}</div>
                <div className={`text-xs mt-1 text-right ${String(m.sender_id) === String(user.id) ? 'text-blue-100' : 'text-gray-400'}`}>{new Date(m.created_at).toLocaleString('id-ID')}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSend} className="p-4 border-t flex items-center gap-3">
          <input value={text} onChange={(e)=>setText(e.target.value)} placeholder="Tulis pesan..." className="flex-1 px-4 py-3 border rounded-xl" />
          <button type="submit" className="inline-flex items-center px-4 py-3 bg-[#007EFF] text-white rounded-xl">
            <FiSend />
          </button>
        </form>
      </section>
    </div>
  );
};

export default ChatDonatur;
