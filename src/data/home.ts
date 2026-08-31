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

export const bestSellers = [
  {
    id: 'bs-chicken-malabar',
    name: 'Chicken Dum Biryani Malabar Special',
    desc: 'Kaima rice dum biryani with tender chicken.',
    price: 219.05,
    image: '/categories/biryanis.png',
    customizable: true,
  },
  {
    id: 'bs-beef-malabar',
    name: 'Beef Dum Biryani Malabar Special',
    desc: 'Kaima rice dum biryani with succulent beef.',
    price: 219.05,
    image: '/categories/biryanis.png',
    customizable: true,
  },
  {
    id: 'bs-chicken-fry',
    name: 'Chicken Fry Bangalore Special',
    desc: 'Bangalore style chicken fry.',
    price: 152.38,
    image: '/categories/fry.jpg',
    customizable: true,
  },
  {
    id: 'bs-donne-chicken',
    name: 'Donne Biryani - Chicken',
    desc: 'Seeraga samba donne biryani with chicken.',
    price: 219.05,
    image: '/categories/biryanis.png',
    customizable: true,
  },
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
