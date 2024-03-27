// 用户聊天数据
export type UserMessage = {
   id: number;
   senderId: string;
   receiverId: string;
   message: string;
   timestamp: Date | string;
   isRead: number;

   /** 消息类型: 
   0用户消息 1群聊消息
   2系统消息 3在线用户数据变化
   4发送的消息已读 5班级消息 */
   type?: 0 | 1 | 2 | 3 | 4;
}


export type OAuthLoginType = "github" | "gitee" | "qq" | "weixin";
// github 用户数据
export interface GithubUser {
   login: string;
   id: number;
   node_id: string;
   avatar_url: string;
   gravatar_id: string | null;
   url: string;
   html_url: string;
   followers_url: string;
   following_url: string;
   gists_url: string;
   starred_url: string;
   subscriptions_url: string;
   organizations_url: string;
   repos_url: string;
   events_url: string;
   received_events_url: string;
   type: string;
   site_admin: boolean;
   name: string | null;
   company: string | null;
   blog: string | null;
   location: string | null;
   email: string | null;
   hireable: boolean | null;
   bio: string | null;
   twitter_username: string | null;
   public_repos: number;
   public_gists: number;
   followers: number;
   following: number;
   created_at: string;
   updated_at: string;
}
// gitee 用户数据
export interface GiteeUser {
   id: number;
   login: string;
   name: string;
   avatar_url: string;
   url: string;
   html_url: string;
   remark?: string; // Optional field as it can be empty or undefined
   followers_url: string;
   following_url: string;
   gists_url: string;
   starred_url: string;
   subscriptions_url: string;
   organizations_url: string;
   repos_url: string;
   events_url: string;
   received_events_url: string;
   type: string;
   blog?: string; // Optional field as it can be empty or undefined
   weibo?: string; // Optional field as it can be null
   bio?: string; // Optional field as it can be empty or undefined
   public_repos: number;
   public_gists: number;
   followers: number;
   following: number;
   stared: number;
   watched: number;
   created_at: string; // ISO 8601 format
   updated_at: string; // ISO 8601 format
   email: string;
}