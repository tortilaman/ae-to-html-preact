import { h, Component } from 'preact';
import { Link } from 'preact-router';
import style from './style.scss';

export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<h1>Agile Academy </h1>
			</header>
		);
	}
}
