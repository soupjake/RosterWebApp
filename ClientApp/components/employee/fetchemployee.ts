import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Employee } from '../../models/employee';
import { SelectedDate } from '../../models/selecteddate';

@Component
export default class FetchEmployeeComponent extends Vue {
	@Prop(SelectedDate) selecteddate!: SelectedDate;
	dateFormatted: string = new Date(this.selecteddate.date).toLocaleDateString();
	employees: Employee[] = [];
	date: string = "";
	loading: boolean = false;
	search: string = "";
	failed: boolean = false;
	dialog: boolean = false;
	selected: number = 0;
	headers: object[] = [
		{ text: 'Id', value: 'id' },
		{ text: 'Name', value: 'name' },
		{ text: 'Role', value: 'role' },
		{ text: 'Contract Hours', value: 'contractHours' },
		{ text: 'Work Pattern', value: 'workPattern' },
		{ text: 'Status', value: 'status' },
	];

	mounted() {
		this.loadEmployees();
	}

	loadEmployees() {
		this.loading = true;
		fetch('api/Employee/GetEmployees?date=' + this.selecteddate.date)
			.then(response => response.json() as Promise<Employee[]>)
			.then(data => {
				this.employees = data;
				this.dateFormatted = new Date(this.selecteddate.date).toLocaleDateString();
				this.loading = false;
			});
	}

	statusColour(type: string) {
		switch (type) {
			case "Day Off":
				return "LightGray";
			case "Annual Leave":
				return "Plum";
			case "Sick Leave":
				return "LightSeaGreen";
			case "Special Leave":
				return "LightCoral";
			case "Training":
				return "CornflowerBlue";
		}
	}

	createEmployee() {
		this.$router.push("/createemployee");
	}

	editEmployee(id: number) {
		this.$router.push("/editemployee/" + id);
	}

	viewEmployee(id: number) {
		this.$router.push("/viewemployee/" + id);
	}

	openDelete(selected: number) {
		this.selected = selected;
		this.dialog = true;
	}

	deleteEmployee() {
		this.failed = false;
		this.dialog = false;
		console.log(this.selected);
		fetch('api/Employee/Delete?id=' + this.selected, {
			method: 'DELETE'
		})
			.then(response => response.json() as Promise<number>)
			.then(data => {
				if (data < 1) {
					this.failed = true;
				} else {
					this.loadEmployees();
				}
			})
	}
}
