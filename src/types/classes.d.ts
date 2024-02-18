import type { User } from "./user"

export type Classes = {
   id: string|null,
   annc: string,
   creatorUid: string,
   info: string,
   name: string,

   userList?: User[],
   creator?: User
}

export type ClassesUser = {
   uid: string
   cid: string
}