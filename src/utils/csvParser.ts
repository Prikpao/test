import { MenuItem } from '../types';

/**
 * Robust CSV Line Parser that handles quotes, escaped quotes, and commas inside cells.
 */
export function parseCSV(text: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let current = '';
  let inQuotes = false;

  const cleanText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < cleanText.length; i++) {
    const char = cleanText[i];
    const nextChar = cleanText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(current.trim());
      current = '';
    } else if (char === '\n' && !inQuotes) {
      row.push(current.trim());
      if (row.length > 0 && row.some(cell => cell.length > 0)) {
        lines.push(row);
      }
      row = [];
      current = '';
    } else {
      current += char;
    }
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current.trim());
    if (row.some(cell => cell.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

/**
 * Maps raw 2D array of CSV rows into typed MenuItem objects.
 * Flexibly detects column headers regardless of exact case or ordering.
 */
export function csvRowsToMenuItems(rows: string[][]): MenuItem[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map(h => h.toLowerCase().trim());

  const findCol = (...names: string[]) => {
    return headers.findIndex(h => names.some(n => h.includes(n)));
  };

  const dayCol = findCol('day', 'weekday', 'date');
  const mainCol = findCol('main', 'entree', 'dish', 'lunch');
  const vegCol = findCol('veg', 'vegetarian', 'vegan', 'plant');
  const sideCol = findCol('side', 'sides', 'salad');
  const soupCol = findCol('soup', 'starter', 'appetizer');
  const dessertCol = findCol('dessert', 'sweet', 'fruit');
  const calCol = findCol('cal', 'calorie', 'kcal');
  const allergenCol = findCol('allergen', 'dietary', 'diet');

  const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const items: MenuItem[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length === 0) continue;

    const rawDay = dayCol !== -1 && row[dayCol] ? row[dayCol].trim() : `Day ${i}`;
    const matchedDay = ((validDays.find(d => d.toLowerCase() === rawDay.toLowerCase()) || 
      validDays[i - 1] || 'Monday')) as MenuItem['day'];

    const main = mainCol !== -1 && row[mainCol] ? row[mainCol] : row[1] || 'Daily Chef Special';
    const veg = vegCol !== -1 && row[vegCol] ? row[vegCol] : row[2] || 'Seasonal Veggie Plate';
    const side = sideCol !== -1 && row[sideCol] ? row[sideCol] : row[3] || 'Fresh Market Greens';
    const soup = soupCol !== -1 && row[soupCol] ? row[soupCol] : undefined;
    const dessert = dessertCol !== -1 && row[dessertCol] ? row[dessertCol] : undefined;
    
    let calories = 550;
    if (calCol !== -1 && row[calCol]) {
      const parsedCal = parseInt(row[calCol].replace(/[^\d]/g, ''), 10);
      if (!isNaN(parsedCal)) calories = parsedCal;
    }

    let allergens: string[] = [];
    if (allergenCol !== -1 && row[allergenCol]) {
      allergens = row[allergenCol].split(/[,;/]/).map(a => a.trim()).filter(Boolean);
    } else {
      allergens = ['Nut-Free'];
    }

    items.push({
      day: matchedDay,
      main,
      vegetarian: veg,
      side,
      soup: soup || 'Daily Broth & Breadsticks',
      dessert: dessert || 'Seasonal Fruit / Fresh Cookie',
      calories,
      allergens: allergens.length > 0 ? allergens : ['Halal-Friendly'],
      chefPick: i % 2 === 1,
      ratings: [5, 4, 5, 5]
    });
  }

  return items;
}

/**
 * Generates sample CSV string template ready for downloading or Google Sheets import.
 */
export function generateSampleMenuCSV(): string {
  return `Day,Main Dish,Vegetarian Option,Sides,Soup,Dessert,Calories,Allergens
Monday,"Crispy Honey-Glazed Chicken with Steamed Jasmine Rice","Sweet Garlic Tofu Stir-Fry with Bok Choy","Sesame Ginger Edamame & Steamed Broccoli","Miso Seaweed Soup","Sliced Honeycrisp Apples & Orange Wedges",580,"Nut-Free, Dairy-Free"
Tuesday,"Handmade Italian Lasagna Bolognese","Spinach & Ricotta Stuffed Shells in Marinara","Garlic Herb Focaccia & House Caesar Salad","Minestrone Vegetable Soup","Tiramisu Parfait / Fresh Pear",640,"Vegetarian Available"
Wednesday,"Slow-Roasted Beef Carnitas Burrito Bowls","Black Bean, Sweet Corn & Cilantro Lime Fajita Bowl","Tortilla Chips, Fresh Pico de Gallo & Guacamole","Tortilla Soup with Crispy Strips","Cinnamon Churros with Dark Chocolate Drizzle",610,"Gluten-Free Option"
Thursday,"Butter Chicken with Fragrant Cumin Rice & Warm Naan","Paneer Butter Masala with Turmeric Rice","Cucumber Tomato Mint Raita & Roasted Samosa","Lentil Dahl Soup","Mango Kulfi Pudding",660,"Halal-Certified, Nut-Free"
Friday,"Crispy Panko Fish & Golden Chips with Tartar Sauce","Artisan Margherita & Grilled Veggie Pizza Slices","Creamy Coleslaw & Steamed Sweet Corn Cob","New England Clam Chowder","Warm Chocolate Chip Cookie & Watermelon Slice",690,"Nut-Free"`;
}
