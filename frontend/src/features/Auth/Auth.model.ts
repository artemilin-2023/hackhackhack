export interface IRegisterProps {
	name: string;
	email: string;
	password: string;
}

export interface IUser {
	id: number;
	email: string;
	name: string;
	role: "customer" | "admin"
}
