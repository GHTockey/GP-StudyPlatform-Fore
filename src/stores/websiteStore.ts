import type { Website } from "@/types/other";
import { defineStore } from "pinia";

type State = Website;
type Getters = {};
type Actions = {
   setWebsiteInfo: (data: Website) => void;
   // getWebsiteInfo: () => void;
};

export const useWebsiteStore = defineStore<string, State, Getters, Actions>("website_store", {
   state: () => ({
      id: 0,
      logoUrl: '',
      name: '',
      info: '',
   }),

   actions: {
      setWebsiteInfo(website: Website) {
         this.id = website.id;
         this.logoUrl = website.logoUrl;
         this.name = website.name;
         this.info = website.info;
      }
   }
});