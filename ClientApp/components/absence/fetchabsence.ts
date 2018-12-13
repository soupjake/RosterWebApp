import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Absence } from '../../models/absence';
import { SelectedDate } from '../../models/selecteddate';

@Component
export default class FetchAbsenceComponent extends Vue {
	@Prop(SelectedDate) selecteddate!: SelectedDate;
	dateFormatted: string = new Date(this.selecteddate.date).toLocaleDateString();
	absences: Absence[] = [];
	loading: boolean = false;
	search: string = "";
	failed: boolean = false;
	dialog: boolean = false;
	headers: object[] = [
		{ text: 'Employee Id', value: 'employeeId' },
		{ text: 'Employee Name', value: 'employeeName' },
		{ text: 'Type', value: 'type' },
		{ text: 'Start Date', value: 'startDate' },
		{ text: 'End Date', value: 'endDate' },
		{ text: 'Hours', value: 'hours' },
	];

	selected: Absence = {
		id: 0,
		employeeId: 0,
		employeeName: "",
		type: "",
		startDate: "",
		endDate: "",
		hours: 0
	}

	mounted() {
		this.loadAbsences();
	}

	loadAbsences() {
		this.loading = true;
		this.dateFormatted = new Date(this.selecteddate.date).toLocaleDateString();
		fetch('api/Absence/GetAbsences?date=' + this.selecteddate.date)
			.then(response => response.json() as Promise<Absence[]>)
			.then(data => {
				this.absences = data;
				this.loading = false;
			});
	}

	typeColour(type: string) {
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

	dateFormat(date: string) {
		return new Date(date).toLocaleDateString();
	}

	createAbsence() {
		this.$router.push("/createabsence");
	}

	editAbsence(id: number) {
		this.$router.push("/editabsence/" + id);
	}

	openDelete(selected: Absence) {
		this.selected = selected;
		this.dialog = true;
	}

	deleteAbsence() {
		this.failed = false;
		this.dialog = false;
		fetch('api/Absence/Delete', {
			method: 'DELETE',
			body: JSON.stringify(this.selected)
		})
			.then(response => response.json() as Promise<number>)
			.then(data => {
				if (data < 1) {
					this.failed = true;
				} else {
					this.loadAbsences();
				}
			})
	}
}
