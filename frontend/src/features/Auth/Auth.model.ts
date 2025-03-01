export interface IRegisterProps {
	name: string;
	email: string;
	password: string;
	role: "seller" | "customer"
}

export interface IUser {
	id: number;
	email: string;
	name: string;
	role: "customer" | "admin"
}
