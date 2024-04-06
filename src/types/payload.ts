import { Role } from "src/auth/enums/role.enum";

export interface Payload {
    username: string;
    email:string;
    roles: Role[];
}