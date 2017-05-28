import { h, Component } from 'preact';
var PouchDB = require('pouchdb');

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
			if(result.total_rows > 0) {
				return Promise.all(result.rows.map(row => {
					return this.readFile(row);
				}))
			}
		}).then(arrayOfResults => {
			return this.setData(arrayOfResults);
		}).catch(console.log.bind(console));
	}//End of constructor

	/**
	 *  Update file state with actual file data.
	 *
	 *  @method setData
	 *
	 *  @param  {array} resultsArr array of objects containing titles, IDs, and Json objects.
	 */
	setData(resultsArr) {
		return Promise.all(resultsArr.map(item => {
			return this.setState((prevState, props) => {
				prevState.files.push(item);
			})
		}))

		if(this.changes) this.changes.cancel();
		this.changes = db.changes({
		  since: 'now',
		  live: true,
		  include_docs: true,
			attachments: true,
			binary: true
		}).on('change', function(change) {
			console.log("There have been changes to the database");
			return Promise.all(change.map(item => {
				return this.readFile(item);
			})).then(arrayOfResults => {
				return this.setData(arrayOfResults);
			})
		}).on('complete', function(info) {
		  // changes() was canceled
		}).on('error', function (err) {
		  console.log(err);
		});
	}

	/**
	 *  Converts Blobs in PouchDB to strings for use by bodymovin..
	 *
	 *  @method readFile
	 *
	 *  @param  {object} row A row from PouchDB
	 *
	 *  @return {Promise}    Fulfilled after blob converted.
	 */
	readFile(row) {
	  let reader = new global.FileReader();
		let file = row.doc._attachments.filename.data;

	  return new Promise((resolve, reject) => {
	    reader.onload = (event) => {
	      let newFile = {
					title: row.doc._id,
					id: row.doc._id.replace(/ /g, ""),
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
	  })
	}//End of readFile



	render() {
		return (
			<div class={style.home}>
				<h1>Animations</h1>
				<NewAnim localDB={this.db} />
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
