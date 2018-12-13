import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Session } from '../../models/session';

@Component
export default class EditSessionComponent extends Vue {	
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: (value: string) => !!value || 'Required',
		number: (value: string) => /^\d+(\d{1,2})?$/.test(value) || 'Value must be number e.g. "8" or "10"',
		decimal: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Value must be decimal e.g. "8.0" or "7.5"'
	}

	session: Session = {
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

	dateFormatted = "";
	loading: boolean = false;
	failed: boolean = false;

	mounted() {
		this.loading = true;
		fetch('api/Session/GetById?id=' + this.$route.params.id)
			.then(respone => respone.json() as Promise<Session>)
			.then(data => {
				this.session = data;
				this.dateFormatted = new Date(this.session.date).toLocaleDateString();
				this.loading = false;
			});
	}

	editSession() {
		this.failed = false;
		if (this.$refs.form.validate()){
			fetch('api/Session/Update', {
				method: 'PUT',
				body: JSON.stringify(this.session)
			})
				.then(response => response.json() as Promise<number>)
				.then(data => {
					if (data < 1) {
						this.failed = true;
					} else {
						this.$router.push('/fetchsession');
					}
				})
		}
	}

	cancel() {
		this.$router.push('/fetchsession');
	}
}