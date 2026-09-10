import * as fs from "fs";
import * as path from "path";

/**
 * Creates a valid 16-bit mono PCM WAV audio buffer.
 */
function createWavBuffer(frequency = 440, durationSeconds = 1.5, sampleRate = 44100): Buffer {
  const numSamples = Math.floor(sampleRate * durationSeconds);
  const dataSize = numSamples * 2; // 16-bit = 2 bytes per sample
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // fmt subchunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  buffer.writeUInt16LE(1, 20);  // AudioFormat (1 for PCM)
  buffer.writeUInt16LE(1, 22);  // NumChannels (1 = Mono)
  buffer.writeUInt32LE(sampleRate, 24); // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  buffer.writeUInt16LE(2, 32);  // BlockAlign (NumChannels * BitsPerSample/8)
  buffer.writeUInt16LE(16, 34); // BitsPerSample (16 bits)

  // data subchunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Generate gentle audio wave with decay envelope
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    // Harmonic pleasant chime tone with decay envelope
    const envelope = Math.exp(-t * 2.5); // natural decay
    const sample = Math.sin(2 * Math.PI * frequency * t) * 0.6 +
                   Math.sin(2 * Math.PI * frequency * 1.5 * t) * 0.25 +
                   Math.sin(2 * Math.PI * frequency * 2 * t) * 0.15;

    const int16Value = Math.floor(sample * envelope * 32767 * 0.7);
    buffer.writeInt16LE(int16Value, 44 + i * 2);
  }

  return buffer;
}

const AUDIO_DIRS = [
  "public/audio/words",
  "public/audio/phrases",
  "public/audio/sentences",
  "public/audio/numbers",
  "public/audio/dates",
];

const SAMPLE_FILES = [
  // Words
  { path: "public/audio/words/accommodation.wav", freq: 440, dur: 1.8 },
  { path: "public/audio/words/environment.wav", freq: 493.88, dur: 1.8 },
  { path: "public/audio/words/necessary.wav", freq: 523.25, dur: 1.6 },
  { path: "public/audio/words/university.wav", freq: 587.33, dur: 1.8 },
  { path: "public/audio/words/reservation.wav", freq: 659.25, dur: 1.8 },
  { path: "public/audio/words/biodiversity.wav", freq: 440, dur: 2.0 },
  { path: "public/audio/words/questionnaire.wav", freq: 523.25, dur: 1.8 },
  { path: "public/audio/words/maintenance.wav", freq: 493.88, dur: 1.8 },
  // Phrases
  { path: "public/audio/phrases/phr-near-the-railway-station.wav", freq: 440, dur: 2.5 },
  { path: "public/audio/phrases/phr-opposite-the-main-library.wav", freq: 493.88, dur: 2.5 },
  { path: "public/audio/phrases/phr-suitable-accommodation.wav", freq: 523.25, dur: 2.2 },
  { path: "public/audio/phrases/phr-paradigm-shift.wav", freq: 587.33, dur: 2.0 },
  // Sentences
  { path: "public/audio/sentences/sent-the-office-is-located-near-the-railway-station.wav", freq: 440, dur: 3.2 },
  { path: "public/audio/sentences/sent-the-university-helps-international-students-find-suitable-accommodation.wav", freq: 493.88, dur: 3.5 },
  // Numbers
  { path: "public/audio/numbers/num-cur-450-50.wav", freq: 523.25, dur: 2.2 },
  { path: "public/audio/numbers/num-07894-551203.wav", freq: 440, dur: 3.0 },
  { path: "public/audio/numbers/num-78-4-.wav", freq: 493.88, dur: 2.0 },
  { path: "public/audio/numbers/num-14-500.wav", freq: 587.33, dur: 2.0 },
  // Dates & Times
  { path: "public/audio/dates/dt-14th-october.wav", freq: 523.25, dur: 2.2 },
  { path: "public/audio/dates/dt-3rd-march-2025.wav", freq: 440, dur: 2.5 },
  { path: "public/audio/dates/tm-9-45-am.wav", freq: 587.33, dur: 2.0 },
  { path: "public/audio/dates/tm-quarter-past-ten.wav", freq: 493.88, dur: 2.2 },
];

function generateAll() {
  console.log("Generating organized sample audio directory structure...");

  for (const dir of AUDIO_DIRS) {
    const fullDir = path.join(process.cwd(), dir);
    if (!fs.existsSync(fullDir)) {
      fs.mkdirSync(fullDir, { recursive: true });
    }
  }

  for (const sample of SAMPLE_FILES) {
    const filePath = path.join(process.cwd(), sample.path);
    const wav = createWavBuffer(sample.freq, sample.dur);
    fs.writeFileSync(filePath, wav);
    console.log(`Created: ${sample.path} (${(wav.length / 1024).toFixed(1)} KB)`);
  }

  console.log(`\nSuccessfully created ${SAMPLE_FILES.length} sample audio assets in public/audio/`);
}

generateAll();
