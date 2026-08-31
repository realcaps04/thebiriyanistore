export const store = {
  name: 'The Biriyani Store',
  slug: 'thebiriyanistore',
  location: 'Kaloor, Kochi',
  locationDetail: 'Vylopilly Lane, Kaloor, Kochi, India 682017',
}

export const activeOrders = [
  {
    id: '#2847',
    status: 'Ready to Serve',
    statusColor: 'bg-amber-100 text-amber-800',
    items: ['/splash-screen.jpg', '/brand/heritage-scene.jpg'],
    price: 649,
    time: '2 Mins Ago',
    table: 'Delivery',
  },
  {
    id: '#2140',
    status: 'Preparing',
    statusColor: 'bg-emerald-100 text-emerald-800',
    items: ['/splash-screen.jpg'],
    price: 320,
    time: '8 Mins Ago',
    table: 'Takeaway',
  },
]

export const categories = [
  { id: 'chicken', label: 'Chicken', icon: '🍗', active: true },
  { id: 'mutton', label: 'Mutton', icon: '🥩', active: false },
  { id: 'beef', label: 'Beef', icon: '🍖', active: false },
  { id: 'combo', label: 'Combos', icon: '🍱', active: false },
]

export const products = [
  {
    id: '1',
    name: 'Chicken Dum Biriyani',
    desc: 'With saffron & spices',
    image: '/splash-screen.jpg',
    isNew: true,
    discount: '50% OFF',
    rating: 4.9,
    price: 320,
  },
  {
    id: '2',
    name: 'Mutton Dum Biriyani',
    desc: 'Slow-cooked Malabar style',
    image: '/brand/heritage-scene.jpg',
    isNew: false,
    discount: '32% OFF',
    rating: 4.8,
    price: 420,
  },
  {
    id: '3',
    name: 'Thalassery Chicken',
    desc: 'Kaima rice specialty',
    image: '/splash-screen.jpg',
    isNew: true,
    discount: '40% OFF',
    rating: 4.9,
    price: 300,
  },
  {
    id: '4',
    name: 'Family Feast Combo',
    desc: 'Serves 4–5 people',
    image: '/brand/heritage-scene.jpg',
    isNew: false,
    discount: '25% OFF',
    rating: 5.0,
    price: 1299,
  },
]
