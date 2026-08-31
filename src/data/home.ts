export const store = {
  name: 'The Biriyani Store',
  slug: 'thebiriyanistore',
  location: 'Kaloor, Kochi',
  locationDetail: 'Vylopilly Lane, Kaloor, Kochi, India 682017',
  mapEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.3333486653414!2d76.29544367480665!3d9.989298590115535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080df4339ced6f%3A0x949a79ae7ee00b7c!2sThe%20Biryani%20Store!5e0!3m2!1sen!2sin!4v1788187538853!5m2!1sen!2sin',
}

export const categories = [
  { id: 'biryanis', label: 'Biryanis', image: '/categories/biryanis.png', active: true },
  { id: 'fry', label: 'Fry', image: '/categories/fry.jpg', active: false },
  { id: 'drinks', label: 'Drinks (Beverages)', image: '/categories/drinks.jpg', active: false },
  { id: 'egg', label: 'Egg', image: '/categories/egg.jpg', active: false },
]

export type MenuItem = {
  id: string
  name: string
  desc: string
  price: number
  image: string
  customizable: boolean
  categoryId: string
}

export const bestSellers: MenuItem[] = [
  {
    id: 'bs-chicken-malabar',
    name: 'Chicken Dum Biryani Malabar Special',
    desc: 'Kaima rice dum biryani with tender chicken.',
    price: 219.05,
    image: '/bestsellers/chicken-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'bs-beef-malabar',
    name: 'Beef Dum Biryani Malabar Special',
    desc: 'Kaima rice dum biryani with succulent beef.',
    price: 219.05,
    image: '/bestsellers/beef-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'bs-chicken-fry',
    name: 'Chicken Fry Bangalore Special',
    desc: 'Bangalore style chicken fry.',
    price: 152.38,
    image: '/bestsellers/chicken-fry.jpg',
    customizable: true,
    categoryId: 'fry',
  },
  {
    id: 'bs-donne-chicken',
    name: 'Donne Biryani - Chicken',
    desc: 'Seeraga samba donne biryani with chicken.',
    price: 219.05,
    image: '/bestsellers/donne-chicken.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
]

export const biryanis: MenuItem[] = [
  {
    id: 'donne-chicken',
    name: 'Donne Biryani - Chicken',
    desc: 'Seeraga samba rice slow cooked in dum with tender chicken.',
    price: 219.05,
    image: '/bestsellers/donne-chicken.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'mini-donne-chicken',
    name: 'Mini Donne Biryani - Chicken',
    desc: 'Mini pack with single piece chicken, Seeraga samba rice.',
    price: 152.38,
    image: '/bestsellers/donne-chicken.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'rice-donne-egg',
    name: 'Rice Donne Biryani (Non Veg) + Egg',
    desc: 'Seeraga samba rice slow cooked in dum with egg.',
    price: 114.29,
    image: '/bestsellers/donne-chicken.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'donne-rice-chicken-fry',
    name: 'Donne Biryani Rice+Chicken Fry',
    desc: 'Seeraga samba rice slow cooked in dum with chicken fry.',
    price: 228.57,
    image: '/bestsellers/donne-chicken.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'rice-only-donne',
    name: 'Rice Only - Donne Biryani',
    desc: 'Aromatic Seeraga samba rice only.',
    price: 85.71,
    image: '/bestsellers/donne-chicken.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'chicken-malabar',
    name: 'Chicken Dum Biryani Malabar Special',
    desc: 'Kaima rice slow cooked in dum with tender chicken.',
    price: 219.05,
    image: '/bestsellers/chicken-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'mini-mutton-malabar',
    name: 'Mini Mutton Dum Biryani [Bone In]',
    desc: 'Half portion, single pc, kaima rice with mutton.',
    price: 228.57,
    image: '/bestsellers/beef-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'beef-malabar',
    name: 'Beef Dum Biryani Malabar Special',
    desc: 'Kaima rice slow cooked in dum with succulent beef.',
    price: 219.05,
    image: '/bestsellers/beef-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'mutton-malabar',
    name: 'Mutton Dum Biryani Malabar Special [Bone In]',
    desc: 'Kaima rice slow cooked in dum with succulent mutton.',
    price: 333.33,
    image: '/bestsellers/beef-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'mini-chicken-malabar',
    name: 'Mini Chicken Dum Biryani Malabar',
    desc: 'Mini pack with single piece chicken, kaima rice.',
    price: 152.38,
    image: '/bestsellers/chicken-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'mini-beef-malabar',
    name: 'Mini Beef Dum Biryani Malabar',
    desc: 'Kaima rice slow cooked in dum with beef, mini pack.',
    price: 161.9,
    image: '/bestsellers/beef-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'malabar-rice-chicken-fry',
    name: 'Dum Biryani Rice + Chicken Fry',
    desc: 'Malabar rice with 3 pc chicken fry and egg.',
    price: 228.57,
    image: '/bestsellers/chicken-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
  {
    id: 'rice-only-malabar',
    name: 'Rice Only - Malabar Biryani',
    desc: 'Aromatic kaima rice only.',
    price: 85.71,
    image: '/bestsellers/chicken-malabar.jpg',
    customizable: true,
    categoryId: 'biryanis',
  },
]

export const drinks: MenuItem[] = [
  {
    id: '7up-330ml',
    name: '7 UP 330ml CAN',
    desc: '330 ml 7 UP',
    price: 66.67,
    image: '/drinks/7up-330ml.png',
    customizable: false,
    categoryId: 'drinks',
  },
  {
    id: 'fresh-lime',
    name: 'Fresh Lime',
    desc: 'Fresh Lime Juice',
    price: 47.62,
    image: '/drinks/fresh-lime.png',
    customizable: false,
    categoryId: 'drinks',
  },
  {
    id: 'mint-lime',
    name: 'Mint Lime Juice',
    desc: 'Refreshing mint and lime juice',
    price: 59,
    image: '/drinks/fresh-lime.png',
    customizable: false,
    categoryId: 'drinks',
  },
  {
    id: 'mirinda-330ml',
    name: 'Mirinda 330ml CAN',
    desc: '330 ml can Mirinda',
    price: 66.67,
    image: '/drinks/mirinda-330ml.png',
    customizable: false,
    categoryId: 'drinks',
  },
  {
    id: 'pepsi-330ml',
    name: 'Pepsi 330ml CAN',
    desc: '330 ml Pepsi',
    price: 66.67,
    image: '/drinks/pepsi-330ml.png',
    customizable: false,
    categoryId: 'drinks',
  },
  {
    id: 'zero-pepsi-330ml',
    name: 'Zero Pepsi 330ml Can',
    desc: 'Zero Sugar Pepsi 330 ml CAN',
    price: 66.67,
    image: '/drinks/zero-pepsi-330ml.jpg',
    customizable: false,
    categoryId: 'drinks',
  },
]

export const egg: MenuItem[] = [
  {
    id: 'egg-boiled',
    name: 'Egg Boiled [ 1 pc ]',
    desc: 'Perfectly boiled egg',
    price: 14.29,
    image: '/egg/egg-boiled.jpg',
    customizable: false,
    categoryId: 'egg',
  },
]

export const products: MenuItem[] = []
