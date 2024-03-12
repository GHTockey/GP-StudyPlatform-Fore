import type { Classes } from "./classes"

export type User = {
   id: string,
   username: string,
   // password: string,
   avatar: string,
   email: string,
   sex: string,

   classes?: Classes
   permissionList?: Permission[],
   roleList?: Role[],
   roleIds?: number[] // 用于提交表单

   // 以下字段在数据库中不存在
   studyTotal?: number,
}

export type Permission = {
   id?: number,
   name: string,
   parentId: number,
   path: string,
   children?: Permission[] | null,
   halfCheck?: number,
   type: 'page' | 'operate' | null,
   icon?: Icon | null,
   disabled?: boolean, // 是否禁用 仅用于树形控件
}
export type Role = {
   id?: number,
   desc: string,
   name: string,
   userIds?: string[] | null,
}