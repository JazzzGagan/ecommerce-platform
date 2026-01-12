import { useState, useEffect } from 'react';
import './HeroSlider.css';

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'ASUS Zenbook Duo UX8406MA 2025',
      description: 'Two screens, endless possibilities. Double your productivity with the Asus ZenBook Duo 2025!',
      cta: 'shop now',
      image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'Apple M4 MacBook Air',
      description: 'Ultra Speed. Zero Noise. Power That Moves With You.',
      cta: 'shop now',
      image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'Wireless Headphones',
      description: 'Premium sound quality with noise cancellation technology.',
      cta: 'shop now',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'Smart Watch',
      description: 'Track your fitness and stay connected with style.',
      cta: 'shop now',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'Wireless Mouse',
      description: 'Ergonomic design for comfortable all-day use.',
      cta: 'shop now',
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'Mechanical Keyboard',
      description: 'Tactile keys for the perfect typing experience.',
      cta: 'shop now',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'USB-C Hub',
      description: 'Expand your connectivity with multiple ports.',
      cta: 'shop now',
      image: 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=800&h=600&fit=crop&q=80'
    },
    {
      title: 'Design, Choose, Create: It\'s All About Your Custom PC.',
      description: 'Build your own PC with our Custom PC builder',
      cta: 'build now',
      image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800&h=600&fit=crop&q=80'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="hero-slider">
      <div className="slider-container">
        <div className="slider-wrapper">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
            >
              <div className="slide-content">
                <h2 className="slide-title">{slide.title}</h2>
                <p className="slide-description">{slide.description}</p>
                <a href="/products" className="slide-cta">
                  {slide.cta}
                </a>
              </div>
              <div className="slide-image">
                <img src={slide.image} alt={slide.title} loading="lazy" className="product-image-main" />
              </div>
            </div>
          ))}
        </div>

        <button className="slider-nav prev" onClick={prevSlide} aria-label="Previous slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button className="slider-nav next" onClick={nextSlide} aria-label="Next slide">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>

        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;

