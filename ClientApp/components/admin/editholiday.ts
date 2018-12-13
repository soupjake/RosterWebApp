import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Holiday } from '../../models/holiday';

@Component
export default class EditHolidayComponent extends Vue {
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: (value: string) => !!value || 'Required',
		number: (value: string) => /^\d+(\d{1,2})?$/.test(value) || 'Value must be number e.g. "8" or "10"',
		decimal: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Value must be decimal e.g. "8.0" or "7.5"'
	}

	holiday: Holiday = {
		id: 0,
		name: "",
		date: ""
	}

	dateFormatted = "";
	loading: boolean = false;
	failed: boolean = false;

	mounted() {
		this.loading = true;
		fetch('api/Admin/GetHolidayById?id=' + this.$route.params.id)
			.then(respone => respone.json() as Promise<Holiday>)
			.then(data => {
				this.holiday = data;
				this.formatDate();
				this.loading = false;
			});
	}

	editHoliday() {
		this.failed = false;
		if (this.$refs.form.validate()) {
			fetch('api/Admin/UpdateHoliday', {
				method: 'PUT',
				body: JSON.stringify(this.holiday)
			})
				.then(response => response.json() as Promise<number>)
				.then(data => {
					if (data < 1) {
						this.failed = true;
					} else {
						this.$router.push('/fetchadmin');
					}
				})
		}
	}

	formatDate() {
		this.dateFormatted = new Date(this.holiday.date).toLocaleDateString();
	}

	cancel() {
		this.$router.push('/fetchadmin');
	}
}