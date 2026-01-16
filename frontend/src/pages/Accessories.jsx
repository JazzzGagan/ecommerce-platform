import ProductSlider from '../components/ProductSlider';
import Footer from '../components/Footer';

const Accessories = () => {
  const accessoriesProducts = [
    {
      name: 'UGREEN HiTune T2 Bluetooth 5.0 Wireless Earbuds',
      price: 'रु 5,000',
      originalPrice: 'रु 6,500',
      rating: 4,
      reviews: 12,
      timer: '18d 17h 45m 49s',
      image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'Kingston A400 480GB 2.5 inch SATA 3 Internal SSD',
      price: 'रु 18,000',
      originalPrice: 'रु 22,000',
      rating: 4,
      reviews: 8,
      timer: '18d 17h 45m 49s',
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'Cudy AC 650Mbps USB WiFi Adapter for PC',
      price: 'रु 1,150',
      originalPrice: 'रु 2,000',
      rating: 4,
      reviews: 5,
      timer: '18d 17h 45m 49s',
      image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'HAVIT HV-MS989GT Wireless Mouse',
      price: 'रु 725',
      originalPrice: 'रु 1,200',
      rating: 4,
      reviews: 15,
      timer: '18d 17h 45m 49s',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'UGREEN Cat6 RJ45 Unshielding Network crystal head',
      price: 'रु 1,000',
      originalPrice: 'रु 1,500',
      rating: 5,
      reviews: 3,
      timer: '18d 17h 45m 49s',
      image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'Rapoo V700-8A multi mode wireless mechanical keyboard',
      price: 'रु 10,625',
      originalPrice: 'रु 13,000',
      rating: 4,
      reviews: 7,
      timer: '18d 17h 45m 49s',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'CHOETECH USB-C to Ethernet ( HUB-R01 )',
      price: 'रु 2,800',
      originalPrice: 'रु 3,500',
      rating: 4,
      reviews: 9,
      timer: '18d 17h 45m 49s',
      image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'Rapoo C200 720P HD USB WebCam',
      price: 'रु 3,735',
      originalPrice: 'रु 4,500',
      rating: 5,
      reviews: 11,
      timer: '18d 17h 45m 49s',
      image: 'https://images.unsplash.com/photo-1587825147138-34637d094dcd?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'Logitech MX Master 3 Wireless Mouse',
      price: 'रु 8,500',
      rating: 5,
      reviews: 24,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'Corsair K70 RGB Mechanical Keyboard',
      price: 'रु 12,000',
      rating: 5,
      reviews: 18,
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'Sony WH-1000XM4 Noise Cancelling Headphones',
      price: 'रु 25,000',
      rating: 5,
      reviews: 32,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&q=80&auto=format'
    },
    {
      name: 'Samsung T7 Portable SSD 1TB',
      price: 'रु 15,000',
      rating: 5,
      reviews: 15,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400&h=400&fit=crop&q=80&auto=format'
    }
  ];

  return (
    <div style={{ paddingTop: '120px', minHeight: '100vh' }}>
      <ProductSlider products={accessoriesProducts} title="Accessories" />
    </div>
  );
};

export default Accessories;

