import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Site } from '../../models/site';

@Component
export default class EditSiteComponent extends Vue {
	$refs!: {
		form: HTMLFormElement
	}

	rules: object = {
		required: (value: string) => !!value || 'Required',
		number: (value: string) => /^\d+(\d{1,2})?$/.test(value) || 'Value must be number e.g. "8" or "10"',
		decimal: (value: string) => /^\d+(\.\d{1,2})?$/.test(value) || 'Value must be decimal e.g. "8.0" or "7.5"'
	}

	site: Site = {
		id: 0,
		name: "",
		times: "",
	}

	loading: boolean = false;
	failed: boolean = false;

	mounted() {
		this.loading = true;
		fetch('api/Admin/GetSiteById?id=' + this.$route.params.id)
			.then(respone => respone.json() as Promise<Site>)
			.then(data => {
				this.site = data;
				this.loading = false;
			});
	}

	editSite() {
		this.failed = false;
		if (this.$refs.form.validate()) {
			fetch('api/Admin/UpdateSite', {
				method: 'PUT',
				body: JSON.stringify(this.site)
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

	cancel() {
		this.$router.push('/fetchadmin');
	}
}