export interface Character {
  id: string;
  name: string;
  image: string;
  characterInfo: string;
  story: string;
  firstMessage: string;
  moonNote: string;
  googleAIStudioLink: string;
  nglLink: string;
  slogan: string;
  hashtags: string;
  createdAt: string;
  updatedAt?: string;
  authorEmail?: string;
}

export interface Comment {
  id: string;
  characterId: string;
  parentId?: string | null;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email?: string | null;
  displayName?: string | null;
  nickname?: string;
  photoURL?: string | null;
  updatedAt?: string;
}

export enum TabType {
  INFO = 'info',
  STORY = 'story',
  FIRST_MESSAGE = 'first_message',
  MOON_NOTE = 'moon_note',
  COMMENTS = 'comments'
}
