import './FeaturedCategories.css';

const FeaturedCategories = () => {
  const categories = [
    { name: 'Mobiles', icon: 'mobile' },
    { name: 'Ultrabook', icon: 'laptop' },
    { name: 'Branded Desktops', icon: 'desktop' },
    { name: 'Tablets', icon: 'tablet' },
    { name: 'Monitors', icon: 'monitor' },
    { name: 'Camera', icon: 'camera' },
    { name: 'Graphics card', icon: 'gpu' },
    { name: 'Projectors', icon: 'projector' },
    { name: 'Keyboard', icon: 'keyboard' },
    { name: 'Mouse', icon: 'mouse' },
    { name: 'Headphones', icon: 'headphones' },
    { name: 'Speakers', icon: 'speakers' },
    { name: 'SSD', icon: 'ssd' },
    { name: 'External storage', icon: 'storage' },
    { name: 'Gaming Chairs', icon: 'chair' },
    { name: 'Hubs & Dock', icon: 'hub' },
    { name: 'Printers', icon: 'printer' },
    { name: 'Gaming Console', icon: 'console' }
  ];

  const getIcon = (iconType) => {
    const iconStyle = { stroke: '#1a1a1a', fill: 'none', strokeWidth: '1', strokeLinecap: 'round', strokeLinejoin: 'round' };
    
    switch(iconType) {
      case 'mobile':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12.01" y2="18"/>
          </svg>
        );
      case 'laptop':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="2" y="4" width="20" height="14" rx="2" ry="2"/>
            <line x1="2" y1="20" x2="22" y2="20"/>
            <line x1="6" y1="20" x2="6" y2="22"/>
            <line x1="18" y1="20" x2="18" y2="22"/>
          </svg>
        );
      case 'desktop':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <rect x="10" y="21" width="4" height="2" rx="1"/>
          </svg>
        );
      case 'tablet':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2"/>
            <line x1="12" y1="18" x2="12" y2="18"/>
            <circle cx="12" cy="6" r="1"/>
          </svg>
        );
      case 'monitor':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        );
      case 'camera':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        );
      case 'gpu':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <circle cx="7" cy="8" r="1.5"/>
            <circle cx="17" cy="8" r="1.5"/>
            <line x1="2" y1="12" x2="22" y2="12"/>
            <line x1="7" y1="4" x2="7" y2="8"/>
            <line x1="17" y1="4" x2="17" y2="8"/>
            <rect x="8" y="14" width="8" height="4" rx="0.5"/>
          </svg>
        );
      case 'projector':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="2" y="8" width="20" height="12" rx="2"/>
            <circle cx="12" cy="14" r="2"/>
            <line x1="12" y1="16" x2="12" y2="20"/>
            <line x1="8" y1="20" x2="16" y2="20"/>
            <path d="M6 8 L6 4 L18 4 L18 8"/>
            <line x1="2" y1="12" x2="6" y2="12"/>
            <line x1="18" y1="12" x2="22" y2="12"/>
          </svg>
        );
      case 'keyboard':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="2" y="6" width="20" height="12" rx="2"/>
            <rect x="4" y="9" width="3" height="2" rx="0.5"/>
            <rect x="8" y="9" width="3" height="2" rx="0.5"/>
            <rect x="12" y="9" width="3" height="2" rx="0.5"/>
            <rect x="16" y="9" width="3" height="2" rx="0.5"/>
            <rect x="4" y="13" width="14" height="2" rx="0.5"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>
        );
      case 'mouse':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <ellipse cx="12" cy="15" rx="6" ry="8"/>
            <line x1="12" y1="7" x2="12" y2="15"/>
            <line x1="12" y1="23" x2="12" y2="24"/>
            <line x1="10" y1="24" x2="14" y2="24"/>
          </svg>
        );
      case 'headphones':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
            <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
          </svg>
        );
      case 'speakers':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="4" y="2" width="16" height="20" rx="2"/>
            <circle cx="12" cy="8" r="2"/>
            <line x1="8" y1="14" x2="16" y2="14"/>
            <line x1="8" y1="18" x2="16" y2="18"/>
            <circle cx="6" cy="6" r="1"/>
            <circle cx="18" cy="6" r="1"/>
            <circle cx="6" cy="20" r="1"/>
            <circle cx="18" cy="20" r="1"/>
          </svg>
        );
      case 'ssd':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="3" y="4" width="18" height="16" rx="2"/>
            <line x1="3" y1="8" x2="21" y2="8"/>
            <line x1="8" y1="4" x2="8" y2="8"/>
            <line x1="16" y1="4" x2="16" y2="8"/>
            <rect x="6" y="10" width="12" height="8" rx="1"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="16" x2="15" y2="16"/>
          </svg>
        );
      case 'storage':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="6" y="2" width="12" height="20" rx="2"/>
            <line x1="10" y1="6" x2="14" y2="6"/>
            <line x1="10" y1="10" x2="14" y2="10"/>
            <rect x="8" y="14" width="8" height="4" rx="1"/>
            <rect x="9" y="18" width="6" height="2" rx="0.5"/>
          </svg>
        );
      case 'chair':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="4" y="12" width="16" height="8" rx="2"/>
            <line x1="8" y1="12" x2="8" y2="8"/>
            <line x1="16" y1="12" x2="16" y2="8"/>
            <rect x="6" y="6" width="12" height="4" rx="1"/>
            <circle cx="6" cy="20" r="1"/>
            <circle cx="18" cy="20" r="1"/>
            <circle cx="10" cy="20" r="1"/>
            <circle cx="14" cy="20" r="1"/>
            <line x1="8" y1="8" x2="8" y2="6"/>
            <line x1="16" y1="8" x2="16" y2="6"/>
          </svg>
        );
      case 'hub':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="4" y="8" width="16" height="12" rx="2"/>
            <rect x="6" y="4" width="4" height="6" rx="1"/>
            <rect x="14" y="4" width="4" height="6" rx="1"/>
            <circle cx="8" cy="10" r="1"/>
            <circle cx="16" cy="10" r="1"/>
            <circle cx="12" cy="12" r="1"/>
            <circle cx="12" cy="16" r="1"/>
            <line x1="10" y1="14" x2="14" y2="14"/>
          </svg>
        );
      case 'printer':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="4" y="4" width="16" height="16" rx="2"/>
            <line x1="4" y1="8" x2="20" y2="8"/>
            <line x1="8" y1="12" x2="16" y2="12"/>
            <line x1="8" y1="16" x2="16" y2="16"/>
            <circle cx="18" cy="6" r="1"/>
            <line x1="6" y1="20" x2="18" y2="20"/>
          </svg>
        );
      case 'console':
        return (
          <svg width="60" height="60" viewBox="0 0 24 24" {...iconStyle}>
            <rect x="4" y="8" width="16" height="10" rx="2"/>
            <path d="M8 12 L10 12 M8 14 L10 14 M8 16 L10 16"/>
            <circle cx="16" cy="13" r="1.5"/>
            <circle cx="19" cy="13" r="1.5"/>
            <line x1="14" y1="15" x2="20" y2="15"/>
            <line x1="6" y1="6" x2="18" y2="6"/>
            <line x1="6" y1="18" x2="18" y2="18"/>
          </svg>
        );
      default:
        return <div className="category-icon-placeholder"></div>;
    }
  };

  return (
    <section className="featured-categories-section">
      <div className="container">
        <h2 className="section-title">FEATURED CATEGORY</h2>
        <div className="categories-grid">
          {categories.map((category, index) => (
            <a key={index} href={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`} className="category-card">
              <div className="category-image">
                {getIcon(category.icon)}
              </div>
              <span className="category-name">{category.name}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
