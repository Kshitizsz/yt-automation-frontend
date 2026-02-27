export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  email: string;
  role: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export enum VideoJobStatus {
  Pending = 0,
  GeneratingScript = 1,
  GeneratingVoiceover = 2,
  GeneratingVideo = 3,
  GeneratingThumbnail = 4,
  OptimizingSEO = 5,
  ReadyToPublish = 6,
  Publishing = 7,
  Published = 8,
  Failed = 9,
  Cancelled = 10
}

export const VideoJobStatusLabel: Record<VideoJobStatus, string> = {
  [VideoJobStatus.Pending]: 'Pending',
  [VideoJobStatus.GeneratingScript]: 'Generating Script',
  [VideoJobStatus.GeneratingVoiceover]: 'Generating Voiceover',
  [VideoJobStatus.GeneratingVideo]: 'Generating Video',
  [VideoJobStatus.GeneratingThumbnail]: 'Generating Thumbnail',
  [VideoJobStatus.OptimizingSEO]: 'Optimizing SEO',
  [VideoJobStatus.ReadyToPublish]: 'Ready to Publish',
  [VideoJobStatus.Publishing]: 'Publishing',
  [VideoJobStatus.Published]: 'Published',
  [VideoJobStatus.Failed]: 'Failed',
  [VideoJobStatus.Cancelled]: 'Cancelled'
};

export interface VideoJob {
  id: number;
  topic: string;
  title?: string;
  description?: string;
  tags?: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  voiceoverUrl?: string;
  youtubeVideoId?: string;
  status: VideoJobStatus;
  errorMessage?: string;
  nicheCategory: string;
  createdAt: string;
}

export interface CreateVideoJobDto {
  topic: string;
  nicheCategory: string;
  aiModel?: string;
  autoPublish?: boolean;
  scheduleAt?: string;
}

export interface MarketInsight {
  id: number;
  nicheCategory: string;
  trendingTopics: string[];
  analysisSummary: string;
  aiSource: string;
  trendScore: number;
  fetchedAt: string;
}

export interface SEOResponse {
  optimizedTitle: string;
  optimizedDescription: string;
  tags: string[];
  seoScore: number;
}

export interface AnalyticsSummary {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  subscribers: number;
  totalVideos: number;
  publishedVideos: number;
  recentVideos: VideoAnalyticsItem[];
}

export interface VideoAnalyticsItem {
  title: string;
  views: number;
  likes: number;
  comments: number;
  watchTimeMinutes: number;
  publishedAt: string;
}

export interface DashboardSummary {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  scheduledJobs: number;
  totalViews: number;
  recentJobs: VideoJob[];
  topTrends: MarketInsight[];
}
