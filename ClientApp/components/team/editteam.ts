import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Team } from '../../models/team';
import { Employee } from '../../models/employee';
import { TeamMember } from '../../models/teammember';

@Component
export default class EditTeamComponent extends Vue {
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: (value: string) => !!value || 'Required',
		number: (value: string) => /^\d+(\d{1,2})?$/.test(value) || 'Value must be number e.g. "8" or "10"',
		decimal: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Value must be decimal e.g. "8.0" or "7.5"'
	}

	team: Team = {
		id: 0,
		name: "",
		members: []
	}

	loading: boolean = false;
	failed: boolean = false;
	errorMessage: string = "";
	employees: Employee[] = [];
	managers: Employee[] = [];
	supervisors: Employee[] = [];
	agents: Employee[] = [];
	teammanagers: TeamMember[] = [];
	teamsupervisors: TeamMember[] = [];
	teamagents: TeamMember[] = [];

	mounted() {
		this.loading = true;
		fetch('api/Employee/GetEmployees')
			.then(response => response.json() as Promise<Employee[]>)
			.then(data => {
				this.employees = data;
				this.filterRoles();
				this.getTeam();
			});
	}

	getTeam() {
		fetch('api/Team/GetById?id=' + this.$route.params.id)
			.then(respone => respone.json() as Promise<Team>)
			.then(data => {
				this.team = JSON.parse(JSON.stringify(data));
				this.filterTeamRoles();
				this.loading = false;
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

	filterTeamRoles() {
		for (var i = 0; i < this.team.members.length; i++) {
			switch (this.team.members[i].employeeRole) {
				case "Manager":
					this.teammanagers.push(this.team.members[i]);
					break;
				case "Supervisor":
					this.teamsupervisors.push(this.team.members[i]);
					break;
				case "Agent":
					this.teamagents.push(this.team.members[i]);
					break;
			}
		}
		if (this.teammanagers.length < 1) {
			this.teammanagers.push(this.createTeamMember("Manager"));
		}
		if (this.teamsupervisors.length < 1) {
			this.teamsupervisors.push(this.createTeamMember("Supervisor"));
		}
		if (this.teamagents.length < 1) {
			this.teamagents.push(this.createTeamMember("Agent"));
		}
	}

	createTeamMember(role: string) {
		var temp: TeamMember = {
			id: 0,
			teamId: 0,
			employeeId: 0,
			employeeName: "",
			employeeRole: role
		};
		return temp;
	}

	addManager() {
		if (this.teammanagers.length < 2) {
			this.teammanagers.push(this.createTeamMember("Manager"));
		}
	}

	addSupervisor() {
		if (this.teamsupervisors.length < 2) {
			this.teamsupervisors.push(this.createTeamMember("Supervisor"));
		}
	}

	addAgent() {
		if (this.teamagents.length < 5) {
			this.teamagents.push(this.createTeamMember("Agent"));
		}
	}

	removeManager() {
		if (this.teammanagers.length > 1) {
			this.teammanagers.pop();
		}
	}

	removeSupervisor() {
		if (this.teamsupervisors.length > 1) {
			this.teamsupervisors.pop();
		}
	}

	removeAgent() {
		if (this.teamagents.length > 1) {
			this.teamagents.pop();
		}
	}

	//Check for duplicates selected
	checkDuplicates() {
		this.failed = false;
		var duplicate: boolean = false;
		for (var i = 0; i < this.teammanagers.length - 1; i++) {
			if (this.teammanagers[i + 1].employeeId == this.teammanagers[i].employeeId) {
				this.failed = true;
				this.errorMessage = "Duplicate Manager found!";
				duplicate = true;
				break;
			}
		}
		for (var i = 0; i < this.teamsupervisors.length - 1; i++) {
			if (this.teamsupervisors[i + 1].employeeId == this.teamsupervisors[i].employeeId) {
				this.failed = true;
				this.errorMessage = "Duplicate Supervisor found!";
				duplicate = true;
				break;
			}
		}
		for (var i = 0; i < this.teamagents.length - 1; i++) {
			if (this.teamagents[i + 1].employeeId == this.teamagents[i].employeeId) {
				this.failed = true;
				this.errorMessage = "Duplicate Agent found!";
				duplicate = true;
				break;
			}
		}
		return duplicate;
	}

	populateMembers() {
		for (var i = 0; i < this.teammanagers.length; i++) {
			if (this.teammanagers[i].employeeId > 0) {
				this.team.members.push(this.teammanagers[i]);
			}
		}
		for (var i = 0; i < this.teamsupervisors.length; i++) {
			if (this.teamsupervisors[i].employeeId > 0) {
				this.team.members.push(this.teamsupervisors[i]);
			}
		}
		for (var i = 0; i < this.teamagents.length; i++) {
			if (this.teamagents[i].employeeId > 0) {
				this.team.members.push(this.teamagents[i]);
			}
		}
	}

	editTeam() {
		this.failed = false;
		if (this.$refs.form.validate()) {
			if (!this.checkDuplicates()) {
				this.populateMembers();
				fetch('api/Team/Update', {
					method: 'PUT',
					body: JSON.stringify(this.team)
				})
					.then(response => response.json() as Promise<number>)
					.then(data => {
						if (data < 1) {
							this.errorMessage = "Failed to edit Team!";
							this.failed = true;
						} else {
							this.$router.push('/fetchteam');
						}
					})
			}
		}
	}

	clear() {
		this.teammanagers = [];
		this.teammanagers.push(this.createTeamMember("Manager"));
		this.teamsupervisors = [];
		this.teamsupervisors.push(this.createTeamMember("Supervisor"));
		this.teamagents = [];
		this.teamagents.push(this.createTeamMember("Agent"));
	}

	cancel() {
		this.$router.push('/fetchteam');
	}
}