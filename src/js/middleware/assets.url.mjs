/**
 * @file Assets
 */

import {
	base64toBlob,
	ImgSprite,
	SndBaa,
	SndSneeze,
	SndYawn
} from '../core.mjs';

/**
 * The Image Sprite (Blob URL)
 *
 * @const {string}
 */
export const ImgSpriteUrl = URL.createObjectURL(base64toBlob(ImgSprite, 'image/png'));

/**
 * Audio: Baa (Blob URL)
 *
 * @const {string}
 */
export const SndBaaUrl = URL.createObjectURL(base64toBlob(SndBaa, 'audio/mp3'));

/**
 * Audio: Sneeze (Blob URL)
 *
 * @const {string}
 */
export const SndSneezeUrl = URL.createObjectURL(base64toBlob(SndSneeze, 'audio/mp3'));

/**
 * Audio: Yawn (Blob URL)
 *
 * @const {string}
 */
export const SndYawnUrl = URL.createObjectURL(base64toBlob(SndYawn, 'audio/mp3'));
