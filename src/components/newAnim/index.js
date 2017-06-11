import { h, Component } from 'preact';
// let PouchDB = require('pouchdb');

import style from './style.scss';

export default class NewAnim extends Component {
	constructor(props) {
		super();
		this.state = {
			title: "",
			file: null
		};
		this.animDb = props.localDB;
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
		event.preventDefault();
		let fileInput = document.getElementById('fileUpload');
		for (let file of fileInput.files) {
			if (file.type !== 'application/json') {
				//Not JSON
				alert("Non JSON file of type " + file.type + " was not uploaded");
			} else {
				//JSON file
				let fileData = {
					_id: this.state.title,
					_attachments: {
						filename: {
							content_type: file.type,
							data: file
						}
					}
				};
				//Get existing document
				let existingDoc = this.animDb.get(fileData._id).catch(err => {
					//If an existing file wasn't found, return the new one.
					if (err.name === 'not_found') {
						return fileData;
					}
					//Some other unexpected error
					throw err;
				}).then(doc => {
					doc._attachments = fileData._attachments;
					this.props.addFile(doc);
					return this.animDb.put(doc);
				}).then(() => {
					//Success
					this.props.close();
					return console.log("Successfully added document");
				}).catch(err => {
					//New unexpected error, not 404 or 409
					console.log(err);
					console.log.bind(console);
				});
			}
		}
	}

	render() {
		return (
			<div class={style.home}>
				<h1>New Animation</h1>
				<form onSubmit={this.handleSubmit} >
					<label for="fileTitle" class={style.input}>Title:
						<input type="text" value={this.state.title} onChange={this.handleInputChange} name="title" id="fileTitle" />
					</label>
					<label for="fileUpload" class={style.input}>File:
						<input type="file" value={this.state.file} onChange={this.handleInputChange} name="file" id="fileUpload" />
					</label>
					<input type="submit" value="submit" onSubmit={this.handleSubmit} class={style.input}/>
				</form>
			</div>
		);
	}
}
