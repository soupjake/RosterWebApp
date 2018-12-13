import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Employee } from '../../models/employee';

@Component
export default class CreateEmployeeComponent extends Vue {	
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: (value: string) => !!value || 'Required',
		number: (value: string) => /^\d+(\d{1,2})?$/.test(value) || 'Value must be number e.g. "8" or "10"',
		decimal: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Value must be decimal e.g. "8.0" or "7.5"'
	}

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

	failed: boolean = false;
	workpattern: string[] = [];
	roles: string[] = ["Manager", "Supervisor", "Agent"];
	days: string[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	createEmployee() {
		this.failed = false;
		if (this.$refs.form.validate()){
			//Get work pattern first
			this.employee.workPattern = this.workpattern.join();

			//Then send employee to backend
			fetch('api/Employee/Create', {
				method: 'POST',
				body: JSON.stringify(this.employee)
			})
				.then(response => response.json() as Promise<number>)
				.then(data => {
					if (data < 1) {
						this.failed = true;
					} else {
						this.$router.push('/fetchemployee');
					}
				})
		}
	}

	clear() {
		this.$refs.form.reset();
	}

	cancel() {
		this.$router.push('/fetchemployee');
	}
}