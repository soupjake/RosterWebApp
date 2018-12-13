import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Session } from '../../models/session';
import { SelectedDate } from '../../models/selecteddate';

@Component
export default class FetchSessionComponent extends Vue {
	@Prop(SelectedDate) selecteddate!: SelectedDate;
	dateFormatted: string = new Date(this.selecteddate.date).toLocaleDateString();
	sessions: Session[] = [];
	loading: boolean = false;
	deletedialog: boolean = false;
	viewdialog: boolean = false;
	notedialog: boolean = false;
	failed: boolean = false;
	errorMessage: string = "";
	search: string = "";
	headers: object[] = [
		{ text: 'Site', value: 'site' },
		{ text: 'Time', value: 'time' },
		{ text: 'Length of Day', value: 'lod' },
		{ text: 'Staff Count', value: 'staffCount' },
	];

	selected: Session = {
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

	mounted() {
		this.loadSessions();
	}

	loadSessions() {
		this.loading = true;
		this.dateFormatted = new Date(this.selecteddate.date).toLocaleDateString();
		fetch('api/Session/GetSessions?date=' + this.selecteddate.date)
			.then(response => response.json() as Promise<Session[]>)
			.then(data => {
				this.sessions = data;
				this.loading = false;
			});
	}

	stateColour(state: number) {
		switch (state) {
			case 0:
				return 'gray';
			case 2:
				return 'red';
		}
	}

	dateFormat() {
		return new Date(this.selecteddate.date).getDate().toString();
	}

	createSession() {
		this.$router.push("/createsession");
	}

	rosterSession(id: number) {
		this.$router.push("/rostersession/" + id);
	}

	editSession(selected: Session) {
		if (selected.employees.length < 1) {
			this.$router.push("/editsession/" + selected.id);
		} else {
			this.errorMessage = "Please unroster staff before editing session!";
			this.failed = true;
		}
	}

	openNote(selected: Session) {
		this.selected = selected;
		this.notedialog = true;
	}

	openView(selected: Session) {
		this.selected = selected;
		this.viewdialog = true;
	}

	openDelete(selected: Session) {
		if (selected.employees.length < 1) {
			this.selected = selected;
			this.deletedialog = true;
		} else {
			this.errorMessage = "Please unroster staff before deleting session!";
			this.failed = true;
		}
	}

	deleteSession() {
		this.failed = false;
		this.deletedialog = false;
		fetch('api/Session/Delete?id=' + this.selected.id, {
			method: 'DELETE'
		})
			.then(response => response.json() as Promise<number>)
			.then(data => {
				if (data < 1) {
					this.errorMessage = "Failed to delete session!";
					this.failed = true;
				} else {
					this.loadSessions();
				}
			})
	}
}
