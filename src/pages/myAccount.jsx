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

    useEffect(() => {
        if (authToken) {
            loadUserData(); // Load user data if token exists
            fetchPets(); // Fetch pets data if token exists
        }
    }, [authToken]);

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

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        const loginData = {
            email: e.target.email.value,
            password: e.target.password.value,
        };

        if (!loginData.email || !loginData.password) {
            setErrorMessages(["Email и пароль обязательны для ввода"]);
            return;
        }

        try {
            const response = await fetch('https://pets.сделай.site/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            if (response.status === 200) {
                const data = await response.json();
                const token = data.data.token;
                localStorage.setItem('token', token);
                setAuthToken(token);
                loadUserData();
                fetchPets();
            } else {
                const errorData = await response.json();
                setErrorMessages([errorData.message || 'Ошибка входа']);
            }
        } catch (error) {
            setErrorMessages([error.message]);
        }
    };

    // Registration form submission
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        const registrationData = {
            name: e.target.name.value,
            phone: e.target.phone.value,
            email: e.target.email.value,
            password: e.target.password.value,
            password_confirmation: e.target.passwordConfirm.value,
            confirm: e.target.confirm.checked ? "true" : "false",
        };

        const errors = validateRegistrationForm(registrationData);
        if (errors.length > 0) {
            setErrorMessages(errors);
            return;
        }

        try {
            const response = await fetch('https://pets.сделай.site/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            if (response.status === 204) {
                setErrorMessages([]);
                alert("Регистрация успешна, теперь можно войти!");
            } else if (response.status === 422) {
                const errorData = await response.json();
                const errorMessages = Object.values(errorData.errors).flat();
                setErrorMessages(errorMessages);
            } else {
                setErrorMessages(['Ошибка регистрации, попробуйте позже']);
            }
        } catch (error) {
            setErrorMessages([error.message]);
        }
    };

    const validateRegistrationForm = (data) => {
        const errors = [];
        if (!data.name) errors.push("Имя обязательно.");
        if (!data.phone) errors.push("Телефон обязателен.");
        if (!data.email || !/\S+@\S+\.\S+/.test(data.email)) errors.push("Неверный формат email.");
        if (!data.password || data.password.length < 7) errors.push("Пароль должен быть не менее 7 символов.");
        if (data.password !== data.password_confirmation) errors.push("Пароли не совпадают.");
        if (!data.confirm) errors.push("Необходимо согласие на обработку данных.");
        return errors;
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
                        <Alert variant="danger" className="mt-3">
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
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Пароль</Form.Label>
                                        <Form.Control type="password" name="password" required />
                                    </Form.Group>
                                    <Button type="submit" className="w-100">Войти</Button>
                                </Form>
                            ) : (
                                <Form onSubmit={handleRegisterSubmit}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Имя</Form.Label>
                                        <Form.Control type="text" name="name" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Телефон</Form.Label>
                                        <Form.Control type="tel" name="phone" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Пароль</Form.Label>
                                        <Form.Control type="password" name="password" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Подтверждение пароля</Form.Label>
                                        <Form.Control type="password" name="passwordConfirm" required />
                                    </Form.Group>
                                    <Form.Check
                                        type="checkbox"
                                        label="Согласие на обработку данных"
                                        name="confirm"
                                        required
                                    />
                                    <Button type="submit" className="w-100">Зарегистрироваться</Button>
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
