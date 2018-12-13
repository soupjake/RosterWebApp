import { TeamMember } from "./teammember";

export interface Team {
	id: number;
	name: string;
	members: TeamMember[]
}