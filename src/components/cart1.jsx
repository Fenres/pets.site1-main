import React from 'react';

const Card1 = ({ pet, onClick }) => {
    return (
        <div className="border card m-3" style={{  width: '250зч' }} onClick={() => onClick(pet)}>
            <img
                src={'https://pets.сделай.site' + pet.photos}  // Use the correct URL for images
                className="card-img-top"
                alt={`рисунок ${pet.kind}`}  // Assuming kind is the type of animal
                style={{ height: '10%', objectFit: 'contain', width: 'auto' }}  // Updated to use 'contain'
            />
            <div className="card-body">
                <h5 className="">{pet.kind}</h5>  {/* Display the kind of animal */}

                <p className=""><strong>Описание:</strong> {pet.description}</p>
                <p className=""><strong>Номер чипа:</strong> {pet.mark || "Номер чипа не указан"}</p>
                <p className=""><strong>Район:</strong> {pet.district}</p>
           
            </div>
        </div>
    );
};

export default Card1;
