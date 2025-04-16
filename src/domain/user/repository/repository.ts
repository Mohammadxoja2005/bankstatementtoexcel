import { User } from "app/domain";

export interface UserRepository {
    create(user: Omit<User, "id">): Promise<void>;

    getById(id: string): Promise<User | null>;

    getUserByGoogleId: (id: string) => Promise<User>;
}
