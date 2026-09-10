import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { VERBS_500_DATA } from "../data/verbs-500";

// Read .env file directly
const envPath = path.resolve(process.cwd(), ".env");
const envText = fs.readFileSync(envPath, "utf8");
const env: Record<string, string> = {};
envText.split("\n").forEach((line) => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase URL or Key in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedVerbs() {
  console.log(`Starting to seed ${VERBS_500_DATA.length} verbs into Supabase table public.verbs...`);

  // Check current count in Supabase
  const { count: initialCount } = await supabase
    .from("verbs")
    .select("*", { count: "exact", head: true });
  console.log(`Current verbs count in Supabase: ${initialCount || 0}`);

  // Format records for public.verbs table
  const records = VERBS_500_DATA.map((v, index) => ({
    base_form: v.baseForm,
    past_form: v.pastForm,
    past_participle: v.pastParticiple,
    meaning: v.meaning,
    pronunciation: v.pronunciation || null,
    example_sentence: v.exampleSentence || null,
    example_meaning: v.pastExample ? `${v.pastExample} | ${v.pastParticipleExample}` : null,
    verb_type: v.verbType,
    difficulty: v.difficulty,
    is_common: v.isCommon,
    is_ielts_relevant: v.isIeltsRelevant,
    display_order: index + 1,
  }));

  // Clean existing or insert in batches of 50
  if ((initialCount || 0) > 0) {
    console.log("Clearing existing verbs in database to perform fresh seed...");
    const { error: delError } = await supabase.from("verbs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
    if (delError) {
      console.warn("Delete warning:", delError.message);
    }
  }

  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const { data, error } = await supabase.from("verbs").insert(batch).select("id");

    if (error) {
      console.error(`Error inserting batch ${i / BATCH_SIZE + 1}:`, error.message);
    } else {
      inserted += data?.length || batch.length;
      console.log(`Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(records.length / BATCH_SIZE)} (${inserted}/${records.length} verbs)`);
    }
  }

  // Verify final count
  const { count: finalCount } = await supabase
    .from("verbs")
    .select("*", { count: "exact", head: true });

  console.log(`\n✅ Seeding complete! Total verbs in Supabase public.verbs: ${finalCount}`);

  // Generate SQL file for Supabase SQL Editor
  generateSqlMigrationFile(records);
}

function escapeSql(str: string | null | undefined): string {
  if (str === null || str === undefined) return "NULL";
  return `'${str.replace(/'/g, "''")}'`;
}

function generateSqlMigrationFile(records: Array<{
  base_form: string;
  past_form: string;
  past_participle: string;
  meaning: string;
  pronunciation: string | null;
  example_sentence: string | null;
  example_meaning: string | null;
  verb_type: string;
  difficulty: string;
  is_common: boolean;
  is_ielts_relevant: boolean;
  display_order: number;
}>) {
  const sqlLines: string[] = [
    "-- ==============================================================================",
    "-- Supabase SQL Seed: 500+ IELTS Verbs (Phase 3 Dataset)",
    `-- Total Verbs: ${records.length}`,
    "-- ==============================================================================",
    "",
    "-- Optional: Truncate existing verbs before fresh seed",
    "-- TRUNCATE TABLE public.verbs CASCADE;",
    "",
    "INSERT INTO public.verbs (base_form, past_form, past_participle, meaning, pronunciation, example_sentence, example_meaning, verb_type, difficulty, is_common, is_ielts_relevant, display_order)",
    "VALUES",
  ];

  const valueRows = records.map((r) => {
    return `  (${escapeSql(r.base_form)}, ${escapeSql(r.past_form)}, ${escapeSql(r.past_participle)}, ${escapeSql(r.meaning)}, ${escapeSql(r.pronunciation)}, ${escapeSql(r.example_sentence)}, ${escapeSql(r.example_meaning)}, ${escapeSql(r.verb_type)}, ${escapeSql(r.difficulty)}, ${r.is_common}, ${r.is_ielts_relevant}, ${r.display_order})`;
  });

  sqlLines.push(valueRows.join(",\n") + ";");
  sqlLines.push("");

  const outputPath = path.resolve(process.cwd(), "supabase", "seed_500_verbs.sql");
  fs.writeFileSync(outputPath, sqlLines.join("\n"), "utf8");
  console.log(`📁 Generated SQL seed script: ${outputPath}`);
}

seedVerbs().catch((err) => {
  console.error("Fatal error during seeding:", err);
  process.exit(1);
});
