import { TShop } from "./shops.types"

export type TUserRole = "admin" | "user"

export type TUserToken = string|null

export enum TUserType { IE="ie", LLP="llp" }

export interface TUserObject {
	phone: string;
	userId: number;
	roles: Array<TUserRole>
}

export interface TUserCity {
	id: number;
	name: string;
	region: {
		id: number;
		name: string;
	}
}

export interface TUserDashboard {
	info: any;
	shops: TShop[],
	transactions: any;
}



