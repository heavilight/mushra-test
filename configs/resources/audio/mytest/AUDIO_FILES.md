# Audio Files for mytest

Place WAV files in each subdirectory. All files must be the same sample rate and channel count as the reference.

## Required structure

```
mytest/
  speech1/
    reference.wav   ← original (unchanged) speech clip 1
    adpcm.wav       ← ADPCM-filtered version
    low.wav         ← low-quality compression output
    med.wav         ← medium-quality compression output
    high.wav        ← high-quality compression output
  speech2/          ← same five files for speech clip 2
  speech3/          ← same five files for speech clip 3
  music1/           ← same five files for music clip 1
  music2/           ← same five files for music clip 2
  music3/           ← same five files for music clip 3
```

## Tips

- Recommended clip length: 8–15 seconds (long enough to hear artefacts, short enough to not fatigue listeners).
- Use 44.1 kHz or 48 kHz, mono or stereo – just keep it consistent across all files in a trial.
- WAV format is required (webMUSHRA does not support MP3/AAC directly in the browser audio API path).
- Name each file exactly as shown above; the YAML config references these paths directly.
