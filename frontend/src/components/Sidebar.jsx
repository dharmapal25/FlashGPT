import { PlusIcon, LucideDelete, Star, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const Sidebar = ({ sidebarOpen, setSidebarOpen, currentChatId, onDeleteClick }) => {
  const navigate = useNavigate();
  const { user, chats, bookmarked, toggleBookmark } = useApp();

  const sorted = [...chats].sort((a, b) => {
    const aS = !!bookmarked[a._id], bS = !!bookmarked[b._id];
    if (aS === bS) return new Date(b.createdAt) - new Date(a.createdAt);
    return (bS ? 1 : 0) - (aS ? 1 : 0);
  });

  return (
    <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
      <h2 className="appTitle" style={{ fontSize: '18px', fontWeight: '600', padding: '10px 10px 0 17px' }}>
        Flash GPT
      </h2>

      <div className="sidebarTop">
        <button className="newChatBtn" onClick={() => navigate('/chat/new')}>
          <PlusIcon size={15} /> New chat
        </button>
        <button className="menuToggle toggle-2" onClick={() => setSidebarOpen(o => !o)}>
          <span className="hamburger" />
        </button>
      </div>

      <div className="chatList">
        <span className="chatsLabel">Recents</span>
        {chats.length === 0
          ? <p className="noChats">No chats yet</p>
          : sorted.map(chat => (
            <div key={chat._id} className={`chatItem ${currentChatId === chat._id ? 'active' : ''}`}>
              <button className="chatItemBtn" onClick={() => navigate(`/chat/${chat._id}`)}>
                <span className="chatItemTitle">{chat.title}</span>
              </button>
              <div className="chatItemActions">
                <button
                  className={`starBtn ${bookmarked[chat._id] ? 'starred' : ''}`}
                  onClick={e => toggleBookmark(chat._id, e)}
                  title={bookmarked[chat._id] ? 'Unstar' : 'Star'}
                >
                  <Star size={13} fill={bookmarked[chat._id] ? 'currentColor' : 'none'} />
                </button>
                <button className="deleteBtn" onClick={() => onDeleteClick(chat._id)} title="Delete">
                  <LucideDelete size={13} />
                </button>
              </div>
            </div>
          ))
        }
      </div>

      <div className="sidebarFooter">
        <button className="settingsBtn" onClick={() => navigate('/settings')}>
          <Settings size={15} /> Settings
        </button>
        <div className="userInfo">
          {user?.profilePicture && (
            <img src={user.profilePicture} alt={user.displayName} className="avatar-img" />
          )}
          <span className="userName">{user?.displayName}</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;