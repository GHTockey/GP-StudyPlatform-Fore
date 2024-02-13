import type { User } from "./user"

export type Classes = {
   id: string,
   annc: string,
   creatorUid: string,
   info: string,
   name: string,

   userList: User[],
   creator: User
}