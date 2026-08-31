import { bestSellers, biryanis, drinks, egg, products, type MenuItem } from './home'

const allItems = [...bestSellers, ...biryanis, ...drinks, ...egg, ...products]

export function getMenuItemById(id: string): MenuItem | undefined {
  return allItems.find((item) => item.id === id)
}

export type AddonGroupItem = {
  id: string
  name: string
  price: number
  menuItemId?: string
  image?: string
}

export type ProductAddonGroup = {
  id: string
  title: string
  max: number
  items: AddonGroupItem[]
}

const productDetails: Record<string, string> = {
  'bs-chicken-malabar':
    'Malabar special dum biryani cooked with fragrant kaima rice, tender chicken, and a blend of coastal spices. Served with raita, gravy, and salad.',
  'bs-beef-malabar':
    'Slow dum-cooked beef biryani with kaima rice and Malabar spices for a rich, aromatic plate. Includes raita, gravy, and salad on the side.',
  'bs-chicken-fry':
    'Bangalore-style chicken fry with bold masala, crisp finish, and juicy meat. A perfect side or standalone snack.',
  'bs-donne-chicken':
    'Signature donne biryani with seeraga samba rice, chicken, and house spice mix slow-cooked in dum style. Served with raita, gravy, and salad.',
  'donne-chicken':
    'Seeraga samba rice layered with spiced chicken and slow-cooked in dum for deep flavour. Comes with raita, gravy, and salad.',
  'mini-donne-chicken':
    'Mini donne biryani with a single piece of chicken and seeraga samba rice — ideal for one.',
  'rice-donne-egg':
    'Donne biryani rice slow-cooked with egg for a lighter non-veg option.',
  'donne-rice-chicken-fry':
    'Donne biryani rice paired with crispy chicken fry for extra indulgence.',
  'rice-only-donne':
    'Aromatic seeraga samba rice cooked donne-style without protein.',
  'chicken-malabar':
    'Classic Malabar chicken dum biryani with kaima rice and coastal spice notes.',
  'mini-mutton-malabar':
    'Half-portion mutton dum biryani with bone-in meat and kaima rice.',
  'beef-malabar':
    'Beef dum biryani with kaima rice, slow-cooked for tender meat and bold aroma.',
  'mutton-malabar':
    'Premium mutton dum biryani with bone-in pieces and Malabar spices.',
  'mini-chicken-malabar':
    'Mini Malabar chicken biryani with a single piece and kaima rice.',
  'mini-beef-malabar':
    'Mini beef dum biryani — full flavour in a smaller portion.',
  'malabar-rice-chicken-fry':
    'Malabar biryani rice served with chicken fry and egg.',
  'rice-only-malabar':
    'Kaima rice cooked Malabar-style without meat.',
}

export function getProductDetails(item: MenuItem): string {
  if (productDetails[item.id]) return productDetails[item.id]
  if (item.categoryId === 'drinks') {
    return `${item.desc}. Chilled and served fresh.`
  }
  if (item.categoryId === 'egg') {
    return `${item.desc}. Add to any biryani or enjoy on its own.`
  }
  return `${item.desc}. Prepared fresh at The Biriyani Store, Kaloor.`
}

const donneExtrasGroup: ProductAddonGroup = {
  id: 'donne-extras',
  title: 'Donne Extras',
  max: 4,
  items: [
    { id: 'extra-salad', name: 'I Need More Salad', price: 20, image: '/brand/food-sides.jpg' },
    { id: 'extra-gravy', name: 'I Need More Gravy', price: 20, image: '/brand/food-biryani.jpg' },
    {
      id: 'extra-boiled-egg',
      name: 'I Need Extra Boiled Egg',
      price: 20,
      menuItemId: 'egg-boiled',
      image: '/egg/egg-boiled.jpg',
    },
    { id: 'extra-dates-pickle', name: 'I Need Dates Pickle', price: 20, image: '/categories/egg.jpg' },
  ],
}

const chickenFryGroup: ProductAddonGroup = {
  id: 'chicken-fry',
  title: 'Chicken Fry',
  max: 1,
  items: [
    {
      id: 'chicken-fry-small',
      name: 'Chicken Fry - Small',
      price: 152.38,
      menuItemId: 'bs-chicken-fry',
      image: '/bestsellers/chicken-fry.jpg',
    },
  ],
}

function buildDrinkGroup(): ProductAddonGroup {
  const drinkItems: AddonGroupItem[] = drinks.map((drink) => ({
    id: `drink-${drink.id}`,
    name: drink.name,
    price: drink.price,
    menuItemId: drink.id,
    image: drink.image,
  }))

  return {
    id: 'drinks',
    title: 'Drink',
    max: 3,
    items: drinkItems,
  }
}

export function getProductAddonGroups(item: MenuItem): ProductAddonGroup[] {
  const groups: ProductAddonGroup[] = []

  const isBiryani =
    item.categoryId === 'biryanis' ||
    item.name.toLowerCase().includes('biryani') ||
    item.name.toLowerCase().includes('donne')

  if (isBiryani && item.customizable) {
    groups.push(donneExtrasGroup)
  }

  if (item.id !== 'bs-chicken-fry') {
    groups.push(chickenFryGroup)
  }

  if (item.categoryId !== 'drinks') {
    groups.push(buildDrinkGroup())
  }

  return groups
}

export function isBestSeller(id: string): boolean {
  return bestSellers.some((item) => item.id === id)
}
