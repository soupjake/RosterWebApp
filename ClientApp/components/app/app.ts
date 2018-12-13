import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { SelectedDate } from '../../models/selecteddate';
import { getCookie, setCookie } from 'tiny-cookie';

@Component({
	components: {
		MenuComponent: require('../navmenu/navmenu.vue.html').default
	}
})
export default class AppComponent extends Vue {
	drawer: boolean = false;
	dark: boolean = false;
	colours: string[] = ["blue", "teal", "green", "orange", "red", "pink", "purple", "indigo"];
	selecteddate: SelectedDate = new SelectedDate();

	mounted() {
		this.themeColour(Number(getCookie('ers-colour')));
		this.$vuetify.theme.error = "AF0E14";
		this.dark = getCookie('ers-dark') == 'true' ? true : false;
	}

	themeDark() {
		this.dark = !this.dark;
		setCookie('ers-dark', this.dark.toString());
	}

	themeColour(colour: number) {
		setCookie('ers-colour', colour.toString());
		switch (colour) {
			case 0:
				this.$vuetify.theme.primary = "2196F3";
				this.$vuetify.theme.accent = "82B1FF";
				break;
			case 1:
				this.$vuetify.theme.primary = "009688";
				this.$vuetify.theme.accent = "A7FFEB";
				break;
			case 2:
				this.$vuetify.theme.primary = "4CAF50";
				this.$vuetify.theme.accent = "B9F6CA";
				break;
			case 3:
				this.$vuetify.theme.primary = "FF9800";
				this.$vuetify.theme.accent = "FFD180";
				break;
			case 4:
				this.$vuetify.theme.primary = "F44336";
				this.$vuetify.theme.accent = "FF8A80";
				break;
			case 5:
				this.$vuetify.theme.primary = "E91E63";
				this.$vuetify.theme.accent = "FF80AB";
				break;
			case 6:
				this.$vuetify.theme.primary = "9C27B0";
				this.$vuetify.theme.accent = "EA80FC";
				break;
			case 7:
				this.$vuetify.theme.primary = "3F51B5";
				this.$vuetify.theme.accent = "8C9EFF";
				break;
		}
	}
}