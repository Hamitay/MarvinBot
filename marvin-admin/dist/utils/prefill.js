"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const client = new client_1.PrismaClient();
const prefillUser = async () => {
    return await client.user.create({
        data: {
            name: 'admin',
            admin: true,
            passwordMd5: '5ffc7d46cf7f0b09b98441c03c269478' // shake
        }
    });
};
prefillUser()
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
//# sourceMappingURL=prefill.js.map