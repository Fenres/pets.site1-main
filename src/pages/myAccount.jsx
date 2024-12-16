import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FoundPets from "../components/foundanimals";
import MyAkc from "../components/propsMya";
import { Button, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../components/AuthContext';

function MyAccount() {
    const [user, setUser] = useState(null); // Store user data
    const [isLoginTabActive, setIsLoginTabActive] = useState(true); // Switch between login and register tabs
    const [errorMessages, setErrorMessages] = useState([]); // To store error messages
    const { authToken, setAuthToken } = useAuth(); // Get authToken from context
    const navigate = useNavigate();
    const [pets, setPets] = useState([]); // Store pets data
    const [currentPage, setCurrentPage] = useState(1); // Pagination state
    const petsPerPage = 3; // Number of pets per page

    const [isRegistered, setIsRegistered] = useState(false);

    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
  
    const [registerName, setRegisterName] = useState("");
    const [registerPhone, setRegisterPhone] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [registerPasswordConfirm, setRegisterPasswordConfirm] = useState("");
    const [registerConfirm, setRegisterConfirm] = useState(false);
    useEffect(() => {
        if (authToken) {
            loadUserData(); // Load user data if token exists
            fetchPets(); // Fetch pets data if token exists
        }
    }, [authToken]);

    const handleCloseModal = () => {
     
        setLoginEmail("");
        setLoginPassword("");
        setRegisterName("");
        setRegisterPhone("");
        setRegisterEmail("");
        setRegisterPassword("");
        setRegisterPasswordConfirm("");
        setRegisterConfirm(false);
        setErrorMessages([]);
        setIsRegistered(false);
      };

    const loadUserData = async () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${authToken}`);

        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };

        try {
            const response = await fetch("https://pets.сделай.site/api/users", requestOptions);
            const result = await response.json();
            
            console.log("User Data:", result); // Log the user data to the console

            setUser(result);
        } catch (error) {
            console.error("Error fetching user data: ", error);
            setErrorMessages(["Не удалось загрузить данные пользователя. Пожалуйста, попробуйте позже."]);
        }
    };

    const fetchPets = async () => {
        if (!authToken) return;

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${authToken}`);

        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        try {
            const response = await fetch(`https://pets.сделай.site/api/users/orders`, requestOptions);
            const data = await response.json();
            
            console.log("Pets Data:", data); // Log the pets data to the console

            if (response.status === 200) {
                setPets(data.data.orders); 
            } else {
                setErrorMessages([data.error?.message || 'Error fetching pets data']);
            }
        } catch (error) {
            setErrorMessages([error.message]);
        }
    };


    
      const resetErrors = () => setErrorMessages([]);

      const validateRegistrationForm = () => {
        const errors = [];
        const nameRegex = /^[А-Яа-яёЁ\s\-]+$/;
        if (!nameRegex.test(registerName)) {
          errors.push("Имя должно содержать только кириллицу, пробелы и дефисы.");
        }
        const phoneRegex = /^\+7?[0-9]{10}/;
        if (!phoneRegex.test(registerPhone)) {
          errors.push("Телефон должен содержать только цифры и может начинаться с символа '+7'.");
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailRegex.test(registerEmail)) {
          errors.push("Неверный формат email.");
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{7,}$/;
        if (!passwordRegex.test(registerPassword)) {
          errors.push("Пароль должен быть не менее 7 символов, с одной цифрой, одной строчной и одной заглавной буквой.");
        }
        if (registerPassword !== registerPasswordConfirm) {
          errors.push("Пароли не совпадают.");
        }
        return errors;
      };
    
      const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const errors = validateRegistrationForm();
        if (errors.length > 0) {
          setErrorMessages(errors);
          return;
        }
      
        const registrationData = {
          name: registerName,
          phone: registerPhone,
          email: registerEmail,
          password: registerPassword,
          password_confirmation: registerPasswordConfirm,
          confirm: registerConfirm ? "true" : "false",
        };
      
        try {
          const response = await fetch('https://pets.сделай.site/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registrationData),
          });
      
          if (response.status === 204) {
            setIsRegistered(true);
          } else if (response.status === 422) {
            const errorData = await response.json();
            setErrorMessages(['Пользователь с такой почтой уже существует']);
          } else {
            throw new Error('Что-то пошло не так, попробуйте позже.');
          }
        } catch (error) {
          setErrorMessages([error.message]);
        }
      };
    
      const handleLoginSubmit = async (e) => {
        e.preventDefault();
    
        if (!loginEmail || !loginPassword) {
          setErrorMessages(['Email и пароль обязательны для ввода']);
          return;
        }
    
        const loginData = { email: loginEmail, password: loginPassword };
    
        try {
          const response = await fetch('https://pets.сделай.site/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginData),
          });
    
          if (response.status === 200) {
            const data = await response.json();
            const token = data.data.token;
            localStorage.token = token;
            setAuthToken(token);
            handleCloseModal();
            navigate('/myAccount');
          } else {
            const errorData = await response.json();
            setErrorMessages([errorData.message || 'Ошибка входа']);
          }
        } catch (error) {
          setErrorMessages([error.message]);
        }
      };
    

    if (!authToken) {
        return (
            <div style={{ height: '710px', flexDirection: 'column' }}>
                <h2 className="text-center text-white bg-primary m-2">Пожалуйста, авторизуйтесь или зарегистрируйтесь, чтобы продолжить.</h2>
                <div className="container m-auto">
                    <div className="d-flex justify-content-center">
                        <Button
                            className={`btn ${isLoginTabActive ? 'btn-active btn-primary' : 'btn-inactive btn-secondary'}`}
                            onClick={() => setIsLoginTabActive(true)}
                        >
                            Вход
                        </Button>
                        <Button
                            className={`btn ${!isLoginTabActive ? 'btn-active btn-primary' : 'btn-inactive btn-secondary'} ms-2`}
                            onClick={() => setIsLoginTabActive(false)}
                        >
                            Регистрация
                        </Button>
                    </div>

                   {errorMessages.length > 0 && (
            <Alert variant="danger">
              <ul>
                {errorMessages.map((msg, idx) => (
                  <li key={idx}>{msg}</li>
                ))}
              </ul>
            </Alert>
          )}

                    <div className="d-flex justify-content-center mt-4" style={{ maxHeight: '100%' }}>
                        <div className="w-100" style={{ maxWidth: '400px' }}>
                        {isLoginTabActive ? (
              <Form onSubmit={handleLoginSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Почта</Form.Label>
                <Form.Control
                  type="email"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  value={loginPassword}
                  onChange={(e) => { setLoginPassword(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Button type="submit" className="w-100">
                Войти
              </Button>
            </Form>
          ) : (
            // Registration Form
            <Form onSubmit={handleRegisterSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Имя</Form.Label>
                <Form.Control
                  type="text"
                  value={registerName}
                  onChange={(e) => { setRegisterName(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Телефон</Form.Label>
                <Form.Control
                  type="tel"
                  value={registerPhone}
                  onChange={(e) => { setRegisterPhone(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={registerEmail}
                  onChange={(e) => { setRegisterEmail(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Пароль</Form.Label>
                <Form.Control
                  type="password"
                  value={registerPassword}
                  onChange={(e) => { setRegisterPassword(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Подтверждение пароля</Form.Label>
                <Form.Control
                  type="password"
                  value={registerPasswordConfirm}
                  onChange={(e) => { setRegisterPasswordConfirm(e.target.value); resetErrors(); }}
                  required
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                label="Согласие на обработку данных"
                required
                checked={registerConfirm}
                onChange={() => setRegisterConfirm(!registerConfirm)}
              />
              {isRegistered ? (
                <Alert variant="success" className="w-100">
                  Регистрация успешна! Вы можете войти.
                </Alert>
              ) : (
                <Button type="submit" className="w-100">
                  Зарегистрироваться
                </Button>
              )}
            </Form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // If logged in, show user dashboard with FoundPets
    return (
        <div>
            <MyAkc data={user} />
            <FoundPets pets={pets} currentPage={currentPage} setCurrentPage={setCurrentPage} />
        </div>
    );
}

export default MyAccount;
