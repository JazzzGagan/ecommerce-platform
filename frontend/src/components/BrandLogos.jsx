import { useState } from 'react';
import './BrandLogos.css';

const BrandLogos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 6;

  const brands = [
    {
      name: 'Dell',
      logo: 'https://via.placeholder.com/200x80?text=Dell'
    },
    {
      name: 'Asus',
      logo: 'https://via.placeholder.com/200x80?text=Asus'
    },
    {
      name: 'Acer',
      logo: 'https://via.placeholder.com/200x80?text=Acer'
    },
    {
      name: 'MSI',
      logo: 'https://via.placeholder.com/200x80?text=MSI'
    },
    {
      name: 'HP',
      logo: 'https://via.placeholder.com/200x80?text=HP'
    },
    {
      name: 'Lenovo',
      logo: 'https://via.placeholder.com/200x80?text=Lenovo'
    },
    {
      name: 'Apple',
      logo: 'https://via.placeholder.com/200x80?text=Apple'
    },
    {
      name: 'Microsoft',
      logo: 'https://via.placeholder.com/200x80?text=Microsoft'
    },
    {
      name: 'Optoma',
      logo: 'https://via.placeholder.com/200x80?text=Optoma'
    },
    {
      name: 'Logitech',
      logo: 'https://via.placeholder.com/200x80?text=Logitech'
    },
    {
      name: 'Rapoo',
      logo: 'https://via.placeholder.com/200x80?text=Rapoo'
    },
    {
      name: 'Gigabyte',
      logo: 'https://via.placeholder.com/200x80?text=Gigabyte'
    }
  ];

  const totalSlides = Math.ceil(brands.length / itemsPerView);

  const nextSlide = () => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <section className="brand-logos-section">
      <div className="container">
        <div className="brand-slider-wrapper">
          <button 
            className={`brand-slider-nav-btn prev-btn ${currentIndex === 0 ? 'disabled' : ''}`}
            onClick={prevSlide}
            disabled={currentIndex === 0}
            aria-label="Previous slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="brand-slider-container">
            <div 
              className="brand-slider-track"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="brand-slide-group">
                  {brands
                    .slice(slideIndex * itemsPerView, slideIndex * itemsPerView + itemsPerView)
                    .map((brand, brandIndex) => (
                      <div key={brandIndex} className="brand-logo-item">
                        <div className="brand-logo-container">
                          <img 
                            src={brand.logo} 
                            alt={brand.name}
                            className="brand-logo-image"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </div>

          <button 
            className={`brand-slider-nav-btn next-btn ${currentIndex === totalSlides - 1 ? 'disabled' : ''}`}
            onClick={nextSlide}
            disabled={currentIndex === totalSlides - 1}
            aria-label="Next slide"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>

        <div className="brand-slider-dots">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`brand-dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            ></button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandLogos;

