import Vue from 'vue';
import { Component } from 'vue-property-decorator';

class MenuItem {
	constructor(public title: string,
		public icon: string,
		public path: string) { };
}

@Component
export default class NavMenuComponent extends Vue {
	menuItems: MenuItem[] = [
		new MenuItem('Home', 'home', '/'),
		new MenuItem('Sessions', 'today', '/fetchsession'),
		new MenuItem('Employees', 'person', '/fetchemployee'),
		new MenuItem('Teams', 'people', '/fetchteam'),
		new MenuItem('Absences', 'person_outline', '/fetchabsence'),
		new MenuItem('Roster', 'schedule', '/fetchroster'),
		new MenuItem('Admin', 'settings', '/fetchadmin')
	];

}