/* jshint camelcase: false */

/**
	https://api.greenhouse.io/v1/boards/huge/embed/offices
	{
		"id":0,
		"name":"Office Name",
		"departments":[
			{"id":152,"name":"Business Development","jobs":[]},
			{"id":142,"name":"Client Services","jobs":[]},
			{"id":147,"name":"Content Strategy","jobs":[]},
			{"id":150,"name":"Creative","jobs":[]},
			{"id":151,"name":"Finance","jobs":[]},
			{"id":159,"name":"Huge Boutique ","jobs":[]},
			{"id":155,"name":"Huge Labs","jobs":[]},
			{"id":215,"name":"Huge Schools ","jobs":[]},
			{"id":184,"name":"Huge Studio","jobs":[]},
			{"id":143,"name":"Human Resources","jobs":[]},
			{"id":153,"name":"Internships","jobs":[]},
			{"id":154,"name":"IT","jobs":[]},
			{"id":141,"name":"Operations","jobs":[]},
			{"id":144,"name":"Product Design","jobs":[]},
			{"id":145,"name":"Program Management","jobs":[]},
			{"id":149,"name":"Strategy","jobs":[]},
			{"id":146,"name":"Technology","jobs":[]},
			{"id":148,"name":"User Experience","jobs":[]},
			{"id":0,"name":"No Department","jobs":[]}
		]
	}
*/

'use strict';

var greenhouse = {} || greenhouse;

greenhouse = {

	offices: {},

	officeMap: {
		124: 'ATPL',
		118: 'NY',
		126: 'HLPL',
		121: 'UK',
		122: 'LA',
		//22: 'NY',
		120: 'PT',
		123: 'BZ',
		125: 'SF',
		119: 'DC',
		0: '_none'
	},

	/*departmentMap: {
		'business-development': 152,
		'client-services': 142,
		'creative': 150,
		'finance': 151,
		'huge-boutique': 159,
		'huge-labs': 155,
		'huge-schools': 215,
		'huge-studio': 184,
		'human-resources': 143,
		'internshps': 153,
		'it': 154,
		'operations': 141,
		'product-design': 144,
		'program-management': 145,
		'strategy': 149,
		'technology': 146,
		'user-experience': 148
	},*/

	setDataDepartments: function (office, department, sanitizeURL) {

		// department_id is now burned into the page at render
		//var department_id = this.departmentMap[department];
		// var rev = {}
		// for (var key in this.departmentMap) {
		// 	rev[this.departmentMap[key]] = key;
		// }
		// console.log(rev);

		office = this.removeDepartmentsWithNoJobs(office);

		// Data Integrity - remove any department that we're not interested in
		for (var i = 0; i < office.length; i++) {

			var departments = office[i].departments;

			// Loop through each department in the office
			for (var dept in departments) {

				if (parseInt(dept, 10) >= 0) {

					// Doesn't match the ID, remove it
					//if (departments[dept].id !== greenhouse_department_id) {
					//
					//
					// Now using the department name matched against the sanitized URL
					//console.log(departments[dept].name, sanitizeURL(departments[dept].name));
					if (department !== sanitizeURL(departments[dept].name)) {
						delete departments[dept];
					}
					// It matches, return the jobs
					else {
						office[i].jobs = departments[dept].jobs;
						office[i].department_name = departments[dept].name;
						//office[i].department_name = rev[greenhouse_department_id];
					}

				}

			}

			// No jobs? Remove this office.
			if (office[i].jobs === undefined) {
				delete office[i];
			}

		}

		return office;

	},

	removeDepartmentsWithNoJobs: function (data) {

		// Add the shortname  to each office
		for (var office in data.offices) {

			// Don't show offices that are empty
			data.offices[office].departments = this.returnDepartmentsWithJobs(data.offices[office].departments);

			// No jobs? Delete this department
			if (data.offices[office].departments.length === 0) {
				delete data.offices[office];
				continue;
			}

			data.offices[office].shortname = this.officeMap[data.offices[office].id];

		}

		return data.offices;

	},

	returnDepartmentsWithJobs: function (departments) {

		var numJobs = 0;

		for (var department in departments) {

			// Ok, there are jobs here
			if (departments[department].jobs.length > 0) {

				// So count the jobs
				numJobs += departments[department].jobs.length;

			}
			// No jobs
			else {
				delete departments[department];
			}

		}

		departments.numjobs = numJobs;

		return departments;

	}

};