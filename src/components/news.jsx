import React, { useState } from 'react';

function News() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState(null); // Для отображения сообщений об успехе или ошибке
  const [error, setError] = useState(null); // Для отображения ошибок

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // try {
      const response = await fetch('https://pets.сделай.site/api/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

       if (response.status === 204) {
        setMessage('Вы успешно подписались на новости!');
        setEmail(''); // Очистить поле ввода после успешной подписки
       } else if (response.status === 422) {
         const data = await response.json();
        setError(`Ошибка валидации: ${data.error.message}`);
     } else {
        setError('Произошла ошибка. Попробуйте снова.');
      }
    } 
    
  

  return (
    <div>
      <h2 className="text-center text-white bg-primary m-2">
        Подписка на новости
      </h2>

      {message && <div className="alert alert-success text-center">{message}</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      {!message && (
        <form className="w-50 m-auto p-3" style={{ minWidth: 300 }} onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="emailInput" className="form-label">
              Введите адрес электронной почты
            </label>
            <input
              type="email"
              className="form-control"
              id="emailInput"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-describedby="emailHelp"
              required
            />
            <div id="emailHelp" className="form-text">
              Мы никогда не делимся Вашими e-mail ни с кем.
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            Подписаться
          </button>
        </form>
      )}
    </div>
  );
}

export default News;
