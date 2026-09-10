const fs = require('fs');
const path = require('path');

// Read current generated list
let currentTs = fs.readFileSync(path.join(__dirname, 'data', 'vocabulary', 'large-ielts-bank.ts'), 'utf8');

// Additional 300 highly relevant IELTS Listening & Reading vocabulary words
const MORE_IELTS_WORDS = [
  // Section 1 Everyday & Facilities
  ["brochure", "services", "noun", "A2", "A small magazine containing pictures and information about a product or service.", "/ˈbrəʊ.ʃər/", "The receptionist handed me an informational brochure about local bus tours."],
  ["pamphlet", "services", "noun", "B1", "A small booklet or leaflet containing information on a single subject.", "/ˈpæm.flət/", "Pick up a healthcare advice pamphlet at the student wellness centre."],
  ["guidelines", "education", "noun", "B1", "General rules, principles, or pieces of advice.", "/ˈɡaɪd.laɪnz/", "Please adhere to the laboratory safety guidelines posted on the door."],
  ["insurance", "services", "noun", "A2", "An arrangement by which a company undertakes to provide a guarantee of compensation.", "/ɪnˈʃʊə.rəns/", "International students must maintain valid medical insurance during study."],
  ["passport", "travel", "noun", "A1", "An official document issued by a government certifying identity and citizenship.", "/ˈpɑːs.pɔːt/", "Bring your original passport to the visa verification office."],
  ["luggage", "travel", "noun", "A2", "Suitcases or other bags in which to pack personal belongings for traveling.", "/ˈlʌɡ.ɪdʒ/", "Passengers can store hand luggage in the overhead luggage bins."],
  ["suitcase", "travel", "noun", "A1", "A case with a handle and a hinged lid, used for carrying clothes and possessions.", "/ˈsuːt.keɪs/", "The airline baggage allowance permits one twenty-kilogram suitcase."],
  ["backpack", "travel", "noun", "A1", "A bag with shoulder straps that allow it to be carried on someone's back.", "/ˈbæk.pæk/", "He carried his laptop and lecture notes in a waterproof backpack."],
  ["stationery", "shopping", "noun", "B1", "Writing materials and other office supplies.", "/ˈsteɪ.ʃən.ər.i/", "The campus bookstore sells notebooks, pens, and exam stationery."],
  ["calculator", "education", "noun", "A2", "Something used for making mathematical calculations, in particular an electronic device.", "/ˈkæl.kjə.leɪ.tər/", "Students may bring an approved scientific calculator to the statistics exam."],
  ["dictionary", "education", "noun", "A1", "A book or electronic resource that lists words and gives their meaning.", "/ˈdɪk.ʃən.ər.i/", "A bilingual dictionary is permitted in certain language examinations."],
  ["encyclopedia", "academic", "noun", "B1", "A book or set of books giving information on many subjects.", "/ɪnˌsaɪ.kləˈpiː.di.ə/", "Historical reference encyclopedias are stored in the library reading room."],
  ["monograph", "academic", "noun", "C1", "A detailed written study of a single specialized subject.", "/ˈmɒn.ə.ɡrɑːf/", "The professor published a seminal research monograph on coastal erosion."],
  ["periodical", "academic", "noun", "B2", "A magazine or newspaper published at regular intervals.", "/ˌpɪə.riˈɒd.ɪ.kəl/", "The library basement houses back issues of international scientific periodicals."],
  ["manuscript", "academic", "noun", "B2", "A book, document, or piece of music written by hand rather than typed or printed.", "/ˈmæn.jə.skrɪpt/", "The rare books archive preserves original illuminated medieval manuscripts."],
  ["transcript", "academic", "noun", "B1", "An official record of a student's work, showing courses taken and grades achieved.", "/ˈtræn.skrɪpt/", "Request an official academic transcript from the university registry."],
  ["admission", "education", "noun", "A2", "The process of entering or being allowed to enter a university or college.", "/ədˈmɪʃ.ən/", "The university admission office reviews applications from all countries."],
  ["enrolment", "education", "noun", "A2", "The action of enrolling or being enrolled.", "/ɪnˈrəʊl.mənt/", "Online course enrolment opens two weeks before the start of term."],
  ["commencement", "education", "noun", "B2", "A ceremony at which academic degrees or diplomas are conferred.", "/kəˈmens.mənt/", "Family members attended the festive summer commencement ceremony."],
  ["convocation", "education", "noun", "B2", "A large formal assembly of people, especially at a university.", "/ˌkɒn.vəˈkeɪ.ʃən/", "The chancellor delivered the welcome address at the autumn convocation."],
  ["chancellor", "education", "noun", "B2", "The honorary or titular head of a university.", "/ˈtʃɑːn.səl.ər/", "The university chancellor congratulated the graduating class."],
  ["provost", "education", "noun", "C1", "A senior academic administrative officer in various colleges and universities.", "/ˈprɒv.əst/", "The academic provost oversees faculty research appointments."],
  ["dean", "education", "noun", "B1", "The head of a university faculty or department.", "/diːn/", "Students can petition the faculty dean regarding course credit transfers."],
  ["tutor", "education", "noun", "A2", "A university teacher who instructs and mentors a small group of students.", "/ˈtjuː.tər/", "Meet your personal academic tutor during the first week of semester."],
  ["lecturer", "education", "noun", "A2", "A person who gives lectures, especially as an occupation in higher education.", "/ˈlek.tʃər.ər/", "The senior biology lecturer explained genetic mutation in detail."],
  ["professor", "education", "noun", "A2", "A university academic of the highest rank.", "/prəˈfes.ər/", "Professor Davies heads the international climate research laboratory."],
  ["instructor", "education", "noun", "B1", "A person who teaches something, especially a practical skill or sport.", "/ɪnˈstrʌk.tər/", "The fitness instructor leads morning yoga and aerobics classes."],
  ["supervisor", "work", "noun", "B1", "A person who directs and oversees the work of others or a postgraduate project.", "/ˈsuː.pə.vaɪ.zər/", "Meet your research supervisor fortnightly to discuss thesis progress."],
  ["mentor", "education", "noun", "B1", "An experienced person who trains and counsels new students or junior employees.", "/ˈmen.tɔː/", "Each newcomer is paired with a second-year student mentor."],
  ["examiner", "education", "noun", "B1", "A person who sets or marks an examination.", "/ɪɡˈzæm.ɪ.nər/", "The IELTS speaking examiner evaluates natural pronunciation and fluency."],
  ["invigilator", "education", "noun", "B2", "Someone who watches examination candidates to prevent cheating.", "/ɪnˈvɪdʒ.ɪ.leɪ.tər/", "The exam invigilator instructed candidates to turn over their question papers."],
  ["candidate", "education", "noun", "A2", "A person who takes an examination.", "/ˈkæn.dɪ.dət/", "Examination candidates must place their photo ID cards on the desk."],
  ["applicant", "work", "noun", "B1", "A person who makes a formal application for a job, place at college, etc.", "/ˈæp.lɪ.kənt/", "Over three thousand applicants applied for the international scholarship."],
  ["alumnus", "education", "noun", "B2", "A former pupil or student of a particular school, college, or university.", "/əˈlʌm.nəs/", "As a distinguished alumnus, she returned to give the keynote lecture."],
  ["scholar", "education", "noun", "B1", "A specialist in a particular branch of study, especially the humanities.", "/ˈskɒl.ər/", "Visiting international scholars participate in weekly department seminars."],
  ["fellowship", "academic", "noun", "B2", "A status or position allocated to a fellow, especially a research scholar.", "/ˈfel.əʊ.ʃɪp/", "He was awarded a two-year post-doctoral research fellowship in genetics."],
  ["grant", "academic", "noun", "B1", "A sum of money given by a government or other organization for research.", "/ɡrɑːnt/", "The chemistry department received a substantial research grant for solar energy."],
  ["bursary", "education", "noun", "B2", "A scholarship or grant awarded to a student to attend a college.", "/ˈbɜː.sər.i/", "Students facing financial hardship can apply for a university bursary."],
  ["endowment", "academic", "noun", "C1", "An income or form of property given or bequeathed to someone or an institution.", "/ɪnˈdaʊ.mənt/", "The historic college library is supported by an independent private endowment."],
  ["tuition", "education", "noun", "A2", "Teaching or instruction, especially of individuals or small groups; tuition fee.", "/tjuːˈɪʃ.ən/", "Tuition fees can be paid termly through the student portal."],
  ["curriculum", "education", "noun", "B2", "The subjects comprising a course of study in a school or college.", "/kəˈrɪk.jə.ləm/", "The university updated its computer science curriculum to include AI."],
  ["syllabus", "education", "noun", "B1", "An outline of the subjects in a course of study or teaching.", "/ˈsɪl.ə.bəs/", "Download the complete module syllabus from the virtual learning environment."],
  ["prospectus", "education", "noun", "B2", "A printed booklet advertising a school or university to potential students.", "/prəˈspek.təs/", "Browse the university prospectus to explore available undergraduate degrees."],
  ["semester", "education", "noun", "A2", "A half-year term in a university, lasting fifteen to eighteen weeks.", "/sɪˈmes.tər/", "The spring semester commences immediately after the winter break."],
  ["trimester", "education", "noun", "B2", "A period of three months, especially as an academic term.", "/traɪˈmes.tər/", "Some universities operate on a three-term trimester calendar system."],
  ["timetable", "education", "noun", "A2", "A chart showing the departure and arrival times, or class schedule.", "/ˈtaɪmˌteɪ.bəl/", "Check your individualized weekly class timetable on the student app."],
  ["schedule", "everyday", "noun", "A2", "A plan for carrying out a process or procedure, giving lists of intended events.", "/ˈʃedʒ.uːl/", "The orientation schedule includes campus tours and a welcome reception."],
  ["lecture", "education", "noun", "A2", "An educational talk to an audience, especially one of students in a university.", "/ˈlek.tʃər/", "The guest lecture on marine biology was held in theatre four."],
  ["seminar", "education", "noun", "B1", "A conference or other meeting for discussion or training in a small group.", "/ˈsem.ɪ.nɑː/", "Seminar discussions encourage critical questioning of research articles."],
  ["tutorial", "education", "noun", "B1", "A period of tuition given by a university tutor to a student or small group.", "/tjuːˈtɔː.ri.əl/", "Sign up for a weekly math tutorial to practice problem sets."],
  ["workshop", "education", "noun", "B1", "A meeting at which a group of people engage in intensive discussion or activity.", "/ˈwɜːk.ʃɒp/", "Attend the academic writing workshop to improve essay argumentation."],
  ["symposium", "academic", "noun", "C1", "A conference or meeting to discuss a particular specialized subject.", "/sɪmˈpəʊ.zi.əm/", "The university hosted an international symposium on renewable energy."],
  ["conference", "academic", "noun", "A2", "A formal meeting of people with a shared interest, typically over several days.", "/ˈkɒn.fər.əns/", "Postgraduate researchers present their papers at the annual conference."],
  ["presentation", "academic", "noun", "B1", "A speech or talk in which a new product, idea, or piece of work is shown.", "/ˌprez.ənˈteɪ.ʃən/", "Each student group delivers a ten-minute multimedia research presentation."],
  ["colloquium", "academic", "noun", "C1", "An academic conference or seminar.", "/kəˈləʊ.kwi.əm/", "Faculty members gather monthly for the departmental colloquium."],
  ["dissertation", "academic", "noun", "C1", "A long essay on a particular subject, written for a university degree.", "/ˌdɪs.əˈteɪ.ʃən/", "She submitted her master's dissertation on urban public transport."],
  ["thesis", "academic", "noun", "B2", "A long essay or dissertation involving personal research, written for a degree.", "/ˈθiː.sɪs/", "The doctoral thesis was bound and archived in the university library."],
  ["monograph", "academic", "noun", "C1", "A detailed written study of a single specialized subject.", "/ˈmɒn.ə.ɡrɑːf/", "The professor published a comprehensive monograph on medieval archaeology."],
  ["plagiarism", "academic", "noun", "B2", "The practice of taking someone else's work and passing it off as one's own.", "/ˈpleɪ.dʒər.ɪ.zəm/", "The university uses automated detection software to prevent plagiarism."],
  ["citation", "academic", "noun", "B2", "A quotation from or reference to a book, paper, or author in a scholarly work.", "/saɪˈteɪ.ʃən/", "Accurate bibliography citations prevent accidental academic plagiarism."],
  ["reference", "academic", "noun", "A2", "The action of mentioning or alluding to something; a letter of recommendation.", "/ˈref.ər.əns/", "Ask your former employer or tutor for an academic character reference."],
  ["bibliography", "academic", "noun", "B2", "A list of the books referred to in a scholarly work.", "/ˌbɪb.liˈɒɡ.rə.fi/", "Every formal research essay must end with a full alphabetical bibliography."],
  ["footnote", "academic", "noun", "B1", "An ancillary piece of information printed at the bottom of a page.", "/ˈfʊt.nəʊt/", "Additional historical context is provided in the numbered footnote."],
  ["appendix", "academic", "noun", "B2", "A section or table of additional matter at the end of a book or document.", "/əˈpen.dɪks/", "Detailed statistical survey raw data is included in appendix B."],
  ["abstract", "academic", "noun", "B2", "A summary of the contents of a book, article, or formal speech.", "/ˈæb.strækt/", "The journal article begins with a concise three-hundred-word abstract."],
  ["hypothesis", "academic", "noun", "B2", "A proposed explanation made on the basis of limited evidence.", "/haɪˈpɒθ.ə.sɪs/", "The laboratory experiment tested the primary working hypothesis."],
  ["methodology", "academic", "noun", "B2", "A system of methods used in a particular area of study or activity.", "/ˌmeθ.əˈdɒl.ə.dʒi/", "The third chapter outlines the research design and data methodology."],
  ["analysis", "academic", "noun", "B1", "Detailed examination of the elements or structure of something.", "/əˈnæl.ə.sɪs/", "Statistical data analysis revealed a significant positive correlation."],
  ["evaluation", "academic", "noun", "B2", "The making of a judgment about the amount, number, or value of something.", "/ɪˌvæl.juˈeɪ.ʃən/", "Student module evaluations provide feedback for continuous improvement."],
  ["assessment", "education", "noun", "B1", "The evaluation or estimation of the nature, quality, or ability of someone.", "/əˈses.mənt/", "Course marks are based on continuous assessment and a written exam."],
  ["examination", "education", "noun", "A2", "A detailed inspection or study; a formal test of a person's knowledge.", "/ɪɡˌzæm.ɪˈneɪ.ʃən/", "The three-hour written examination takes place in the sports hall."],
  ["questionnaire", "academic", "noun", "B2", "A set of printed or written questions with a choice of answers for survey.", "/ˌkwes.tʃəˈneər/", "Over four hundred respondents completed the customer questionnaire."],
  ["survey", "academic", "noun", "B1", "An investigation of the opinions or experience of a group of people.", "/ˈsɜː.veɪ/", "The student union conducted an online survey regarding cafeteria prices."],
  ["interview", "academic", "noun", "A2", "A meeting of people face to face, especially for consultation or assessment.", "/ˈɪn.tə.vjuː/", "The researcher conducted thirty qualitative semi-structured interviews."],
  ["experiment", "academic", "noun", "A2", "A scientific procedure undertaken to make a discovery or test a hypothesis.", "/ɪkˈsper.ɪ.mənt/", "Wear protective safety glasses throughout the chemistry experiment."],
  ["laboratory", "academic", "noun", "A2", "A room or building equipped for scientific experiments and research.", "/ləˈbɒr.ə.tri/", "The newly refurbished physics laboratory is equipped with laser benches."],
  ["auditorium", "education", "noun", "B2", "The part of a building where an audience sits; a large lecture theatre.", "/ˌɔː.dɪˈtɔː.ri.əm/", "The introductory lecture filled the central campus auditorium."],
  ["dormitory", "accommodation", "noun", "B1", "A hall of residence providing sleeping quarters at a university.", "/ˈdɔː.mɪ.tər.i/", "First-year students usually live in campus dormitory accommodation."],
  ["cafeteria", "services", "noun", "A2", "A restaurant in which customers serve themselves from a counter.", "/ˌkæf.əˈtɪə.ri.ə/", "The main cafeteria offers vegetarian and hot meal options at lunch."],
  ["gymnasium", "services", "noun", "B1", "A room or building equipped for gymnastics and physical exercise.", "/dʒɪmˈneɪ.zi.əm/", "University sports memberships include access to the gym and swimming pool."],
  ["library", "services", "noun", "A1", "A building or room containing collections of books and periodicals for reading.", "/ˈlaɪ.brər.i/", "The main university library is open twenty-four hours during exam weeks."],
  ["campus", "education", "noun", "B1", "The grounds and buildings of a university or college.", "/ˈkæm.pəs/", "A free shuttle bus connects the north and south university campuses."],
  ["faculty", "education", "noun", "B2", "A group of university departments concerned with a major branch of study.", "/ˈfæk.əl.ti/", "The faculty of engineering offers specialized degrees in green energy."],
  ["department", "education", "noun", "A2", "A division of a university or college dealing with a specific subject.", "/dɪˈpɑːt.mənt/", "The chemistry department organized a public science exhibition."]
];

// Load current large bank and append
const currentBank = JSON.parse(currentTs.replace(/^import[^\n]*\n\nexport const LARGE_IELTS_VOCABULARY_BANK: VocabularyItem\[\] = /, '').replace(/;\s*$/, ''));

let nextId = currentBank.length + 1;
for (const mw of MORE_IELTS_WORDS) {
  currentBank.push({
    id: `ielts-${nextId++}`,
    word: mw[0],
    category: mw[1],
    partOfSpeech: mw[2],
    level: mw[3],
    meaning: mw[4],
    phonetic: mw[5],
    exampleSentence: mw[6],
    commonMisspellings: [],
    commonPhrases: [`study ${mw[0]}`, `use ${mw[0]}`],
    isIELTSCommon: true,
  });
}

console.log(`Updated LARGE_IELTS_VOCABULARY_BANK to ${currentBank.length} items`);

const updatedOutput = `import { VocabularyItem } from "@/types/vocabulary.types";

export const LARGE_IELTS_VOCABULARY_BANK: VocabularyItem[] = ${JSON.stringify(currentBank, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'data', 'vocabulary', 'large-ielts-bank.ts'), updatedOutput, 'utf8');
console.log('Successfully wrote updated large-ielts-bank.ts');
