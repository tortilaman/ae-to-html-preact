import { h, Component } from 'preact';
let PouchDB = require('pouchdb');

import style from './style.less';

export default class AnimationList extends Component {
	constructor(localDB) {
		super();
		this.state = {
			title: "Animations",
			db: localDB.localDB
		};
		this.db = localDB.localDB;
		this.handleInputChange = this.handleInputChange.bind(this);
	}

	//TODO: Update this.
	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({ [name]: value });
	}

	handleSubmit(event) {
		// alert(this.state.title + ' has been uploaded');
		event.preventDefault();
		let nonJson = false;
		let fileInput = document.getElementById('fileUpload');
		for (let file of fileInput.files) {
			if (file.type != 'application/json') {
				alert("Non JSON file of type " + file.type + " was not uploaded");
			} else {
				var fileData = {
					_id: this.state.title,
					_attachments: {
						filename: {
				content_type: file.type,
							data: file
						}
					}
				};
				//Get any existing document
				var existingDoc = this.db.get(fileData.id).then(function(doc) {
					//File has already been uploaded
					if (existingDoc) {
						doc.atachments = fileData.attachments;
						return this.db.put(doc);
					}
					return this.db.put(fileData);
					
				}).then(() => {
					// success
				}).catch((err) => {
					console.log(err);//Not a 404 or 409
				});
			}
		}
	}

	render() {
		return (
			<div class={style.home}>
				<form onSubmit={this.handleSubmit} >
					<label for="fileTitle">Title:
						<input type="text" value={this.state.title} onChange={this.handleInputChange} name="title" id="fileTitle" />
					</label><br />
					<label for="fileUpload">File:
						<input type="file" value={this.state.file} onChange={this.handleInputChange} name="file" id="fileUpload" />
					</label><br />
					<input type="submit" value="submit" onSubmit={this.handleSubmit} />
				</form>
			</div>
		);
	}
}
