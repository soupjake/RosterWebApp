import { SessionEmployee } from "./sessionemployee";

export interface Session {
	id: number;
	date: string;
	day: string;
	site: string;
	time: string;
	lod: number;
	holiday: number;
	note: string;
	staffCount: number;
	state: number;
	employees: SessionEmployee[];
}