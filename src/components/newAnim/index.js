import { h, Component } from 'preact';
var PouchDB = require('pouchdb');

import style from './style.less';

export default class NewAnim extends Component {
	constructor(localDB) {
    super();
    this.state = {
			title: "",
			file: null
		};
		this.db = localDB.localDB;
		this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

	handleInputChange(event) {
		const target = event.target;
    const value = target.value;
    const name = target.name;

		this.setState({ [name]: value });
	}

	handleSubmit(event) {
    // alert(this.state.title + ' has been uploaded');
		event.preventDefault();
		var nonJson = false;
		var fileInput = document.getElementById('fileUpload');
		for (var file of fileInput.files) {
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
			  }
				//Get any existing document
				var existingDoc = this.db.get(fileData._id).catch(err => {
					//If it's a new file, return the new file instead of the old one.
					if(err.name === 'not_found') {
						return fileData;
					} else {
						throw err;
					}
				}).then(doc => {
						doc.atachments = fileData.attachments;
						return this.db.put(doc);
				}).then(() => {
				  //Success
				}).catch(err => {
					//New unexpected error, not 404 or 409
					console.log.bind(console);
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
