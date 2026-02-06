// User Types
export interface User {
  id: string;
  email: string;
  emailVerified: Date | null;
  username: string | null;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  privacyMode: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  pushEnabled: boolean;
  notificationPreferences: NotificationPreferences;
  topicStats: TopicStats;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  challenges: boolean;
  friendRequests: boolean;
  gameInvites: boolean;
  levelUps: boolean;
  matchResults: boolean;
  achievements: boolean;
  weeklyDigest: boolean;
}

export interface TopicStats {
  [topicId: string]: {
    level: number;
    xp: number;
    rank?: number;
  };
}

export interface UserPreview {
  id: string;
  username: string | null;
  displayName: string | null;
  avatarUrl: string | null;
  level?: number;
  isOnline?: boolean;
}

export interface SocialUserPreview extends UserPreview {
  level?: number;
  isOnline?: boolean;
}

export interface SuggestedUser extends SocialUserPreview {
  mutualTopics: string[];
}

// Auth Types
export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  isNewUser?: boolean;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  email: string;
  password: string;
  username: string;
}

export interface VerifyEmailInput {
  token: string;
}

export interface ForgotPasswordInput {
  email: string;
}

export interface ResetPasswordInput {
  token: string;
  password: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  sortOrder: number;
  topicCount: number;
}

export interface Topic {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string;
  iconColor: string;
  bannerUrl: string | null;
  featured: boolean;
  isNew: boolean;
  questionCount: number;
  playCount: number;
  category: Category;
  userLevel?: number;
}

export interface TopicListItem {
  id: string;
  name: string;
  slug: string;
  icon: string;
  iconColor: string;
  questionCount: number;
  playCount: number;
  featured: boolean;
  isNew: boolean;
}

// Match Types
export type MatchStatus = 'PENDING' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'FINISHED' | 'ABANDONED';

export interface MatchPlayer {
  id: string;
  username: string;
  avatarUrl: string | null;
  score: number;
  correctCount: number;
}

export interface MatchSummary {
  id: string;
  topicId: string;
  topicName: string;
  status: MatchStatus;
  player1: MatchPlayer;
  player2: MatchPlayer | null;
  winnerId: string | null;
  playedAt: string;
}

export interface MatchResult {
  matchId: string;
  winner: 'player1' | 'player2' | 'tie';
  player1: MatchPlayer;
  player2: MatchPlayer;
  xpBreakdown: MatchXPBreakdown;
  questions: MatchQuestionReview[];
}

export interface MatchXPBreakdown {
  base: number;
  winBonus: number;
  streakBonus: number;
  total: number;
}

export interface MatchQuestionReview {
  questionId: string;
  text: string;
  options: string[];
  correctIndex: number;
  myAnswer: number | null;
  opponentAnswer: number | null;
  myPoints: number;
  opponentPoints: number;
}

// Leaderboard Types
export type LeaderboardScope = 'global' | 'country' | 'city';

export interface LeaderboardEntry {
  rank: number;
  user: UserPreview;
  score: number;
  level: number;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  total: number;
  userRank: number | null;
  scope: LeaderboardScope;
  topicId: string;
}

// Social Types
export type FollowStatus = 'none' | 'following' | 'followed_by' | 'mutual';

export interface FollowersResponse {
  users: SocialUserPreview[];
  nextCursor?: string;
  totalCount: number;
}

export interface FollowingResponse {
  users: SocialUserPreview[];
  nextCursor?: string;
  totalCount: number;
}

export interface FriendsResponse {
  users: SocialUserPreview[];
  nextCursor?: string;
  totalCount: number;
}

export interface SuggestionsResponse {
  users: SuggestedUser[];
}

export interface RecentOpponentsResponse {
  users: SocialUserPreview[];
}

export interface FollowStatusResponse {
  status: FollowStatus;
  followersCount: number;
  followingCount: number;
}

// Challenge Types
export type ChallengeStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED' | 'EXPIRED';

export interface ChallengePreview {
  id: string;
  challenger: UserPreview;
  challenged: UserPreview;
  topic: TopicListItem;
  status: ChallengeStatus;
  createdAt: string;
  expiresAt: string;
}

export interface ChallengeWithDetails extends ChallengePreview {
  matchId?: string;
}

export interface CreateChallengeRequest {
  challengedId: string;
  topicId: string;
}

export interface ChallengeListResponse {
  challenges: ChallengeWithDetails[];
  nextCursor?: string;
}

export interface ChallengeCountResponse {
  count: number;
}

// Message Types
export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export interface ConversationPreview {
  id: string;
  otherUser: UserPreview;
  lastMessage?: {
    content: string;
    createdAt: string;
    isFromMe: boolean;
  };
  unreadCount: number;
  muted: boolean;
}

export interface InboxResponse {
  conversations: ConversationPreview[];
  nextCursor?: string;
}

export interface MessagesResponse {
  messages: Message[];
  nextCursor?: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: string;
  actor?: UserPreview;
  data: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export interface NotificationListResponse {
  notifications: Notification[];
  nextCursor?: string;
}

export interface UnreadNotificationCountResponse {
  count: number;
}

// Settings Types
export interface SettingsResponse {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  pushEnabled: boolean;
  privacyMode: boolean;
  notificationPreferences: NotificationPreferences;
  deletionRequestedAt?: string | null;
}

// Stats Types
export interface GlobalStats {
  totalXP: number;
  level: number;
  totalWins: number;
  totalLosses: number;
  totalMatches: number;
  winRate: number;
  topTopics: TopicStats[];
}

export interface TopicStatsResponse {
  topicId: string;
  level: number;
  xp: number;
  wins: number;
  losses: number;
  streak: number;
  rank?: number;
}
