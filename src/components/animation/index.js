import { h, Component } from 'preact';
var PouchDB = require('pouchdb');
import bodymovin from '../../lib/bodymovin.min.js';

import style from './style.less';

export default class Animation extends Component {

	componentDidMount() {
		var reader = new FileReader();
		var element = document.getElementById('icon-' + this.props.jsData.id);
		reader.readAsText(this.props.jsData.data);
		reader.onload = function(e) {
			var jsonData = JSON.parse(e.target.result);
			// var jsonData = e.target.result;
			var params = {
			  container: element, // the dom element that will contain the animation
			  renderer: 'svg',
			  loop: false,
			  autoplay: true,
			  animationData: jsonData
			}
			var anim = bodymovin.loadAnimation(params);
			anim.play();
		}
	}

	render({ jsData: { title, id, data } }) {
		return (
			<tr>
				<td>
					<h1>{title}</h1>
					<button>Play</button>
				</td>
				<td class="bm_container" id={ 'icon-container-' + id }>
					<div class="bm_inner_container" id={ 'icon-' + id }></div>
				</td>
			</tr>
		);
	}
}
