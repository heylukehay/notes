type User = {
    id: number;
    username: string;
    password: string;
    employee?: Employee;
    notes: Note[];
    createdAt: DateTime;
    updatedAt: DateTime;
    deletedAt?: DateTime;
};

type Employee = {
    id: number;
    userId?: number;
    firstName: string;
    lastName: string;
    role: Role;
    team: Team[];
    managerOf: Team[];
    deletedAt?: DateTime;
};

type Team = {
    id: number;
    managerId: number;
    teamName: string;
    employees: Employee[];
    deletedAt?: DateTime;
};

type Note = {
    id: number;
    userId: number;
    title: string;
    content: string;
    author: User;
    createdAt: DateTime;
    updatedAt: DateTime;
    deletedAt?: DateTime;
};

enum Role {
    EMPLOYEE,
    MANAGER,
    ADMIN,
};
