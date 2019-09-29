/**
 * @file Entry point.
 */

import { Poe } from './_poe.mjs';



// Exports to prevent mangling.
window['Poe'] = Poe;
window['Poe']['animation'] = Poe.animation;
window['Poe']['audio'] = Poe.audio;
window['Poe']['debug'] = Poe.debug;
window['Poe']['help'] = Poe.help;
window['Poe']['start'] = Poe.start;
window['Poe']['stop'] = Poe.stop;
