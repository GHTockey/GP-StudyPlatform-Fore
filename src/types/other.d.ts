export type SocketMessageVo = {
   sender_id?: string; // 发送者ID
   receiver_id: string; // 接收者ID
   message: string; // 消息内容
   type?: 0 | 1 | 2 | 3; // 消息类型：0用户消息 1群发消息 2系统消息 3在线用户变化
};

// 用户聊天数据
export type UserChat = {
   id: number;
   sender_id: string;
   receiver_id: string;
   message: string;
   timestamp: Date;
   is_read: number;
}