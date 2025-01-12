type TweetMetrics = {
    replies: number;
    reposts: number;
    likes: number;
    views: number;
  };
  
  type TweetMedia = {
    type: "image" | "video";
    url: string;
  };
  
  type BookmarkData = {
    tweetId: string;
    authorName: string;
    authorUsername: string;
    text: string;
    timestamp: string;
    metrics: TweetMetrics;
    links: string[];
    // media: TweetMedia[];
  };
  
  export type { BookmarkData, TweetMetrics, TweetMedia };
  