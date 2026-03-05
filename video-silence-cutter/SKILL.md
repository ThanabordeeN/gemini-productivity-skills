---
name: video-silence-cutter
description: Automatically detects and removes silent sections from video files using FFmpeg's silencedetect filter via the silencecut-ffmpeg library. Features high-quality encoding (CRF 18) and optimized defaults for fast-paced content.
---

# Video Silence Cutter (High Quality)

This skill provides a high-fidelity workflow for removing silent intervals from video or audio files. It is optimized for "jump-cut" style editing while maintaining original visual quality.

## Features
- **High Quality Encoding**: Uses `libx264` with `-crf 18` (visually lossless) and `-preset slow`.
- **Aggressive Defaults**: Optimized for speech and fast-paced content (-35dB / 0.2s).
- **Audio Fidelity**: High-bitrate AAC audio encoding (192k).

## Prerequisites

The following npm packages must be installed in the workspace:
- `silencecut-ffmpeg`
- `ffmpeg-static`

If they are missing:
```bash
npm install silencecut-ffmpeg ffmpeg-static
```

## Workflow

Execute the bundled script to perform the cutting:

```bash
node scripts/cut_silence.cjs <input_file> <output_file> [noise_level] [duration_threshold]
```

- **input_file**: Path to the source video.
- **output_file**: Path where the processed video will be saved.
- **noise_level** (Optional): Noise floor in dB. Default is `-35` (optimized for speech).
- **duration_threshold** (Optional): Minimum duration of silence to remove in seconds. Default is `0.2` (for tight cuts).

## Troubleshooting
- **No changes seen**: Try a more aggressive noise level (e.g., `-30`) or a shorter duration (e.g., `0.1`).
- **Missing parts**: If it cuts too much, try a quieter noise level (e.g., `-45`) or a longer duration (e.g., `0.5`).
