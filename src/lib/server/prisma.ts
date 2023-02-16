import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
declare global {
    var prisma: PrismaClient;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') global.prisma = prisma

prisma.$use(async (params, next) => {
    if (params.model == "User" && params.action == "create") {
        params.args.data.password = await bcrypt.hash(params.args.data.password, 3);
    }
    return next(params)
})
export default prisma