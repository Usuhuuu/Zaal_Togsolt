// src/types/types.ts

// Type for Message object
export interface Message {
    senderId: string;
    message: string;
    timestamp?: string;  // Optional field for message timestamp
  }
  
  // Type for ChatGroup object
  export interface ChatGroup {
    groupId: string;
    groupName?: string; // Optional field for group name
  }
  
  // Type for User (for when sending messages)
  export interface User {
    userId: string;
    username: string;
    avatarUrl?: string; // Optional field for avatar URL
  }
  
  // Type for Chat component state (for managing the chat groups and messages)
  export interface ChatState {
    chatGroups: ChatGroup[];
    messages: Message[];
    newMessage: string;
    currentGroupId: string | null;
  }
  
  // Type for API Response (example of fetching chat groups)
  export interface ChatGroupsApiResponse {
    chatGroupIDs: string[];
  }
  