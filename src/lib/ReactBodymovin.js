import { h, Component } from 'preact';
const bodymovin = require('bodymovin/build/player/bodymovin');

class ReactBodymovin extends Component {
	componentDidMount () {
		const options = Object.assign({}, this.props.options);
		options.wrapper = this.wrapper;
		options.renderer = 'svg';

		this.anim = bodymovin.loadAnimation(options);
	}

	componentWillUnmount () {
		this.anim.destroy();
	}

	shouldComponentUpdate () {
		return false;
	}

	getAnim () {
		return this.anim;
	}

	render () {
		const storeWrapper = (el) => {
			this.wrapper = el;
		};

		// this.props.animation ? this.extAnim.play() : this.animation.play();

		return (
			<div className='react-bodymovin-container' ref={storeWrapper} />
		);
	}
}

module.exports = ReactBodymovin;
