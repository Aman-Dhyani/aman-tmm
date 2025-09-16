export type ItemType = "single" | "double";

export interface Item {
  name: string;
  label: string;
  type: ItemType;
  multiplier: number;
}

export const items: Item[] = [
  // Single Inputs
  { name: "Red_Chutney", label: "Red Chutney", type: "single", multiplier: 1 },
  { name: "Mayonaise", label: "Mayonnaise", type: "single", multiplier: 1 },
  { name: "Chili_Oil", label: "Chili Oil", type: "single", multiplier: 1 },
  { name: "Oil", label: "Oil", type: "single", multiplier: 1 },

  // Double Inputs
  { name: "Veg_Spring", label: "Veg Spring Roll", type: "double", multiplier: 10 },
  { name: "Chicken_Spring", label: "Chicken Spring Roll", type: "double", multiplier: 10 },
  { name: "Veg_S", label: "Veg Steam", type: "double", multiplier: 50 },
  { name: "Veg_K", label: "Veg Kurkure", type: "double", multiplier: 25 },
  { name: "Cheese_Corn_S", label: "Cheese Corn Steam", type: "double", multiplier: 50 },
  { name: "Cheese_Corn_K", label: "Cheese Corn Kurkure", type: "double", multiplier: 25 },
  { name: "Soya_S", label: "Soya Steam", type: "double", multiplier: 50 },
  { name: "Soya_K", label: "Soya Kurkure", type: "double", multiplier: 25 },
  { name: "Paneer_S", label: "Paneer Steam", type: "double", multiplier: 50 },
  { name: "Paneer_K", label: "Paneer Kurkure", type: "double", multiplier: 25 },
  { name: "Chicken_S", label: "Chicken Steam", type: "double", multiplier: 50 },
  { name: "Chicken_K", label: "Chicken Kurkure", type: "double", multiplier: 25 },
  { name: "Veg_S_Wheat", label: "Veg Steam Wheat", type: "double", multiplier: 50 },
  { name: "Soya_S_Wheat", label: "Soya Steam Wheat", type: "double", multiplier: 50 },
  { name: "Paneer_S_Wheat", label: "Paneer Steam Wheat", type: "double", multiplier: 50 },
  { name: "Chicken_S_Wheat", label: "Chicken Steam Wheat", type: "double", multiplier: 50 },
];