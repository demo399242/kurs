export enum TShopOperation { BUY="buy", SELL="sell" }

export interface TShopRate {
	buy: string;
	sell: string;
}

export interface TShopRates {
	[currencyName: string]: TShopRate
}

export interface TCurrency {
	name: string;
	text: string;
	digits: number;
	flag: string;
}

export interface TRegion {
	id: number;
	name: string;
	isCity: boolean;
	cities: TCity[];
	cities2: TCity[];
}

export interface TCity {
	id: number;
	name: string;
	region: TRegion;
	status: number;
	isCity?: boolean;
}

export interface TShop {
	id: number;
	name: string;
	rates: TShopRates;
	street: string;
	house: string;
	city: TCity;
	paid_dtm: Date;
}

export interface TBestRates {
	[currencyName: string]: {
		buy_value: string;
		sell_value: string;
	};
}

export interface TCurrencyCol extends TCurrency {
	buyAz: boolean;
	sellAz: boolean;
}

export interface TCurrencyColsOptions {
	colIndex: number;
	operation: TShopOperation;
}

