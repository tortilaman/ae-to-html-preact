import { h, Component } from 'preact';
//Modified the component to use full bodymovin library
import ReactBodymovin from '../../lib/ReactBodymovin';

var PouchDB = require('pouchdb');

import style from './style.less';

export default class Animation extends Component {

	render({ jsData: { title, id, data } }) {
		var params = {
			renderer: 'svg',
			loop: false,
			autoplay: true,
			animationData: data
		}
		return (
			<tr>
				<td>
					<h1>{title}</h1>
					<button>Play</button>
				</td>
				<td class="bm_container" id={ 'icon-container-' + id }>
					<ReactBodymovin options={params} />
				</td>
			</tr>
		);
	}
}
