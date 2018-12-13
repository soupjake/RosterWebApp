export class SelectedDate {
	date: string;
	constructor() {
		this.date = new Date().toISOString().slice(0, 10);
	}
}