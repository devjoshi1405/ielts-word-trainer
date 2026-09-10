import {
  LocalAudioStorageProvider,
  SupabaseAudioStorageProvider,
  AudioStorageManager,
} from "../lib/audio/storage";
import { productionAudioService } from "../lib/audio/production-audio-service";
import { formatAudioTime } from "../hooks/use-audio-player";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`[ASSERTION FAILED]: ${message}`);
  }
}

function runPhase4AudioTests() {
  console.log("==========================================================");
  console.log("   IELTS WORD TRAINER — PHASE 4 AUDIO SUBSYSTEM TESTS     ");
  console.log("==========================================================\n");

  let totalTests = 0;
  let passedTests = 0;

  function test(name: string, fn: () => void) {
    totalTests++;
    try {
      fn();
      console.log(`  ✓ [TEST ${totalTests.toString().padStart(2, "0")}]: ${name}`);
      passedTests++;
    } catch (err: any) {
      console.error(`  ✗ [TEST ${totalTests.toString().padStart(2, "0")} FAILED]: ${name}`);
      console.error(`    ${err.message}`);
      throw err;
    }
  }

  // --- PART 1: STORAGE PATH RESOLVER TESTS ---
  console.log("[PART 1] Storage Path Resolution Tests:");

  test("1. Local storage provider: word audio URL", () => {
    const provider = new LocalAudioStorageProvider();
    const url = provider.getAudioUrl("words", "accommodation");
    assert(url === "/audio/words/accommodation.wav", `Expected /audio/words/accommodation.wav, got ${url}`);
  });

  test("2. Local storage provider: phrase audio URL", () => {
    const provider = new LocalAudioStorageProvider();
    const url = provider.resolveExerciseAudioUrl("PREPOSITION_PHRASE", "near the railway station");
    assert(url === "/audio/phrases/phr-near-the-railway-station.wav", `Got ${url}`);
  });

  test("3. Local storage provider: sentence audio URL", () => {
    const provider = new LocalAudioStorageProvider();
    const url = provider.resolveExerciseAudioUrl("SENTENCE_TARGET", "The office is located near the railway station.");
    assert(url.startsWith("/audio/sentences/sent-the-office-is-located"), `Got ${url}`);
  });

  test("4. Local storage provider: currency & number audio URL", () => {
    const provider = new LocalAudioStorageProvider();
    const url = provider.resolveExerciseAudioUrl("NUMBER", "£450.50");
    assert(url === "/audio/numbers/num-cur-450-50.wav", `Got ${url}`);
  });

  test("5. Local storage provider: date audio URL", () => {
    const provider = new LocalAudioStorageProvider();
    const url = provider.resolveExerciseAudioUrl("DATE", "14th October");
    assert(url === "/audio/dates/dt-14th-october.wav", `Got ${url}`);
  });

  // --- PART 2: SUPABASE / REMOTE STORAGE ABSTRACTION ---
  console.log("\n[PART 2] Supabase & Remote Storage Abstraction Tests:");

  test("6. Supabase storage provider: resolves valid bucket public URL", () => {
    const provider = new SupabaseAudioStorageProvider({
      supabaseUrl: "https://xyzielts.supabase.co",
      bucketName: "ielts-audio",
    });
    const url = provider.getAudioUrl("words", "biodiversity");
    assert(
      url === "https://xyzielts.supabase.co/storage/v1/object/public/ielts-audio/words/biodiversity.mp3",
      `Expected Supabase CDN URL, got ${url}`
    );
  });

  test("7. AudioStorageManager: dynamic provider switching", () => {
    const manager = new AudioStorageManager();
    const localProvider = new LocalAudioStorageProvider();
    const supabaseProvider = new SupabaseAudioStorageProvider({ supabaseUrl: "https://mycdn.supabase.co" });

    manager.setProvider(localProvider);
    assert(manager.getProvider().getProviderName() === "local", "Expected local provider");
    assert(manager.getAudioUrl("words", "test") === "/audio/words/test.wav", "Expected local URL");

    manager.setProvider(supabaseProvider);
    assert(manager.getProvider().getProviderName() === "supabase", "Expected supabase provider");
    assert(manager.getAudioUrl("words", "test").includes("mycdn.supabase.co"), "Expected Supabase URL");
  });

  // --- PART 3: AUDIO SERVICE STATE MACHINE & CONTROLS ---
  console.log("\n[PART 3] Audio Service State Machine & Controls Tests:");

  test("8. Initial state values", () => {
    const state = productionAudioService.getState();
    assert(state.isPlaying === false, "isPlaying should be false initially");
    assert(state.volume === 1.0, "volume should be 1.0 initially");
    assert(state.playbackRate === 1.0, "playbackRate should be 1.0 initially");
  });

  test("9. Playback rate controls (0.5x, 0.75x, 1.0x)", () => {
    productionAudioService.setPlaybackRate(0.5);
    assert(productionAudioService.getState().playbackRate === 0.5, "Expected 0.5x");

    productionAudioService.setPlaybackRate(0.75);
    assert(productionAudioService.getState().playbackRate === 0.75, "Expected 0.75x");

    productionAudioService.setPlaybackRate(1.0);
    assert(productionAudioService.getState().playbackRate === 1.0, "Expected 1.0x");
  });

  test("10. Volume controls and mute toggling", () => {
    productionAudioService.setVolume(0.8);
    assert(productionAudioService.getState().volume === 0.8, "Volume should be 0.8");
    assert(productionAudioService.getState().isMuted === false, "isMuted should be false");

    productionAudioService.setMuted(true);
    assert(productionAudioService.getState().isMuted === true, "isMuted should be true");

    productionAudioService.setMuted(false);
    assert(productionAudioService.getState().isMuted === false, "isMuted should be false");

    productionAudioService.setVolume(1.0);
  });

  test("11. Seeking and percent progress calculation", () => {
    productionAudioService.seek(0);
    assert(productionAudioService.getState().currentTime === 0, "Current time should be 0");
  });

  test("12. Time formatting helper: formatAudioTime", () => {
    assert(formatAudioTime(0) === "0:00", "0 should format to 0:00");
    assert(formatAudioTime(65) === "1:05", "65 should format to 1:05");
    assert(formatAudioTime(180) === "3:00", "180 should format to 3:00");
  });

  test("13. State subscription listener notification", () => {
    let notified = false;
    const unsub = productionAudioService.subscribe((s) => {
      if (s) notified = true;
    });
    assert(notified, "Subscriber should be notified immediately with current state");
    unsub();
  });

  console.log("\n==========================================================");
  console.log(`   ALL ${passedTests}/${totalTests} PHASE 4 AUDIO TESTS PASSED!            `);
  console.log("==========================================================");
}

runPhase4AudioTests();
