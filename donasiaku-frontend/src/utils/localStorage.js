// Auth Management
export const setAuthData = (userData) => {
  localStorage.setItem('user', JSON.stringify(userData));
  localStorage.setItem('isAuthenticated', 'true');
};

export const getAuthData = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const saveAuthData = (data) => {
  localStorage.setItem("authData", JSON.stringify(data));
};
export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getUserRole = () => {
  const user = getAuthData();
  return user ? user.role : null;
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('isAuthenticated');
};

// Donasi Management
export const saveDonasi = (donasi) => {
  const existingDonasi = getDonasi();
  const newDonasi = {
    ...donasi,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  existingDonasi.push(newDonasi);
  localStorage.setItem('donasi', JSON.stringify(existingDonasi));
  return newDonasi;
};

export const getDonasi = () => {
  const donasi = localStorage.getItem('donasi');
  return donasi ? JSON.parse(donasi) : [];
};

export const getDonasiById = (id) => {
  const allDonasi = getDonasi();
  return allDonasi.find(d => d.id === id);
};

export const updateDonasi = (id, updatedData) => {
  const allDonasi = getDonasi();
  const index = allDonasi.findIndex(d => d.id === id);
  if (index !== -1) {
    allDonasi[index] = { ...allDonasi[index], ...updatedData, updatedAt: new Date().toISOString() };
    localStorage.setItem('donasi', JSON.stringify(allDonasi));
    return allDonasi[index];
  }
  return null;
};

export const deleteDonasi = (id) => {
  const allDonasi = getDonasi();
  const filtered = allDonasi.filter(d => d.id !== id);
  localStorage.setItem('donasi', JSON.stringify(filtered));
  return true;
};

export const getDonasiByUserId = (userId) => {
  const allDonasi = getDonasi();
  return allDonasi.filter(d => d.userId === userId);
};

// Requests (permintaan) management
export const getRequests = () => {
  const req = localStorage.getItem('requests_db');
  return req ? JSON.parse(req) : [];
};

export const saveRequest = (request) => {
  const all = getRequests();
  all.push(request);
  localStorage.setItem('requests_db', JSON.stringify(all));
  return request;
};

export const updateRequestStatus = (requestId, status) => {
  const all = getRequests();
  const idx = all.findIndex(r => String(r.id) === String(requestId));
  if (idx !== -1) {
    all[idx].status = status;
    all[idx].updatedAt = new Date().toISOString();
    localStorage.setItem('requests_db', JSON.stringify(all));
    return all[idx];
  }
  return null;
};

export const getRequestsByDonasiIds = (donasiIds = []) => {
  const all = getRequests();
  const ids = donasiIds.map(String);
  return all.filter(r => ids.includes(String(r.donasiId)));
};

// Messages (chat) management
export const getMessages = () => {
  const m = localStorage.getItem('messages_db');
  return m ? JSON.parse(m) : [];
};

export const saveMessage = (message) => {
  const all = getMessages();
  all.push(message);
  localStorage.setItem('messages_db', JSON.stringify(all));
  return message;
};

export const getConversationsForUser = (userId) => {
  const all = getMessages();
  const peers = new Map();
  all.forEach((msg) => {
    const other = String(msg.from) === String(userId) ? String(msg.to) : String(msg.from);
    if (!peers.has(other)) peers.set(other, []);
    peers.get(other).push(msg);
  });

  // return array of { peerId, lastMessage }
  return Array.from(peers.entries()).map(([peerId, msgs]) => ({
    peerId,
    lastMessage: msgs.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt)).slice(-1)[0],
    messages: msgs.sort((a,b)=> new Date(a.createdAt) - new Date(b.createdAt))
  }));
};
