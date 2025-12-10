import React, { useEffect, useRef } from 'react'
import { useChatStore } from '../../Store/useChatStore'
import MessageInput from './MessageInput';

const Chat = () => {
  const { messages, isMessagesLoading, selectedUser, loadInitialUser, loadMessages } = useChatStore();
  const containerRef = useRef(null);

  useEffect(() => {
    // Initialize selected user and messages
    loadInitialUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedUser) loadMessages(selectedUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser]);

  useEffect(() => {
    // scroll to bottom on new messages
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  if (isMessagesLoading) return (
    <div className='flex-1 flex flex-col overflow-auto'>
      <div className='p-4 text-sm text-gray-400'>Loading messages...</div>
    </div>
  )

  return (
    <div className='flex-1 flex flex-col overflow-hidden'>
      <div className='px-4 py-3 border-b border-zinc-800 bg-zinc-900'>
        <h3 className='text-white text-sm'>Chat</h3>
        <p className='text-xs text-gray-400'>Interviewer</p>
      </div>

      <div ref={containerRef} className='flex-1 p-4 space-y-3 overflow-y-auto bg-zinc-950'>
        {messages && messages.length > 0 ? (
          messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl p-3 ${m.sender === 'me' ? 'bg-gray-800 text-white' : 'bg-gray-800 text-gray-100'}`}>
                {m.image && (
                  <img src={m.image} alt='sent' className='w-48 h-auto rounded mb-2 object-cover' />
                )}
                {m.text && <p className='text-sm'>{m.text}</p>}
                <div className='text-[10px] mt-1 text-gray-300 text-right'>{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-gray-400 text-sm'>No messages yet. Say hi!</div>
        )}
      </div>

      <div className='border-t border-zinc-800 bg-zinc-900'>
        <MessageInput />
      </div>
    </div>
  )
}

export default Chat
