import type { User } from "./user"

// 添加时的词集
export type VocabularyVo = {
   authorId: string | undefined,
   desc: string,
   title: string,
   cover: string,
   wordsList: Word[]
}
// 词集
export type Vocabulary = {
   id: string,
   title: string,
   desc: string,
   cover: string,
   count: number,
   authorId: string,
   createTime: string,
   updateTime: string,
   stuNum: number,
   // 关联
   wordsList?: Word[],
   author?: User,
   userList?: [] | User[],
}
// 词语
export type Word = {
   definition: string,
   word: string,
   id: string | null,
   vid: string | null
}