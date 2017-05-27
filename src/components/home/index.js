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
					let title = row.doc._id;
					let id = row.doc._id.replace(/ /g, "");
					let data = row.doc._attachments.filename.data;
					let jsData = {
						title: title,
						id: id,
						data: data
					};
					return jsData;
				}));
			}
			return
		}).then(arrayOfResults => {
			this.setState({files: arrayOfResults});
			return
		}).catch(console.log.bind(console));
	}

	render() {
		// console.log(this.state.files);
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
