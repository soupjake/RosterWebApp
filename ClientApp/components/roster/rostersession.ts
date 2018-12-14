import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Session } from '../../models/session';
import { Employee } from '../../models/employee';
import { Team } from '../../models/team';
import { SessionEmployee } from '../../models/sessionemployee';
import { TeamMember } from '../../models/teammember';

@Component
export default class RosterSessionComponent extends Vue {

	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: (value: string) => !!value || 'Required',
		number: (value: string) => /^\d+(\d{1,2})?$/.test(value) || 'Value must be number e.g. "8" or "10"',
		decimal: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Value must be decimal e.g. "8.0" or "7.5"'
	}

	failed: boolean = false;
	errorMessage: string = "";
	loading: boolean = false;
	holiday: boolean = false;

	before: Session = {
		id: 0,
		date: "",
		day: "",
		site: "",
		time: "",
		lod: 0,
		holiday: 0,
		note: "",
		staffCount: 0,
		state: 0,
		employees: []
	}

	after: Session = {
		id: 0,
		date: "",
		day: "",
		site: "",
		time: "",
		lod: 0,
		holiday: 0,
		note: "",
		staffCount: 0,
		state: 0,
		employees: []
	}

	team: Team = {
		id: 0,
		name: "",
		members: []
	}

	employees: Employee[] = [];
	teams: Team[] = [];
	managers: Employee[] = [];
	supervisors: Employee[] = [];
	agents: Employee[] = [];
	sessionmanagers: SessionEmployee[] = [];
	sessionsupervisors: SessionEmployee[] = [];
	sessionagents: SessionEmployee[] = [];

	mounted() {
		this.loading = true;
		//Get session first
		fetch('api/Session/GetById?id=' + this.$route.params.id)
			.then(respone => respone.json() as Promise<Session>)
			.then(data => {
				this.before = JSON.parse(JSON.stringify(data));
				this.after = data;
				if (this.after.holiday > 0) {
					this.holiday = true;
				}
				this.filterSessionRoles();
				//then get available and teams
				this.loadAvailable();
				this.loadTeams();
				this.loading = false;
			});
	}

	createSessionEmployee(role: string) {
		var temp: SessionEmployee = {
			id: 0,
			sessionId: this.after.id,
			sessionDate: this.after.date,
			sessionSite: this.after.site,
			employeeId: 0,
			employeeName: "",
			employeeRole: role,
			employeeLOD: this.after.lod,
			employeeOT: 0.0
		};
		return temp;
	}

	convertSessionEmployee(member: TeamMember) {
		var temp: SessionEmployee = {
			id: 0,
			sessionId: this.after.id,
			sessionDate: this.after.date,
			sessionSite: this.after.site,
			employeeId: member.employeeId,
			employeeName: member.employeeName,
			employeeRole: member.employeeRole,
			employeeLOD: this.after.lod,
			employeeOT: 0.0
		};
		return temp;
	}

	addManager() {
		if (this.sessionmanagers.length < 2) {
			this.sessionmanagers.push(this.createSessionEmployee("Manager"));
		}
	}

	addSupervisor() {
		if (this.sessionsupervisors.length < 2) {
			this.sessionsupervisors.push(this.createSessionEmployee("Supervisor"));
		}
	}
	addAgent() {
		if (this.sessionagents.length < 5) {
			this.sessionagents.push(this.createSessionEmployee("Agent"));
		}
	}

	removeManager() {
		if (this.sessionmanagers.length > 1) {
			this.sessionmanagers.pop();
		}
	}

	removeSupervisor() {
		if (this.sessionsupervisors.length > 1) {
			this.sessionsupervisors.pop();
		}
	}

	removeAgent() {
		if (this.sessionagents.length > 1) {
			this.sessionagents.pop();
		}
	}

	loadAvailable() {
		fetch('api/Employee/GetAvailable?date=' + this.before.date + "&day=" + this.before.day)
			.then(response => response.json() as Promise<Employee[]>)
			.then(data => {
				this.employees = data;
				this.filterRoles();
			});
	}

	loadTeams() {
		fetch('api/Team/GetTeams')
			.then(response => response.json() as Promise<Team[]>)
			.then(data => {
				this.teams = data;
			});
	}

	filterRoles() {
		for (var i = 0; i < this.employees.length; i++) {
			switch (this.employees[i].role) {
				case "Manager":
					this.managers.push(this.employees[i]);
					break;
				case "Supervisor":
					this.supervisors.push(this.employees[i]);
					break;
				case "Agent":
					this.agents.push(this.employees[i]);
					break;
			}
		}
	}

	filterSessionRoles() {
		for (var i = 0; i < this.after.employees.length; i++) {
			switch (this.after.employees[i].employeeRole) {
				case "Manager":
					this.sessionmanagers.push(this.after.employees[i]);
					break;
				case "Supervisor":
					this.sessionsupervisors.push(this.after.employees[i]);
					break;
				case "Agent":
					this.sessionagents.push(this.after.employees[i]);
					break;
			}
		}
		if (this.sessionmanagers.length < 1) {
			this.sessionmanagers.push(this.createSessionEmployee("Manager"));
		}
		if (this.sessionsupervisors.length < 1) {
			this.sessionsupervisors.push(this.createSessionEmployee("Supervisor"));
		}
		if (this.sessionagents.length < 1) {
			this.sessionagents.push(this.createSessionEmployee("Agent"));
		}
	}

	setTeam() {
		this.sessionmanagers = [];
		this.sessionsupervisors = [];
		this.sessionagents = [];
		for (var i = 0; i < this.team.members.length; i++) {
			if (this.searchTeam(this.team.members[i].employeeId)) {
				switch (this.team.members[i].employeeRole) {
					case "Manager":
						this.sessionmanagers.push(this.convertSessionEmployee(this.team.members[i]));
						break;
					case "Supervisor":
						this.sessionsupervisors.push(this.convertSessionEmployee(this.team.members[i]));
						break;
					case "Agent":
						this.sessionagents.push(this.convertSessionEmployee(this.team.members[i]));
						break;
				}
			} else {
				switch (this.team.members[i].employeeRole) {
					case "Manager":
						this.sessionmanagers.push(this.createSessionEmployee("Manager"));
						break;
					case "Supervisor":
						this.sessionsupervisors.push(this.createSessionEmployee("Supervisor"));
						break;
					case "Agent":
						this.sessionagents.push(this.createSessionEmployee("Agent"));
						break;
				}
			}
		}
	}

	searchTeam(id: number) {
		let match: boolean = false;
		for (var i = 0; i < this.employees.length; i++) {
			if (this.employees[i].id === id) {
				match = true;
				break
			}
		}
		return match;
	}

	checkDuplicates() {
		this.failed = false;
		var duplicate: boolean = false;
		for (var i = 0; i < this.sessionmanagers.length - 1; i++) {
			if (this.sessionmanagers[i + 1].employeeId == this.sessionmanagers[i].employeeId) {
				this.failed = true;
				this.errorMessage = "Duplicate Manager found!";
				duplicate = true;
				break;
			}
		}
		for (var i = 0; i < this.sessionsupervisors.length - 1; i++) {
			if (this.sessionsupervisors[i + 1].employeeId == this.sessionsupervisors[i].employeeId) {
				this.failed = true;
				this.errorMessage = "Duplicate Supervisor found!";
				duplicate = true;
				break;
			}
		}
		for (var i = 0; i < this.sessionagents.length - 1; i++) {
			if (this.sessionagents[i + 1].employeeId == this.sessionagents[i].employeeId) {
				this.failed = true;
				this.errorMessage = "Duplicate Agent found!";
				duplicate = true;
				break;
			}
		}
		return duplicate;
	}

	populateEmployees() {
		this.after.employees = [];
		for (var i = 0; i < this.sessionmanagers.length; i++) {
			if (this.sessionmanagers[i].employeeId > 0) {
				this.after.employees.push(this.sessionmanagers[i]);
			}
		}
		for (var i = 0; i < this.sessionsupervisors.length; i++) {
			if (this.sessionsupervisors[i].employeeId > 0) {
				this.after.employees.push(this.sessionsupervisors[i]);
			}
		}
		for (var i = 0; i < this.sessionagents.length; i++) {
			if (this.sessionagents[i].employeeId > 0) {
				this.after.employees.push(this.sessionagents[i]);
			}
		}
	}

	rosterSession() {
		this.failed = false;
		this.loading = true;
		if (!this.checkDuplicates()) {
			this.populateEmployees();
			let sessions: Session[] = [];
			sessions.push(this.before);
			sessions.push(this.after);
			fetch('api/Roster/Update', {
				method: 'PUT',
				body: JSON.stringify(sessions)
			})
				.then(response => response.json() as Promise<number>)
				.then(data => {
					if (data < 1) {
						this.errorMessage = "Failed to roster session!";
						this.failed = true;
						this.loading = false;
					} else {
						this.$router.push('/fetchsession');
					}
				})
		} else {
			this.loading = false;
		}
	}

	clear() {
		this.team = {
			id: 0,
			name: "",
			members: []
		}
		this.sessionmanagers = [];
		this.sessionmanagers.push(this.createSessionEmployee("Manager"));
		this.sessionsupervisors = [];
		this.sessionsupervisors.push(this.createSessionEmployee("Supervisor"));
		this.sessionagents = [];
		this.sessionagents.push(this.createSessionEmployee("Agent"));
	}

	cancel() {
		this.$router.push('/fetchsession');
	}
}
