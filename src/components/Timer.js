import EventDispatcher from './EventDispatcher';

export default class Timer extends EventDispatcher {
	/**
	 * @param {number} delay
	 */
	constructor(delay = 500) {
		super();
		/** @private {number} */
		this._keyInterval = null;
		/** @private {number} */
		this._delay = delay;
		/** @private {number} */
		this._start = 0;

		/** @private {number} */
		this._duration = null;
	}

	run() {
		this.dispatch("onstart");
		this._start = Date.now();
		this._keyInterval = setInterval(() => {
			this.dispatch("ontick");
		}, this._delay);
	}

	stop() {
		clearInterval(this._keyInterval);
		this.dispatch("onstop");
	}

	/**
	 * @return {number}
	 */
	getDuration() {
		if (!this._duration)
		{
			return (Date.now() - this._start);
		}
		return this._duration;
	}
}