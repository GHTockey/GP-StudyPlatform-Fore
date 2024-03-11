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