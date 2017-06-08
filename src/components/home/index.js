import { h, Component } from 'preact';
let PouchDB = require('pouchdb');

import style from './style.less';
import NewAnim from '../newAnim';
import Animation from '../animation';



export default class Home extends Component {
	constructor() {
		super();
		this.db = new PouchDB('files');
		this.state = {
			db: "",
			files: []
		};

		this.db.allDocs({include_docs: true, attachments: true, binary: true}).then(result => {
			if (result.total_rows > 0) {
				return Promise.all(result.rows.map(row => {
					return this.readFile(row);
				}));
			}
		}).then(arrayOfResults => {
			return this.setData(arrayOfResults);
		}).catch(console.log.bind(console));

		this.addFile = this.addFile.bind(this);
	}

	/**
	 *  Update file state with actual file data.
	 *
	 *  @method setData
	 *
	 *  @param  {array} resultsArr array of objects containing titles, IDs, and Json objects.
	 */
	setData(resultsArr) {
		return Promise.all(resultsArr.map(item => {
			return this.setState((prevState) => {
				// prevState.files.push(item);
				let ind = prevState.files.findIndex(exItem => {
					return exItem.id === item.id;
				});
				if (ind >= 0) {
					prevState.files[ind] = item;
				} else {
					prevState.files.push(item);
				}
			});
		}));
	}

	/**
	 *  File Reader Promise Helper:
	 *  Converts Blobs in PouchDB to strings for use by bodymovin.
	 *  From https://gist.github.com/svnlto/5c62c0ecfcb741a5eef9
	 *
	 *  @method readFile
	 *
	 *  @param  {object} row A row from PouchDB
	 *
	 *  @return {Promise}    Fulfilled after blob converted.
	 */
	readFile(row) {
		let reader = new global.FileReader();
		let doc = row.doc ? row.doc : row;
		let file = doc._attachments.filename.data;

		return new Promise((resolve, reject) => {
			reader.onload = (event) => {
				let newFile = {
					title: doc._id,
					id: doc._id.replace(/ /g, ""),
					data: JSON.parse(event.target.result)
				};
				resolve(newFile);
			};

			reader.onerror = () => {
				return reject(this);
			};

			if (/^image/.test(file.type)) {
				reader.readAsDataURL(file);
			} else {
				reader.readAsText(file);
			}
		});
	}//End of readFile

	addFile(file) {
		console.log("Adding file to state");
		console.log(file);
		return Promise.resolve(this.readFile(file)).then( file => {
			//We're putting the file into an array here. Will cause problems if it's already an array...
			let fileArr = [file];
			this.setData(fileArr);
		});
	}

	render() {


		/*
			Changes adds other garbage, it's more work don't use it.
		 */
		// this.changes = this.db.changes({
		// 	since: 'now',
		// 	live: true,
		// 	include_docs: true,
		// 	attachments: true,
		// 	binary: true
		// }).on('change', change => {
		// 	console.log("There have been changes to the database");
		// 	console.log(change);
		// 	if (Array.isArray(change)) {
		// 		//	Need to process multiple items
		// 		//	This hasn't been tested...
		// 		return Promise.all(change.map(item => {
		// 			return this.readFile(item);
		// 		})).then(arrayOfResults => {
		// 			return this.setData(arrayOfResults);
		// 		});
		// 	} else {
		// 		return this.setState((prevState) => {
		// 			prevState.files.push(change);
		// 		});
		// 	}
		// }).on('complete', info => {
		// 	// changes() was canceled
		// }).on('error', (err) => {
		// 	console.log(err);
		// });

		return (
			<div class={style.home}>
				<h1>Animations</h1>
				<NewAnim localDB={this.db} addFile={this.addFile} />
				<table>
					{
						this.state.files ? (
							this.state.files.map( object => (
								<Animation jsData={object} />
							))
						) : null
					}
				</table>
			</div>
		);
	}
}
