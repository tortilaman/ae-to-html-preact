import { h, Component } from 'preact';
//Modified the component to use full bodymovin library
import ReactBodymovin from '../../lib/ReactBodymovin';

// import style from './style.scss';

export default class Animation extends Component {
	constructor() {
		super();
		this.bodyMovinAnim;
		this.handleClick = this.handleClick.bind(this);
	}

	handleClick() {
		this.bodyMovinAnim.anim.goToAndPlay(0);
		// this.props.aniamtion[this.props.ind].play();
	}

	render(props) {
		let params = {
			renderer: 'svg',
			loop: false,
			autoplay: true,
			animationData: props.jsData.data
		};
		return (
			<tr>
				<td>
					<h1>{props.jsData.title}</h1>
					<button onClick={this.handleClick}>Play</button>
				</td>
				<td class="bm_container" id={'icon-container-' + props.jsData.id}>
					<ReactBodymovin
						ref={(bodyMovin) => { this.bodyMovinAnim = bodyMovin; }}
						options={params}
					/>
				</td>
			</tr>
		);
	}
}
