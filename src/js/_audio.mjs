/**
 * @file Audio.
 */



// A baaaa noise.
export const BAA = 'data:audio/mp3;base64,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';

// A sneeze.
export const SNEEZE = 'data:audio/mp3;base64,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coVW9VPz2RnmRE0V+lim/9qqcFZUSp1ZLez617HNYECaxcNt/8qHwmmX0sKVv84QGVRrtLfwBqqd//MwxPoUUXbe/mQEdGaTtceFqTWP7yFwWlbOWxvQdB2GH/2KpinYyL/+pjaGltq6HBAX9ZVdjQ3MJBp5a0OAgCwtD4DIAeGHgE2zb7N6//NAxOkSokLvHnoErJ+ncAkGO+6vcAYiHkhNTu/fCo8i4QPNi9jL4fFQVHrP/O1HIc46UUZEUz9vpU4Qy7aunY7Oj26+EKZ5dV//+me4Uw4cccAmaWSfXY7vamqepyAoB1lkY3AGqZ7/8zDE+RQaJuL+ZAR05sdXvgO/nHwygz1jHiu13/wMNgBEji0usiBQpaZU75zNqyboloNFUyVrY9Ubpf3W5F0mOX///3RxlXrIcBtiv5P/80DE6RMpTu8eecSsf/PVdNR1maqu10A6WW9lr/AIY6SyJMqlCXuqGCCFC6jbmczezw+ljTMEYZykpOQMs7gLvYyeR+SmmqIPdFRmud1Sqe3+cYzPTU/6afu1WMcYKOmU4JOmuwy7Fv/zMMT3E5JG6x5ZRKzp/X8qjqggSkk5bW7wDEREZUMCv1iFvOvlcldr3i27JHpDnznF1TqG+ttitD9GTGEFaVHALzCgoIAoAZCmeGTRTP/zQMTpFRJC2x54xLE15+2r/+pfF+gKQRz6NyKVfsQqQpqOqAVZWGv31/ACwhHF13Mcc7vwXJo9o0tEWmIAXQ5WMN9jh1Hysm0pzGHkNotqHUot7Ms7Hzq6oVyE+d2Rs6NLn529+7uc//NAxO8VkkrjHnrEHcIA8sGBR455bHkZk+qvonyVA977NLH+AMFDIxaaNJa73s3AMk1lzFUfb96SNfFMm7bxnHbfHksmRnkGi9i0dVrtGX2P94xvB//8rU8RghzkZAjuv7QFsDd8fFP/80DE8xRiQtseeEU4Bll2WWSLcAGR7IQqNTHa2J9QJgnpp9t2qufKgyDqQu0qFUzMVnQz6Ff9aO9lViUaVbFaiUvo9ut2bl9CHVP/fal2vqUhauHoEb1obiwnP46XJYh4ZyI9tt7ttf/zMMT8FTIm3x5byoCa6yyAAAHIHFjWKjwIDkrcEHp56KrKS3CtYhGpGlqePTlktupg7WRD+3UJDRtsrobqs1ZYfPCTG9HxaDYmnqRsS//zQMToEoJC1v5YRVXm2VzTvbNk7FufYcUic1v72R1ZuvUQNlNt9a31+h5lytbTfem37J8U2vqTTFsTi9db/RzeFpLApadrav9N9W3rFR0Ks//uQpEgZKxhttQAIjwlBUFg6VBUNHgV//MwxPkU+lLPH0sQAAVDSsFQV/qBr/BVYKgqCobgqCoKv/grKgqdlQVc2JQVBWsNKBpwiBoGjxYGgoDUO0xBTUUzLjEwMFVVVVVVVVVV//NwxOYkKlay/5lgAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVX/8zDE/hD4AppfwAAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';

// A yawn.
export const YAWN = 'data:audio/mp3;base64,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';

/**
 * Get Audio
 *
 * @param {string} name Audio.
 * @return {void} Nothing.
 */
export const makeNoise = function(name) {
	/* @type {?string} */
	let file = null;

	switch (name) {
	case 'BAA':
		file = BAA;
		break;
	case 'SNEEZE':
		file = SNEEZE;
		break;
	case 'YAWN':
		file = YAWN;
		break;
	default:
		return;
	}

	/** @type {Audio} */
	const audio = new Audio(file);
	audio.play();
};
