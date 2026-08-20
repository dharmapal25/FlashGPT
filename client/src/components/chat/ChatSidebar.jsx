import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HiOutlineMenu } from 'react-icons/hi';
import { BiCommentAdd, BiPlus } from 'react-icons/bi';
import { AiOutlineDelete } from 'react-icons/ai';
import DeletePopUp from '../DeletePopUp';
import defaultImage from "../../../public/qw.jpg";

const ChatSidebar = ({
    isSidebarOpen,
    setIsSidebarOpen,
    titles,
    activeChatId,
    onSelectChat,
    onNewChat,
    onDeleteChat }) => {


    const [selectedDeleteId, setSelectedDeleteId] = useState(null);

    const profileImage = localStorage.getItem('image');

    return (
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
            <div
                className="sidebar-header"
                style={{ flexDirection: !isSidebarOpen ? 'column-reverse' : '' }}
            >
                <button className="new-chat-btn" onClick={onNewChat}>
                    <span className="plus-icon">
                        {isSidebarOpen ? <BiPlus size={20} /> : <BiCommentAdd size={20} />}
                    </span>
                    {isSidebarOpen && <span>New Chat</span>}
                </button>

                <button
                    className="toggle-sidebar-btn"
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                    <HiOutlineMenu size={20} />
                </button>
            </div>

            {isSidebarOpen && (
                <div className="chat-history-list">
                    {titles.map((chat) => (
                        <div
                            key={chat._id}
                            className={`chat-item ${chat._id === activeChatId ? 'active' : ''}`}
                            onClick={() => {
                                onSelectChat(chat._id);
                                onNewChat();
                            }}
                        >
                            <span className="chat-title-text">
                                {chat.title || 'Untitled Chat'}
                            </span>

                            <AiOutlineDelete
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedDeleteId(chat._id);
                                }}
                            />

                            {selectedDeleteId === chat._id && (
                                <DeletePopUp
                                    id={chat._id}
                                    onClose={() => setSelectedDeleteId(null)}
                                    onConfirm={() => {
                                        onDeleteChat(chat._id);
                                        setSelectedDeleteId(null);
                                    }}
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <div className="sidebar-footer">
                <Link to="/profile">
                    <div className="user-profile">
                        <div className="avatar">
                            <img src={profileImage || defaultImage} alt="User Avatar" className="default" />
                        </div>
                        {isSidebarOpen && (
                            <div className="user-info">
                                <span className="user-name">Profile</span>
                            </div>
                        )}
                    </div>
                </Link>
            </div>
        </aside>
    );
};

export default ChatSidebar;