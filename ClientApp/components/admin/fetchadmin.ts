import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Holiday } from '../../models/holiday';
import { Site } from '../../models/site';

@Component
export default class FetchAbsenceComponent extends Vue {
	holidays: Holiday[] = [];
	sites: Site[] = [];
	loadingHoliday: boolean = false;
	loadingSite: boolean = false;
	searchHoliday: string = "";
	searchSite: string = "";
	failed: boolean = false;
	errorMessage: string = "";
	dialog: boolean = false;
	dialogMessage: string = "";
	selectedSwitch: number = 0;
	selectedHoliday: number = 0;
	selectedSite: number = 0;

	headersHoliday: object[] = [
		{ text: 'Name', value: 'name' },
		{ text: 'Date', value: 'date' }
	];

	headersSite: object[] = [
		{ text: 'Name', value: 'name' },
		{ text: 'Times', value: 'times' }
	];

	mounted() {
		this.loadHolidays();
		this.loadSites();
	}

	loadHolidays() {
		this.loadingHoliday = true;
		fetch('api/Admin/GetHolidays')
			.then(response => response.json() as Promise<Holiday[]>)
			.then(data => {
				this.holidays = data;
				this.loadingHoliday = false;
			});
	}

	loadSites() {
		this.loadingSite = true;
		fetch('api/Admin/GetSites')
			.then(response => response.json() as Promise<Site[]>)
			.then(data => {
				this.sites = data;
				this.loadingSite = false;
			});
	}

	createHoliday() {
		this.$router.push("/createholiday");
	}

	createSite() {
		this.$router.push("/createsite");
	}

	editHoliday(id: number) {
		this.$router.push("/editholiday/" + id);
	}

	editSite(id: number) {
		this.$router.push("/editsite/" + id);
	}

	openHolidayDelete(selected: number) {
		this.selectedHoliday = selected;
		this.selectedSwitch = 0;
		this.dialogMessage = "Are you sure you want to delete this Holiday?";
		this.dialog = true;
	}

	openSiteDelete(selected: number) {
		this.selectedSite = selected;
		this.selectedSwitch = 1;
		this.dialogMessage = "Are you sure you want to delete this Site?";
		this.dialog = true;
	}

	deleteSwitch() {
		switch (this.selectedSwitch) {
			case 0:
				this.deleteHoliday();
				break;
			case 1:
				this.deleteSite();
				break;
		}
	}

	deleteHoliday() {
		this.failed = false;
		this.dialog = false;
		fetch('api/Admin/DeleteSpecialDate?id=' + this.selectedHoliday, {
			method: 'DELETE'
		})
			.then(response => response.json() as Promise<number>)
			.then(data => {
				if (data < 1) {
					this.errorMessage = "Failed to delete special date!";
					this.failed = true;
				} else {
					this.loadHolidays();
				}
			})
	}

	deleteSite() {
		this.failed = false;
		this.dialog = false;
		fetch('api/Admin/DeleteSite?id=' + this.selectedSite, {
			method: 'DELETE'
		})
			.then(response => response.json() as Promise<number>)
			.then(data => {
				if (data < 1) {
					this.errorMessage = "Failed to delete site!";
					this.failed = true;
				} else {
					this.loadSites();
				}
			})
	}
}
