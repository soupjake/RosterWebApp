import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Session } from '../../models/session';
import { Employee } from '../../models/employee';

@Component
export default class ViewEmployeeComponent extends Vue {
	sessions: Session[] = [];
	startdate: string = "";
	enddate: string = "";
	startDateFormatted = "";
	endDateFormatted = "";
	loading: boolean = false;
	failed: boolean = false;
	search: string = "";
	headers: object[] = [
		{ text: 'Date', value: 'date' },
		{ text: 'Day', value: 'day' },
		{ text: 'Site', value: 'site' },
		{ text: 'Time', value: 'time' },
	];

	employee: Employee = {
		id: 0,
		name: "",
		role: "",
		contractHours: 0.0,
		appointedHours: 0.0,
		absenceHours: 0.0,
		overtimeHours: 0.0,
		negHours: 0.0,
		coHours: 0.0,
		workPattern: "",
		status: ""
	}

	mounted() {
		this.loading = true;
		fetch('api/Employee/GetById?id=' + this.$route.params.id)
			.then(respone => respone.json() as Promise<Employee>)
			.then(data => {
				this.employee = data;
				this.loading = false;
			});
	}

	dateFormat(date: string) {
		return new Date(date).toLocaleDateString();
	}

	loadSessions() {
		if (this.startdate != "") {
			this.startDateFormatted = this.dateFormat(this.startdate);
		}
		if (this.enddate != "") {
			this.endDateFormatted = this.dateFormat(this.enddate);
		}
		if (this.startdate != "" && this.enddate != "") {
			if (this.enddate >= this.startdate) {
				this.loading = true;
				fetch('api/Employee/GetEmployeeSessions?employeeid=' + this.employee.id + '&startdate=' + this.startdate + '&enddate=' + this.enddate)
					.then(response => response.json() as Promise<Session[]>)
					.then(data => {
						this.sessions = data;
						this.failed = false;
						this.loading = false;
					});
			} else {
				this.sessions = [];
				this.failed = true;
			}
		}
	}
}
