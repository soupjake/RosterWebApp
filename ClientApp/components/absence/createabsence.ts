import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Absence } from '../../models/absence';
import { Employee } from '../../models/employee';

@Component
export default class CreateAbsenceComponent extends Vue {	
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: (value: string) => !!value || 'Required',
		number: (value: string) => /^\d+(\d{1,2})?$/.test(value) || 'Value must be number e.g. "8" or "10"',
		decimal: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Value must be decimal e.g. "8.0" or "7.5"'
	}

	absence: Absence = {
		id: 0,
		employeeId: 0,
		employeeName: "",
		type: "",
		startDate: "",
		endDate: "",
		hours: 0
	}

	startDateFormatted = "";
	endDateFormatted = "";
	iddisable: boolean = false;
	loading: boolean = false;
	failed: boolean = false;
	types: string[] = ["Day Off", "Annual Leave", "Sick Leave", "Special Leave", "Training"];
	partDays: string[] = ["Yes", "No"];

	createAbsence() {
		this.failed = false;
		if (this.$refs.form.validate()) {
			if (this.absence.endDate >= this.absence.startDate) {
				fetch('api/Absence/Create', {
					method: 'POST',
					body: JSON.stringify(this.absence)
				})
					.then(response => response.json() as Promise<number>)
					.then(data => {
						if (data < 1) {
							this.failed = true;
						} else {
							this.$router.push('/fetchabsence');
						}
					})
			} else {
				this.failed = true;
			}
		}
	}

	search() {
		this.loading = true;
		fetch('api/Employee/GetById?id=' + this.absence.employeeId)
			.then(response => response.json() as Promise<Employee>)
			.then(data => {
				if (data.id > 0) {
					this.absence.employeeName = data.name;
					this.iddisable = true;
					this.loading = false;
				} else {
					alert("Couldn't find Employee by that Id!");
					this.loading = false;
				}
			})
	}

	formatStartDate() {
		this.startDateFormatted = new Date(this.absence.startDate).toLocaleDateString();
	}

	formatEndDate() {
		this.endDateFormatted = new Date(this.absence.endDate).toLocaleDateString();
	}

	clear() {
		this.iddisable = false;
		this.$refs.form.reset();
	}

	cancel() {
		this.$router.push('/fetchabsence');
	}
}