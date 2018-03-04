const utils = {

	/**
	 * @return {string}
	 */
	getUid: function() {
		return 'id-' + Math.random().toString(36).substr(2, 16);
	},

	/**
	 * @param {number} time
	 * @return {string}
	 */
	formatTime: function(time) {
		if (time < 10)
		{
			return `0${time}`;
		}
		return time;
	}
}

export default utils;