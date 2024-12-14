import React from 'react';

const Card = (props) => {
    return (
        <div className="border card m-3" style={{ minWidth: 300, width: '30%' }} onClick={() => props.onClick(props.pet)}>
            <img
                src={'https://pets.сделай.site' + props.pet.photos}  // Use the correct URL for images
                className="card-img-top"
                alt={`рисунок ${props.pet.kind}`}  // Assuming kind is the type of animal
                style={{ height: '60%', objectFit: 'contain', width: '100%' }}  // Updated to use 'contain'
            />
            <div className="card-body">
                <h5 className="card-title">{props.pet.kind}</h5>  {/* Display the kind of animal */}
                <p className="card-text"><strong>ID:</strong> {props.pet.id}</p>
                <p className="card-text"><strong>Описание:</strong> {props.pet.description}</p>
                <p className="card-text"><strong>Номер чипа:</strong> {props.pet.mark || "Номер чипа не указан"}</p>
                <p className="card-text"><strong>Район:</strong> {props.pet.district}</p>
                <p className="card-text"><strong>Дата:</strong> {props.pet.date}</p>
            </div>
        </div>
    );
};

export default Card;
