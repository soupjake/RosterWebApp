import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { TeamSite } from '../../models/teamsite';
import { Team } from '../../models/team';

@Component
export default class ViewTeamComponent extends Vue {
	teamsites: TeamSite[] = [];
	startdate: string = "";
	enddate: string = "";
	startDateFormatted: string = "";
	endDateFormatted: string = "";
	loading: boolean = false;
	failed: boolean = false;
	search: string = "";
	headers: object[] = [
		{ text: 'Date', value: 'date' },
		{ text: 'Day', value: 'day' },
	];

	team: Team = {
		id: 0,
		name: "",
		members: []
	}

	mounted() {
		fetch('api/Team/GetById?id=' + this.$route.params.id)
			.then(response => response.json() as Promise<Team>)
			.then(data => {
				this.team = data;
				for (var i = 0; i < this.team.members.length; i++) {
					this.headers.push({ text: this.team.members[i].employeeName, value: 'employeeSite' });
				}
			})
	}

	loadSessions() {
		if (this.startdate != "") {
			this.startDateFormatted = new Date(this.startdate).toLocaleDateString();
		}
		if (this.enddate != "") {
			this.endDateFormatted = new Date(this.enddate).toLocaleDateString();
		}
		if (this.startdate != "" && this.enddate != "") {
			if (this.enddate >= this.startdate) {
				this.loading = true;
				fetch('api/Team/GetTeamSites?id=' + this.$route.params.id + '&startdate=' + this.startdate + '&enddate=' + this.enddate)
					.then(response => response.json() as Promise<TeamSite[]>)
					.then(data => {
						this.failed = false;
						this.teamsites = data;
						this.loading = false;
					});
			} else {
				this.teamsites = [];
				this.failed = true;
			}
		}
	}

	siteColour(type: string) {
		switch (type) {
			case "Day Off":
				return "LightGray";
			case "Day Off - Part":
				return "LightGray";
			case "Annual Leave":
				return "Plum";
			case "Annual Leave - Part":
				return "Plum";
			case "Sick Leave":
				return "LightSeaGreen";
			case "Sick Leave - Part":
				return "LightSeaGreen";
			case "Special Leave":
				return "LightCoral";
			case "Special Leave - Part":
				return "LightCoral";
			case "Training":
				return "CornflowerBlue";
			case "Training - Part":
				return "CornflowerBlue";
		}
	}

	dateFormat(date: string) {
		return new Date(date).toLocaleDateString();
	}
}
