import React from 'react';

const Card = (props) => {
    return (
        <div
            className="border card mb-3 me-4"
            style={{ minWidth: 300, width: '30%', height: '700px' }}
            onClick={() => props.onClick(props.pet)}  // Клик по карточке
        >
            <img
                src={'https://pets.сделай.site' + props.pet.photos}
                className="card-img-top p-2"
                alt={`Фото питомца ${props.pet.kind}`}
                style={{ height: '60%', objectFit: 'contain', width: '100%' }}
            />
            <div className="card-body">
                <h5 className="card-title">{props.pet.kind}</h5>
                <p className="card-text">
                    <strong>ID:</strong> {props.pet.id}
                </p>
                <p className="card-text">
                    <strong>Описание:</strong> {props.pet.description}
                </p>
                <p className="card-text">
                    <strong>Номер чипа:</strong> {props.pet.mark || 'Номер чипа не указан'}
                </p>
                <p className="card-text">
                    <strong>Район:</strong> {props.pet.district}
                </p>
                <p className="card-text">
                    <strong>Дата:</strong> {props.pet.date}
                </p>
                <p className="card-text">
                    <strong>Статус:</strong> {props.pet.status}
                </p>
            </div>
        </div>
    );
};

export default Card;
