import { body } from "express-validator";

export const registerValidation = [
    body("name", "ім'я повинне складатися мінімум з 3 символів").isLength({
        min: 3,
    }),
    body("username", "ім'я повинне складатися мінімум з 3 символів").isLength({
        min: 4,
    }),
    body("email", "невірний email").isEmail(),
    body("password", "невірний пароль").isLength({ min: 6 }),

    body("avatarUrl", "невірне посилання на зображення").isURL(),
];
