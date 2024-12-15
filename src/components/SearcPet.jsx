import React, { useState } from 'react';
import Card from './propsCard';  // Компонент для карточки
import AdDetails from './adDetale';  // Детали объявления
import { useLocation } from 'react-router-dom';

function SearcPet() {
 // Для хранения выбранного объявления
  const location = useLocation();
  const selectedAd = location.state?.selectedAd; 

  // Функция для выбора объявления




  return (
    <div>
      <div className="search-box text-center text-white bg-primary p-3">
        <h3>Поиск животных</h3>
      </div>

      <div className="d-flex justify-content-center">
     
      </div>

      <div>
        {selectedAd ? (
        <AdDetails selectedAd={selectedAd} closeAd={() => console.log('Закрыть')} />
             
        ) : (
          <div className="d-flex flex-wrap justify-content-center">
            {/* {suggestions.length === 0 ? ( */}
              <p className="text-center">Нет результатов</p>
            {/* ) : (
              suggestions.map((pet) => (
                <Card
                  key={pet.id}
                  pet={pet}
                  onClick={() => selectAd(pet)}  // Выбор объявления
                />
              ))
            )} */}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearcPet;
