import { User } from "app/domain";

export interface UserRepository {
    create(user: User): Promise<void>;

    getById(id: string): Promise<User | null>;
}
