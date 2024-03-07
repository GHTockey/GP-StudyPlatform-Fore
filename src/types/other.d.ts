// 用户聊天数据
export type UserMessage = {
   id: number;
   senderId: string;
   receiverId: string;
   message: string;
   timestamp: Date | string;
   is_read: number;
   type?: 0 | 1 | 2 | 3; // 消息类型：0用户消息 1群发消息 2系统消息 3在线用户变化
}