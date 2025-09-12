"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  followUser: (targetUserId: string | number) => void;
  unfollowUser: (targetUserId: string | number) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    });

    // Connection events
    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error: any) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Follow/Unfollow events
    socketInstance.on('user_followed', (data: any) => {
      console.log('User followed:', data);
      // You can dispatch actions or show notifications here
    });

    socketInstance.on('user_unfollowed', (data: any) => {
      console.log('User unfollowed:', data);
      // You can dispatch actions or show notifications here
    });

    socketInstance.on('new_follower', (data: any) => {
      console.log('New follower:', data);
      // Show notification when someone follows you
    });

    setSocket(socketInstance);

    // Cleanup
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const followUser = (targetUserId: string | number) => {
    if (socket) {
      socket.emit('follow_user', { targetUserId });
      console.log(`Following user: ${targetUserId}`);
    }
  };

  const unfollowUser = (targetUserId: string | number) => {
    if (socket) {
      socket.emit('unfollow_user', { targetUserId });
      console.log(`Unfollowing user: ${targetUserId}`);
    }
  };

  const value: SocketContextType = {
    socket,
    isConnected,
    followUser,
    unfollowUser,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
