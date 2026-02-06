'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Send, Trophy, Zap, Gift } from 'lucide-react';
import { useMessages, useSendMessage, useMarkMessagesRead } from '@/hooks';
import { Card, CardContent, Badge, Button, Input, Loading } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { cn, formatTime } from '@/lib/utils';

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { messages, isLoading, refresh, loadMore, hasMore } = useMessages(conversationId);
  const { send, isLoading: sending } = useSendMessage();
  const { markAsRead } = useMarkMessagesRead();

  // Mark messages as read
  useEffect(() => {
    markAsRead(conversationId);
  }, [conversationId, markAsRead]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || sending) return;
    
    const result = await send(conversationId, message);
    if (result.success) {
      setMessage('');
      refresh();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Demo data for messages
  const demoMessages = [
    { id: '1', content: 'Hey! Ready for our match?', senderId: 'other', createdAt: new Date(Date.now() - 3600000).toISOString(), status: 'READ' },
    { id: '2', content: 'Absolutely! I\'ve been practicing all week', senderId: 'me', createdAt: new Date(Date.now() - 3500000).toISOString(), status: 'READ' },
    { id: '3', content: 'What topic are we playing?', senderId: 'other', createdAt: new Date(Date.now() - 3000000).toISOString(), status: 'READ' },
    { id: '4', content: 'How about Science?', senderId: 'me', createdAt: new Date(Date.now() - 2500000).toISOString(), status: 'READ' },
    { id: '5', content: 'Sounds good to me! Let\'s go! 🎮', senderId: 'other', createdAt: new Date(Date.now() - 2000000).toISOString(), status: 'READ' },
  ];

  const displayMessages = messages.length > 0 ? messages : demoMessages;

  // Demo other user
  const otherUser = {
    id: 'other',
    username: 'QuizMaster',
    displayName: 'Quiz Master',
    avatarUrl: null,
    isOnline: true,
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 pb-4 border-b border-background-700"
      >
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft size={18} className="mr-2" />
        </Button>
        <div className="relative">
          <Avatar 
            src={otherUser.avatarUrl} 
            alt={otherUser.displayName || otherUser.username}
            size="md"
          />
          {otherUser.isOnline && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background-900" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-medium text-white">
            {otherUser.displayName || otherUser.username}
          </p>
          <p className="text-xs text-gray-400">
            {otherUser.isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Trophy size={16} className="mr-1" />
            Challenge
          </Button>
        </div>
      </motion.div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loading />
          </div>
        ) : (
          <>
            {hasMore && (
              <div className="text-center">
                <Button variant="ghost" size="sm" onClick={loadMore} disabled={isLoading}>
                  Load More
                </Button>
              </div>
            )}
            
            {displayMessages.map((msg, index) => {
              const isMe = msg.senderId === 'me';
              const showDate = index === 0 || 
                new Date(msg.createdAt).toDateString() !== 
                new Date(displayMessages[index - 1].createdAt).toDateString();
              
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex',
                    isMe ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isMe && showDate && (
                    <div className="w-full text-center my-4">
                      <Badge variant="secondary" size="sm">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  )}
                  <div className={cn(
                    'max-w-[70%] rounded-2xl px-4 py-2',
                    isMe 
                      ? 'bg-primary-500 text-white rounded-br-md' 
                      : 'bg-background-800 text-white rounded-bl-md'
                  )}>
                    <p className="text-sm">{msg.content}</p>
                    <div className={cn(
                      'flex items-center gap-1 mt-1',
                      isMe ? 'justify-end' : 'justify-start'
                    )}>
                      <span className="text-xs text-gray-400">
                        {formatTime(new Date(msg.createdAt))}
                      </span>
                      {isMe && (
                        <span className="text-xs">
                          {msg.status === 'READ' ? '✓✓' : msg.status === 'DELIVERED' ? '✓' : ''}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-t border-background-700 p-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Button variant="secondary" size="sm">
            <Gift size={16} className="mr-1" />
            Gift
          </Button>
          <Button variant="secondary" size="sm">
            <Zap size={16} className="mr-1" />
            Quick Challenge
          </Button>
        </div>
        
        {/* Message Input */}
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={!message.trim() || sending}>
            <Send size={18} />
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
