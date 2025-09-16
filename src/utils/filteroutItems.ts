// utils/filterOutItems.ts
import { Item } from "@/constants/items";

// List of items to filter out
const EXCLUDE_ITEMS = ["Red_Chutney", "Mayonaise", "Chili_Oil", "Oil"];

/**
 * Filters out unwanted items from the array
 * @param itemsList - Array of items
 * @returns Filtered array excluding specific items
 */
export function filterOutItems(itemsList: Item[]): Item[] {
  return itemsList.filter(item => !EXCLUDE_ITEMS.includes(item.name));
}
