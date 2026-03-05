#!/usr/bin/env node

/**
 * Script to cut silent sections from a video file with high quality.
 * Usage: node cut_silence.cjs <input> <output> [noiseLevel] [duration]
 */

const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

async function run() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node cut_silence.cjs <input> <output> [noiseLevel] [duration]');
    process.exit(1);
  }

  const [inFile, outFile, noiseLevel = '-35', duration = '0.2'] = args;

  if (!fs.existsSync(inFile)) {
    console.error(`Error: Input file not found: ${inFile}`);
    process.exit(1);
  }

  try {
    const ffmpeg = require('ffmpeg-static');
    const { silentDetect } = require('silencecut-ffmpeg');

    // Add ffmpeg to PATH
    const ffmpegDir = path.dirname(ffmpeg);
    process.env.PATH = `${ffmpegDir}${path.delimiter}${process.env.PATH}`;

    console.log(`Analyzing: ${inFile} (noiseLevel=${noiseLevel}dB, duration=${duration}s)`);
    
    const { nonSilentSections } = await silentDetect({
      file: inFile,
      noiseLevelThreshold: parseInt(noiseLevel),
      durationThreshold: parseFloat(duration),
    });

    if (nonSilentSections.length === 0) {
      console.log('No non-silent sections detected. Nothing to do.');
      return;
    }

    console.log(`Detected ${nonSilentSections.length} non-silent sections. Cutting with high quality...`);

    const select = nonSilentSections
      .map(section => {
        let start = section.start.toFixed(3).replace('.000', '');
        let end = section.end.toFixed(3).replace('.000', '');
        return `between(t,${start},${end})`;
      })
      .join('+');

    // Manually run ffmpeg with high quality settings
    // -crf 18 is visually lossless
    const ffmpegArgs = [
      '-i', inFile,
      '-vf', `select='${select}',setpts=N/FRAME_RATE/TB`,
      '-af', `aselect='${select}',asetpts=N/SR/TB`,
      '-c:v', 'libx264',
      '-crf', '18',
      '-preset', 'slow',
      '-c:a', 'aac',
      '-b:a', '192k',
      outFile,
      '-y'
    ];

    const childProcess = spawn('ffmpeg', ffmpegArgs);

    childProcess.stderr.on('data', (data) => {
      // Progress logging or silencer
      const line = data.toString();
      if (line.includes('time=')) {
        process.stdout.write(`Progress: ${line.match(/time=([\d:.]+)/)?.[1] || ''}\r`);
      }
    });

    childProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`\nSuccess: ${outFile} created.`);
      } else {
        console.error(`\nFFmpeg failed with code ${code}`);
        process.exit(1);
      }
    });

  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

run();
