import type { Classes } from "./classes"

export type User = {
   id: string,
   username: string,
   // password: string,
   avatar: string,
   email: string,
   sex: string,

   classes?: Classes
}