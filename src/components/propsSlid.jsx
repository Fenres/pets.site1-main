import React from 'react';
import './sliderCss.css';  // Your custom CSS for carousel styling

function Slider({ slides }) {
  return (
    <main className="w-100" style={{ overflow: 'hidden' }}>
      <div
        id="carouselExampleIndicators"
        className="carousel slide bg-success bg-opacity-25 w-100 p-2"
        data-bs-ride="carousel"
      >
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide-to={index}
              className={index === 0 ? 'active' : ''}
              aria-current={index === 0 ? 'true' : undefined}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Carousel Items */}
        <div className="carousel-inner text-center d-flex align-items-center" style={{ height: '45vh' }}>
          {slides.map((slide, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''} w-100`}>
              <img
                src={'https://pets.сделай.site' + slide.image}  // Assuming this is the correct image URL
                className="d-block mx-auto"
                alt={slide.kind}
                style={{ maxWidth: '100%', height: '30vh', objectFit: 'contain' }}
              />
              <h2 className="text-center mt-3">{slide.kind}</h2>
              <p>{slide.description}</p>
            </div>
          ))}
        </div>

    
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" aria-hidden="true" />
          <span className="visually-hidden">Предыдущий</span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleIndicators"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" aria-hidden="true" />
          <span className="visually-hidden">Следующий</span>
        </button>
      </div>
    </main>
  );
}

export default Slider;
