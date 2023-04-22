# FLAC 1.4.2 Encoder Settings

The three embedded audio assets — baa, sneeze, and yawn — account for nearly **one third** of the overall size of `js-mate-poe.min.js`.

As such, we need to make sure we're maximizing compression during the lossless [flac](https://github.com/xiph/flac) encoding phase.

The baseline best-practice settings get us close:

```bash
flac -8epV -r8 --no-padding --no-seektable [input.wav] -o [output.flac]
```

But each source is slightly different. The following additional options have produced the smallest outputs to date:

| File | Apodization(s) | Blocksize | Result (Bytes) |
| ---- | -------------- | --------- | -------------- |
| Baa | `subdivide_tukey(32/0.9)` | `2304` | 6,806 |
| Sneeze | `subdivide_tukey(32/0.85)` + `tukey(0.55)` | `1152` | 8,115 |
| Yawn | `subdivide_tukey(32/0.9)` + `tukey(0.55)` | `4096` | 19,111 |

It required a lot of obsessive testing to reach this point, but I bet there are still a few more bytes yet to be saved.

If you're bored, have a lot of computing power, and manage to find a better combination of advanced (reference encoder) settings, please open a [pull request](https://github.com/Blobfolio/js-mate-poe/pulls)!
