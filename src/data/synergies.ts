import type { BoothArea } from "./characters";

export interface SynergyRule {
  characters: string[];       // character names involved in synergy
  bonusText: string;          // text description of the synergy bonus
  areas?: BoothArea[];           // optional: filter by area if relevant
}

export const synergyRules: SynergyRule[] = [
  {
    characters: ["March Assistant", "Dan Heng Assistant"],
    bonusText: "+150% revenue from Dan Heng and March Booth in Market Area",
    areas: ["Market"],
  },
  {
    characters: ["Himeko Assistant", "Sunday Assistant"],
    bonusText: "+50% revenue in Commemoration Area",
    areas: ["Commemoration"],
  },
  {
    characters: ["Welt Assistant", "Jiaoqiu Assistant", "Silver Wolf Assistant"],
    bonusText: "+100% revenue in Entertainment Area",
    areas: ["Entertainment"],
  },
  // Add your real synergy rules here
];
