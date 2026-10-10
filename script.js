/* =========================================================================
   OpenWord v3.6 — Self-contained. No external files. ~1,400 curated words.
   ========================================================================= */

(function () {
  "use strict";

  /* =======================================================================
     GOOGLE HOMEPAGE REPLICA
     ======================================================================= */
  const gForm = document.getElementById("g-form");
  const gInput = document.getElementById("g-input");

  gForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = gInput.value.trim();
    window.location.href = q
      ? `https://www.google.com/search?q=${encodeURIComponent(q)}`
      : "https://www.google.com";
  });

  document.getElementById("g-lucky").addEventListener("click", () => {
    const q = gInput.value.trim();
    if (!q) return (window.location.href = "https://www.google.com/doodles");
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}&btnI=1`;
  });

  const SHORTCUTS = [
    { label: "YouTube",   url: "https://youtube.com",         color: "#ff0000", letter: "▶" },
    { label: "Gmail",     url: "https://mail.google.com",     color: "#ea4335", letter: "M" },
    { label: "GitHub",    url: "https://github.com",          color: "#24292e", letter: "G" },
    { label: "Reddit",    url: "https://reddit.com",          color: "#ff4500", letter: "R" },
    { label: "Wikipedia", url: "https://wikipedia.org",       color: "#333",    letter: "W" },
    { label: "Maps",      url: "https://maps.google.com",     color: "#34a853", letter: "M" },
    { label: "Drive",     url: "https://drive.google.com",    color: "#fbbc04", letter: "D" },
    { label: "Calendar",  url: "https://calendar.google.com", color: "#4285f4", letter: "C" },
  ];
  const shortcutsWrap = document.getElementById("g-shortcuts");
  SHORTCUTS.forEach((s) => {
    const a = document.createElement("a");
    a.className = "g-shortcut";
    a.href = s.url;
    a.innerHTML = `
      <span class="g-shortcut-icon" style="background:${s.color}">${s.letter}</span>
      <span class="g-shortcut-label">${s.label}</span>
    `;
    shortcutsWrap.appendChild(a);
  });
  window.addEventListener("load", () => gInput.focus());

  /* =======================================================================
     CONSTANTS
     ======================================================================= */
  const STORAGE = {
    SETTINGS: "userSettings",
    BANK: "wordBank",
    FAVS: "favourites",
    COLLAPSED: "collapsedState",
  };

  const SETUP_FLAG = "openword_setup_complete";

  const LANGUAGES = ["French", "Japanese", "Spanish"];
  const TOPICS = [
    "Food", "School", "Health", "Travel", "Business", "Technology",
    "Sports", "Music", "Nature", "Emotions", "Family", "Daily Life",
    "Shopping", "Weather", "Numbers", "Time", "Colors", "Animals",
  ];

  /* =======================================================================
     DICTIONARY — Curated, self-contained.
     Tuple schema: [word, romaji, translation, definition, pos, gender, ipa, example, exampleEn]
     ======================================================================= */
  const RAW = {
      French: {
      Food: [
        ["pain", null, "bread", "A staple food made of flour and water, baked into a loaf.", "Noun", "Masculine", "/pɛ̃/", "Le pain est encore chaud.", "The bread is still warm."],
        ["baguette", null, "baguette", "A long, narrow French loaf with a crisp crust.", "Noun", "Feminine", "/ba.ɡɛt/", "J'achète une baguette à la boulangerie.", "I buy a baguette at the bakery."],
        ["croissant", null, "croissant", "A crescent-shaped roll of leavened dough.", "Noun", "Masculine", "/kʁwa.sɑ̃/", "Le croissant est encore chaud.", "The croissant is still warm."],
        ["fromage", null, "cheese", "A dairy product made from curdled milk.", "Noun", "Masculine", "/fʁɔ.maʒ/", "J'adore le fromage français.", "I love French cheese."],
        ["beurre", null, "butter", "A soft yellow dairy product made from cream.", "Noun", "Masculine", "/bœʁ/", "Le beurre fond dans la poêle.", "The butter melts in the pan."],
        ["lait", null, "milk", "A white liquid produced by mammals for their young.", "Noun", "Masculine", "/lɛ/", "Le lait est dans le frigo.", "The milk is in the fridge."],
        ["œuf", null, "egg", "An oval reproductive body laid by birds.", "Noun", "Masculine", "/œf/", "Je mange un œuf au petit-déjeuner.", "I eat an egg at breakfast."],
        ["viande", null, "meat", "Animal flesh used as food.", "Noun", "Feminine", "/vjɑ̃d/", "Il ne mange pas de viande.", "He doesn't eat meat."],
        ["poulet", null, "chicken", "A domestic fowl kept for its eggs or meat.", "Noun", "Masculine", "/pu.lɛ/", "Le poulet rôti sent bon.", "The roasted chicken smells good."],
        ["bœuf", null, "beef", "The meat of a cow or bull.", "Noun", "Masculine", "/bœf/", "Le bœuf bourguignon est un plat traditionnel.", "Beef bourguignon is a traditional dish."],
        ["porc", null, "pork", "The meat of a pig.", "Noun", "Masculine", "/pɔʁ/", "Elle ne mange pas de porc.", "She doesn't eat pork."],
        ["poisson", null, "fish", "A cold-blooded aquatic animal with gills.", "Noun", "Masculine", "/pwa.sɔ̃/", "Le poisson est frais aujourd'hui.", "The fish is fresh today."],
        ["saumon", null, "salmon", "A large edible fish with pink flesh.", "Noun", "Masculine", "/so.mɔ̃/", "Le saumon est délicieux grillé.", "Salmon is delicious grilled."],
        ["crevette", null, "shrimp", "A small marine crustacean with long legs.", "Noun", "Feminine", "/kʁə.vɛt/", "J'adore les crevettes sautées.", "I love sautéed shrimp."],
        ["huître", null, "oyster", "An edible bivalve mollusc with a rough shell.", "Noun", "Feminine", "/ɥitʁ/", "Les huîtres sont un plat de fête.", "Oysters are a festive dish."],
        ["légume", null, "vegetable", "A plant or part of a plant used as food.", "Noun", "Masculine", "/le.ɡym/", "Mange tes légumes, s'il te plaît.", "Eat your vegetables, please."],
        ["carotte", null, "carrot", "A long orange root vegetable.", "Noun", "Feminine", "/ka.ʁɔt/", "La carotte est pleine de vitamines.", "The carrot is full of vitamins."],
        ["pomme de terre", null, "potato", "A starchy underground tuber used as a vegetable.", "Noun", "Feminine", "/pɔm də tɛʁ/", "Les pommes de terre sont cuites.", "The potatoes are cooked."],
        ["tomate", null, "tomato", "A red fruit eaten as a vegetable.", "Noun", "Feminine", "/tɔ.mat/", "La tomate est mûre.", "The tomato is ripe."],
        ["oignon", null, "onion", "A bulbous vegetable with a strong flavour.", "Noun", "Masculine", "/ɔ.ɲɔ̃/", "L'oignon fait pleurer.", "The onion makes you cry."],
        ["ail", null, "garlic", "A strong-smelling bulb used as a seasoning.", "Noun", "Masculine", "/aj/", "La recette demande de l'ail.", "The recipe calls for garlic."],
        ["salade", null, "salad / lettuce", "A cold dish of mixed raw vegetables.", "Noun", "Feminine", "/sa.lad/", "La salade est fraîche.", "The salad is fresh."],
        ["haricot", null, "bean", "An edible seed of various plants.", "Noun", "Masculine", "/a.ʁi.ko/", "Les haricots verts sont bons.", "Green beans are good."],
        ["riz", null, "rice", "A grain from a marsh grass, a staple food.", "Noun", "Masculine", "/ʁi/", "Le riz accompagne bien ce plat.", "Rice pairs well with this dish."],
        ["pâtes", null, "pasta", "An Italian food made of durum wheat dough.", "Noun", "Feminine", "/pɑt/", "Les pâtes cuisent dans l'eau.", "The pasta cooks in the water."],
        ["fruit", null, "fruit", "The sweet product of a plant containing seeds.", "Noun", "Masculine", "/fʁɥi/", "Les fruits sont mûrs.", "The fruits are ripe."],
        ["pomme", null, "apple", "A round fruit with red or green skin.", "Noun", "Feminine", "/pɔm/", "Elle mange une pomme chaque matin.", "She eats an apple every morning."],
        ["banane", null, "banana", "A long curved fruit with soft sweet flesh.", "Noun", "Feminine", "/ba.nan/", "La banane est jaune.", "The banana is yellow."],
        ["orange", null, "orange", "A round citrus fruit with thick orange skin.", "Noun", "Feminine", "/ɔ.ʁɑ̃ʒ/", "L'orange est juteuse.", "The orange is juicy."],
        ["raisin", null, "grape", "A small round fruit growing in bunches.", "Noun", "Masculine", "/ʁɛ.zɛ̃/", "Le raisin est doux.", "The grape is sweet."],
        ["fraise", null, "strawberry", "A small red fruit with tiny seeds on its surface.", "Noun", "Feminine", "/fʁɛz/", "La fraise sent bon.", "The strawberry smells good."],
        ["cerise", null, "cherry", "A small round red stone fruit.", "Noun", "Feminine", "/sə.ʁiz/", "Les cerises sont mûres.", "The cherries are ripe."],
        ["citron", null, "lemon", "A yellow citrus fruit with sour juice.", "Noun", "Masculine", "/si.tʁɔ̃/", "Le citron est acide.", "The lemon is sour."],
        ["eau", null, "water", "A clear liquid essential for life.", "Noun", "Feminine", "/o/", "Un verre d'eau, s'il vous plaît.", "A glass of water, please."],
        ["vin", null, "wine", "An alcoholic drink made from fermented grapes.", "Noun", "Masculine", "/vɛ̃/", "Ce vin vient de Bordeaux.", "This wine comes from Bordeaux."],
        ["bière", null, "beer", "An alcoholic drink made from fermented grain.", "Noun", "Feminine", "/bjɛʁ/", "Une bière fraîche, s'il vous plaît.", "A cold beer, please."],
        ["jus", null, "juice", "The liquid extracted from fruit or vegetables.", "Noun", "Masculine", "/ʒy/", "Le jus d'orange est frais.", "The orange juice is fresh."],
        ["café", null, "coffee", "A hot drink made from roasted coffee beans.", "Noun", "Masculine", "/ka.fe/", "Je bois du café le matin.", "I drink coffee in the morning."],
        ["thé", null, "tea", "A hot drink made by infusing tea leaves.", "Noun", "Masculine", "/te/", "Elle préfère le thé au café.", "She prefers tea to coffee."],
        ["sucre", null, "sugar", "A sweet crystalline substance.", "Noun", "Masculine", "/sykʁ/", "Pas de sucre, merci.", "No sugar, thank you."],
        ["sel", null, "salt", "A white crystalline mineral used as seasoning.", "Noun", "Masculine", "/sɛl/", "Ajoute un peu de sel.", "Add a little salt."],
        ["poivre", null, "pepper", "A spice made from ground peppercorns.", "Noun", "Masculine", "/pwavʁ/", "Le poivre est sur la table.", "The pepper is on the table."],
        ["huile", null, "oil", "A viscous liquid used in cooking.", "Noun", "Feminine", "/ɥil/", "L'huile d'olive est excellente.", "Olive oil is excellent."],
        ["vinaigre", null, "vinegar", "A sour liquid used as a condiment.", "Noun", "Masculine", "/vi.nɛɡʁ/", "La vinaigrette contient du vinaigre.", "Vinaigrette contains vinegar."],
        ["moutarde", null, "mustard", "A yellow condiment made from mustard seeds.", "Noun", "Feminine", "/mu.taʁd/", "La moutarde est forte.", "The mustard is strong."],
        ["mayonnaise", null, "mayonnaise", "A thick creamy sauce made from eggs and oil.", "Noun", "Feminine", "/ma.jɔ.nɛz/", "Elle aime la mayonnaise.", "She likes mayonnaise."],
        ["soupe", null, "soup", "A liquid dish made by boiling ingredients.", "Noun", "Feminine", "/sup/", "La soupe est chaude.", "The soup is hot."],
        ["entrée", null, "starter", "The first course of a meal.", "Noun", "Feminine", "/ɑ̃.tʁe/", "L'entrée est servie.", "The starter is served."],
        ["plat", null, "main course", "The main dish of a meal.", "Noun", "Masculine", "/pla/", "Le plat principal arrive.", "The main course is coming."],
        ["dessert", null, "dessert", "A sweet course served at the end of a meal.", "Noun", "Masculine", "/de.sɛʁ/", "Le dessert est servi.", "Dessert is served."],
        ["gâteau", null, "cake", "A sweet baked food made from flour and sugar.", "Noun", "Masculine", "/ɡa.to/", "Le gâteau est délicieux.", "The cake is delicious."],
        ["tarte", null, "pie / tart", "A baked dish of fruit or other filling in pastry.", "Noun", "Feminine", "/taʁt/", "La tarte aux pommes est fameuse.", "Apple tart is famous."],
        ["chocolat", null, "chocolate", "A food made from roasted cacao beans.", "Noun", "Masculine", "/ʃɔ.kɔ.la/", "Il adore le chocolat noir.", "He loves dark chocolate."],
        ["glace", null, "ice cream", "A frozen sweet food made from dairy cream.", "Noun", "Feminine", "/ɡlas/", "La glace fond vite.", "The ice cream melts fast."],
        ["restaurant", null, "restaurant", "A place where meals are prepared and served.", "Noun", "Masculine", "/ʁɛs.to.ʁɑ̃/", "Ce restaurant est bondé.", "This restaurant is packed."],
        ["cuisine", null, "kitchen", "A room for preparing food.", "Noun", "Feminine", "/kɥi.zin/", "La cuisine est propre.", "The kitchen is clean."],
        ["cuisinier", null, "cook", "A person who prepares food professionally.", "Noun", "Masculine", "/kɥi.zi.nje/", "Le cuisinier prépare le repas.", "The cook prepares the meal."],
        ["manger", null, "to eat", "To consume food.", "Verb", null, "/mɑ̃.ʒe/", "Nous allons manger.", "We are going to eat."],
        ["boire", null, "to drink", "To take liquid into the mouth.", "Verb", null, "/bwaʁ/", "Il aime boire du thé.", "He likes to drink tea."],
      ],
      School: [
        ["école", null, "school", "An institution where children are taught.", "Noun", "Feminine", "/e.kɔl/", "Mon école est près d'ici.", "My school is near here."],
        ["collège", null, "middle school", "A secondary school for younger teenagers.", "Noun", "Masculine", "/kɔ.lɛʒ/", "Il va au collège.", "He goes to middle school."],
        ["lycée", null, "high school", "A secondary school for older teenagers.", "Noun", "Masculine", "/li.se/", "Elle étudie au lycée.", "She studies at high school."],
        ["université", null, "university", "An institution of higher education.", "Noun", "Feminine", "/y.ni.vɛʁ.si.te/", "Elle étudie à l'université.", "She studies at the university."],
        ["classe", null, "class", "A group of students taught together.", "Noun", "Feminine", "/klas/", "La classe commence à huit heures.", "Class starts at eight."],
        ["salle", null, "room", "A space within a building enclosed by walls.", "Noun", "Feminine", "/sal/", "La salle est grande.", "The room is large."],
        ["professeur", null, "teacher", "A person who teaches, especially in a school.", "Noun", "Masculine", "/pʁɔ.fe.sœʁ/", "Le professeur explique la leçon.", "The teacher explains the lesson."],
        ["élève", null, "pupil", "A child at school.", "Noun", "Masculine", "/e.lɛv/", "Cet élève est studieux.", "This pupil is studious."],
        ["étudiant", null, "student", "A person studying at a university or college.", "Noun", "Masculine", "/e.ty.djɑ̃/", "Elle est une étudiante sérieuse.", "She is a serious student."],
        ["directeur", null, "headmaster", "The person in charge of a school.", "Noun", "Masculine", "/di.ʁɛk.tœʁ/", "Le directeur parle aux élèves.", "The headmaster speaks to the pupils."],
        ["livre", null, "book", "A written or printed work bound in covers.", "Noun", "Masculine", "/livʁ/", "Je lis un livre intéressant.", "I'm reading an interesting book."],
        ["cahier", null, "notebook", "A book with blank pages for writing notes.", "Noun", "Masculine", "/ka.je/", "Ouvre ton cahier, s'il te plaît.", "Open your notebook, please."],
        ["stylo", null, "pen", "An instrument for writing with ink.", "Noun", "Masculine", "/sti.lo/", "Mon stylo ne marche plus.", "My pen doesn't work anymore."],
        ["crayon", null, "pencil", "An instrument for writing or drawing.", "Noun", "Masculine", "/kʁɛ.jɔ̃/", "Puis-je emprunter ton crayon ?", "May I borrow your pencil?"],
        ["gomme", null, "eraser", "An object used to remove pencil marks.", "Noun", "Feminine", "/ɡɔm/", "La gomme est dans ma trousse.", "The eraser is in my pencil case."],
        ["règle", null, "ruler", "A straight strip used for measuring or drawing lines.", "Noun", "Feminine", "/ʁɛɡl/", "Il mesure avec une règle.", "He measures with a ruler."],
        ["trousse", null, "pencil case", "A small container for pens and pencils.", "Noun", "Feminine", "/tʁus/", "Ma trousse est neuve.", "My pencil case is new."],
        ["cartable", null, "schoolbag", "A bag for carrying school books.", "Noun", "Masculine", "/kaʁ.tabl/", "Son cartable est lourd.", "His schoolbag is heavy."],
        ["tableau", null, "blackboard", "A dark board used for writing with chalk.", "Noun", "Masculine", "/ta.blo/", "Le professeur écrit au tableau.", "The teacher writes on the board."],
        ["bureau", null, "desk", "A table used for writing or working.", "Noun", "Masculine", "/by.ʁo/", "Mon bureau est rangé.", "My desk is tidy."],
        ["chaise", null, "chair", "A seat for one person.", "Noun", "Feminine", "/ʃɛz/", "Prends une chaise.", "Take a chair."],
        ["bibliothèque", null, "library", "A building or room containing a collection of books.", "Noun", "Feminine", "/bi.bli.jɔ.tɛk/", "Je vais à la bibliothèque.", "I'm going to the library."],
        ["devoir", null, "homework", "Schoolwork assigned to be done at home.", "Noun", "Masculine", "/də.vwaʁ/", "J'ai beaucoup de devoirs ce soir.", "I have a lot of homework tonight."],
        ["leçon", null, "lesson", "A period of learning or teaching.", "Noun", "Feminine", "/lə.sɔ̃/", "La leçon est difficile.", "The lesson is difficult."],
        ["exercice", null, "exercise", "A task set to practise a skill.", "Noun", "Masculine", "/ɛɡ.zɛʁ.sis/", "L'exercice est simple.", "The exercise is simple."],
        ["examen", null, "exam", "A formal test of knowledge or ability.", "Noun", "Masculine", "/ɛɡ.za.mɛ̃/", "J'ai un examen demain matin.", "I have an exam tomorrow morning."],
        ["question", null, "question", "A sentence worded to elicit information.", "Noun", "Feminine", "/kɛs.tjɔ̃/", "Posez une question.", "Ask a question."],
        ["réponse", null, "answer", "A reply to a question.", "Noun", "Feminine", "/ʁe.pɔ̃s/", "Votre réponse est correcte.", "Your answer is correct."],
        ["note", null, "grade", "A mark indicating the quality of work.", "Noun", "Feminine", "/nɔt/", "J'ai eu une bonne note.", "I got a good grade."],
        ["matière", null, "subject", "A branch of knowledge studied.", "Noun", "Feminine", "/ma.tjɛʁ/", "Quelle est ta matière préférée ?", "What is your favourite subject?"],
        ["mathématiques", null, "mathematics", "The study of numbers and quantities.", "Noun", "Feminine", "/ma.te.ma.tik/", "J'aime les mathématiques.", "I like mathematics."],
        ["histoire", null, "history", "The study of past events.", "Noun", "Feminine", "/is.twaʁ/", "L'histoire est fascinante.", "History is fascinating."],
        ["géographie", null, "geography", "The study of the earth and its features.", "Noun", "Feminine", "/ʒe.ɔ.ɡʁa.fi/", "La géographie est utile.", "Geography is useful."],
        ["science", null, "science", "The study of the physical world.", "Noun", "Feminine", "/sjɑ̃s/", "La science explique le monde.", "Science explains the world."],
        ["langue", null, "language", "A system of communication used by a country.", "Noun", "Feminine", "/lɑ̃ɡ/", "J'apprends une nouvelle langue.", "I'm learning a new language."],
        ["français", null, "French", "The official language of France.", "Noun", "Masculine", "/fʁɑ̃.sɛ/", "J'étudie le français.", "I study French."],
        ["anglais", null, "English", "The official language of the United Kingdom.", "Noun", "Masculine", "/ɑ̃.ɡlɛ/", "Elle parle anglais.", "She speaks English."],
        ["vacances", null, "holidays", "A period of time away from work or school.", "Noun", "Feminine", "/va.kɑ̃s/", "Les vacances commencent demain.", "The holidays start tomorrow."],
        ["rentrée", null, "start of term", "The time when school begins again.", "Noun", "Feminine", "/ʁɑ̃.tʁe/", "La rentrée est en septembre.", "The start of term is in September."],
        ["année scolaire", null, "school year", "The period of the year when school is in session.", "Noun", "Feminine", "/a.ne skɔ.lɛʁ/", "L'année scolaire dure dix mois.", "The school year lasts ten months."],
        ["diplôme", null, "diploma", "A certificate awarded on completing studies.", "Noun", "Masculine", "/di.plom/", "Il reçoit son diplôme.", "He receives his diploma."],
        ["classeur", null, "binder", "A folder for keeping loose papers.", "Noun", "Masculine", "/kla.sœʁ/", "Range tes feuilles dans le classeur.", "Put your sheets in the binder."],
        ["feuille", null, "sheet of paper", "A piece of paper for writing on.", "Noun", "Feminine", "/fœj/", "Donne-moi une feuille.", "Give me a sheet of paper."],
        ["ciseaux", null, "scissors", "A cutting instrument with two blades.", "Noun", "Masculine", "/si.zo/", "Les ciseaux sont dans la trousse.", "The scissors are in the pencil case."],
        ["colle", null, "glue", "A sticky substance for joining things.", "Noun", "Feminine", "/kɔl/", "J'ai besoin de colle.", "I need glue."],
        ["craie", null, "chalk", "A soft white limestone used for writing.", "Noun", "Feminine", "/kʁɛ/", "Le professeur utilise de la craie.", "The teacher uses chalk."],
        ["entrée", null, "entrance", "A passage into a building.", "Noun", "Feminine", "/ɑ̃.tʁe/", "L'entrée est fermée.", "The entrance is closed."],
        ["sortie", null, "exit", "A passage out of a building.", "Noun", "Feminine", "/sɔʁ.ti/", "La sortie est à droite.", "The exit is on the right."],
        ["couloir", null, "corridor", "A long passage in a building.", "Noun", "Masculine", "/ku.lwaʁ/", "Le couloir est long.", "The corridor is long."],
        ["cantine", null, "canteen", "A restaurant in a school or workplace.", "Noun", "Feminine", "/kɑ̃.tin/", "Je mange à la cantine.", "I eat at the canteen."],
        ["cours", null, "lesson / class", "A period of instruction in a subject.", "Noun", "Masculine", "/kuʁ/", "Le cours commence.", "The class begins."],
        ["apprendre", null, "to learn", "To gain knowledge or skill.", "Verb", null, "/a.pʁɑ̃dʁ/", "Nous aimons apprendre.", "We like to learn."],
        ["étudier", null, "to study", "To devote time to learning.", "Verb", null, "/e.ty.dje/", "Je dois étudier.", "I must study."],
        ["réviser", null, "to revise", "To review material previously studied.", "Verb", null, "/ʁe.vi.ze/", "Elle doit réviser.", "She must revise."],
        ["lire", null, "to read", "To look at and understand written words.", "Verb", null, "/liʁ/", "Je lis chaque soir.", "I read every evening."],
        ["écrire", null, "to write", "To mark letters or words on a surface.", "Verb", null, "/e.kʁiʁ/", "Nous devons écrire une phrase.", "We must write a sentence."],
        ["écouter", null, "to listen", "To give attention to sound.", "Verb", null, "/e.ku.te/", "Écoutez attentivement.", "Listen carefully."],
        ["répéter", null, "to repeat", "To say or do something again.", "Verb", null, "/ʁe.pe.te/", "Répète la phrase.", "Repeat the sentence."],
        ["réussir", null, "to succeed", "To accomplish an aim or purpose.", "Verb", null, "/ʁe.y.siʁ/", "Elle veut réussir.", "She wants to succeed."],
      ],
      Health: [
        ["santé", null, "health", "The state of being free from illness.", "Noun", "Feminine", "/sɑ̃.te/", "La santé est la plus grande richesse.", "Health is the greatest wealth."],
        ["médecin", null, "doctor", "A person qualified to practise medicine.", "Noun", "Masculine", "/med.sɛ̃/", "Le médecin arrive bientôt.", "The doctor arrives soon."],
        ["docteur", null, "doctor", "A qualified medical practitioner.", "Noun", "Masculine", "/dɔk.tœʁ/", "Le docteur examine le patient.", "The doctor examines the patient."],
        ["infirmière", null, "nurse", "A person trained to care for the sick.", "Noun", "Feminine", "/ɛ̃.fiʁ.mjɛʁ/", "L'infirmière est très gentille.", "The nurse is very kind."],
        ["pharmacien", null, "pharmacist", "A person who prepares and sells medicines.", "Noun", "Masculine", "/faʁ.ma.sjɛ̃/", "Le pharmacien conseille le client.", "The pharmacist advises the customer."],
        ["hôpital", null, "hospital", "An institution providing medical treatment.", "Noun", "Masculine", "/ɔ.pi.tal/", "L'hôpital est à droite.", "The hospital is on the right."],
        ["clinique", null, "clinic", "A private hospital or medical centre.", "Noun", "Feminine", "/kli.nik/", "La clinique est moderne.", "The clinic is modern."],
        ["pharmacie", null, "pharmacy", "A shop where medicines are prepared and sold.", "Noun", "Feminine", "/faʁ.ma.si/", "La pharmacie est ouverte.", "The pharmacy is open."],
        ["médicament", null, "medicine", "A substance used to treat disease.", "Noun", "Masculine", "/me.di.ka.mɑ̃/", "Prenez ce médicament après le repas.", "Take this medicine after the meal."],
        ["comprimé", null, "tablet", "A small disc of compressed medicine.", "Noun", "Masculine", "/kɔ̃.pʁi.me/", "Prends un comprimé.", "Take a tablet."],
        ["sirop", null, "syrup", "A thick sweet liquid medicine.", "Noun", "Masculine", "/si.ʁo/", "Le sirop calme la toux.", "The syrup soothes the cough."],
        ["pansement", null, "bandage", "A strip of material used to cover a wound.", "Noun", "Masculine", "/pɑ̃s.mɑ̃/", "Il faut changer le pansement.", "The bandage needs changing."],
        ["vaccin", null, "vaccine", "A substance that stimulates antibody production.", "Noun", "Masculine", "/vak.sɛ̃/", "Le vaccin est recommandé.", "The vaccine is recommended."],
        ["piqûre", null, "injection", "An act of injecting medicine with a needle.", "Noun", "Feminine", "/pi.kyʁ/", "La piqûre ne fait pas mal.", "The injection doesn't hurt."],
        ["fièvre", null, "fever", "An abnormally high body temperature.", "Noun", "Feminine", "/fjɛvʁ/", "Il a de la fièvre depuis hier.", "He's had a fever since yesterday."],
        ["rhume", null, "cold", "A common viral infection of the nose and throat.", "Noun", "Masculine", "/ʁym/", "J'ai attrapé un rhume.", "I caught a cold."],
        ["grippe", null, "flu", "An infectious viral illness with fever.", "Noun", "Feminine", "/ɡʁip/", "La grippe est contagieuse.", "The flu is contagious."],
        ["toux", null, "cough", "A sudden expulsion of air from the lungs.", "Noun", "Feminine", "/tu/", "La toux persiste.", "The cough persists."],
        ["maladie", null, "illness", "A disease or period of sickness.", "Noun", "Feminine", "/ma.la.di/", "La maladie est grave.", "The illness is serious."],
        ["infection", null, "infection", "The invasion of the body by harmful organisms.", "Noun", "Feminine", "/ɛ̃.fɛk.sjɔ̃/", "L'infection doit être traitée.", "The infection must be treated."],
        ["blessure", null, "injury", "Physical harm or damage to the body.", "Noun", "Feminine", "/blɛ.syʁ/", "La blessure guérit lentement.", "The injury heals slowly."],
        ["douleur", null, "pain", "A physical suffering or discomfort.", "Noun", "Feminine", "/du.lœʁ/", "J'ai une douleur au dos.", "I have pain in my back."],
        ["tête", null, "head", "The upper part of the human body.", "Noun", "Feminine", "/tɛt/", "J'ai mal à la tête.", "I have a headache."],
        ["estomac", null, "stomach", "The internal organ in which digestion occurs.", "Noun", "Masculine", "/ɛs.tɔ.ma/", "Mon estomac gargouille.", "My stomach is rumbling."],
        ["gorge", null, "throat", "The passage from the mouth to the stomach.", "Noun", "Feminine", "/ɡɔʁʒ/", "J'ai mal à la gorge.", "I have a sore throat."],
        ["dent", null, "tooth", "A hard structure in the jaws used for biting.", "Noun", "Feminine", "/dɑ̃/", "Cette dent me fait mal.", "This tooth hurts."],
        ["dos", null, "back", "The rear surface of the human body.", "Noun", "Masculine", "/do/", "Mon dos me fait souffrir.", "My back is hurting me."],
        ["bras", null, "arm", "The upper limb of the human body.", "Noun", "Masculine", "/bʁɑ/", "Il s'est cassé le bras.", "He broke his arm."],
        ["jambe", null, "leg", "A limb used for walking.", "Noun", "Feminine", "/ʒɑ̃b/", "Elle a mal à la jambe.", "Her leg hurts."],
        ["cœur", null, "heart", "The organ that pumps blood around the body.", "Noun", "Masculine", "/kœʁ/", "Le cœur bat vite.", "The heart beats fast."],
        ["poumon", null, "lung", "The organ used for breathing.", "Noun", "Masculine", "/pu.mɔ̃/", "Fumer nuit aux poumons.", "Smoking harms the lungs."],
        ["sang", null, "blood", "The red liquid that circulates in the body.", "Noun", "Masculine", "/sɑ̃/", "Il faut faire une prise de sang.", "A blood test is needed."],
        ["os", null, "bone", "The hard tissue forming the skeleton.", "Noun", "Masculine", "/ɔs/", "L'os est cassé.", "The bone is broken."],
        ["peau", null, "skin", "The outer covering of the body.", "Noun", "Feminine", "/po/", "Sa peau est très douce.", "Her skin is very soft."],
        ["repos", null, "rest", "A state of inactivity for refreshment.", "Noun", "Masculine", "/ʁə.po/", "Il a besoin de repos.", "He needs rest."],
        ["sommeil", null, "sleep", "A natural state of rest.", "Noun", "Masculine", "/sɔ.mɛj/", "Le sommeil est important.", "Sleep is important."],
        ["fatigue", null, "tiredness", "A state of feeling tired.", "Noun", "Feminine", "/fa.tiɡ/", "La fatigue se fait sentir.", "The tiredness is setting in."],
        ["stress", null, "stress", "A state of mental or emotional strain.", "Noun", "Masculine", "/stʁɛs/", "Le stress nuit à la santé.", "Stress harms health."],
        ["régime", null, "diet", "A special course of food to lose weight.", "Noun", "Masculine", "/ʁe.ʒim/", "Elle suit un régime.", "She is on a diet."],
        ["exercice", null, "exercise", "Physical activity for health.", "Noun", "Masculine", "/ɛɡ.zɛʁ.sis/", "L'exercice est bénéfique.", "Exercise is beneficial."],
        ["sport", null, "sport", "An activity involving physical exertion.", "Noun", "Masculine", "/spɔʁ/", "Le sport est bon pour la santé.", "Sport is good for health."],
        ["sain", null, "healthy", "In good health; conducive to health.", "Adjective", null, "/sɛ̃/", "Ce repas est sain.", "This meal is healthy."],
        ["malade", null, "sick", "Affected by illness.", "Adjective", null, "/ma.lad/", "Il est malade.", "He is sick."],
        ["fatigué", null, "tired", "In need of rest or sleep.", "Adjective", null, "/fa.ti.ɡe/", "Je suis fatigué.", "I am tired."],
        ["robuste", null, "robust", "Strong and healthy; sturdy.", "Adjective", null, "/ʁɔ.byst/", "Il est robuste.", "He is robust."],
        ["faible", null, "weak", "Lacking physical strength.", "Adjective", null, "/fɛbl/", "Le patient se sent faible.", "The patient feels weak."],
        ["gravement", null, "seriously", "In a serious manner.", "Adverb", null, "/ɡʁav.mɑ̃/", "Il est gravement malade.", "He is seriously ill."],
        ["guérir", null, "to heal", "To become sound or healthy again.", "Verb", null, "/ɡe.ʁiʁ/", "La blessure va guérir.", "The injury will heal."],
        ["soigner", null, "to treat", "To give medical care to.", "Verb", null, "/swa.ɲe/", "Le médecin va le soigner.", "The doctor will treat him."],
        ["respirer", null, "to breathe", "To take air into the lungs.", "Verb", null, "/ʁɛs.pi.ʁe/", "Respirez lentement.", "Breathe slowly."],
        ["dormir", null, "to sleep", "To rest with eyes closed.", "Verb", null, "/dɔʁ.miʁ/", "Il faut bien dormir.", "You need to sleep well."],
        ["souffrir", null, "to suffer", "To experience pain or distress.", "Verb", null, "/su.fʁiʁ/", "Il souffre du dos.", "He suffers from his back."],
        ["éternuer", null, "to sneeze", "To expel air suddenly through the nose.", "Verb", null, "/e.tɛʁ.nɥe/", "Elle éternue souvent.", "She sneezes often."],
        ["tousser", null, "to cough", "To expel air from the lungs suddenly.", "Verb", null, "/tu.se/", "Le patient tousse beaucoup.", "The patient coughs a lot."],
        ["vomir", null, "to vomit", "To eject the contents of the stomach through the mouth.", "Verb", null, "/vɔ.miʁ/", "Il a vomi après le repas.", "He vomited after the meal."],
        ["prendre", null, "to take", "To consume medicine or food.", "Verb", null, "/pʁɑ̃dʁ/", "Prends tes médicaments.", "Take your medicine."],
      ],
      Travel: [
        ["voyage", null, "trip", "An act of traveling from one place to another.", "Noun", "Masculine", "/vwa.jaʒ/", "Notre voyage a été magnifique.", "Our trip was magnificent."],
        ["vacances", null, "holidays", "A period of rest away from work.", "Noun", "Feminine", "/va.kɑ̃s/", "Les vacances d'été approchent.", "Summer holidays are near."],
        ["tourisme", null, "tourism", "Traveling for pleasure.", "Noun", "Masculine", "/tu.ʁism/", "Le tourisme est important ici.", "Tourism is important here."],
        ["touriste", null, "tourist", "A person traveling for pleasure.", "Noun", "Masculine", "/tu.ʁist/", "Le touriste prend des photos.", "The tourist takes photos."],
        ["gare", null, "train station", "A place where trains stop for passengers.", "Noun", "Feminine", "/ɡaʁ/", "La gare est à dix minutes d'ici.", "The station is ten minutes away."],
        ["aéroport", null, "airport", "A complex of runways and terminals for aircraft.", "Noun", "Masculine", "/a.e.ʁɔ.pɔʁ/", "Nous allons à l'aéroport en taxi.", "We go to the airport by taxi."],
        ["port", null, "port", "A harbour where ships dock.", "Noun", "Masculine", "/pɔʁ/", "Le port est animé.", "The port is busy."],
        ["billet", null, "ticket", "A piece of paper allowing entry or travel.", "Noun", "Masculine", "/bi.jɛ/", "J'ai acheté un billet de train.", "I bought a train ticket."],
        ["réservation", null, "reservation", "An arrangement to have something kept for you.", "Noun", "Feminine", "/ʁe.zɛʁ.va.sjɔ̃/", "J'ai fait une réservation.", "I made a reservation."],
        ["passeport", null, "passport", "An official document for international travel.", "Noun", "Masculine", "/pas.pɔʁ/", "N'oublie pas ton passeport.", "Don't forget your passport."],
        ["visa", null, "visa", "An endorsement allowing entry to a country.", "Noun", "Masculine", "/vi.za/", "Il faut un visa pour ce pays.", "You need a visa for this country."],
        ["bagage", null, "luggage", "Personal belongings packed for a journey.", "Noun", "Masculine", "/ba.ɡaʒ/", "Récupérez vos bagages.", "Collect your luggage."],
        ["valise", null, "suitcase", "A rectangular bag for carrying clothes while traveling.", "Noun", "Feminine", "/va.liz/", "Ma valise est trop lourde.", "My suitcase is too heavy."],
        ["sac", null, "bag", "A flexible container with a handle.", "Noun", "Masculine", "/sak/", "Mon sac est plein.", "My bag is full."],
        ["avion", null, "airplane", "A powered flying vehicle with fixed wings.", "Noun", "Masculine", "/a.vjɔ̃/", "L'avion décolle à midi.", "The plane takes off at noon."],
        ["train", null, "train", "A series of railway carriages pulled by a locomotive.", "Noun", "Masculine", "/tʁɛ̃/", "Le train arrive à huit heures.", "The train arrives at eight."],
        ["métro", null, "subway", "An underground railway system in a city.", "Noun", "Masculine", "/me.tʁo/", "Le métro est rapide.", "The subway is fast."],
        ["bus", null, "bus", "A large road vehicle for carrying passengers.", "Noun", "Masculine", "/bys/", "Le bus est en retard.", "The bus is late."],
        ["voiture", null, "car", "A road vehicle with four wheels and an engine.", "Noun", "Feminine", "/vwa.tyʁ/", "Ma voiture est garée là-bas.", "My car is parked over there."],
        ["taxi", null, "taxi", "A car with a driver for hire.", "Noun", "Masculine", "/tak.si/", "Prenons un taxi.", "Let's take a taxi."],
        ["vélo", null, "bicycle", "A vehicle with two wheels propelled by pedals.", "Noun", "Masculine", "/ve.lo/", "Je loue un vélo.", "I'm renting a bicycle."],
        ["bateau", null, "boat", "A vessel for traveling on water.", "Noun", "Masculine", "/ba.to/", "Le bateau quitte le port.", "The boat leaves the port."],
        ["hôtel", null, "hotel", "An establishment providing accommodation.", "Noun", "Masculine", "/o.tɛl/", "Nous dormons à l'hôtel ce soir.", "We're sleeping at the hotel tonight."],
        ["auberge", null, "inn", "A small hotel or place to stay.", "Noun", "Feminine", "/o.bɛʁʒ/", "L'auberge est charmante.", "The inn is charming."],
        ["chambre", null, "room", "A space within a building for sleeping.", "Noun", "Feminine", "/ʃɑ̃bʁ/", "La chambre est propre.", "The room is clean."],
        ["clé", null, "key", "A small metal object for opening a lock.", "Noun", "Feminine", "/kle/", "Voici la clé de la chambre.", "Here is the room key."],
        ["carte", null, "map", "A diagrammatic representation of an area.", "Noun", "Feminine", "/kaʁt/", "Regarde la carte, on est perdus.", "Look at the map, we're lost."],
        ["plan", null, "map / plan", "A detailed diagram of a place or route.", "Noun", "Masculine", "/plɑ̃/", "Le plan de la ville est utile.", "The city map is useful."],
        ["boussole", null, "compass", "An instrument for finding direction.", "Noun", "Feminine", "/bu.sɔl/", "La boussole indique le nord.", "The compass points north."],
        ["plage", null, "beach", "A pebbly or sandy shore by the sea.", "Noun", "Feminine", "/plaʒ/", "La plage est magnifique.", "The beach is magnificent."],
        ["montagne", null, "mountain", "A large natural elevation of the earth's surface.", "Noun", "Feminine", "/mɔ̃.taɲ/", "Nous grimpons la montagne.", "We're climbing the mountain."],
        ["ville", null, "city", "A large human settlement.", "Noun", "Feminine", "/vil/", "Cette ville est animée.", "This city is lively."],
        ["village", null, "village", "A small community in a rural area.", "Noun", "Masculine", "/vi.laʒ/", "Le village est tranquille.", "The village is quiet."],
        ["musée", null, "museum", "A building in which objects of interest are displayed.", "Noun", "Masculine", "/my.ze/", "Le musée est fermé le lundi.", "The museum is closed on Mondays."],
        ["monument", null, "monument", "A structure erected to commemorate a person or event.", "Noun", "Masculine", "/mɔ.ny.mɑ̃/", "Ce monument est célèbre.", "This monument is famous."],
        ["église", null, "church", "A building used for Christian worship.", "Noun", "Feminine", "/e.ɡliz/", "L'église est ancienne.", "The church is old."],
        ["cathédrale", null, "cathedral", "The principal church of a diocese.", "Noun", "Feminine", "/ka.te.dʁal/", "La cathédrale est immense.", "The cathedral is immense."],
        ["château", null, "castle", "A large fortified building or mansion.", "Noun", "Masculine", "/ʃa.to/", "Le château est magnifique.", "The castle is magnificent."],
        ["restaurant", null, "restaurant", "A place where meals are prepared and served.", "Noun", "Masculine", "/ʁɛs.tɔ.ʁɑ̃/", "Ce restaurant est bondé.", "This restaurant is packed."],
        ["rue", null, "street", "A public road in a town or city.", "Noun", "Feminine", "/ʁy/", "Cette rue est piétonne.", "This street is pedestrian."],
        ["route", null, "road", "A wide way leading from one place to another.", "Noun", "Feminine", "/ʁut/", "La route est longue.", "The road is long."],
        ["autoroute", null, "highway", "A main road for fast traffic.", "Noun", "Feminine", "/ɔ.tɔ.ʁut/", "L'autoroute est chargée.", "The highway is busy."],
        ["pont", null, "bridge", "A structure carrying a road over a river.", "Noun", "Masculine", "/pɔ̃/", "Le pont est ancien.", "The bridge is old."],
        ["frontière", null, "border", "A line separating two countries.", "Noun", "Feminine", "/fʁɔ̃.tjɛʁ/", "Nous traversons la frontière.", "We cross the border."],
        ["douane", null, "customs", "The official department that administers duties on imports.", "Noun", "Feminine", "/dwan/", "Nous passons la douane.", "We're going through customs."],
        ["étranger", null, "abroad / foreigner", "A foreign country or a person from one.", "Noun", "Masculine", "/e.tʁɑ̃.ʒe/", "Il voyage à l'étranger.", "He travels abroad."],
        ["partir", null, "to leave", "To go away from a place.", "Verb", null, "/paʁ.tiʁ/", "Nous devons partir.", "We must leave."],
        ["arriver", null, "to arrive", "To reach a destination.", "Verb", null, "/a.ʁi.ve/", "Nous allons arriver demain.", "We will arrive tomorrow."],
        ["voyager", null, "to travel", "To go from one place to another.", "Verb", null, "/vwa.ja.ʒe/", "Nous aimons voyager.", "We like to travel."],
        ["visiter", null, "to visit", "To go to see a place or person.", "Verb", null, "/vi.zi.te/", "Nous allons visiter Rome.", "We are going to visit Rome."],
        ["réserver", null, "to book", "To arrange for something in advance.", "Verb", null, "/ʁe.zɛʁ.ve/", "Je vais réserver une chambre.", "I will book a room."],
        ["explorer", null, "to explore", "To travel through an area to learn about it.", "Verb", null, "/ɛks.plɔ.ʁe/", "Nous voulons explorer la ville.", "We want to explore the city."],
        ["découvrir", null, "to discover", "To find something for the first time.", "Verb", null, "/de.ku.vʁiʁ/", "J'aime découvrir de nouvelles cultures.", "I love discovering new cultures."],
        ["conduire", null, "to drive", "To operate a motor vehicle.", "Verb", null, "/kɔ̃.dɥiʁ/", "Elle sait conduire.", "She knows how to drive."],
        ["voler", null, "to fly", "To move through the air.", "Verb", null, "/vɔ.le/", "Nous allons voler demain.", "We are going to fly tomorrow."],
        ["naviguer", null, "to navigate", "To plan and direct the course of a ship or aircraft.", "Verb", null, "/na.vi.ɡe/", "Il sait naviguer.", "He knows how to navigate."],
        ["se promener", null, "to stroll", "To walk in a leisurely way.", "Verb", null, "/sə pʁɔ.mə.ne/", "Nous aimons nous promener.", "We like to stroll."],
      ],
      Business: [
        ["entreprise", null, "company", "A commercial business.", "Noun", "Feminine", "/ɑ̃.tʁə.pʁiz/", "Il dirige une entreprise.", "He runs a company."],
        ["société", null, "corporation", "A commercial organization.", "Noun", "Feminine", "/sɔ.sje.te/", "La société est cotée en bourse.", "The corporation is publicly traded."],
        ["compagnie", null, "company", "A commercial business or firm.", "Noun", "Feminine", "/kɔ̃.pa.ɲi/", "La compagnie aérienne annule le vol.", "The airline cancels the flight."],
        ["bureau", null, "office", "A room or building used for work.", "Noun", "Masculine", "/by.ʁo/", "Mon bureau est au troisième étage.", "My office is on the third floor."],
        ["patron", null, "boss", "A person in charge of others at work.", "Noun", "Masculine", "/pa.tʁɔ̃/", "Le patron est en réunion.", "The boss is in a meeting."],
        ["directeur", null, "director", "A person who manages an organization.", "Noun", "Masculine", "/di.ʁɛk.tœʁ/", "Le directeur annonce les résultats.", "The director announces the results."],
        ["employé", null, "employee", "A person who is paid to work for someone.", "Noun", "Masculine", "/ɑ̃.plwa.je/", "Les employés sont contents.", "The employees are happy."],
        ["collègue", null, "colleague", "A person with whom one works.", "Noun", "Masculine", "/kɔ.lɛɡ/", "Mon collègue est sympathique.", "My colleague is friendly."],
        ["client", null, "client", "A person using the services of a professional.", "Noun", "Masculine", "/kli.jɑ̃/", "Le client est satisfait.", "The client is satisfied."],
        ["fournisseur", null, "supplier", "A company that provides goods or services.", "Noun", "Masculine", "/fuʁ.ni.sœʁ/", "Le fournisseur livre demain.", "The supplier delivers tomorrow."],
        ["partenaire", null, "partner", "A person or organization that shares an activity.", "Noun", "Masculine", "/paʁ.tə.nɛʁ/", "Notre partenaire est en Europe.", "Our partner is in Europe."],
        ["concurrent", null, "competitor", "A rival in business or sport.", "Noun", "Masculine", "/kɔ̃.ky.ʁɑ̃/", "Le concurrent baisse ses prix.", "The competitor lowers prices."],
        ["marché", null, "market", "The trade in a particular commodity.", "Noun", "Masculine", "/maʁ.ʃe/", "Le marché est en croissance.", "The market is growing."],
        ["produit", null, "product", "An article or substance manufactured for sale.", "Noun", "Masculine", "/pʁɔ.dɥi/", "Le produit se vend bien.", "The product sells well."],
        ["service", null, "service", "Work done for a customer or company.", "Noun", "Masculine", "/sɛʁ.vis/", "Le service client est ouvert.", "Customer service is open."],
        ["vente", null, "sale", "The exchange of goods for money.", "Noun", "Feminine", "/vɑ̃t/", "La vente est conclue.", "The sale is closed."],
        ["achat", null, "purchase", "The act of buying something.", "Noun", "Masculine", "/a.ʃa/", "L'achat est confirmé.", "The purchase is confirmed."],
        ["prix", null, "price", "The amount of money expected for something.", "Noun", "Masculine", "/pʁi/", "Le prix est raisonnable.", "The price is reasonable."],
        ["coût", null, "cost", "The amount that must be paid to produce something.", "Noun", "Masculine", "/ku/", "Le coût augmente.", "The cost is rising."],
        ["facture", null, "invoice", "A list of goods sent with amounts owed.", "Noun", "Feminine", "/fak.tyʁ/", "La facture est dans l'enveloppe.", "The invoice is in the envelope."],
        ["devis", null, "quote", "An estimate of the cost of work.", "Noun", "Masculine", "/də.vi/", "Le devis est prêt.", "The quote is ready."],
        ["contrat", null, "contract", "A written or spoken agreement.", "Noun", "Masculine", "/kɔ̃.tʁa/", "Le contrat est signé.", "The contract is signed."],
        ["accord", null, "agreement", "A negotiated arrangement.", "Noun", "Masculine", "/a.kɔʁ/", "Nous avons un accord.", "We have an agreement."],
        ["négociation", null, "negotiation", "Discussion aimed at reaching an agreement.", "Noun", "Feminine", "/ne.ɡɔ.sja.sjɔ̃/", "La négociation avance.", "The negotiation is progressing."],
        ["réunion", null, "meeting", "A gathering of people for discussion.", "Noun", "Feminine", "/ʁe.y.njɔ̃/", "La réunion est importante.", "The meeting is important."],
        ["conférence", null, "conference", "A formal meeting for discussion.", "Noun", "Feminine", "/kɔ̃.fe.ʁɑ̃s/", "La conférence est en ligne.", "The conference is online."],
        ["présentation", null, "presentation", "A demonstration or explanation of something.", "Noun", "Feminine", "/pʁe.zɑ̃.ta.sjɔ̃/", "Sa présentation est claire.", "Her presentation is clear."],
        ["projet", null, "project", "An individual or collaborative enterprise.", "Noun", "Masculine", "/pʁɔ.ʒɛ/", "Le projet avance.", "The project is progressing."],
        ["plan", null, "plan", "A detailed proposal for doing or achieving something.", "Noun", "Masculine", "/plɑ̃/", "Le plan est approuvé.", "The plan is approved."],
        ["objectif", null, "objective", "A goal or aim.", "Noun", "Masculine", "/ɔb.ʒɛk.tif/", "Nous atteignons notre objectif.", "We reach our objective."],
        ["stratégie", null, "strategy", "A plan of action to achieve a goal.", "Noun", "Feminine", "/stʁa.te.ʒi/", "La stratégie doit changer.", "The strategy must change."],
        ["budget", null, "budget", "An estimate of income and expenditure.", "Noun", "Masculine", "/byd.ʒɛ/", "Le budget est limité.", "The budget is limited."],
        ["salaire", null, "salary", "A fixed regular payment for work.", "Noun", "Masculine", "/sa.lɛʁ/", "Son salaire augmente.", "His salary increases."],
        ["prime", null, "bonus", "An extra payment for good performance.", "Noun", "Feminine", "/pʁim/", "Elle reçoit une prime.", "She receives a bonus."],
        ["impôt", null, "tax", "A compulsory contribution to the state.", "Noun", "Masculine", "/ɛ̃.po/", "Il faut payer les impôts.", "Taxes must be paid."],
        ["banque", null, "bank", "An institution for keeping and lending money.", "Noun", "Feminine", "/bɑ̃k/", "La banque ouvre à neuf heures.", "The bank opens at nine."],
        ["argent", null, "money", "A medium of exchange in the form of coins or notes.", "Noun", "Masculine", "/aʁ.ʒɑ̃/", "L'argent est important.", "Money is important."],
        ["investissement", null, "investment", "Money put into something to gain profit.", "Noun", "Masculine", "/ɛ̃.vɛs.tis.mɑ̃/", "L'investissement est rentable.", "The investment is profitable."],
        ["bénéfice", null, "profit", "Financial gain.", "Noun", "Masculine", "/be.ne.fis/", "Le bénéfice augmente.", "The profit increases."],
        ["perte", null, "loss", "Money lost in a transaction.", "Noun", "Feminine", "/pɛʁt/", "L'entreprise a subi une perte.", "The company suffered a loss."],
        ["chiffre d'affaires", null, "revenue", "The total amount of money a company receives.", "Noun", "Masculine", "/ʃifʁ da.fɛʁ/", "Le chiffre d'affaires progresse.", "Revenue is growing."],
        ["croissance", null, "growth", "The process of increasing in size or value.", "Noun", "Feminine", "/kʁwa.sɑ̃s/", "La croissance est forte.", "The growth is strong."],
        ["crise", null, "crisis", "A time of intense difficulty or danger.", "Noun", "Feminine", "/kʁiz/", "La crise économique est grave.", "The economic crisis is serious."],
        ["faillite", null, "bankruptcy", "Legal status of a company unable to pay debts.", "Noun", "Feminine", "/fa.jit/", "L'entreprise est en faillite.", "The company is bankrupt."],
        ["succès", null, "success", "The accomplishment of an aim.", "Noun", "Masculine", "/syk.sɛ/", "Le succès est mérité.", "The success is deserved."],
        ["échec", null, "failure", "A lack of success.", "Noun", "Masculine", "/e.ʃɛk/", "L'échec est difficile.", "Failure is hard."],
        ["employé", null, "employed", "Having paid work.", "Adjective", null, "/ɑ̃.plwa.je/", "Elle est bien employée.", "She is well employed."],
        ["chômeur", null, "unemployed", "Without a job.", "Adjective", null, "/ʃo.mœʁ/", "Il est au chômage.", "He is unemployed."],
        ["travailler", null, "to work", "To perform a job.", "Verb", null, "/tʁa.va.je/", "Nous devons travailler.", "We must work."],
        ["vendre", null, "to sell", "To give something in exchange for money.", "Verb", null, "/vɑ̃dʁ/", "Nous devons vendre.", "We must sell."],
        ["acheter", null, "to buy", "To obtain in exchange for payment.", "Verb", null, "/aʃ.te/", "L'entreprise veut acheter.", "The company wants to buy."],
        ["négocier", null, "to negotiate", "To discuss to reach an agreement.", "Verb", null, "/ne.ɡɔ.sje/", "Ils vont négocier.", "They are going to negotiate."],
        ["investir", null, "to invest", "To put money into something to gain profit.", "Verb", null, "/ɛ̃.vɛs.tiʁ/", "Ils veulent investir.", "They want to invest."],
        ["embaucher", null, "to hire", "To employ someone for wages.", "Verb", null, "/ɑ̃.bo.ʃe/", "L'entreprise veut embaucher.", "The company wants to hire."],
        ["licencier", null, "to lay off", "To dismiss an employee.", "Verb", null, "/li.sɑ̃.sje/", "L'entreprise doit licencier.", "The company must lay off."],
        ["diriger", null, "to manage", "To be in charge of.", "Verb", null, "/di.ʁi.ʒe/", "Elle dirige une équipe.", "She manages a team."],
        ["planifier", null, "to plan", "To decide on and arrange in advance.", "Verb", null, "/pla.ni.fje/", "Nous devons planifier le projet.", "We must plan the project."],
        ["développer", null, "to develop", "To grow or cause to grow larger.", "Verb", null, "/dev.lɔ.pe/", "Nous voulons développer le projet.", "We want to develop the project."],
        ["gérer", null, "to manage", "To be in charge of a business or team.", "Verb", null, "/ʒe.ʁe/", "Il sait gérer une entreprise.", "He knows how to manage a company."],
      ],
      Technology: [
        ["ordinateur", null, "computer", "An electronic device for storing and processing data.", "Noun", "Masculine", "/ɔʁ.di.na.tœʁ/", "Mon ordinateur est lent.", "My computer is slow."],
        ["portable", null, "laptop", "A portable personal computer.", "Noun", "Masculine", "/pɔʁ.tabl/", "Mon portable est léger.", "My laptop is light."],
        ["téléphone", null, "phone", "A device for transmitting voice over distances.", "Noun", "Masculine", "/te.le.fɔn/", "Mon téléphone sonne.", "My phone is ringing."],
        ["smartphone", null, "smartphone", "A mobile phone with advanced features.", "Noun", "Masculine", "/smaʁt.fɔn/", "Son smartphone est neuf.", "Her smartphone is new."],
        ["tablette", null, "tablet", "A flat portable computer with a touchscreen.", "Noun", "Feminine", "/ta.blɛt/", "La tablette est pratique.", "The tablet is handy."],
        ["écran", null, "screen", "A flat panel displaying images or text.", "Noun", "Masculine", "/e.kʁɑ̃/", "L'écran est cassé.", "The screen is broken."],
        ["clavier", null, "keyboard", "A set of keys for operating a computer.", "Noun", "Masculine", "/kla.vje/", "Le clavier est neuf.", "The keyboard is new."],
        ["souris", null, "mouse", "A hand-held device controlling a cursor.", "Noun", "Feminine", "/su.ʁi/", "La souris ne marche pas.", "The mouse doesn't work."],
        ["imprimante", null, "printer", "A device for printing documents.", "Noun", "Feminine", "/ɛ̃.pʁi.mɑ̃t/", "L'imprimante est en panne.", "The printer is broken."],
        ["scanner", null, "scanner", "A device for digitizing documents.", "Noun", "Masculine", "/ska.ne/", "Le scanner est rapide.", "The scanner is fast."],
        ["casque", null, "headphones", "A device worn over the ears for listening.", "Noun", "Masculine", "/kask/", "Mon casque est confortable.", "My headphones are comfortable."],
        ["enceinte", null, "speaker", "A device that converts signals into sound.", "Noun", "Feminine", "/ɑ̃.sɛ̃t/", "L'enceinte est puissante.", "The speaker is powerful."],
        ["caméra", null, "camera", "A device for recording images and video.", "Noun", "Feminine", "/ka.me.ʁa/", "La caméra filme.", "The camera is recording."],
        ["appareil photo", null, "camera", "A device for taking photographs.", "Noun", "Masculine", "/a.pa.ʁɛj fo.to/", "Son appareil photo est cher.", "His camera is expensive."],
        ["câble", null, "cable", "A wire for transmitting electrical signals.", "Noun", "Masculine", "/kabl/", "Le câble est trop court.", "The cable is too short."],
        ["chargeur", null, "charger", "A device for recharging batteries.", "Noun", "Masculine", "/ʃaʁ.ʒœʁ/", "J'ai oublié mon chargeur.", "I forgot my charger."],
        ["batterie", null, "battery", "A device that stores electrical energy.", "Noun", "Feminine", "/ba.tʁi/", "La batterie est faible.", "The battery is low."],
        ["internet", null, "internet", "A global computer network.", "Noun", "Masculine", "/ɛ̃.tɛʁ.nɛt/", "Internet est lent aujourd'hui.", "The internet is slow today."],
        ["wifi", null, "wifi", "A facility allowing devices to connect wirelessly.", "Noun", "Masculine", "/wi.fi/", "Le wifi est gratuit.", "The wifi is free."],
        ["réseau", null, "network", "A group of interconnected computers.", "Noun", "Masculine", "/ʁe.zo/", "Le réseau fonctionne.", "The network works."],
        ["site", null, "website", "A set of related web pages.", "Noun", "Masculine", "/sit/", "Le site est en panne.", "The site is down."],
        ["page", null, "page", "A single screen of a website or document.", "Noun", "Feminine", "/paʒ/", "La page ne charge pas.", "The page doesn't load."],
        ["lien", null, "link", "A connection between two things.", "Noun", "Masculine", "/ljɛ̃/", "Le lien est cassé.", "The link is broken."],
        ["logiciel", null, "software", "Programs used by a computer.", "Noun", "Masculine", "/lɔ.ʒi.sjɛl/", "Ce logiciel est utile.", "This software is useful."],
        ["application", null, "application", "A program on a device.", "Noun", "Feminine", "/a.pli.ka.sjɔ̃/", "L'application est gratuite.", "The application is free."],
        ["programme", null, "program", "A set of instructions for a computer.", "Noun", "Masculine", "/pʁɔ.ɡʁam/", "Le programme plante.", "The program crashes."],
        ["fichier", null, "file", "A collection of data stored under one name.", "Noun", "Masculine", "/fi.ʃje/", "Le fichier est corrompu.", "The file is corrupted."],
        ["dossier", null, "folder", "A container for organizing files.", "Noun", "Masculine", "/dɔ.sje/", "Le dossier est vide.", "The folder is empty."],
        ["document", null, "document", "A piece of written or electronic work.", "Noun", "Masculine", "/dɔ.ky.mɑ̃/", "Le document est prêt.", "The document is ready."],
        ["photo", null, "photo", "A picture made with a camera.", "Noun", "Feminine", "/fo.to/", "Cette photo est belle.", "This photo is beautiful."],
        ["vidéo", null, "video", "A recording of moving visual images.", "Noun", "Feminine", "/vi.de.o/", "La vidéo est longue.", "The video is long."],
        ["musique", null, "music", "Vocal or instrumental sounds combined.", "Noun", "Feminine", "/my.zik/", "J'écoute de la musique en ligne.", "I listen to music online."],
        ["jeu", null, "game", "An activity for amusement or competition.", "Noun", "Masculine", "/ʒø/", "Ce jeu est addictif.", "This game is addictive."],
        ["données", null, "data", "Facts and statistics collected for reference.", "Noun", "Feminine", "/dɔ.ne/", "Les données sont sauvegardées.", "The data is saved."],
        ["mot de passe", null, "password", "A secret word used to gain access.", "Noun", "Masculine", "/mo də pas/", "Entrez votre mot de passe.", "Enter your password."],
        ["compte", null, "account", "A registration with a service provider.", "Noun", "Masculine", "/kɔ̃t/", "J'ai créé un compte.", "I created an account."],
        ["email", null, "email", "Messages distributed by electronic means.", "Noun", "Masculine", "/i.mɛl/", "J'ai reçu un email.", "I received an email."],
        ["message", null, "message", "A communication sent from one person to another.", "Noun", "Masculine", "/mɛ.saʒ/", "Il a envoyé un message.", "He sent a message."],
        ["serveur", null, "server", "A computer that provides data to others.", "Noun", "Masculine", "/sɛʁ.vœʁ/", "Le serveur est en panne.", "The server is down."],
        ["base de données", null, "database", "A structured set of data held in a computer.", "Noun", "Feminine", "/baz də dɔ.ne/", "La base de données est sécurisée.", "The database is secure."],
        ["sécurité", null, "security", "The state of being free from danger.", "Noun", "Feminine", "/se.ky.ʁi.te/", "La sécurité est essentielle.", "Security is essential."],
        ["virus", null, "virus", "A piece of code that can damage a computer.", "Noun", "Masculine", "/vi.ʁys/", "Le virus a infecté l'ordinateur.", "The virus infected the computer."],
        ["mise à jour", null, "update", "A new version of software.", "Noun", "Feminine", "/miz a ʒuʁ/", "La mise à jour est disponible.", "The update is available."],
        ["sauvegarde", null, "backup", "A copy of data stored separately.", "Noun", "Feminine", "/sov.ɡaʁd/", "Fais une sauvegarde.", "Make a backup."],
        ["cloud", null, "cloud storage", "Storage of data on remote servers.", "Noun", "Masculine", "/klaud/", "Le cloud est pratique.", "Cloud storage is handy."],
        ["télécharger", null, "to download", "To copy data from a network to a device.", "Verb", null, "/te.le.ʃaʁ.ʒe/", "Je vais télécharger le fichier.", "I will download the file."],
        ["installer", null, "to install", "To set up software for use.", "Verb", null, "/ɛ̃s.ta.le/", "Je vais installer l'application.", "I will install the application."],
        ["cliquer", null, "to click", "To press a button on a mouse.", "Verb", null, "/kli.ke/", "Cliquez sur le bouton.", "Click the button."],
        ["taper", null, "to type", "To write using a keyboard.", "Verb", null, "/ta.pe/", "Tape ton nom ici.", "Type your name here."],
        ["enregistrer", null, "to save", "To store data for later retrieval.", "Verb", null, "/ɑ̃.ʁə.ʒis.tʁe/", "Enregistre le document.", "Save the document."],
        ["imprimer", null, "to print", "To produce a paper copy of a document.", "Verb", null, "/ɛ̃.pʁi.me/", "Imprime cette page.", "Print this page."],
        ["envoyer", null, "to send", "To cause to go to a destination.", "Verb", null, "/ɑ̃.vwa.je/", "Envoie-moi un email.", "Send me an email."],
        ["recevoir", null, "to receive", "To be given or paid something.", "Verb", null, "/ʁə.sə.vwaʁ/", "J'ai reçu ton message.", "I received your message."],
        ["chercher", null, "to search", "To look for information.", "Verb", null, "/ʃɛʁ.ʃe/", "Cherche sur internet.", "Search on the internet."],
        ["partager", null, "to share", "To give a portion to others.", "Verb", null, "/paʁ.ta.ʒe/", "Nous pouvons partager le lien.", "We can share the link."],
        ["programmer", null, "to program", "To write computer code.", "Verb", null, "/pʁɔ.ɡʁa.me/", "Elle aime programmer.", "She likes programming."],
        ["réparer", null, "to repair", "To fix something broken.", "Verb", null, "/ʁe.pa.ʁe/", "Peux-tu réparer mon ordinateur ?", "Can you repair my computer?"],
        ["brancher", null, "to plug in", "To connect to a power source.", "Verb", null, "/bʁɑ̃.ʃe/", "Branche le câble.", "Plug in the cable."],
        ["éteindre", null, "to turn off", "To stop the operation of a device.", "Verb", null, "/e.tɛ̃dʁ/", "Éteins l'ordinateur.", "Turn off the computer."],
        ["allumer", null, "to turn on", "To start the operation of a device.", "Verb", null, "/a.ly.me/", "Allume la lumière.", "Turn on the light."],
      ],
      Sports: [
        ["sport", null, "sport", "An activity involving physical exertion and skill.", "Noun", "Masculine", "/spɔʁ/", "J'aime le sport.", "I like sport."],
        ["football", null, "football", "A game played by two teams kicking a ball.", "Noun", "Masculine", "/fut.bol/", "Le football est populaire.", "Football is popular."],
        ["basket", null, "basketball", "A game where players throw a ball into a hoop.", "Noun", "Masculine", "/bas.kɛt/", "Le basket est rapide.", "Basketball is fast."],
        ["tennis", null, "tennis", "A game where players hit a ball over a net.", "Noun", "Masculine", "/te.nis/", "Le tennis est élégant.", "Tennis is elegant."],
        ["rugby", null, "rugby", "A team game played with an oval ball.", "Noun", "Masculine", "/ʁyɡ.bi/", "Le rugby est physique.", "Rugby is physical."],
        ["volley", null, "volleyball", "A game where teams hit a ball over a net.", "Noun", "Masculine", "/vɔ.lɛ/", "Le volley est amusant.", "Volleyball is fun."],
        ["handball", null, "handball", "A team sport where players throw a ball into a goal.", "Noun", "Masculine", "/ɑ̃d.bal/", "Le handball se joue en salle.", "Handball is played indoors."],
        ["natation", null, "swimming", "The sport of moving through water.", "Noun", "Feminine", "/na.ta.sjɔ̃/", "La natation est saine.", "Swimming is healthy."],
        ["athlétisme", null, "athletics", "Running, jumping and throwing sports.", "Noun", "Masculine", "/at.le.tism/", "L'athlétisme demande de l'endurance.", "Athletics requires endurance."],
        ["course", null, "running", "The activity of running as a sport.", "Noun", "Feminine", "/kuʁs/", "La course est fatigante.", "Running is tiring."],
        ["marathon", null, "marathon", "A long-distance running race of 42 km.", "Noun", "Masculine", "/ma.ʁa.tɔ̃/", "Il court un marathon.", "He runs a marathon."],
        ["vélo", null, "cycling", "The sport of riding a bicycle.", "Noun", "Masculine", "/ve.lo/", "Je fais du vélo.", "I ride a bike."],
        ["ski", null, "skiing", "The sport of gliding over snow on skis.", "Noun", "Masculine", "/ski/", "Le ski est excitant.", "Skiing is exciting."],
        ["randonnée", null, "hiking", "The activity of going for long walks.", "Noun", "Feminine", "/ʁɑ̃.dɔ.ne/", "La randonnée est magnifique.", "Hiking is magnificent."],
        ["escalade", null, "climbing", "The sport of climbing rocks or walls.", "Noun", "Feminine", "/ɛs.ka.lad/", "L'escalade est difficile.", "Climbing is difficult."],
        ["gymnastique", null, "gymnastics", "Exercises developing agility and coordination.", "Noun", "Feminine", "/ʒim.nas.tik/", "La gymnastique est gracieuse.", "Gymnastics is graceful."],
        ["danse", null, "dance", "Movement of the body in rhythm.", "Noun", "Feminine", "/dɑ̃s/", "La danse est un sport.", "Dance is a sport."],
        ["yoga", null, "yoga", "A Hindu discipline of breathing and posture.", "Noun", "Masculine", "/jɔ.ɡa/", "Le yoga me détend.", "Yoga relaxes me."],
        ["équipe", null, "team", "A group of players forming one side.", "Noun", "Feminine", "/e.kip/", "Notre équipe gagne.", "Our team is winning."],
        ["joueur", null, "player", "A person who takes part in a sport.", "Noun", "Masculine", "/ʒwœʁ/", "Le joueur marque un but.", "The player scores a goal."],
        ["entraîneur", null, "coach", "A person who trains athletes.", "Noun", "Masculine", "/ɑ̃.tʁɛ.nœʁ/", "L'entraîneur parle aux joueurs.", "The coach talks to the players."],
        ["arbitre", null, "referee", "A person who enforces rules in a sport.", "Noun", "Masculine", "/aʁ.bitʁ/", "L'arbitre siffle.", "The referee blows the whistle."],
        ["champion", null, "champion", "A person who has defeated all rivals.", "Noun", "Masculine", "/ʃɑ̃.pjɔ̃/", "Le champion sourit.", "The champion smiles."],
        ["match", null, "match", "A contest between two teams or players.", "Noun", "Masculine", "/matʃ/", "Le match commence.", "The match begins."],
        ["compétition", null, "competition", "An event where people compete.", "Noun", "Feminine", "/kɔ̃.pe.ti.sjɔ̃/", "La compétition commence demain.", "The competition begins tomorrow."],
        ["tournoi", null, "tournament", "A series of contests between competitors.", "Noun", "Masculine", "/tuʁ.nwa/", "Le tournoi est annuel.", "The tournament is annual."],
        ["championnat", null, "championship", "A competition to determine a champion.", "Noun", "Masculine", "/ʃɑ̃.pjɔ.na/", "Le championnat commence demain.", "The championship begins tomorrow."],
        ["médaille", null, "medal", "A metal disc awarded as an honour.", "Noun", "Feminine", "/me.daj/", "Elle reçoit une médaille.", "She receives a medal."],
        ["trophée", null, "trophy", "A cup or object awarded as a prize.", "Noun", "Masculine", "/tʁɔ.fe/", "Le trophée est en or.", "The trophy is gold."],
        ["victoire", null, "victory", "An act of defeating an opponent.", "Noun", "Feminine", "/vik.twaʁ/", "La victoire est belle.", "The victory is beautiful."],
        ["défaite", null, "defeat", "An instance of being beaten.", "Noun", "Feminine", "/de.fɛt/", "La défaite est difficile.", "The defeat is difficult."],
        ["score", null, "score", "The number of points gained.", "Noun", "Masculine", "/skɔʁ/", "Le score est serré.", "The score is close."],
        ["but", null, "goal", "A point scored in certain games.", "Noun", "Masculine", "/byt/", "Il marque un but.", "He scores a goal."],
        ["stade", null, "stadium", "A sports arena with tiers of seats.", "Noun", "Masculine", "/stad/", "Le stade est plein.", "The stadium is full."],
        ["terrain", null, "field", "An area where sports are played.", "Noun", "Masculine", "/tɛ.ʁɛ̃/", "Le terrain est humide.", "The field is wet."],
        ["piscine", null, "swimming pool", "An artificial pool for swimming.", "Noun", "Feminine", "/pi.sin/", "La piscine est couverte.", "The pool is indoor."],
        ["gymnase", null, "gymnasium", "A room equipped for indoor sports.", "Noun", "Masculine", "/ʒim.naz/", "Le gymnase est grand.", "The gymnasium is large."],
        ["ballon", null, "ball", "A round object used in games.", "Noun", "Masculine", "/ba.lɔ̃/", "Le ballon roule.", "The ball rolls."],
        ["raquette", null, "racket", "A bat with strings used in tennis.", "Noun", "Feminine", "/ʁa.kɛt/", "Ma raquette est neuve.", "My racket is new."],
        ["maillot", null, "jersey", "A shirt worn by a sports player.", "Noun", "Masculine", "/ma.jo/", "Le maillot est rouge.", "The jersey is red."],
        ["chaussures", null, "shoes", "Footwear worn for sport.", "Noun", "Feminine", "/ʃo.syʁ/", "Mes chaussures sont usées.", "My shoes are worn."],
        ["fort", null, "strong", "Having great physical power.", "Adjective", null, "/fɔʁ/", "Le joueur est fort.", "The player is strong."],
        ["rapide", null, "fast", "Moving quickly.", "Adjective", null, "/ʁa.pid/", "Le coureur est rapide.", "The runner is fast."],
        ["endurant", null, "enduring", "Having great stamina.", "Adjective", null, "/ɑ̃.dy.ʁɑ̃/", "L'athlète est endurant.", "The athlete has endurance."],
        ["agile", null, "agile", "Able to move quickly and easily.", "Adjective", null, "/a.ʒil/", "Le joueur est agile.", "The player is agile."],
        ["puissant", null, "powerful", "Having great strength or force.", "Adjective", null, "/pɥi.sɑ̃/", "Son tir est puissant.", "His shot is powerful."],
        ["athlétique", null, "athletic", "Physically strong and active.", "Adjective", null, "/at.le.tik/", "Elle a une silhouette athlétique.", "She has an athletic build."],
        ["s'entraîner", null, "to train", "To practise for a sport.", "Verb", null, "/sɑ̃.tʁɛ.ne/", "Ils doivent s'entraîner.", "They must train."],
        ["gagner", null, "to win", "To be successful in a contest.", "Verb", null, "/ɡa.ɲe/", "L'équipe veut gagner.", "The team wants to win."],
        ["perdre", null, "to lose", "To be defeated in a contest.", "Verb", null, "/pɛʁdʁ/", "Personne ne veut perdre.", "Nobody wants to lose."],
        ["courir", null, "to run", "To move quickly on foot.", "Verb", null, "/ku.ʁiʁ/", "Ils aiment courir.", "They like running."],
        ["sauter", null, "to jump", "To push oneself off the ground.", "Verb", null, "/so.te/", "L'athlète doit sauter.", "The athlete must jump."],
        ["nager", null, "to swim", "To move through water.", "Verb", null, "/na.ʒe/", "Il aime nager.", "He likes to swim."],
        ["lancer", null, "to throw", "To propel with force from the hand.", "Verb", null, "/lɑ̃.se/", "Il va lancer le ballon.", "He will throw the ball."],
        ["attraper", null, "to catch", "To intercept and hold something moving.", "Verb", null, "/a.tʁa.pe/", "Attrape la balle !", "Catch the ball!"],
        ["marquer", null, "to score", "To gain a point in a game.", "Verb", null, "/maʁ.ke/", "Il va marquer.", "He will score."],
        ["défendre", null, "to defend", "To protect against attack.", "Verb", null, "/de.fɑ̃dʁ/", "L'équipe doit défendre.", "The team must defend."],
        ["arbitrer", null, "to referee", "To act as referee in a match.", "Verb", null, "/aʁ.bit.ʁe/", "Il va arbitrer le match.", "He will referee the match."],
        ["supporter", null, "to support", "To cheer for a team.", "Verb", null, "/sy.pɔʁ.te/", "Nous supportons cette équipe.", "We support this team."],
      ],
      Music: [
        ["musique", null, "music", "Vocal or instrumental sounds combined.", "Noun", "Feminine", "/my.zik/", "J'écoute de la musique.", "I listen to music."],
        ["chanson", null, "song", "A short poem or set of words set to music.", "Noun", "Feminine", "/ʃɑ̃.sɔ̃/", "Cette chanson est belle.", "This song is beautiful."],
        ["mélodie", null, "melody", "A sequence of musical notes.", "Noun", "Feminine", "/me.lɔ.di/", "La mélodie est belle.", "The melody is beautiful."],
        ["rythme", null, "rhythm", "A strong, regular, repeated pattern of sound.", "Noun", "Masculine", "/ʁitm/", "Le rythme est entraînant.", "The rhythm is catchy."],
        ["harmonie", null, "harmony", "The combination of simultaneous musical notes.", "Noun", "Feminine", "/aʁ.mɔ.ni/", "L'harmonie est parfaite.", "The harmony is perfect."],
        ["note", null, "note", "A single musical sound.", "Noun", "Feminine", "/nɔt/", "Il joue les bonnes notes.", "He plays the right notes."],
        ["accord", null, "chord", "A group of notes played together.", "Noun", "Masculine", "/a.kɔʁ/", "L'accord sonne bien.", "The chord sounds good."],
        ["instrument", null, "instrument", "A device for making musical sounds.", "Noun", "Masculine", "/ɛ̃s.tʁy.mɑ̃/", "Cet instrument est ancien.", "This instrument is old."],
        ["guitare", null, "guitar", "A stringed musical instrument.", "Noun", "Feminine", "/ɡi.taʁ/", "Il joue de la guitare.", "He plays the guitar."],
        ["piano", null, "piano", "A large keyboard musical instrument.", "Noun", "Masculine", "/pja.no/", "Le piano résonne.", "The piano resonates."],
        ["violon", null, "violin", "A stringed instrument played with a bow.", "Noun", "Masculine", "/vjɔ.lɔ̃/", "Le violon est doux.", "The violin is soft."],
        ["violoncelle", null, "cello", "A large stringed instrument played with a bow.", "Noun", "Masculine", "/vjɔ.lɔ̃.sɛl/", "Le violoncelle est profond.", "The cello is deep."],
        ["flûte", null, "flute", "A woodwind instrument played by blowing.", "Noun", "Feminine", "/flyt/", "La flûte est légère.", "The flute is light."],
        ["trompette", null, "trumpet", "A brass instrument with a flared bell.", "Noun", "Feminine", "/tʁɔ̃.pɛt/", "La trompette est forte.", "The trumpet is loud."],
        ["tambour", null, "drum", "A percussion instrument played with sticks.", "Noun", "Masculine", "/tɑ̃.buʁ/", "Le tambour résonne.", "The drum resonates."],
        ["batterie", null, "drum kit", "A set of percussion instruments.", "Noun", "Feminine", "/ba.tʁi/", "La batterie résonne.", "The drums resonate."],
        ["saxophone", null, "saxophone", "A brass instrument with a single-reed mouthpiece.", "Noun", "Masculine", "/sak.sɔ.fɔn/", "Le saxophone est jazz.", "The saxophone is jazzy."],
        ["harpe", null, "harp", "A large stringed instrument plucked with fingers.", "Noun", "Feminine", "/aʁp/", "La harpe est céleste.", "The harp is heavenly."],
        ["chanteur", null, "singer", "A person who sings.", "Noun", "Masculine", "/ʃɑ̃.tœʁ/", "Le chanteur est célèbre.", "The singer is famous."],
        ["musicien", null, "musician", "A person who plays music.", "Noun", "Masculine", "/my.zi.sjɛ̃/", "Le musicien joue bien.", "The musician plays well."],
        ["groupe", null, "band", "A group of musicians who play together.", "Noun", "Masculine", "/ɡʁup/", "Le groupe est en tournée.", "The band is on tour."],
        ["orchestre", null, "orchestra", "A group of instrumentalists.", "Noun", "Masculine", "/ɔʁ.kɛstʁ/", "L'orchestre joue.", "The orchestra plays."],
        ["chef d'orchestre", null, "conductor", "A person who directs an orchestra.", "Noun", "Masculine", "/ʃɛf dɔʁ.kɛstʁ/", "Le chef d'orchestre lève sa baguette.", "The conductor raises his baton."],
        ["concert", null, "concert", "A musical performance given in public.", "Noun", "Masculine", "/kɔ̃.sɛʁ/", "Le concert est complet.", "The concert is sold out."],
        ["spectacle", null, "show", "A performance for entertainment.", "Noun", "Masculine", "/spɛk.takl/", "Le spectacle commence.", "The show begins."],
        ["scène", null, "stage", "A raised platform for performance.", "Noun", "Feminine", "/sɛn/", "Elle monte sur scène.", "She goes on stage."],
        ["public", null, "audience", "The people watching a performance.", "Noun", "Masculine", "/py.blik/", "Le public applaudit.", "The audience applauds."],
        ["album", null, "album", "A collection of musical recordings.", "Noun", "Masculine", "/al.bɔm/", "Son album est sorti.", "His album is out."],
        ["chanson", null, "song", "A musical composition with words.", "Noun", "Feminine", "/ʃɑ̃.sɔ̃/", "Cette chanson est triste.", "This song is sad."],
        ["paroles", null, "lyrics", "The words of a song.", "Noun", "Feminine", "/pa.ʁɔl/", "Les paroles sont belles.", "The lyrics are beautiful."],
        ["voix", null, "voice", "The sound produced by a person in speaking or singing.", "Noun", "Feminine", "/vwa/", "Sa voix est claire.", "Her voice is clear."],
        ["chorale", null, "choir", "A group of singers.", "Noun", "Feminine", "/kɔ.ʁal/", "La chorale répète.", "The choir rehearses."],
        ["opéra", null, "opera", "A dramatic work set to music.", "Noun", "Masculine", "/ɔ.pe.ʁa/", "L'opéra est grandiose.", "The opera is grandiose."],
        ["ballet", null, "ballet", "A dance performance set to music.", "Noun", "Masculine", "/ba.lɛ/", "Le ballet est gracieux.", "The ballet is graceful."],
        ["danse", null, "dance", "Movement of the body in rhythm.", "Noun", "Feminine", "/dɑ̃s/", "La danse est joyeuse.", "The dance is joyful."],
        ["jazz", null, "jazz", "A genre of music with improvisation.", "Noun", "Masculine", "/dʒaz/", "Le jazz est entraînant.", "Jazz is catchy."],
        ["rock", null, "rock", "A genre of popular music with a strong beat.", "Noun", "Masculine", "/ʁɔk/", "Le rock est énergique.", "Rock is energetic."],
        ["classique", null, "classical", "Relating to traditional Western music.", "Adjective", null, "/kla.sik/", "J'aime la musique classique.", "I like classical music."],
        ["moderne", null, "modern", "Belonging to the present or recent times.", "Adjective", null, "/mɔ.dɛʁn/", "Sa musique est moderne.", "His music is modern."],
        ["rythmé", null, "rhythmic", "Having a strong regular beat.", "Adjective", null, "/ʁit.me/", "Le morceau est rythmé.", "The song is rhythmic."],
        ["mélodieux", null, "melodious", "Producing a pleasant musical sound.", "Adjective", null, "/me.lɔ.djø/", "Sa voix est mélodieuse.", "Her voice is melodious."],
        ["harmonieux", null, "harmonious", "Forming a pleasing combination.", "Adjective", null, "/aʁ.mɔ.njø/", "Le son est harmonieux.", "The sound is harmonious."],
        ["bruyant", null, "noisy", "Making a lot of noise.", "Adjective", null, "/bʁɥi.jɑ̃/", "Le concert est bruyant.", "The concert is noisy."],
        ["calme", null, "calm", "Quiet and peaceful.", "Adjective", null, "/kalm/", "La mélodie est calme.", "The melody is calm."],
        ["doux", null, "soft", "Gentle and not harsh.", "Adjective", null, "/du/", "Le son est doux.", "The sound is soft."],
        ["fort", null, "loud", "Producing much noise.", "Adjective", null, "/fɔʁ/", "La musique est forte.", "The music is loud."],
        ["chanter", null, "to sing", "To produce musical sounds with the voice.", "Verb", null, "/ʃɑ̃.te/", "Elle aime chanter.", "She likes to sing."],
        ["écouter", null, "to listen", "To give attention to sound.", "Verb", null, "/e.ku.te/", "J'aime écouter la musique.", "I like listening to music."],
        ["jouer", null, "to play", "To perform on a musical instrument.", "Verb", null, "/ʒwe/", "Il sait jouer du piano.", "He can play the piano."],
        ["composer", null, "to compose", "To write music.", "Verb", null, "/kɔ̃.pɔ.ze/", "Il aime composer.", "He likes to compose."],
        ["enregistrer", null, "to record", "To capture sound on a medium.", "Verb", null, "/ɑ̃.ʁə.ʒis.tʁe/", "Ils vont enregistrer une chanson.", "They will record a song."],
        ["répéter", null, "to rehearse", "To practise for a performance.", "Verb", null, "/ʁe.pe.te/", "Ils doivent répéter ce soir.", "They must rehearse tonight."],
        ["danser", null, "to dance", "To move rhythmically to music.", "Verb", null, "/dɑ̃.se/", "Nous aimons danser.", "We like to dance."],
        ["applaudir", null, "to applaud", "To clap one's hands in approval.", "Verb", null, "/a.plo.diʁ/", "Le public applaudit.", "The audience applauds."],
        ["siffler", null, "to whistle", "To make a high-pitched sound by forcing air.", "Verb", null, "/si.fle/", "Il aime siffler.", "He likes to whistle."],
        ["s'accorder", null, "to tune", "To adjust instruments to the same pitch.", "Verb", null, "/sa.kɔʁ.de/", "Les instruments s'accordent.", "The instruments tune together."],
        ["improviser", null, "to improvise", "To create music spontaneously.", "Verb", null, "/ɛ̃.pʁɔ.vi.ze/", "Il aime improviser.", "He likes to improvise."],
        ["accompagner", null, "to accompany", "To play music in support of another.", "Verb", null, "/a.kɔ̃.pa.ɲe/", "Le piano accompagne le violon.", "The piano accompanies the violin."],
        ["interpréter", null, "to interpret", "To perform a piece of music.", "Verb", null, "/ɛ̃.tɛʁ.pʁe.te/", "Elle interprète la chanson.", "She performs the song."],
        ["monter", null, "to turn up", "To increase the volume.", "Verb", null, "/mɔ̃.te/", "Monte le son.", "Turn up the sound."],
        ["baisser", null, "to turn down", "To decrease the volume.", "Verb", null, "/bɛ.se/", "Baisse la musique.", "Turn down the music."],
      ],
      Nature: [
        ["nature", null, "nature", "The physical world including plants and animals.", "Noun", "Feminine", "/na.tyʁ/", "La nature est belle.", "Nature is beautiful."],
        ["arbre", null, "tree", "A woody perennial plant with a trunk.", "Noun", "Masculine", "/aʁbʁ/", "L'arbre est grand.", "The tree is tall."],
        ["forêt", null, "forest", "A large area covered with trees.", "Noun", "Feminine", "/fɔ.ʁɛ/", "La forêt est dense.", "The forest is dense."],
        ["bois", null, "woods", "A small forest.", "Noun", "Masculine", "/bwa/", "Nous marchons dans le bois.", "We walk in the woods."],
        ["fleur", null, "flower", "The reproductive structure of a plant.", "Noun", "Feminine", "/flœʁ/", "La fleur sent bon.", "The flower smells good."],
        ["rose", null, "rose", "A fragrant flower with thorny stems.", "Noun", "Feminine", "/ʁoz/", "La rose est rouge.", "The rose is red."],
        ["tulipe", null, "tulip", "A bulbous spring-flowering plant.", "Noun", "Feminine", "/ty.lip/", "Les tulipes sont jaunes.", "The tulips are yellow."],
        ["herbe", null, "grass", "Low green plants covering the ground.", "Noun", "Feminine", "/ɛʁb/", "L'herbe est verte.", "The grass is green."],
        ["feuille", null, "leaf", "A flat green structure growing from a plant stem.", "Noun", "Feminine", "/fœj/", "La feuille tombe.", "The leaf falls."],
        ["branche", null, "branch", "A part of a tree growing from the trunk.", "Noun", "Feminine", "/bʁɑ̃ʃ/", "La branche casse.", "The branch breaks."],
        ["racine", null, "root", "The part of a plant that attaches it to the ground.", "Noun", "Feminine", "/ʁa.sin/", "La racine est profonde.", "The root is deep."],
        ["graine", null, "seed", "A small part of a plant from which a new plant grows.", "Noun", "Feminine", "/ɡʁɛn/", "La graine germe.", "The seed sprouts."],
        ["jardin", null, "garden", "A piece of ground for growing flowers or vegetables.", "Noun", "Masculine", "/ʒaʁ.dɛ̃/", "Le jardin est fleuri.", "The garden is full of flowers."],
        ["champ", null, "field", "An area of open land for crops or pasture.", "Noun", "Masculine", "/ʃɑ̃/", "Le champ est labouré.", "The field is ploughed."],
        ["prairie", null, "meadow", "A field with grass and wild flowers.", "Noun", "Feminine", "/pʁɛ.ʁi/", "La prairie est verte.", "The meadow is green."],
        ["montagne", null, "mountain", "A large natural elevation of the earth's surface.", "Noun", "Feminine", "/mɔ̃.taɲ/", "La montagne est immense.", "The mountain is immense."],
        ["colline", null, "hill", "A naturally raised area of land.", "Noun", "Feminine", "/kɔ.lin/", "La colline est douce.", "The hill is gentle."],
        ["vallée", null, "valley", "A low area of land between hills or mountains.", "Noun", "Feminine", "/va.le/", "La vallée est belle.", "The valley is beautiful."],
        ["rivière", null, "river", "A large natural stream of water.", "Noun", "Feminine", "/ʁi.vjɛʁ/", "La rivière coule doucement.", "The river flows gently."],
        ["fleuve", null, "large river", "A large natural stream flowing into the sea.", "Noun", "Masculine", "/flœv/", "Le fleuve est large.", "The river is wide."],
        ["lac", null, "lake", "A large body of water surrounded by land.", "Noun", "Masculine", "/lak/", "Le lac est calme.", "The lake is calm."],
        ["mer", null, "sea", "The expanse of salt water covering the earth.", "Noun", "Feminine", "/mɛʁ/", "La mer est calme.", "The sea is calm."],
        ["océan", null, "ocean", "A very large expanse of sea.", "Noun", "Masculine", "/ɔ.se.ɑ̃/", "L'océan est immense.", "The ocean is immense."],
        ["vague", null, "wave", "A moving ridge on the surface of water.", "Noun", "Feminine", "/vaɡ/", "La vague est haute.", "The wave is high."],
        ["plage", null, "beach", "A pebbly or sandy shore by the sea.", "Noun", "Feminine", "/plaʒ/", "La plage est déserte.", "The beach is deserted."],
        ["sable", null, "sand", "Loose granular material on beaches and deserts.", "Noun", "Masculine", "/sabl/", "Le sable est chaud.", "The sand is warm."],
        ["rocher", null, "rock", "A large mass of stone.", "Noun", "Masculine", "/ʁɔ.ʃe/", "Le rocher est énorme.", "The rock is huge."],
        ["ciel", null, "sky", "The region of the atmosphere above the earth.", "Noun", "Masculine", "/sjɛl/", "Le ciel est bleu.", "The sky is blue."],
        ["soleil", null, "sun", "The star at the center of our solar system.", "Noun", "Masculine", "/sɔ.lɛj/", "Le soleil brille.", "The sun is shining."],
        ["lune", null, "moon", "The natural satellite of the earth.", "Noun", "Feminine", "/lyn/", "La lune est pleine.", "The moon is full."],
        ["étoile", null, "star", "A fixed luminous point in the night sky.", "Noun", "Feminine", "/e.twal/", "Les étoiles brillent.", "The stars shine."],
        ["nuage", null, "cloud", "A visible mass of condensed water vapour.", "Noun", "Masculine", "/nɥaʒ/", "Un nuage passe.", "A cloud passes."],
        ["pluie", null, "rain", "Moisture falling from the atmosphere in drops.", "Noun", "Feminine", "/plɥi/", "La pluie tombe.", "The rain is falling."],
        ["neige", null, "snow", "Water vapour frozen into ice crystals.", "Noun", "Feminine", "/nɛʒ/", "La neige est blanche.", "The snow is white."],
        ["vent", null, "wind", "The natural movement of the air.", "Noun", "Masculine", "/vɑ̃/", "Le vent souffle fort.", "The wind blows hard."],
        ["orage", null, "storm", "A violent atmospheric disturbance.", "Noun", "Masculine", "/ɔ.ʁaʒ/", "L'orage arrive.", "The storm is coming."],
        ["arc-en-ciel", null, "rainbow", "An arch of colours in the sky after rain.", "Noun", "Masculine", "/aʁ.kɑ̃.sjɛl/", "L'arc-en-ciel est magnifique.", "The rainbow is magnificent."],
        ["paysage", null, "landscape", "All the visible features of an area.", "Noun", "Masculine", "/pe.i.zaʒ/", "Le paysage est magnifique.", "The landscape is magnificent."],
        ["animal", null, "animal", "A living organism that feeds on organic matter.", "Noun", "Masculine", "/a.ni.mal/", "L'animal vit dans la forêt.", "The animal lives in the forest."],
        ["sauvage", null, "wild", "Living in a natural state.", "Adjective", null, "/so.vaʒ/", "La forêt est sauvage.", "The forest is wild."],
        ["naturel", null, "natural", "Existing in or produced by nature.", "Adjective", null, "/na.ty.ʁɛl/", "Le paysage est naturel.", "The landscape is natural."],
        ["vert", null, "green", "The colour of grass.", "Adjective", null, "/vɛʁ/", "Les champs sont verts.", "The fields are green."],
        ["fleuri", null, "flowery", "Covered with or full of flowers.", "Adjective", null, "/flø.ʁi/", "Le jardin est fleuri.", "The garden is flowery."],
        ["humide", null, "humid", "Containing moisture; damp.", "Adjective", null, "/y.mid/", "Le sol est humide.", "The soil is wet."],
        ["profond", null, "deep", "Extending far down from the top or surface.", "Adjective", null, "/pʁɔ.fɔ̃/", "Le lac est profond.", "The lake is deep."],
        ["calme", null, "calm", "Free from disturbance.", "Adjective", null, "/kalm/", "La mer est calme.", "The sea is calm."],
        ["paisible", null, "peaceful", "Free from disturbance; tranquil.", "Adjective", null, "/pe.zibl/", "Le village est paisible.", "The village is peaceful."],
        ["pousser", null, "to grow", "To develop or increase in size.", "Verb", null, "/pu.se/", "Les plantes poussent.", "The plants grow."],
        ["planter", null, "to plant", "To place in the ground to grow.", "Verb", null, "/plɑ̃.te/", "Nous allons planter un arbre.", "We are going to plant a tree."],
        ["protéger", null, "to protect", "To keep safe from harm.", "Verb", null, "/pʁɔ.te.ʒe/", "Il faut protéger la nature.", "We must protect nature."],
        ["éclore", null, "to bloom", "To open into a flower.", "Verb", null, "/e.klɔʁ/", "Les fleurs vont éclore.", "The flowers will bloom."],
        ["observer", null, "to observe", "To watch carefully.", "Verb", null, "/ɔb.sɛʁ.ve/", "Nous aimons observer les oiseaux.", "We like observing birds."],
        ["couler", null, "to flow", "To move steadily, like a liquid.", "Verb", null, "/ku.le/", "L'eau commence à couler.", "The water begins to flow."],
        ["grandir", null, "to grow", "To increase in size or maturity.", "Verb", null, "/ɡʁɑ̃.diʁ/", "Les arbres grandissent vite.", "The trees grow quickly."],
        ["grimper", null, "to climb", "To go up using the hands and feet.", "Verb", null, "/ɡʁɛ̃.pe/", "Ils grimpent la colline.", "They climb the hill."],
        ["respirer", null, "to breathe", "To take air into the lungs.", "Verb", null, "/ʁɛs.pi.ʁe/", "Respire l'air frais.", "Breathe the fresh air."],
        ["briller", null, "to shine", "To give out bright light.", "Verb", null, "/bʁi.je/", "Le soleil brille.", "The sun shines."],
        ["tomber", null, "to fall", "To move downward, typically rapidly.", "Verb", null, "/tɔ̃.be/", "Les feuilles tombent.", "The leaves fall."],
      ],
      Emotions: [
        ["émotion", null, "emotion", "A strong feeling deriving from circumstances.", "Noun", "Feminine", "/e.mɔ.sjɔ̃/", "L'émotion est forte.", "The emotion is strong."],
        ["sentiment", null, "feeling", "An emotional state or reaction.", "Noun", "Masculine", "/sɑ̃.ti.mɑ̃/", "Il cache ses sentiments.", "He hides his feelings."],
        ["joie", null, "joy", "A feeling of great pleasure.", "Noun", "Feminine", "/ʒwa/", "La joie remplit la pièce.", "Joy fills the room."],
        ["bonheur", null, "happiness", "The state of being happy.", "Noun", "Masculine", "/bɔ.nœʁ/", "Le bonheur est précieux.", "Happiness is precious."],
        ["tristesse", null, "sadness", "The condition of being sad.", "Noun", "Feminine", "/tʁis.tɛs/", "La tristesse l'envahit.", "Sadness overwhelms him."],
        ["peur", null, "fear", "An unpleasant emotion caused by threat.", "Noun", "Feminine", "/pœʁ/", "La peur est naturelle.", "Fear is natural."],
        ["colère", null, "anger", "A strong feeling of annoyance.", "Noun", "Feminine", "/kɔ.lɛʁ/", "Sa colère est visible.", "His anger is visible."],
        ["surprise", null, "surprise", "An unexpected event or emotion.", "Noun", "Feminine", "/syʁ.pʁiz/", "La surprise est agréable.", "The surprise is pleasant."],
        ["amour", null, "love", "A strong feeling of affection.", "Noun", "Masculine", "/a.muʁ/", "L'amour est puissant.", "Love is powerful."],
        ["haine", null, "hatred", "An intense dislike.", "Noun", "Feminine", "/ɛn/", "La haine est destructrice.", "Hatred is destructive."],
        ["honte", null, "shame", "A painful feeling of humiliation.", "Noun", "Feminine", "/ɔ̃t/", "La honte disparaît.", "The shame disappears."],
        ["fierté", null, "pride", "A feeling of deep satisfaction.", "Noun", "Feminine", "/fjɛʁ.te/", "Sa fierté est visible.", "His pride is visible."],
        ["jalousie", null, "jealousy", "A feeling of envy towards another's advantages.", "Noun", "Feminine", "/ʒa.lu.zi/", "La jalousie le ronge.", "Jealousy eats at him."],
        ["espoir", null, "hope", "A feeling of expectation and desire.", "Noun", "Masculine", "/ɛs.pwaʁ/", "L'espoir demeure.", "Hope remains."],
        ["désespoir", null, "despair", "A feeling of hopelessness.", "Noun", "Masculine", "/de.zɛs.pwaʁ/", "Le désespoir le submerge.", "Despair overwhelms him."],
        ["anxiété", null, "anxiety", "A feeling of worry or unease.", "Noun", "Feminine", "/ɑ̃k.sje.te/", "L'anxiété diminue.", "The anxiety decreases."],
        ["stress", null, "stress", "A state of mental or emotional strain.", "Noun", "Masculine", "/stʁɛs/", "Le stress l'accable.", "Stress weighs on him."],
        ["calme", null, "calm", "A state of peace and quiet.", "Noun", "Masculine", "/kalm/", "Le calme revient.", "Calm returns."],
        ["sérénité", null, "serenity", "The state of being calm and peaceful.", "Noun", "Feminine", "/se.ʁe.ni.te/", "Sa sérénité est admirable.", "His serenity is admirable."],
        ["solitude", null, "loneliness", "Sadness because one has no friends or company.", "Noun", "Feminine", "/sɔ.li.tyd/", "La solitude pèse.", "Loneliness weighs heavy."],
        ["nostalgie", null, "nostalgia", "A sentimental longing for the past.", "Noun", "Feminine", "/nɔs.tal.ʒi/", "La nostalgie l'envahit.", "Nostalgia overwhelms him."],
        ["enthousiasme", null, "enthusiasm", "Intense enjoyment or interest.", "Noun", "Masculine", "/ɑ̃.tu.zjasm/", "Son enthousiasme est contagieux.", "His enthusiasm is contagious."],
        ["déception", null, "disappointment", "Sadness caused by failing to fulfil hopes.", "Noun", "Feminine", "/de.sɛp.sjɔ̃/", "Sa déception est visible.", "His disappointment is visible."],
        ["gratitude", null, "gratitude", "The quality of being thankful.", "Noun", "Feminine", "/ɡʁa.ti.tyd/", "Je ressens de la gratitude.", "I feel gratitude."],
        ["confiance", null, "confidence", "A feeling of self-assurance.", "Noun", "Feminine", "/kɔ̃.fjɑ̃s/", "Elle a confiance en elle.", "She has confidence in herself."],
        ["doute", null, "doubt", "A feeling of uncertainty.", "Noun", "Masculine", "/dut/", "Le doute persiste.", "Doubt persists."],
        ["courage", null, "courage", "The ability to face danger or difficulty.", "Noun", "Masculine", "/ku.ʁaʒ/", "Il a beaucoup de courage.", "He has a lot of courage."],
        ["lâcheté", null, "cowardice", "Lack of bravery.", "Noun", "Feminine", "/laʃ.te/", "La lâcheté est méprisée.", "Cowardice is despised."],
        ["générosité", null, "generosity", "The quality of being kind and giving.", "Noun", "Feminine", "/ʒe.ne.ʁɔ.zi.te/", "Sa générosité est connue.", "His generosity is well-known."],
        ["égoïsme", null, "selfishness", "The quality of caring only about oneself.", "Noun", "Masculine", "/e.ɡɔ.ism/", "L'égoïsme nuit aux autres.", "Selfishness harms others."],
        ["heureux", null, "happy", "Feeling pleasure or contentment.", "Adjective", null, "/ø.ʁø/", "Je suis heureux.", "I am happy."],
        ["triste", null, "sad", "Feeling sorrow.", "Adjective", null, "/tʁist/", "Elle est triste.", "She is sad."],
        ["fâché", null, "angry", "Feeling strong displeasure.", "Adjective", null, "/fa.ʃe/", "Il est fâché.", "He is angry."],
        ["inquiet", null, "worried", "Anxious about potential problems.", "Adjective", null, "/ɛ̃.kjɛ/", "Il semble inquiet.", "He seems worried."],
        ["surpris", null, "surprised", "Feeling mild astonishment.", "Adjective", null, "/syʁ.pʁi/", "Il est surpris.", "He is surprised."],
        ["nerveux", null, "nervous", "Easily agitated or alarmed.", "Adjective", null, "/nɛʁ.vø/", "Je suis nerveux.", "I am nervous."],
        ["reconnaissant", null, "grateful", "Feeling thankful.", "Adjective", null, "/ʁə.kɔ.nɛ.sɑ̃/", "Nous sommes reconnaissants.", "We are grateful."],
        ["fier", null, "proud", "Feeling deep satisfaction.", "Adjective", null, "/fjɛʁ/", "Elle est fière de lui.", "She is proud of him."],
        ["jaloux", null, "jealous", "Feeling envy towards another's advantages.", "Adjective", null, "/ʒa.lu/", "Il est jaloux.", "He is jealous."],
        ["furieux", null, "furious", "Extremely angry.", "Adjective", null, "/fy.ʁjø/", "Il est furieux.", "He is furious."],
        ["content", null, "glad", "Pleased; happy.", "Adjective", null, "/kɔ̃.tɑ̃/", "Je suis content de te voir.", "I'm glad to see you."],
        ["tranquille", null, "tranquil", "Free from disturbance.", "Adjective", null, "/tʁɑ̃.kil/", "Elle est tranquille.", "She is tranquil."],
        ["ému", null, "moved", "Affected by strong emotion.", "Adjective", null, "/e.my/", "Il est très ému.", "He is very moved."],
        ["pleurer", null, "to cry", "To shed tears.", "Verb", null, "/plø.ʁe/", "Elle commence à pleurer.", "She starts to cry."],
        ["rire", null, "to laugh", "To make sounds expressing amusement.", "Verb", null, "/ʁiʁ/", "Ils aiment rire.", "They like to laugh."],
        ["sourire", null, "to smile", "To form a smile.", "Verb", null, "/su.ʁiʁ/", "Elle aime sourire.", "She likes to smile."],
        ["aimer", null, "to love", "To feel deep affection.", "Verb", null, "/e.me/", "Nous aimons voyager.", "We love traveling."],
        ["détester", null, "to hate", "To feel intense dislike.", "Verb", null, "/de.tɛs.te/", "Il déteste attendre.", "He hates waiting."],
        ["espérer", null, "to hope", "To want something to happen.", "Verb", null, "/ɛs.pe.ʁe/", "J'espère réussir.", "I hope to succeed."],
        ["craindre", null, "to fear", "To be afraid of.", "Verb", null, "/kʁɛ̃dʁ/", "Elle craint l'orage.", "She fears the storm."],
        ["s'inquiéter", null, "to worry", "To feel anxious.", "Verb", null, "/sɛ̃.kje.te/", "Ne t'inquiète pas.", "Don't worry."],
        ["se réjouir", null, "to rejoice", "To feel or show great joy.", "Verb", null, "/sə ʁe.ʒwiʁ/", "Elle se réjouit de te voir.", "She rejoices at seeing you."],
        ["s'énerver", null, "to get angry", "To become angry.", "Verb", null, "/se.nɛʁ.ve/", "Il ne faut pas s'énerver.", "You should not get angry."],
        ["regretter", null, "to regret", "To feel sorrow about something.", "Verb", null, "/ʁə.ɡʁɛ.te/", "Je regrette cette décision.", "I regret this decision."],
        ["admirer", null, "to admire", "To regard with respect or warm approval.", "Verb", null, "/ad.mi.ʁe/", "J'admire son courage.", "I admire his courage."],
        ["en avoir marre", null, "to be fed up", "To be tired of something.", "Verb", null, "/ɑ̃.n‿a.vwaʁ maʁ/", "J'en ai marre.", "I'm fed up."],
        ["se sentir", null, "to feel", "To experience an emotion or sensation.", "Verb", null, "/sə sɑ̃.tiʁ/", "Je me sens bien.", "I feel good."],
        ["se calmer", null, "to calm down", "To become less agitated.", "Verb", null, "/sə kal.me/", "Calme-toi.", "Calm down."],
      ],
      Family: [
        ["famille", null, "family", "A group of parents and children.", "Noun", "Feminine", "/fa.mij/", "Ma famille est nombreuse.", "My family is large."],
        ["mère", null, "mother", "A woman in relation to her child.", "Noun", "Feminine", "/mɛʁ/", "Ma mère cuisine bien.", "My mother cooks well."],
        ["père", null, "father", "A man in relation to his child.", "Noun", "Masculine", "/pɛʁ/", "Mon père travaille.", "My father works."],
        ["parent", null, "parent", "A person's father or mother.", "Noun", "Masculine", "/pa.ʁɑ̃/", "Le parent accompagne l'enfant.", "The parent accompanies the child."],
        ["frère", null, "brother", "A man or boy in relation to other children of his parents.", "Noun", "Masculine", "/fʁɛʁ/", "Mon frère est plus grand.", "My brother is taller."],
        ["sœur", null, "sister", "A woman or girl in relation to other children of her parents.", "Noun", "Feminine", "/sœʁ/", "Ma sœur étudie.", "My sister studies."],
        ["demi-frère", null, "half-brother", "A brother with one parent in common.", "Noun", "Masculine", "/də.mi.fʁɛʁ/", "Mon demi-frère vit à Lyon.", "My half-brother lives in Lyon."],
        ["demi-sœur", null, "half-sister", "A sister with one parent in common.", "Noun", "Feminine", "/də.mi.sœʁ/", "Ma demi-sœur est plus jeune.", "My half-sister is younger."],
        ["enfant", null, "child", "A young human being below the age of puberty.", "Noun", "Masculine", "/ɑ̃.fɑ̃/", "L'enfant joue.", "The child plays."],
        ["fils", null, "son", "A boy or man in relation to his parents.", "Noun", "Masculine", "/fis/", "Mon fils a dix ans.", "My son is ten."],
        ["fille", null, "daughter / girl", "A girl or woman in relation to her parents.", "Noun", "Feminine", "/fij/", "Ma fille va à l'école.", "My daughter goes to school."],
        ["bébé", null, "baby", "A very young child.", "Noun", "Masculine", "/be.be/", "Le bébé dort.", "The baby sleeps."],
        ["grand-père", null, "grandfather", "The father of one's father or mother.", "Noun", "Masculine", "/ɡʁɑ̃.pɛʁ/", "Mon grand-père raconte des histoires.", "My grandfather tells stories."],
        ["grand-mère", null, "grandmother", "The mother of one's father or mother.", "Noun", "Feminine", "/ɡʁɑ̃.mɛʁ/", "Ma grand-mère est sage.", "My grandmother is wise."],
        ["arrière-grand-père", null, "great-grandfather", "The father of one's grandparent.", "Noun", "Masculine", "/a.ʁjɛʁ.ɡʁɑ̃.pɛʁ/", "Mon arrière-grand-père est vieux.", "My great-grandfather is old."],
        ["oncle", null, "uncle", "The brother of one's father or mother.", "Noun", "Masculine", "/ɔ̃kl/", "Mon oncle habite loin.", "My uncle lives far away."],
        ["tante", null, "aunt", "The sister of one's father or mother.", "Noun", "Feminine", "/tɑ̃t/", "Ma tante est gentille.", "My aunt is kind."],
        ["cousin", null, "cousin (male)", "A son of one's uncle or aunt.", "Noun", "Masculine", "/ku.zɛ̃/", "Mon cousin arrive demain.", "My cousin arrives tomorrow."],
        ["cousine", null, "cousin (female)", "A daughter of one's uncle or aunt.", "Noun", "Feminine", "/ku.zin/", "Ma cousine étudie à Paris.", "My cousin studies in Paris."],
        ["neveu", null, "nephew", "A son of one's brother or sister.", "Noun", "Masculine", "/nə.vø/", "Mon neveu est petit.", "My nephew is small."],
        ["nièce", null, "niece", "A daughter of one's brother or sister.", "Noun", "Feminine", "/njɛs/", "Ma nièce est adorable.", "My niece is adorable."],
        ["mari", null, "husband", "A married man considered in relation to his spouse.", "Noun", "Masculine", "/ma.ʁi/", "Son mari travaille ici.", "Her husband works here."],
        ["femme", null, "wife / woman", "A married woman considered in relation to her spouse.", "Noun", "Feminine", "/fam/", "Sa femme est médecin.", "His wife is a doctor."],
        ["époux", null, "spouse (male)", "A husband.", "Noun", "Masculine", "/e.pu/", "Son époux est charmant.", "Her spouse is charming."],
        ["épouse", null, "spouse (female)", "A wife.", "Noun", "Feminine", "/e.puz/", "Son épouse est professeur.", "His spouse is a teacher."],
        ["fiancé", null, "fiancé", "A man engaged to be married.", "Noun", "Masculine", "/fjɑ̃.se/", "Son fiancé est gentil.", "Her fiancé is kind."],
        ["fiancée", null, "fiancée", "A woman engaged to be married.", "Noun", "Feminine", "/fjɑ̃.se/", "Sa fiancée est belle.", "His fiancée is beautiful."],
        ["beau-père", null, "stepfather / father-in-law", "The husband of one's mother or the father of one's spouse.", "Noun", "Masculine", "/bo.pɛʁ/", "Mon beau-père est sympa.", "My stepfather is nice."],
        ["belle-mère", null, "stepmother / mother-in-law", "The wife of one's father or the mother of one's spouse.", "Noun", "Feminine", "/bɛl.mɛʁ/", "Ma belle-mère cuisine bien.", "My stepmother cooks well."],
        ["beau-frère", null, "brother-in-law", "The brother of one's spouse.", "Noun", "Masculine", "/bo.fʁɛʁ/", "Mon beau-frère est drôle.", "My brother-in-law is funny."],
        ["belle-sœur", null, "sister-in-law", "The sister of one's spouse.", "Noun", "Feminine", "/bɛl.sœʁ/", "Ma belle-sœur est médecin.", "My sister-in-law is a doctor."],
        ["parrain", null, "godfather", "A man who presents a child at baptism.", "Noun", "Masculine", "/pa.ʁɛ̃/", "Mon parrain est généreux.", "My godfather is generous."],
        ["marraine", null, "godmother", "A woman who presents a child at baptism.", "Noun", "Feminine", "/ma.ʁɛn/", "Ma marraine est attentionnée.", "My godmother is caring."],
        ["aîné", null, "eldest", "Having lived the longest among siblings.", "Adjective", null, "/e.ne/", "Mon frère aîné travaille.", "My older brother works."],
        ["cadet", null, "youngest", "Younger than the other siblings.", "Adjective", null, "/ka.dɛ/", "Mon frère cadet étudie.", "My younger brother studies."],
        ["jeune", null, "young", "Having lived for only a short time.", "Adjective", null, "/ʒœn/", "Le jeune enfant dort.", "The young child sleeps."],
        ["vieux", null, "old", "Having lived for a long time.", "Adjective", null, "/vjø/", "Mon grand-père est vieux.", "My grandfather is old."],
        ["marié", null, "married", "Joined in marriage.", "Adjective", null, "/ma.ʁje/", "Ils sont mariés.", "They are married."],
        ["célibataire", null, "single", "Not married.", "Adjective", null, "/se.li.ba.tɛʁ/", "Il est célibataire.", "He is single."],
        ["divorcé", null, "divorced", "Legally dissolved from a marriage.", "Adjective", null, "/di.vɔʁ.se/", "Elle est divorcée.", "She is divorced."],
        ["veuf", null, "widower", "A man whose spouse has died.", "Adjective", null, "/vœf/", "Il est veuf.", "He is a widower."],
        ["adoptif", null, "adoptive", "Related by adoption.", "Adjective", null, "/a.dɔp.tif/", "Son père adoptif est gentil.", "His adoptive father is kind."],
        ["fraternel", null, "brotherly", "Of or like a brother.", "Adjective", null, "/fʁa.tɛʁ.nɛl/", "Leur lien est fraternel.", "Their bond is brotherly."],
        ["maternel", null, "maternal", "Of or like a mother.", "Adjective", null, "/ma.tɛʁ.nɛl/", "Son instinct maternel est fort.", "Her maternal instinct is strong."],
        ["paternel", null, "paternal", "Of or like a father.", "Adjective", null, "/pa.tɛʁ.nɛl/", "Son amour paternel est grand.", "His paternal love is great."],
        ["affectueux", null, "affectionate", "Readily showing fondness.", "Adjective", null, "/a.fɛk.tɥø/", "Il est très affectueux.", "He is very affectionate."],
        ["proche", null, "close", "Emotionally intimate.", "Adjective", null, "/pʁɔʃ/", "Nous sommes très proches.", "We are very close."],
        ["naître", null, "to be born", "To come into existence.", "Verb", null, "/nɛtʁ/", "Le bébé vient de naître.", "The baby has just been born."],
        ["grandir", null, "to grow up", "To become older.", "Verb", null, "/ɡʁɑ̃.diʁ/", "Les enfants grandissent vite.", "Children grow up quickly."],
        ["élever", null, "to raise", "To bring up a child.", "Verb", null, "/el.ve/", "Ils élèvent trois enfants.", "They raise three children."],
        ["respecter", null, "to respect", "To show admiration or esteem.", "Verb", null, "/ʁɛs.pɛk.te/", "Nous devons respecter nos parents.", "We must respect our parents."],
        ["aider", null, "to help", "To assist.", "Verb", null, "/e.de/", "Nous devons aider nos parents.", "We must help our parents."],
        ["partager", null, "to share", "To give a portion to others.", "Verb", null, "/paʁ.ta.ʒe/", "Nous partageons un repas.", "We share a meal."],
        ["épouser", null, "to marry", "To take as a spouse.", "Verb", null, "/e.pu.ze/", "Ils vont se marier.", "They are going to get married."],
        ["divorcer", null, "to divorce", "To legally dissolve a marriage.", "Verb", null, "/di.vɔʁ.se/", "Ils vont divorcer.", "They are going to divorce."],
        ["s'occuper de", null, "to look after", "To take care of.", "Verb", null, "/sɔ.ky.pe də/", "Elle s'occupe de sa mère.", "She looks after her mother."],
        ["rendre visite", null, "to visit", "To go to see someone.", "Verb", null, "/ʁɑ̃dʁ vi.zit/", "Je rends visite à mes grands-parents.", "I visit my grandparents."],
        ["téléphoner", null, "to call", "To use a telephone to contact someone.", "Verb", null, "/te.le.fɔ.ne/", "Je téléphone à ma mère.", "I call my mother."],
        ["aimer", null, "to love", "To feel deep affection.", "Verb", null, "/e.me/", "J'aime ma famille.", "I love my family."],
      ],
      "Daily Life": [
        ["maison", null, "house", "A building for human habitation.", "Noun", "Feminine", "/mɛ.zɔ̃/", "Ma maison est petite.", "My house is small."],
        ["appartement", null, "apartment", "A set of rooms within a larger building.", "Noun", "Masculine", "/a.paʁ.tə.mɑ̃/", "Mon appartement est au troisième étage.", "My apartment is on the third floor."],
        ["immeuble", null, "building", "A structure with a roof and walls.", "Noun", "Masculine", "/i.mœbl/", "L'immeuble est neuf.", "The building is new."],
        ["chambre", null, "bedroom", "A room for sleeping.", "Noun", "Feminine", "/ʃɑ̃bʁ/", "Ma chambre est petite.", "My bedroom is small."],
        ["salon", null, "living room", "A room for relaxing and entertaining.", "Noun", "Masculine", "/sa.lɔ̃/", "Le salon est spacieux.", "The living room is spacious."],
        ["cuisine", null, "kitchen", "A room for preparing food.", "Noun", "Feminine", "/kɥi.zin/", "La cuisine est propre.", "The kitchen is clean."],
        ["salle de bain", null, "bathroom", "A room with a bath or shower.", "Noun", "Feminine", "/sal də bɛ̃/", "La salle de bain est grande.", "The bathroom is large."],
        ["toilettes", null, "toilet", "A room with a toilet.", "Noun", "Feminine", "/twa.lɛt/", "Où sont les toilettes ?", "Where is the toilet?"],
        ["porte", null, "door", "A hinged barrier used to close an entrance.", "Noun", "Feminine", "/pɔʁt/", "Ferme la porte.", "Close the door."],
        ["fenêtre", null, "window", "An opening in a wall fitted with glass.", "Noun", "Feminine", "/fə.nɛtʁ/", "Ouvre la fenêtre.", "Open the window."],
        ["mur", null, "wall", "A vertical structure enclosing an area.", "Noun", "Masculine", "/myʁ/", "Le mur est blanc.", "The wall is white."],
        ["sol", null, "floor", "The lower surface of a room.", "Noun", "Masculine", "/sɔl/", "Le sol est propre.", "The floor is clean."],
        ["plafond", null, "ceiling", "The upper interior surface of a room.", "Noun", "Masculine", "/pla.fɔ̃/", "Le plafond est haut.", "The ceiling is high."],
        ["escalier", null, "stairs", "A set of steps leading from one floor to another.", "Noun", "Masculine", "/ɛs.ka.lje/", "L'escalier est raide.", "The stairs are steep."],
        ["ascenseur", null, "elevator", "A platform or cage for moving people between floors.", "Noun", "Masculine", "/a.sɑ̃.sœʁ/", "L'ascenseur est en panne.", "The elevator is broken."],
        ["table", null, "table", "A piece of furniture with a flat top and legs.", "Noun", "Feminine", "/tabl/", "La table est mise.", "The table is set."],
        ["chaise", null, "chair", "A seat for one person.", "Noun", "Feminine", "/ʃɛz/", "Prends une chaise.", "Take a chair."],
        ["fauteuil", null, "armchair", "A comfortable chair with side supports.", "Noun", "Masculine", "/fo.tœj/", "Le fauteuil est confortable.", "The armchair is comfortable."],
        ["canapé", null, "sofa", "A long upholstered seat for several people.", "Noun", "Masculine", "/ka.na.pe/", "Le canapé est doux.", "The sofa is soft."],
        ["lit", null, "bed", "A piece of furniture for sleeping.", "Noun", "Masculine", "/li/", "Le lit est confortable.", "The bed is comfortable."],
        ["oreiller", null, "pillow", "A cushion for the head in bed.", "Noun", "Masculine", "/ɔ.ʁɛ.je/", "L'oreiller est moelleux.", "The pillow is soft."],
        ["couverture", null, "blanket", "A warm covering for a bed.", "Noun", "Feminine", "/ku.vɛʁ.tyʁ/", "La couverture est chaude.", "The blanket is warm."],
        ["drap", null, "sheet", "A large piece of cloth used on a bed.", "Noun", "Masculine", "/dʁa/", "Le drap est propre.", "The sheet is clean."],
        ["armoire", null, "wardrobe", "A tall cupboard for hanging clothes.", "Noun", "Feminine", "/aʁ.mwaʁ/", "L'armoire est pleine.", "The wardrobe is full."],
        ["commode", null, "dresser", "A piece of furniture with drawers.", "Noun", "Feminine", "/kɔ.mɔd/", "La commode est en bois.", "The dresser is wooden."],
        ["étagère", null, "shelf", "A flat horizontal surface for holding items.", "Noun", "Feminine", "/e.ta.ʒɛʁ/", "L'étagère est haute.", "The shelf is high."],
        ["lampe", null, "lamp", "A device for giving light.", "Noun", "Feminine", "/lɑ̃p/", "La lampe est allumée.", "The lamp is on."],
        ["miroir", null, "mirror", "A reflective surface showing a person's image.", "Noun", "Masculine", "/mi.ʁwaʁ/", "Le miroir est cassé.", "The mirror is broken."],
        ["horloge", null, "clock", "An instrument for measuring time.", "Noun", "Feminine", "/ɔʁ.lɔʒ/", "L'horloge indique midi.", "The clock shows noon."],
        ["tapis", null, "rug", "A floor covering made of thick woven material.", "Noun", "Masculine", "/ta.pi/", "Le tapis est rouge.", "The rug is red."],
        ["rideau", null, "curtain", "A piece of cloth hung to cover a window.", "Noun", "Masculine", "/ʁi.do/", "Le rideau est ouvert.", "The curtain is open."],
        ["clé", null, "key", "A small metal object for opening a lock.", "Noun", "Feminine", "/kle/", "J'ai perdu ma clé.", "I lost my key."],
        ["réveil", null, "alarm clock", "A clock that wakes a sleeper.", "Noun", "Masculine", "/ʁe.vɛj/", "Le réveil sonne tôt.", "The alarm clock rings early."],
        ["douche", null, "shower", "A cubicle for washing.", "Noun", "Feminine", "/duʃ/", "La douche est chaude.", "The shower is hot."],
        ["bain", null, "bath", "A tub filled with water for washing.", "Noun", "Masculine", "/bɛ̃/", "Le bain est prêt.", "The bath is ready."],
        ["savon", null, "soap", "A substance used with water for washing.", "Noun", "Masculine", "/sa.vɔ̃/", "Le savon sent bon.", "The soap smells good."],
        ["serviette", null, "towel", "An absorbent cloth for drying.", "Noun", "Feminine", "/sɛʁ.vjɛt/", "La serviette est propre.", "The towel is clean."],
        ["brosse à dents", null, "toothbrush", "A small brush for cleaning the teeth.", "Noun", "Feminine", "/bʁɔs a dɑ̃/", "Ma brosse à dents est neuve.", "My toothbrush is new."],
        ["dentifrice", null, "toothpaste", "A paste for cleaning the teeth.", "Noun", "Masculine", "/dɑ̃.ti.fʁis/", "Le dentifrice est fini.", "The toothpaste is finished."],
        ["shampooing", null, "shampoo", "A liquid for washing hair.", "Noun", "Masculine", "/ʃɑ̃.pwɛ̃/", "Le shampooing sent la fraise.", "The shampoo smells like strawberry."],
        ["peigne", null, "comb", "A tool for arranging the hair.", "Noun", "Masculine", "/pɛɲ/", "Le peigne est dans le tiroir.", "The comb is in the drawer."],
        ["propre", null, "clean", "Free from dirt or marks.", "Adjective", null, "/pʁɔpʁ/", "La chambre est propre.", "The room is clean."],
        ["sale", null, "dirty", "Covered or marked with dirt.", "Adjective", null, "/sal/", "Mes vêtements sont sales.", "My clothes are dirty."],
        ["rangé", null, "tidy", "Arranged neatly.", "Adjective", null, "/ʁɑ̃.ʒe/", "La cuisine est rangée.", "The kitchen is tidy."],
        ["occupé", null, "busy", "Having a great deal to do.", "Adjective", null, "/ɔ.ky.pe/", "Je suis occupé aujourd'hui.", "I am busy today."],
        ["fatigué", null, "tired", "In need of rest or sleep.", "Adjective", null, "/fa.ti.ɡe/", "Je suis fatigué ce soir.", "I am tired tonight."],
        ["se réveiller", null, "to wake up", "To stop sleeping.", "Verb", null, "/sə ʁe.vɛ.je/", "Je me réveille à sept heures.", "I wake up at seven."],
        ["se lever", null, "to get up", "To rise from bed.", "Verb", null, "/sə lə.ve/", "Je dois me lever tôt.", "I must get up early."],
        ["se laver", null, "to wash oneself", "To clean oneself.", "Verb", null, "/sə la.ve/", "Elle va se laver.", "She is going to wash herself."],
        ["se brosser", null, "to brush", "To clean with a brush.", "Verb", null, "/sə bʁɔ.se/", "Je me brosse les dents.", "I brush my teeth."],
        ["s'habiller", null, "to get dressed", "To put on clothes.", "Verb", null, "/sa.bi.je/", "Il s'habille rapidement.", "He gets dressed quickly."],
        ["se coucher", null, "to go to bed", "To go to sleep.", "Verb", null, "/sə ku.ʃe/", "Je vais me coucher tôt.", "I am going to bed early."],
        ["se reposer", null, "to rest", "To stop activity for a while.", "Verb", null, "/sə ʁə.po.ze/", "Il veut se reposer.", "He wants to rest."],
        ["travailler", null, "to work", "To perform a job.", "Verb", null, "/tʁa.va.je/", "Nous devons travailler.", "We must work."],
        ["ranger", null, "to tidy", "To put things in their proper places.", "Verb", null, "/ʁɑ̃.ʒe/", "Je dois ranger ma chambre.", "I must tidy my room."],
        ["nettoyer", null, "to clean", "To free from dirt.", "Verb", null, "/ne.twa.je/", "Je vais nettoyer la maison.", "I will clean the house."],
        ["laver", null, "to wash", "To clean with water.", "Verb", null, "/la.ve/", "Je vais laver les assiettes.", "I will wash the plates."],
        ["cuisiner", null, "to cook", "To prepare food.", "Verb", null, "/kɥi.zi.ne/", "J'aime cuisiner le soir.", "I like cooking in the evening."],
        ["manger", null, "to eat", "To consume food.", "Verb", null, "/mɑ̃.ʒe/", "Nous allons manger.", "We are going to eat."],
        ["boire", null, "to drink", "To take liquid into the mouth.", "Verb", null, "/bwaʁ/", "Elle boit du café.", "She drinks coffee."],
      ],
      Shopping: [
        ["magasin", null, "store", "A shop.", "Noun", "Masculine", "/ma.ɡa.zɛ̃/", "Le magasin ferme bientôt.", "The store closes soon."],
        ["boutique", null, "boutique", "A small shop selling fashionable items.", "Noun", "Feminine", "/bu.tik/", "La boutique ferme bientôt.", "The boutique closes soon."],
        ["supermarché", null, "supermarket", "A large self-service grocery store.", "Noun", "Masculine", "/sy.pɛʁ.maʁ.ʃe/", "Le supermarché est ouvert.", "The supermarket is open."],
        ["marché", null, "market", "A regular gathering for purchase and sale.", "Noun", "Masculine", "/maʁ.ʃe/", "Le marché est animé.", "The market is lively."],
        ["centre commercial", null, "shopping mall", "A large building containing many shops.", "Noun", "Masculine", "/sɑ̃tʁ kɔ.mɛʁ.sjal/", "Le centre commercial est immense.", "The mall is huge."],
        ["pharmacie", null, "pharmacy", "A shop where medicines are prepared and sold.", "Noun", "Feminine", "/faʁ.ma.si/", "La pharmacie est ouverte.", "The pharmacy is open."],
        ["boulangerie", null, "bakery", "A shop that sells bread and cakes.", "Noun", "Feminine", "/bu.lɑ̃ʒ.ʁi/", "La boulangerie sent bon.", "The bakery smells good."],
        ["pâtisserie", null, "pastry shop", "A shop that sells pastries and cakes.", "Noun", "Feminine", "/pa.ti.sʁi/", "La pâtisserie est réputée.", "The pastry shop is famous."],
        ["boucherie", null, "butcher shop", "A shop that sells meat.", "Noun", "Feminine", "/buʃ.ʁi/", "La boucherie est fermée.", "The butcher shop is closed."],
        ["librairie", null, "bookshop", "A shop that sells books.", "Noun", "Feminine", "/li.bʁɛ.ʁi/", "J'aime cette librairie.", "I like this bookshop."],
        ["prix", null, "price", "The amount of money expected for something.", "Noun", "Masculine", "/pʁi/", "Le prix est raisonnable.", "The price is reasonable."],
        ["client", null, "customer", "A person buying goods or services.", "Noun", "Masculine", "/kli.jɑ̃/", "Le client attend son tour.", "The customer waits for his turn."],
        ["vendeur", null, "salesperson", "A person who sells goods.", "Noun", "Masculine", "/vɑ̃.dœʁ/", "Le vendeur est aimable.", "The salesperson is friendly."],
        ["caisse", null, "checkout", "A counter where payment is made.", "Noun", "Feminine", "/kɛs/", "La caisse est ouverte.", "The checkout is open."],
        ["panier", null, "basket", "A container for shopping.", "Noun", "Masculine", "/pa.nje/", "Le panier est plein.", "The basket is full."],
        ["chariot", null, "shopping cart", "A cart used in a supermarket.", "Noun", "Masculine", "/ʃa.ʁjo/", "Le chariot est lourd.", "The cart is heavy."],
        ["carte bancaire", null, "bank card", "A plastic card for making payments.", "Noun", "Feminine", "/kaʁt bɑ̃.kɛʁ/", "J'ai oublié ma carte bancaire.", "I forgot my bank card."],
        ["espèces", null, "cash", "Money in the form of coins or notes.", "Noun", "Feminine", "/ɛs.pɛs/", "Je paie en espèces.", "I pay in cash."],
        ["monnaie", null, "change", "Coins of low value.", "Noun", "Feminine", "/mɔ.nɛ/", "Gardez la monnaie.", "Keep the change."],
        ["reçu", null, "receipt", "A printed acknowledgment of payment.", "Noun", "Masculine", "/ʁə.sy/", "Voici votre reçu.", "Here is your receipt."],
        ["facture", null, "invoice", "A list of goods sent with amounts owed.", "Noun", "Feminine", "/fak.tyʁ/", "La facture est dans l'enveloppe.", "The invoice is in the envelope."],
        ["remise", null, "discount", "A reduction in price.", "Noun", "Feminine", "/ʁə.miz/", "La remise est importante.", "The discount is significant."],
        ["solde", null, "sale", "A period when goods are sold at reduced prices.", "Noun", "Masculine", "/sɔld/", "Les soldes commencent demain.", "The sales start tomorrow."],
        ["promotion", null, "promotion", "A special offer at a lower price.", "Noun", "Feminine", "/pʁɔ.mɔ.sjɔ̃/", "Cette promotion est intéressante.", "This promotion is interesting."],
        ["taille", null, "size", "The dimensions of an item.", "Noun", "Feminine", "/taj/", "Quelle taille cherchez-vous ?", "What size are you looking for?"],
        ["essayage", null, "fitting", "The act of trying on clothes.", "Noun", "Masculine", "/e.sɛ.jaʒ/", "Les cabines d'essayage sont là.", "The fitting rooms are there."],
        ["cabine", null, "fitting room", "A small room for trying on clothes.", "Noun", "Feminine", "/ka.bin/", "La cabine est libre.", "The fitting room is free."],
        ["vêtement", null, "clothing", "Items worn to cover the body.", "Noun", "Masculine", "/vɛt.mɑ̃/", "Ces vêtements sont chers.", "These clothes are expensive."],
        ["robe", null, "dress", "A one-piece garment for a woman.", "Noun", "Feminine", "/ʁɔb/", "La robe est élégante.", "The dress is elegant."],
        ["chemise", null, "shirt", "A garment for the upper body with sleeves.", "Noun", "Feminine", "/ʃə.miz/", "La chemise est blanche.", "The shirt is white."],
        ["pantalon", null, "trousers", "A garment covering the legs separately.", "Noun", "Masculine", "/pɑ̃.ta.lɔ̃/", "Le pantalon est neuf.", "The trousers are new."],
        ["jupe", null, "skirt", "A garment hanging from the waist.", "Noun", "Feminine", "/ʒyp/", "La jupe est courte.", "The skirt is short."],
        ["manteau", null, "coat", "A garment worn over other clothes for warmth.", "Noun", "Masculine", "/mɑ̃.to/", "Le manteau est chaud.", "The coat is warm."],
        ["veste", null, "jacket", "A short coat.", "Noun", "Feminine", "/vɛst/", "La veste est jolie.", "The jacket is pretty."],
        ["pull", null, "sweater", "A knitted garment for the upper body.", "Noun", "Masculine", "/pyl/", "Le pull est douillet.", "The sweater is cozy."],
        ["chaussures", null, "shoes", "Footwear for protecting the feet.", "Noun", "Feminine", "/ʃo.syʁ/", "Ces chaussures sont belles.", "These shoes are beautiful."],
        ["bottes", null, "boots", "Coverings for the feet and ankles.", "Noun", "Feminine", "/bɔt/", "Les bottes sont en cuir.", "The boots are leather."],
        ["sandales", null, "sandals", "Light open shoes for warm weather.", "Noun", "Feminine", "/sɑ̃.dal/", "Les sandales sont pratiques.", "The sandals are practical."],
        ["chaussettes", null, "socks", "Garments worn on the feet.", "Noun", "Feminine", "/ʃo.sɛt/", "Les chaussettes sont propres.", "The socks are clean."],
        ["chapeau", null, "hat", "A covering for the head.", "Noun", "Masculine", "/ʃa.po/", "Le chapeau est élégant.", "The hat is elegant."],
        ["écharpe", null, "scarf", "A length of fabric worn around the neck.", "Noun", "Feminine", "/e.ʃaʁp/", "L'écharpe est chaude.", "The scarf is warm."],
        ["gants", null, "gloves", "Coverings for the hands.", "Noun", "Masculine", "/ɡɑ̃/", "Les gants sont en laine.", "The gloves are wool."],
        ["bijou", null, "jewel", "A precious ornament.", "Noun", "Masculine", "/bi.ʒu/", "Le bijou est précieux.", "The jewel is precious."],
        ["montre", null, "watch", "A small clock worn on the wrist.", "Noun", "Feminine", "/mɔ̃tʁ/", "La montre est cassée.", "The watch is broken."],
        ["lunettes", null, "glasses", "Frames with lenses worn to aid vision.", "Noun", "Feminine", "/ly.nɛt/", "Mes lunettes sont sales.", "My glasses are dirty."],
        ["cher", null, "expensive", "Costing a lot of money.", "Adjective", null, "/ʃɛʁ/", "Ce produit est cher.", "This product is expensive."],
        ["bon marché", null, "cheap", "Costing little money.", "Adjective", null, "/bɔ̃ maʁ.ʃe/", "Cette chemise est bon marché.", "This shirt is cheap."],
        ["gratuit", null, "free", "Costing nothing.", "Adjective", null, "/ɡʁa.tɥi/", "Le service est gratuit.", "The service is free."],
        ["disponible", null, "available", "Able to be used or obtained.", "Adjective", null, "/dis.pɔ.nibl/", "Le produit est disponible.", "The product is available."],
        ["neuf", null, "new", "Not previously used.", "Adjective", null, "/nœf/", "J'achète un téléphone neuf.", "I am buying a new phone."],
        ["usagé", null, "used", "Previously owned.", "Adjective", null, "/y.za.ʒe/", "Il vend un vélo usagé.", "He sells a used bicycle."],
        ["abordable", null, "affordable", "Inexpensive enough.", "Adjective", null, "/a.bɔʁ.dabl/", "Le prix est abordable.", "The price is affordable."],
        ["élégant", null, "elegant", "Graceful and stylish.", "Adjective", null, "/e.le.ɡɑ̃/", "Cette veste est élégante.", "This jacket is elegant."],
        ["vendre", null, "to sell", "To give something in exchange for money.", "Verb", null, "/vɑ̃dʁ/", "La boutique vend des robes.", "The shop sells dresses."],
        ["acheter", null, "to buy", "To obtain in exchange for payment.", "Verb", null, "/aʃ.te/", "Je veux acheter des chaussures.", "I want to buy shoes."],
        ["payer", null, "to pay", "To give money for goods.", "Verb", null, "/pe.je/", "Je vais payer maintenant.", "I will pay now."],
        ["choisir", null, "to choose", "To pick from a range.", "Verb", null, "/ʃwa.ziʁ/", "Je dois choisir une taille.", "I must choose a size."],
        ["essayer", null, "to try on", "To test clothing for fit.", "Verb", null, "/e.se.je/", "Elle veut essayer la robe.", "She wants to try on the dress."],
        ["comparer", null, "to compare", "To assess similarities and differences.", "Verb", null, "/kɔ̃.pa.ʁe/", "Je veux comparer les prix.", "I want to compare the prices."],
        ["commander", null, "to order", "To request goods.", "Verb", null, "/kɔ.mɑ̃.de/", "Je vais commander en ligne.", "I will order online."],
        ["livrer", null, "to deliver", "To bring goods to a destination.", "Verb", null, "/li.vʁe/", "Le magasin va livrer demain.", "The store will deliver tomorrow."],
        ["retourner", null, "to return", "To give back goods to a store.", "Verb", null, "/ʁə.tuʁ.ne/", "Je veux retourner cet article.", "I want to return this item."],
        ["rendre", null, "to give back", "To return something to its owner.", "Verb", null, "/ʁɑ̃dʁ/", "Rends-moi mon stylo.", "Give me back my pen."],
      ],
      Weather: [
        ["temps", null, "weather", "The state of the atmosphere.", "Noun", "Masculine", "/tɑ̃/", "Le temps est beau.", "The weather is nice."],
        ["climat", null, "climate", "The weather conditions prevailing in an area.", "Noun", "Masculine", "/kli.ma/", "Le climat est doux.", "The climate is mild."],
        ["soleil", null, "sun", "The star at the center of our solar system.", "Noun", "Masculine", "/sɔ.lɛj/", "Le soleil brille.", "The sun is shining."],
        ["pluie", null, "rain", "Moisture falling from the atmosphere in drops.", "Noun", "Feminine", "/plɥi/", "La pluie tombe.", "The rain is falling."],
        ["neige", null, "snow", "Water vapour frozen into ice crystals.", "Noun", "Feminine", "/nɛʒ/", "La neige est blanche.", "The snow is white."],
        ["vent", null, "wind", "The natural movement of the air.", "Noun", "Masculine", "/vɑ̃/", "Le vent souffle fort.", "The wind blows hard."],
        ["nuage", null, "cloud", "A visible mass of condensed water vapour.", "Noun", "Masculine", "/nɥaʒ/", "Un nuage passe.", "A cloud passes."],
        ["orage", null, "storm", "A violent atmospheric disturbance.", "Noun", "Masculine", "/ɔ.ʁaʒ/", "L'orage arrive.", "The storm is coming."],
        ["tempête", null, "tempest", "A violent windy storm.", "Noun", "Feminine", "/tɑ̃.pɛt/", "La tempête fait rage.", "The tempest rages."],
        ["brouillard", null, "fog", "A thick cloud of water droplets.", "Noun", "Masculine", "/bʁu.jaʁ/", "Le brouillard est épais.", "The fog is thick."],
        ["brume", null, "mist", "A light fog.", "Noun", "Feminine", "/bʁym/", "La brume se lève.", "The mist is rising."],
        ["rosée", null, "dew", "Small drops of water on cool surfaces.", "Noun", "Feminine", "/ʁo.ze/", "La rosée brille.", "The dew glistens."],
        ["gel", null, "frost", "A deposit of white ice crystals.", "Noun", "Masculine", "/ʒɛl/", "Le gel est arrivé.", "The frost has come."],
        ["verglas", null, "black ice", "A thin coating of ice on the ground.", "Noun", "Masculine", "/vɛʁ.ɡla/", "Attention au verglas.", "Watch out for black ice."],
        ["chaleur", null, "heat", "The quality of being hot.", "Noun", "Feminine", "/ʃa.lœʁ/", "La chaleur est intense.", "The heat is intense."],
        ["canicule", null, "heatwave", "A period of unusually hot weather.", "Noun", "Feminine", "/ka.ni.kyl/", "La canicule continue.", "The heatwave continues."],
        ["froid", null, "cold", "A low temperature.", "Noun", "Masculine", "/fʁwa/", "Le froid est mordant.", "The cold is biting."],
        ["fraîcheur", null, "coolness", "A state of being cool.", "Noun", "Feminine", "/fʁɛ.ʃœʁ/", "La fraîcheur du matin.", "The coolness of the morning."],
        ["humidité", null, "humidity", "The amount of water vapour in the air.", "Noun", "Feminine", "/y.mi.di.te/", "L'humidité est élevée.", "The humidity is high."],
        ["sécheresse", null, "drought", "A prolonged period of abnormally low rainfall.", "Noun", "Feminine", "/seʃ.ʁɛs/", "La sécheresse est grave.", "The drought is serious."],
        ["inondation", null, "flood", "An overflowing of a large amount of water.", "Noun", "Feminine", "/i.nɔ̃.da.sjɔ̃/", "L'inondation a causé des dégâts.", "The flood caused damage."],
        ["température", null, "temperature", "The degree of heat or cold.", "Noun", "Feminine", "/tɑ̃.pe.ʁa.tyʁ/", "La température baisse.", "The temperature drops."],
        ["degré", null, "degree", "A unit of measurement for temperature.", "Noun", "Masculine", "/də.ɡʁe/", "Il fait vingt degrés.", "It is twenty degrees."],
        ["thermomètre", null, "thermometer", "An instrument for measuring temperature.", "Noun", "Masculine", "/tɛʁ.mɔ.mɛtʁ/", "Le thermomètre indique zéro.", "The thermometer shows zero."],
        ["prévision", null, "forecast", "A prediction of weather.", "Noun", "Feminine", "/pʁe.vi.zjɔ̃/", "La prévision annonce de la pluie.", "The forecast predicts rain."],
        ["météo", null, "weather report", "A broadcast about the weather.", "Noun", "Feminine", "/me.te.o/", "La météo annonce du soleil.", "The weather report predicts sun."],
        ["saison", null, "season", "Each of the four divisions of the year.", "Noun", "Feminine", "/sɛ.zɔ̃/", "Chaque saison a son charme.", "Each season has its charm."],
        ["printemps", null, "spring", "The season between winter and summer.", "Noun", "Masculine", "/pʁɛ̃.tɑ̃/", "Le printemps est fleuri.", "Spring is in flower."],
        ["été", null, "summer", "The warmest season of the year.", "Noun", "Masculine", "/e.te/", "L'été est chaud.", "Summer is hot."],
        ["automne", null, "autumn", "The season between summer and winter.", "Noun", "Masculine", "/o.tɔn/", "L'automne est coloré.", "Autumn is colourful."],
        ["hiver", null, "winter", "The coldest season of the year.", "Noun", "Masculine", "/i.vɛʁ/", "L'hiver est rude.", "Winter is harsh."],
        ["arc-en-ciel", null, "rainbow", "An arch of colours in the sky after rain.", "Noun", "Masculine", "/aʁ.kɑ̃.sjɛl/", "L'arc-en-ciel est magnifique.", "The rainbow is magnificent."],
        ["éclair", null, "lightning", "A flash of electricity in the sky.", "Noun", "Masculine", "/e.klɛʁ/", "Un éclair illumine le ciel.", "Lightning illuminates the sky."],
        ["tonnerre", null, "thunder", "A loud rumbling sound in the sky.", "Noun", "Masculine", "/tɔ.nɛʁ/", "Le tonnerre gronde.", "The thunder rumbles."],
        ["grêle", null, "hail", "Pellets of frozen rain falling from the sky.", "Noun", "Feminine", "/ɡʁɛl/", "La grêle tombe.", "The hail falls."],
        ["averse", null, "shower", "A brief fall of rain.", "Noun", "Feminine", "/a.vɛʁs/", "Une averse arrive.", "A shower is coming."],
        ["giboulée", null, "sleet shower", "A sudden brief shower of rain or sleet.", "Noun", "Feminine", "/ʒi.bu.le/", "La giboulée de mars.", "The March shower."],
        ["ensoleillé", null, "sunny", "Bright with sunlight.", "Adjective", null, "/ɑ̃.sɔ.lɛ.je/", "Le ciel est ensoleillé.", "The sky is sunny."],
        ["nuageux", null, "cloudy", "Covered with clouds.", "Adjective", null, "/nɥa.ʒø/", "Le ciel est nuageux.", "The sky is cloudy."],
        ["pluvieux", null, "rainy", "Characterized by rainfall.", "Adjective", null, "/ply.vjø/", "Le temps est pluvieux.", "The weather is rainy."],
        ["venteux", null, "windy", "With strong winds.", "Adjective", null, "/vɑ̃.tø/", "La journée est venteuse.", "The day is windy."],
        ["brumeux", null, "foggy", "Thick with fog.", "Adjective", null, "/bʁy.mø/", "Le matin est brumeux.", "The morning is foggy."],
        ["glacial", null, "freezing", "Extremely cold.", "Adjective", null, "/ɡla.sjal/", "Le vent est glacial.", "The wind is freezing."],
        ["doux", null, "mild", "Moderately warm.", "Adjective", null, "/du/", "Le climat est doux.", "The climate is mild."],
        ["humide", null, "humid", "Containing moisture.", "Adjective", null, "/y.mid/", "L'air est humide.", "The air is humid."],
        ["sec", null, "dry", "Free from moisture.", "Adjective", null, "/sɛk/", "Le temps est sec.", "The weather is dry."],
        ["orageux", null, "stormy", "Characterized by storms.", "Adjective", null, "/ɔ.ʁa.ʒø/", "Le ciel devient orageux.", "The sky becomes stormy."],
        ["froid", null, "cold", "Of or at a low temperature.", "Adjective", null, "/fʁwa/", "Le matin est froid.", "The morning is cold."],
        ["chaud", null, "hot", "Having a high temperature.", "Adjective", null, "/ʃo/", "L'été est chaud.", "Summer is hot."],
        ["frais", null, "fresh / cool", "Moderately cold.", "Adjective", null, "/fʁɛ/", "Le soir est frais.", "The evening is cool."],
        ["gelé", null, "frozen", "Turned into ice.", "Adjective", null, "/ʒə.le/", "Le lac est gelé.", "The lake is frozen."],
        ["geler", null, "to freeze", "To turn into ice.", "Verb", null, "/ʒə.le/", "L'eau va geler.", "The water will freeze."],
        ["pleuvoir", null, "to rain", "To fall as rain.", "Verb", null, "/plø.vwaʁ/", "Il va pleuvoir.", "It is going to rain."],
        ["neiger", null, "to snow", "To fall as snow.", "Verb", null, "/nɛ.ʒe/", "Il va neiger ce soir.", "It will snow tonight."],
        ["souffler", null, "to blow", "To move air.", "Verb", null, "/su.fle/", "Le vent commence à souffler.", "The wind starts blowing."],
        ["briller", null, "to shine", "To give out bright light.", "Verb", null, "/bʁi.je/", "Le soleil va briller.", "The sun will shine."],
        ["grêler", null, "to hail", "To fall as hail.", "Verb", null, "/ɡʁe.le/", "Il commence à grêler.", "It starts to hail."],
        ["tonner", null, "to thunder", "To make a loud noise in the sky.", "Verb", null, "/tɔ.ne/", "Il va tonner.", "It is going to thunder."],
        ["éclairer", null, "to light up", "To illuminate.", "Verb", null, "/e.klɛ.ʁe/", "L'éclair éclaire le ciel.", "The lightning lights up the sky."],
        ["fondre", null, "to melt", "To become liquid by heat.", "Verb", null, "/fɔ̃dʁ/", "La neige va fondre.", "The snow will melt."],
      ],
      Numbers: [
        ["zéro", null, "zero", "The number 0.", "Numeral", null, "/ze.ʁo/", "Zéro est un nombre.", "Zero is a number."],
        ["un", null, "one", "The number 1.", "Numeral", null, "/œ̃/", "J'ai un livre.", "I have one book."],
        ["deux", null, "two", "The number 2.", "Numeral", null, "/dø/", "Deux enfants jouent.", "Two children play."],
        ["trois", null, "three", "The number 3.", "Numeral", null, "/tʁwa/", "Trois chats dorment.", "Three cats sleep."],
        ["quatre", null, "four", "The number 4.", "Numeral", null, "/katʁ/", "Quatre saisons.", "Four seasons."],
        ["cinq", null, "five", "The number 5.", "Numeral", null, "/sɛ̃k/", "Cinq minutes.", "Five minutes."],
        ["six", null, "six", "The number 6.", "Numeral", null, "/sis/", "Six heures.", "Six hours."],
        ["sept", null, "seven", "The number 7.", "Numeral", null, "/sɛt/", "Sept jours.", "Seven days."],
        ["huit", null, "eight", "The number 8.", "Numeral", null, "/ɥit/", "Huit personnes.", "Eight people."],
        ["neuf", null, "nine", "The number 9.", "Numeral", null, "/nœf/", "Neuf mois.", "Nine months."],
        ["dix", null, "ten", "The number 10.", "Numeral", null, "/dis/", "Dix euros.", "Ten euros."],
        ["onze", null, "eleven", "The number 11.", "Numeral", null, "/ɔ̃z/", "Onze joueurs.", "Eleven players."],
        ["douze", null, "twelve", "The number 12.", "Numeral", null, "/duz/", "Douze mois.", "Twelve months."],
        ["quinze", null, "fifteen", "The number 15.", "Numeral", null, "/kɛ̃z/", "Quinze minutes.", "Fifteen minutes."],
        ["vingt", null, "twenty", "The number 20.", "Numeral", null, "/vɛ̃/", "Vingt étudiants.", "Twenty students."],
        ["trente", null, "thirty", "The number 30.", "Numeral", null, "/tʁɑ̃t/", "Trente jours.", "Thirty days."],
        ["quarante", null, "forty", "The number 40.", "Numeral", null, "/ka.ʁɑ̃t/", "Quarante ans.", "Forty years."],
        ["cinquante", null, "fifty", "The number 50.", "Numeral", null, "/sɛ̃.kɑ̃t/", "Cinquante euros.", "Fifty euros."],
        ["soixante", null, "sixty", "The number 60.", "Numeral", null, "/swa.sɑ̃t/", "Soixante secondes.", "Sixty seconds."],
        ["cent", null, "hundred", "The number 100.", "Numeral", null, "/sɑ̃/", "Cent ans.", "A hundred years."],
        ["mille", null, "thousand", "The number 1000.", "Numeral", null, "/mil/", "Mille mercis.", "A thousand thanks."],
        ["million", null, "million", "One thousand thousands.", "Numeral", null, "/mi.ljɔ̃/", "Un million est grand.", "A million is large."],
        ["milliard", null, "billion", "One thousand millions.", "Numeral", null, "/mi.ljaʁ/", "Un milliard d'étoiles.", "A billion stars."],
        ["nombre", null, "number", "An arithmetical value.", "Noun", "Masculine", "/nɔ̃bʁ/", "Le nombre est correct.", "The number is correct."],
        ["chiffre", null, "digit", "A single numeral.", "Noun", "Masculine", "/ʃifʁ/", "Ce chiffre est important.", "This digit is important."],
        ["numéro", null, "number", "A number identifying something in a series.", "Noun", "Masculine", "/ny.me.ʁo/", "Quel est ton numéro ?", "What is your number?"],
        ["moitié", null, "half", "One of two equal parts.", "Noun", "Feminine", "/mwa.tje/", "La moitié est suffisante.", "Half is enough."],
        ["tiers", null, "third", "One of three equal parts.", "Noun", "Masculine", "/tjɛʁ/", "Un tiers des élèves.", "A third of the students."],
        ["quart", null, "quarter", "One of four equal parts.", "Noun", "Masculine", "/kaʁ/", "Un quart reste.", "A quarter remains."],
        ["pourcentage", null, "percentage", "A rate per hundred.", "Noun", "Masculine", "/puʁ.sɑ̃.taʒ/", "Le pourcentage augmente.", "The percentage increases."],
        ["somme", null, "sum", "A total amount.", "Noun", "Feminine", "/sɔm/", "La somme est correcte.", "The sum is correct."],
        ["total", null, "total", "The whole amount.", "Noun", "Masculine", "/tɔ.tal/", "Le total est vingt.", "The total is twenty."],
        ["addition", null, "addition", "A mathematical sum.", "Noun", "Feminine", "/a.di.sjɔ̃/", "L'addition est simple.", "The addition is simple."],
        ["soustraction", null, "subtraction", "The process of taking one number from another.", "Noun", "Feminine", "/sus.tʁak.sjɔ̃/", "La soustraction est facile.", "Subtraction is easy."],
        ["multiplication", null, "multiplication", "The process of multiplying numbers.", "Noun", "Feminine", "/myl.ti.pli.ka.sjɔ̃/", "La multiplication est utile.", "Multiplication is useful."],
        ["division", null, "division", "The process of dividing numbers.", "Noun", "Feminine", "/di.vi.zjɔ̃/", "La division est difficile.", "Division is difficult."],
        ["fraction", null, "fraction", "A numerical quantity that is not whole.", "Noun", "Feminine", "/fʁak.sjɔ̃/", "La fraction est simple.", "The fraction is simple."],
        ["décimal", null, "decimal", "Relating to a base-10 system.", "Adjective", null, "/de.si.mal/", "C'est un nombre décimal.", "It is a decimal number."],
        ["entier", null, "whole", "Not a fraction.", "Adjective", null, "/ɑ̃.tje/", "C'est un nombre entier.", "It is a whole number."],
        ["pair", null, "even", "Divisible by two.", "Adjective", null, "/pɛʁ/", "Huit est un nombre pair.", "Eight is an even number."],
        ["impair", null, "odd", "Not divisible by two.", "Adjective", null, "/ɛ̃.pɛʁ/", "Sept est un nombre impair.", "Seven is an odd number."],
        ["positif", null, "positive", "Greater than zero.", "Adjective", null, "/pɔ.zi.tif/", "Le résultat est positif.", "The result is positive."],
        ["négatif", null, "negative", "Less than zero.", "Adjective", null, "/ne.ɡa.tif/", "Le nombre est négatif.", "The number is negative."],
        ["égal", null, "equal", "Being the same in quantity.", "Adjective", null, "/e.ɡal/", "Les deux nombres sont égaux.", "The two numbers are equal."],
        ["différent", null, "different", "Not the same as another.", "Adjective", null, "/di.fe.ʁɑ̃/", "Les chiffres sont différents.", "The digits are different."],
        ["grand", null, "large", "Of considerable size.", "Adjective", null, "/ɡʁɑ̃/", "Le nombre est grand.", "The number is large."],
        ["petit", null, "small", "Of a size that is less than normal.", "Adjective", null, "/pə.ti/", "Le chiffre est petit.", "The digit is small."],
        ["premier", null, "first", "Coming before all others.", "Adjective", null, "/pʁə.mje/", "C'est mon premier choix.", "It is my first choice."],
        ["dernier", null, "last", "Coming after all others.", "Adjective", null, "/dɛʁ.nje/", "C'est le dernier numéro.", "It is the last number."],
        ["compter", null, "to count", "To determine the number of.", "Verb", null, "/kɔ̃.te/", "Les enfants apprennent à compter.", "The children learn to count."],
        ["calculer", null, "to calculate", "To compute a result.", "Verb", null, "/kal.ky.le/", "Je vais calculer le total.", "I will calculate the total."],
        ["additionner", null, "to add", "To combine numbers.", "Verb", null, "/a.di.sjɔ.ne/", "Les élèves apprennent à additionner.", "The students learn to add."],
        ["soustraire", null, "to subtract", "To take away from a number.", "Verb", null, "/sus.tʁɛʁ/", "Il faut soustraire cinq.", "You need to subtract five."],
        ["multiplier", null, "to multiply", "To increase by a factor.", "Verb", null, "/myl.ti.pli.je/", "Il faut multiplier par deux.", "You must multiply by two."],
        ["diviser", null, "to divide", "To separate into parts.", "Verb", null, "/di.vi.ze/", "Nous devons diviser le nombre.", "We must divide the number."],
        ["doubler", null, "to double", "To multiply by two.", "Verb", null, "/du.ble/", "Nous allons doubler la quantité.", "We will double the quantity."],
        ["mesurer", null, "to measure", "To determine the size or amount of.", "Verb", null, "/mə.zy.ʁe/", "Mesure la longueur.", "Measure the length."],
        ["estimer", null, "to estimate", "To approximate.", "Verb", null, "/ɛs.ti.me/", "Nous pouvons estimer la quantité.", "We can estimate the quantity."],
        ["arrondir", null, "to round", "To make a number simpler.", "Verb", null, "/a.ʁɔ̃.diʁ/", "Arrondis le chiffre.", "Round the number."],
      ],
      Time: [
        ["temps", null, "time", "The indefinite continued progress of existence.", "Noun", "Masculine", "/tɑ̃/", "Le temps passe vite.", "Time passes quickly."],
        ["seconde", null, "second", "A period of one sixtieth of a minute.", "Noun", "Feminine", "/sə.ɡɔ̃d/", "Une seconde suffit.", "One second is enough."],
        ["minute", null, "minute", "A period of 60 seconds.", "Noun", "Feminine", "/mi.nyt/", "Attendez une minute.", "Wait a minute."],
        ["heure", null, "hour", "A period of 60 minutes.", "Noun", "Feminine", "/œʁ/", "Quelle heure est-il ?", "What time is it?"],
        ["jour", null, "day", "A period of 24 hours.", "Noun", "Masculine", "/ʒuʁ/", "Bonjour, bonne journée.", "Hello, have a good day."],
        ["journée", null, "day (duration)", "The time during which it is light.", "Noun", "Feminine", "/ʒuʁ.ne/", "Bonne journée !", "Have a good day!"],
        ["matin", null, "morning", "The period from sunrise to noon.", "Noun", "Masculine", "/ma.tɛ̃/", "Le matin est frais.", "The morning is cool."],
        ["midi", null, "noon", "Twelve o'clock in the day.", "Noun", "Masculine", "/mi.di/", "Il est midi.", "It is noon."],
        ["après-midi", null, "afternoon", "The time from noon to evening.", "Noun", "Masculine", "/a.pʁɛ.mi.di/", "L'après-midi est libre.", "The afternoon is free."],
        ["soir", null, "evening", "The period from afternoon to night.", "Noun", "Masculine", "/swaʁ/", "Bonsoir.", "Good evening."],
        ["nuit", null, "night", "The period of darkness between sunset and sunrise.", "Noun", "Feminine", "/nɥi/", "Bonne nuit.", "Good night."],
        ["minuit", null, "midnight", "Twelve o'clock at night.", "Noun", "Masculine", "/mi.nɥi/", "Il est minuit.", "It is midnight."],
        ["aube", null, "dawn", "The first appearance of light in the morning.", "Noun", "Feminine", "/ob/", "L'aube se lève.", "Dawn breaks."],
        ["crépuscule", null, "dusk", "The time just before nightfall.", "Noun", "Masculine", "/kʁe.pys.kyl/", "Le crépuscule est beau.", "Dusk is beautiful."],
        ["semaine", null, "week", "A period of seven days.", "Noun", "Feminine", "/sə.mɛn/", "La semaine commence lundi.", "The week begins Monday."],
        ["week-end", null, "weekend", "Saturday and Sunday.", "Noun", "Masculine", "/wi.kɛnd/", "Bon week-end !", "Have a good weekend!"],
        ["mois", null, "month", "A period of about 30 days.", "Noun", "Masculine", "/mwa/", "Le mois passe vite.", "The month passes quickly."],
        ["année", null, "year", "A period of 365 days.", "Noun", "Feminine", "/a.ne/", "Bonne année !", "Happy New Year!"],
        ["décennie", null, "decade", "A period of ten years.", "Noun", "Feminine", "/de.se.ni/", "Une décennie passe.", "A decade passes."],
        ["siècle", null, "century", "A period of 100 years.", "Noun", "Masculine", "/sjɛkl/", "Un siècle représente cent ans.", "A century represents one hundred years."],
        ["millénaire", null, "millennium", "A period of 1000 years.", "Noun", "Masculine", "/mi.le.nɛʁ/", "Un millénaire est long.", "A millennium is long."],
        ["hier", null, "yesterday", "The day before today.", "Adverb", null, "/jɛʁ/", "Je l'ai vu hier.", "I saw him yesterday."],
        ["aujourd'hui", null, "today", "On this present day.", "Adverb", null, "/o.ʒuʁ.dɥi/", "Nous travaillons aujourd'hui.", "We are working today."],
        ["demain", null, "tomorrow", "The day after today.", "Adverb", null, "/də.mɛ̃/", "Nous partirons demain.", "We will leave tomorrow."],
        ["après-demain", null, "day after tomorrow", "Two days from now.", "Adverb", null, "/a.pʁɛ.də.mɛ̃/", "À après-demain.", "See you the day after tomorrow."],
        ["avant-hier", null, "day before yesterday", "Two days ago.", "Adverb", null, "/a.vɑ̃.tjɛʁ/", "Il est parti avant-hier.", "He left the day before yesterday."],
        ["maintenant", null, "now", "At the present time.", "Adverb", null, "/mɛ̃t.nɑ̃/", "Je pars maintenant.", "I am leaving now."],
        ["bientôt", null, "soon", "In a short time.", "Adverb", null, "/bjɛ̃.to/", "Nous arriverons bientôt.", "We will arrive soon."],
        ["tôt", null, "early", "Before the expected time.", "Adverb", null, "/to/", "Je me lève tôt.", "I get up early."],
        ["tard", null, "late", "After the expected time.", "Adverb", null, "/taʁ/", "Il rentre tard.", "He comes home late."],
        ["toujours", null, "always", "At all times.", "Adverb", null, "/tu.ʒuʁ/", "Elle est toujours là.", "She is always there."],
        ["souvent", null, "often", "Frequently.", "Adverb", null, "/su.vɑ̃/", "Il vient souvent.", "He comes often."],
        ["parfois", null, "sometimes", "Occasionally.", "Adverb", null, "/paʁ.fwa/", "Je voyage parfois.", "I travel sometimes."],
        ["rarement", null, "rarely", "Not often.", "Adverb", null, "/ʁaʁ.mɑ̃/", "Elle sort rarement.", "She rarely goes out."],
        ["jamais", null, "never", "At no time.", "Adverb", null, "/ʒa.mɛ/", "Je ne fume jamais.", "I never smoke."],
        ["déjà", null, "already", "Before now.", "Adverb", null, "/de.ʒa/", "Il est déjà parti.", "He has already left."],
        ["encore", null, "still", "Up to and including the present.", "Adverb", null, "/ɑ̃.kɔʁ/", "Il est encore là.", "He is still there."],
        ["pendant", null, "during", "Throughout the course of.", "Preposition", null, "/pɑ̃.dɑ̃/", "Pendant l'été, il fait chaud.", "During summer, it is hot."],
        ["depuis", null, "since / for", "From a past time until now.", "Preposition", null, "/də.pɥi/", "Je travaille depuis une heure.", "I've been working for an hour."],
        ["avant", null, "before", "During the period preceding.", "Preposition", null, "/a.vɑ̃/", "Avant midi.", "Before noon."],
        ["après", null, "after", "During the period following.", "Preposition", null, "/a.pʁɛ/", "Après le repas.", "After the meal."],
        ["calendrier", null, "calendar", "A chart showing days and months.", "Noun", "Masculine", "/ka.lɑ̃.dʁi.je/", "Le calendrier est à jour.", "The calendar is up to date."],
        ["montre", null, "watch", "A small clock worn on the wrist.", "Noun", "Feminine", "/mɔ̃tʁ/", "Ma montre est en retard.", "My watch is slow."],
        ["horloge", null, "clock", "An instrument for measuring time.", "Noun", "Feminine", "/ɔʁ.lɔʒ/", "L'horloge indique midi.", "The clock shows noon."],
        ["chronomètre", null, "stopwatch", "A watch used for timing events.", "Noun", "Masculine", "/kʁɔ.nɔ.mɛtʁ/", "Le chronomètre tourne.", "The stopwatch is running."],
        ["rendez-vous", null, "appointment", "An arrangement to meet at a particular time.", "Noun", "Masculine", "/ʁɑ̃.de.vu/", "J'ai un rendez-vous à trois heures.", "I have an appointment at three."],
        ["délai", null, "deadline", "The latest time by which something must be done.", "Noun", "Masculine", "/de.lɛ/", "Le délai est court.", "The deadline is short."],
        ["durée", null, "duration", "The time during which something continues.", "Noun", "Feminine", "/dy.ʁe/", "La durée est courte.", "The duration is short."],
        ["moment", null, "moment", "A brief period of time.", "Noun", "Masculine", "/mɔ.mɑ̃/", "Attendez un moment.", "Wait a moment."],
        ["instant", null, "instant", "An extremely brief period of time.", "Noun", "Masculine", "/ɛ̃s.tɑ̃/", "Un instant, s'il vous plaît.", "One moment, please."],
        ["époque", null, "era", "A particular period of history.", "Noun", "Feminine", "/e.pɔk/", "À cette époque, tout était calme.", "In that era, everything was calm."],
        ["passé", null, "past", "The time before now.", "Noun", "Masculine", "/pa.se/", "Le passé reste important.", "The past remains important."],
        ["présent", null, "present", "The current moment.", "Noun", "Masculine", "/pʁe.zɑ̃/", "Le présent compte.", "The present matters."],
        ["avenir", null, "future", "The time yet to come.", "Noun", "Masculine", "/av.niʁ/", "L'avenir est incertain.", "The future is uncertain."],
        ["futur", null, "future", "The time yet to come.", "Noun", "Masculine", "/fy.tyʁ/", "Le futur nous appartient.", "The future belongs to us."],
        ["commencer", null, "to begin", "To start.", "Verb", null, "/kɔ.mɑ̃.se/", "Le film va commencer.", "The movie will begin."],
        ["finir", null, "to finish", "To come to an end.", "Verb", null, "/fi.niʁ/", "Le cours va finir.", "The class will finish."],
        ["attendre", null, "to wait", "To stay in place until something happens.", "Verb", null, "/a.tɑ̃dʁ/", "Je vais attendre une heure.", "I will wait for an hour."],
        ["durer", null, "to last", "To continue for a period.", "Verb", null, "/dy.ʁe/", "Le voyage va durer trois heures.", "The trip will last three hours."],
        ["prendre", null, "to take (time)", "To require a period of time.", "Verb", null, "/pʁɑ̃dʁ/", "Cela prend du temps.", "It takes time."],
        ["passer", null, "to pass", "To go by (of time).", "Verb", null, "/pa.se/", "Le temps passe vite.", "Time passes quickly."],
        ["retarder", null, "to delay", "To make late.", "Verb", null, "/ʁə.taʁ.de/", "La pluie peut retarder le départ.", "The rain can delay the departure."],
        ["avancer", null, "to move forward", "To progress.", "Verb", null, "/a.vɑ̃.se/", "L'horloge avance.", "The clock moves forward."],
        ["reculer", null, "to postpone", "To move to a later time.", "Verb", null, "/ʁə.ky.le/", "Il faut reculer la réunion.", "We need to postpone the meeting."],
        ["planifier", null, "to schedule", "To arrange according to a plan.", "Verb", null, "/pla.ni.fje/", "Je vais planifier ma semaine.", "I will plan my week."],
        ["se dépêcher", null, "to hurry", "To move or act quickly.", "Verb", null, "/sə de.pe.ʃe/", "Dépêche-toi !", "Hurry up!"],
      ],
      Colors: [
        ["couleur", null, "color", "The property of reflecting light.", "Noun", "Feminine", "/ku.lœʁ/", "Cette couleur est magnifique.", "This color is beautiful."],
        ["rouge", null, "red", "The colour of blood.", "Adjective", null, "/ʁuʒ/", "Une pomme rouge.", "A red apple."],
        ["bleu", null, "blue", "The colour of a clear sky.", "Adjective", null, "/blø/", "Le ciel est bleu.", "The sky is blue."],
        ["vert", null, "green", "The colour of grass.", "Adjective", null, "/vɛʁ/", "L'herbe est verte.", "The grass is green."],
        ["jaune", null, "yellow", "The colour of a ripe lemon.", "Adjective", null, "/ʒon/", "Le soleil est jaune.", "The sun is yellow."],
        ["noir", null, "black", "The darkest colour.", "Adjective", null, "/nwaʁ/", "Un chat noir.", "A black cat."],
        ["blanc", null, "white", "The colour of snow.", "Adjective", null, "/blɑ̃/", "La neige est blanche.", "The snow is white."],
        ["orange", null, "orange", "A colour between red and yellow.", "Adjective", null, "/ɔ.ʁɑ̃ʒ/", "La fleur est orange.", "The flower is orange."],
        ["violet", null, "purple", "A colour between red and blue.", "Adjective", null, "/vjɔ.lɛ/", "Le ciel devient violet.", "The sky becomes purple."],
        ["rose", null, "pink", "A pale red colour.", "Adjective", null, "/ʁoz/", "La robe est rose.", "The dress is pink."],
        ["marron", null, "brown", "The colour of chocolate.", "Adjective", null, "/ma.ʁɔ̃/", "Le sac est marron.", "The bag is brown."],
        ["gris", null, "gray", "A colour between black and white.", "Adjective", null, "/ɡʁi/", "Le ciel est gris.", "The sky is gray."],
        ["beige", null, "beige", "A pale sandy colour.", "Adjective", null, "/bɛʒ/", "Le canapé est beige.", "The sofa is beige."],
        ["turquoise", null, "turquoise", "A bright blue-green colour.", "Adjective", null, "/tyʁ.kwaz/", "La mer est turquoise.", "The sea is turquoise."],
        ["doré", null, "golden", "Coloured like gold.", "Adjective", null, "/dɔ.ʁe/", "Le soleil est doré.", "The sun is golden."],
        ["argenté", null, "silver", "Coloured like silver.", "Adjective", null, "/aʁ.ʒɑ̃.te/", "Le métal est argenté.", "The metal is silver."],
        ["pourpre", null, "crimson", "A rich deep red colour.", "Adjective", null, "/puʁpʁ/", "Le rideau est pourpre.", "The curtain is crimson."],
        ["écarlate", null, "scarlet", "A brilliant red colour.", "Adjective", null, "/e.kaʁ.lat/", "La robe est écarlate.", "The dress is scarlet."],
        ["bordeaux", null, "burgundy", "A dark red colour.", "Adjective", null, "/bɔʁ.do/", "Le vin est bordeaux.", "The wine is burgundy."],
        ["ivoire", null, "ivory", "A creamy white colour.", "Adjective", null, "/i.vwaʁ/", "Le piano est ivoire.", "The piano is ivory."],
        ["indigo", null, "indigo", "A deep blue-violet colour.", "Adjective", null, "/ɛ̃.di.ɡo/", "Le ciel est indigo.", "The sky is indigo."],
        ["ocre", null, "ochre", "An earthy yellow-brown colour.", "Adjective", null, "/ɔkʁ/", "La terre est ocre.", "The earth is ochre."],
        ["pâle", null, "pale", "Light in colour.", "Adjective", null, "/pal/", "Le jaune est pâle.", "The yellow is pale."],
        ["vif", null, "bright", "Intense in colour.", "Adjective", null, "/vif/", "Le rouge est vif.", "The red is bright."],
        ["foncé", null, "dark", "Deep in colour.", "Adjective", null, "/fɔ̃.se/", "Le vert est foncé.", "The green is dark."],
        ["clair", null, "light", "Pale in colour.", "Adjective", null, "/klɛʁ/", "Le bleu clair est joli.", "Light blue is pretty."],
        ["brillant", null, "shiny", "Reflecting light.", "Adjective", null, "/bʁi.jɑ̃/", "Le rouge est brillant.", "The red is shiny."],
        ["mat", null, "matte", "Not shiny.", "Adjective", null, "/mat/", "La peinture est mate.", "The paint is matte."],
        ["transparent", null, "transparent", "Allowing light through.", "Adjective", null, "/tʁɑ̃s.pa.ʁɑ̃/", "Le verre est transparent.", "The glass is transparent."],
        ["opaque", null, "opaque", "Not able to be seen through.", "Adjective", null, "/ɔ.pak/", "Le mur est opaque.", "The wall is opaque."],
        ["coloré", null, "colorful", "Having much or varied colour.", "Adjective", null, "/kɔ.lɔ.ʁe/", "Le marché est coloré.", "The market is colorful."],
        ["teinte", null, "shade", "A particular variety of a colour.", "Noun", "Feminine", "/tɛ̃t/", "La teinte est douce.", "The shade is soft."],
        ["nuance", null, "nuance", "A subtle difference in colour.", "Noun", "Feminine", "/nɥɑ̃s/", "La nuance est subtile.", "The nuance is subtle."],
        ["ton", null, "tone", "The shade or quality of a colour.", "Noun", "Masculine", "/tɔ̃/", "Le ton est chaud.", "The tone is warm."],
        ["pigment", null, "pigment", "A substance that gives colour.", "Noun", "Masculine", "/piɡ.mɑ̃/", "Le pigment est naturel.", "The pigment is natural."],
        ["peinture", null, "paint", "A coloured substance applied to a surface.", "Noun", "Feminine", "/pɛ̃.tyʁ/", "La peinture est fraîche.", "The paint is fresh."],
        ["pinceau", null, "brush", "A tool with bristles for painting.", "Noun", "Masculine", "/pɛ̃.so/", "Le pinceau est fin.", "The brush is fine."],
        ["palette", null, "palette", "A range of colours used by an artist.", "Noun", "Feminine", "/pa.lɛt/", "La palette contient plusieurs couleurs.", "The palette contains several colors."],
        ["arc-en-ciel", null, "rainbow", "An arch of colours in the sky.", "Noun", "Masculine", "/aʁ.kɑ̃.sjɛl/", "L'arc-en-ciel a sept couleurs.", "The rainbow has seven colors."],
        ["prisme", null, "prism", "A glass shape that splits light into colours.", "Noun", "Masculine", "/pʁism/", "Le prisme décompose la lumière.", "The prism splits the light."],
        ["colorer", null, "to color", "To add colour to.", "Verb", null, "/kɔ.lɔ.ʁe/", "Les enfants aiment colorer.", "The children like to color."],
        ["peindre", null, "to paint", "To apply paint.", "Verb", null, "/pɛ̃dʁ/", "Elle aime peindre les murs.", "She likes to paint the walls."],
        ["teindre", null, "to dye", "To colour with dye.", "Verb", null, "/tɛ̃dʁ/", "Il veut teindre ses cheveux.", "He wants to dye his hair."],
        ["dessiner", null, "to draw", "To produce a picture.", "Verb", null, "/de.si.ne/", "J'aime dessiner.", "I like to draw."],
        ["mélanger", null, "to mix", "To combine colours.", "Verb", null, "/me.lɑ̃.ʒe/", "Nous allons mélanger les couleurs.", "We are going to mix the colors."],
        ["assombrir", null, "to darken", "To make darker.", "Verb", null, "/a.sɔ̃.bʁiʁ/", "La pluie assombrit le ciel.", "The rain darkens the sky."],
        ["éclaircir", null, "to lighten", "To make lighter in colour.", "Verb", null, "/e.klɛʁ.siʁ/", "Le soleil va éclaircir la peinture.", "The sun will lighten the paint."],
        ["briller", null, "to shine", "To give out bright light.", "Verb", null, "/bʁi.je/", "Les couleurs brillent.", "The colors shine."],
        ["décorer", null, "to decorate", "To add ornament to.", "Verb", null, "/de.kɔ.ʁe/", "Vamos a decorar la habitación.", "We are going to decorate the room."],
        ["assortir", null, "to match", "To be harmonious with.", "Verb", null, "/a.sɔʁ.tiʁ/", "Ces couleurs s'assortissent bien.", "These colors match well."],
        ["contraster", null, "to contrast", "To differ strikingly.", "Verb", null, "/kɔ̃.tʁas.te/", "Le rouge contraste avec le vert.", "Red contrasts with green."],
        ["ressembler", null, "to resemble", "To look like.", "Verb", null, "/ʁə.sɑ̃.ble/", "Ces teintes se ressemblent.", "These shades resemble each other."],
        ["distinguer", null, "to distinguish", "To recognize a difference.", "Verb", null, "/dis.tɛ̃.ɡe/", "Je distingue mal les couleurs.", "I can barely distinguish colors."],
        ["admirer", null, "to admire", "To regard with respect.", "Verb", null, "/ad.mi.ʁe/", "J'admire cette couleur.", "I admire this color."],
        ["préférer", null, "to prefer", "To like better than another.", "Verb", null, "/pʁe.fe.ʁe/", "Je préfère le bleu.", "I prefer blue."],
        ["choisir", null, "to choose", "To pick from a range.", "Verb", null, "/ʃwa.ziʁ/", "Choisis une couleur.", "Choose a color."],
        ["aimer", null, "to like", "To find agreeable.", "Verb", null, "/e.me/", "J'aime le rose.", "I like pink."],
        ["détester", null, "to hate", "To feel intense dislike.", "Verb", null, "/de.tɛs.te/", "Il déteste le jaune.", "He hates yellow."],
      ],
      Animals: [
        ["animal", null, "animal", "A living organism that feeds on organic matter.", "Noun", "Masculine", "/a.ni.mal/", "L'animal vit dans la forêt.", "The animal lives in the forest."],
        ["chien", null, "dog", "A domesticated carnivorous mammal.", "Noun", "Masculine", "/ʃjɛ̃/", "Le chien aboie.", "The dog barks."],
        ["chat", null, "cat", "A small domesticated carnivorous mammal.", "Noun", "Masculine", "/ʃa/", "Le chat dort sur le canapé.", "The cat sleeps on the sofa."],
        ["oiseau", null, "bird", "A feathered, egg-laying vertebrate.", "Noun", "Masculine", "/wa.zo/", "L'oiseau chante.", "The bird sings."],
        ["cheval", null, "horse", "A solid-hoofed herbivorous mammal.", "Noun", "Masculine", "/ʃə.val/", "Le cheval galope.", "The horse gallops."],
        ["vache", null, "cow", "A fully grown female of cattle.", "Noun", "Feminine", "/vaʃ/", "La vache mange de l'herbe.", "The cow eats grass."],
        ["taureau", null, "bull", "An uncastrated male bovine.", "Noun", "Masculine", "/tɔ.ʁo/", "Le taureau est fort.", "The bull is strong."],
        ["mouton", null, "sheep", "A domesticated ruminant animal with a thick coat.", "Noun", "Masculine", "/mu.tɔ̃/", "Le mouton broute.", "The sheep grazes."],
        ["chèvre", null, "goat", "A hardy domesticated ruminant animal.", "Noun", "Feminine", "/ʃɛvʁ/", "La chèvre grimpe.", "The goat climbs."],
        ["cochon", null, "pig", "An omnivorous domesticated hoofed mammal.", "Noun", "Masculine", "/kɔ.ʃɔ̃/", "Le cochon se roule dans la boue.", "The pig rolls in the mud."],
        ["poule", null, "hen", "A female domestic fowl kept for eggs.", "Noun", "Feminine", "/pul/", "La poule pond des œufs.", "The hen lays eggs."],
        ["coq", null, "rooster", "An adult male chicken.", "Noun", "Masculine", "/kɔk/", "Le coq chante le matin.", "The rooster crows in the morning."],
        ["canard", null, "duck", "A waterbird with a broad bill and short legs.", "Noun", "Masculine", "/ka.naʁ/", "Le canard nage.", "The duck swims."],
        ["oie", null, "goose", "A large waterbird with a long neck.", "Noun", "Feminine", "/wa/", "L'oie est bruyante.", "The goose is noisy."],
        ["dinde", null, "turkey", "A large bird native to North America.", "Noun", "Feminine", "/dɛ̃d/", "La dinde est traditionnelle.", "Turkey is traditional."],
        ["lapin", null, "rabbit", "A burrowing plant-eating mammal.", "Noun", "Masculine", "/la.pɛ̃/", "Le lapin saute.", "The rabbit hops."],
        ["souris", null, "mouse", "A small rodent with a pointed snout.", "Noun", "Feminine", "/su.ʁi/", "La souris court vite.", "The mouse runs fast."],
        ["rat", null, "rat", "A large rodent with a pointed snout.", "Noun", "Masculine", "/ʁa/", "Le rat vit dans les égouts.", "The rat lives in the sewers."],
        ["écureuil", null, "squirrel", "A bushy-tailed tree-dwelling rodent.", "Noun", "Masculine", "/e.ky.ʁœj/", "L'écureuil grimpe à l'arbre.", "The squirrel climbs the tree."],
        ["hérisson", null, "hedgehog", "A small mammal with protective spines.", "Noun", "Masculine", "/e.ʁi.sɔ̃/", "Le hérisson se roule en boule.", "The hedgehog rolls into a ball."],
        ["lion", null, "lion", "A large tawny wild cat of Africa.", "Noun", "Masculine", "/ljɔ̃/", "Le lion rugit.", "The lion roars."],
        ["tigre", null, "tiger", "A large Asian wild cat with a striped coat.", "Noun", "Masculine", "/tiɡʁ/", "Le tigre chasse.", "The tiger hunts."],
        ["léopard", null, "leopard", "A large spotted wild cat.", "Noun", "Masculine", "/le.ɔ.paʁ/", "Le léopard est rapide.", "The leopard is fast."],
        ["éléphant", null, "elephant", "A very large plant-eating mammal with a trunk.", "Noun", "Masculine", "/e.le.fɑ̃/", "L'éléphant est énorme.", "The elephant is huge."],
        ["girafe", null, "giraffe", "A tall African mammal with a long neck.", "Noun", "Feminine", "/ʒi.ʁaf/", "La girafe mange les feuilles.", "The giraffe eats leaves."],
        ["singe", null, "monkey", "A small primate with a long tail.", "Noun", "Masculine", "/sɛ̃ʒ/", "Le singe grimpe.", "The monkey climbs."],
        ["gorille", null, "gorilla", "A large powerful ape.", "Noun", "Masculine", "/ɡɔ.ʁij/", "Le gorille est fort.", "The gorilla is strong."],
        ["ours", null, "bear", "A large heavy mammal with thick fur.", "Noun", "Masculine", "/uʁs/", "L'ours dort en hiver.", "The bear sleeps in winter."],
        ["loup", null, "wolf", "A wild carnivorous mammal of the dog family.", "Noun", "Masculine", "/lu/", "Le loup hurle.", "The wolf howls."],
        ["renard", null, "fox", "A carnivorous mammal with a bushy tail.", "Noun", "Masculine", "/ʁə.naʁ/", "Le renard est rusé.", "The fox is cunning."],
        ["cerf", null, "deer", "A hoofed animal with antlers.", "Noun", "Masculine", "/sɛʁ/", "Le cerf court vite.", "The deer runs fast."],
        ["sanglier", null, "wild boar", "A wild pig with tusks.", "Noun", "Masculine", "/sɑ̃.ɡli.je/", "Le sanglier est féroce.", "The wild boar is fierce."],
        ["chameau", null, "camel", "A large desert mammal with humps.", "Noun", "Masculine", "/ʃa.mo/", "Le chameau marche dans le désert.", "The camel walks in the desert."],
        ["zèbre", null, "zebra", "An African wild horse with black-and-white stripes.", "Noun", "Masculine", "/zɛbʁ/", "Le zèbre court.", "The zebra runs."],
        ["kangourou", null, "kangaroo", "An Australian marsupial with powerful hind legs.", "Noun", "Masculine", "/kɑ̃.ɡu.ʁu/", "Le kangourou saute.", "The kangaroo jumps."],
        ["panda", null, "panda", "A large black-and-white bear-like mammal.", "Noun", "Masculine", "/pɑ̃.da/", "Le panda mange du bambou.", "The panda eats bamboo."],
        ["abeille", null, "bee", "A flying insect that collects nectar.", "Noun", "Feminine", "/a.bɛj/", "L'abeille bourdonne.", "The bee buzzes."],
        ["guêpe", null, "wasp", "A stinging winged insect.", "Noun", "Feminine", "/ɡɛp/", "La guêpe pique.", "The wasp stings."],
        ["papillon", null, "butterfly", "An insect with large colourful wings.", "Noun", "Masculine", "/pa.pi.jɔ̃/", "Le papillon vole.", "The butterfly flies."],
        ["libellule", null, "dragonfly", "A slender insect with two pairs of transparent wings.", "Noun", "Feminine", "/li.bɛ.lyl/", "La libellule vole vite.", "The dragonfly flies fast."],
        ["fourmi", null, "ant", "A small insect that lives in colonies.", "Noun", "Feminine", "/fuʁ.mi/", "La fourmi travaille dur.", "The ant works hard."],
        ["araignée", null, "spider", "An eight-legged arachnid that spins webs.", "Noun", "Feminine", "/a.ʁɛ.ɲe/", "L'araignée tisse sa toile.", "The spider spins its web."],
        ["mouche", null, "fly", "A small flying insect.", "Noun", "Feminine", "/muʃ/", "La mouche vole.", "The fly flies."],
        ["moustique", null, "mosquito", "A small flying insect that bites.", "Noun", "Masculine", "/mus.tik/", "Le moustique pique.", "The mosquito bites."],
        ["serpent", null, "snake", "A long limbless reptile.", "Noun", "Masculine", "/sɛʁ.pɑ̃/", "Le serpent rampe.", "The snake slithers."],
        ["lézard", null, "lizard", "A reptile with a long body and tail.", "Noun", "Masculine", "/le.zaʁ/", "Le lézard se chauffe au soleil.", "The lizard warms in the sun."],
        ["tortue", null, "turtle", "A slow-moving reptile with a shell.", "Noun", "Feminine", "/tɔʁ.ty/", "La tortue marche lentement.", "The turtle walks slowly."],
        ["crocodile", null, "crocodile", "A large predatory reptile with a long snout.", "Noun", "Masculine", "/kʁɔ.kɔ.dil/", "Le crocodile attend sa proie.", "The crocodile waits for its prey."],
        ["grenouille", null, "frog", "A tailless amphibian that leaps.", "Noun", "Feminine", "/ɡʁə.nuj/", "La grenouille saute.", "The frog jumps."],
        ["poisson", null, "fish", "A cold-blooded aquatic animal with gills.", "Noun", "Masculine", "/pwa.sɔ̃/", "Le poisson nage.", "The fish swims."],
        ["requin", null, "shark", "A large predatory fish with sharp teeth.", "Noun", "Masculine", "/ʁə.kɛ̃/", "Le requin est dangereux.", "The shark is dangerous."],
        ["baleine", null, "whale", "A very large marine mammal.", "Noun", "Feminine", "/ba.lɛn/", "La baleine est immense.", "The whale is immense."],
        ["dauphin", null, "dolphin", "An intelligent aquatic mammal.", "Noun", "Masculine", "/do.fɛ̃/", "Le dauphin saute.", "The dolphin jumps."],
        ["phoque", null, "seal", "A fish-eating aquatic mammal with flippers.", "Noun", "Masculine", "/fɔk/", "Le phoque nage bien.", "The seal swims well."],
        ["sauvage", null, "wild", "Living in a natural state.", "Adjective", null, "/so.vaʒ/", "Cet animal est sauvage.", "This animal is wild."],
        ["domestique", null, "domestic", "Tamed and kept by humans.", "Adjective", null, "/dɔ.mɛs.tik/", "Le chat est domestique.", "The cat is domestic."],
        ["féroce", null, "fierce", "Savage and aggressive.", "Adjective", null, "/fe.ʁɔs/", "Le prédateur est féroce.", "The predator is fierce."],
        ["venimeux", null, "venomous", "Producing venom.", "Adjective", null, "/və.ni.mø/", "Ce serpent est venimeux.", "This snake is venomous."],
        ["aboyer", null, "to bark", "To make the sound of a dog.", "Verb", null, "/a.bwa.je/", "Le chien aime aboyer.", "The dog likes to bark."],
        ["miauler", null, "to meow", "To make the sound of a cat.", "Verb", null, "/mjo.le/", "Le chat commence à miauler.", "The cat starts to meow."],
        ["voler", null, "to fly", "To move through the air.", "Verb", null, "/vɔ.le/", "L'oiseau peut voler.", "The bird can fly."],
        ["nager", null, "to swim", "To move through water.", "Verb", null, "/na.ʒe/", "Le dauphin aime nager.", "The dolphin likes to swim."],
        ["chasser", null, "to hunt", "To pursue and kill for food.", "Verb", null, "/ʃa.se/", "Le lion va chasser.", "The lion will hunt."],
        ["ramper", null, "to crawl", "To move on the belly.", "Verb", null, "/ʁɑ̃.pe/", "Le serpent rampe.", "The snake slithers."],
        ["galoper", null, "to gallop", "To run fast like a horse.", "Verb", null, "/ɡa.lɔ.pe/", "Le cheval galope.", "The horse gallops."],
        ["sauter", null, "to jump", "To push oneself off the ground.", "Verb", null, "/so.te/", "Le lapin saute.", "The rabbit hops."],
        ["mordre", null, "to bite", "To use the teeth to cut into something.", "Verb", null, "/mɔʁdʁ/", "Le chien peut mordre.", "The dog can bite."],
        ["rugir", null, "to roar", "To make a deep, loud sound.", "Verb", null, "/ʁy.ʒiʁ/", "Le lion rugit.", "The lion roars."],
        ["siffler", null, "to hiss", "To make a sharp sound.", "Verb", null, "/si.fle/", "Le serpent siffle.", "The snake hisses."],
        ["pondre", null, "to lay eggs", "To produce eggs.", "Verb", null, "/pɔ̃dʁ/", "La poule pond des œufs.", "The hen lays eggs."],
        ["nourrir", null, "to feed", "To give food to.", "Verb", null, "/nu.ʁiʁ/", "Il faut nourrir le cheval.", "The horse needs to be fed."],
        ["élever", null, "to raise", "To bring up animals.", "Verb", null, "/el.ve/", "Ils élèvent des poules.", "They raise chickens."],
        ["observer", null, "to observe", "To watch carefully.", "Verb", null, "/ɔb.sɛʁ.ve/", "J'aime observer les oiseaux.", "I like observing birds."],
        ["capturer", null, "to capture", "To catch an animal.", "Verb", null, "/kap.ty.ʁe/", "Ils capturent un lion.", "They capture a lion."],
        ["protéger", null, "to protect", "To keep safe from harm.", "Verb", null, "/pʁɔ.te.ʒe/", "Il faut protéger les animaux.", "We must protect animals."],
        ["adopter", null, "to adopt", "To take an animal into one's home.", "Verb", null, "/a.dɔp.te/", "Elle a adopté un chat.", "She adopted a cat."],
        ["caresser", null, "to stroke", "To gently touch an animal.", "Verb", null, "/ka.ʁɛ.se/", "Il caresse le chien.", "He strokes the dog."],
        ["dresser", null, "to train", "To teach an animal skills.", "Verb", null, "/dʁɛ.se/", "Elle dresse son chien.", "She trains her dog."],
      ],
    },
      Japanese: {
      Food: [
        ["パン", "pan", "bread", "A staple food made of flour and water, baked into a loaf.", "Noun", null, null, "パンを買います。", "I buy bread."],
        ["ご飯", "gohan", "rice / meal", "Cooked rice; a meal.", "Noun", null, null, "ご飯を食べましょう。", "Let's eat."],
        ["寿司", "sushi", "sushi", "Vinegared rice with fish or vegetables.", "Noun", null, null, "寿司が大好きです。", "I love sushi."],
        ["刺身", "sashimi", "sashimi", "Fresh raw fish sliced thin.", "Noun", null, null, "刺身は新鮮です。", "The sashimi is fresh."],
        ["天ぷら", "tenpura", "tempura", "Battered and deep-fried seafood or vegetables.", "Noun", null, null, "天ぷらは美味しい。", "Tempura is delicious."],
        ["ラーメン", "rāmen", "ramen", "A Japanese noodle soup.", "Noun", null, null, "ラーメンを食べたい。", "I want to eat ramen."],
        ["うどん", "udon", "udon", "Thick Japanese wheat noodles.", "Noun", null, null, "うどんは温かいです。", "The udon is warm."],
        ["そば", "soba", "soba", "Thin Japanese buckwheat noodles.", "Noun", null, null, "そばを食べます。", "I eat soba."],
        ["味噌汁", "misoshiru", "miso soup", "A traditional Japanese soup with miso paste.", "Noun", null, null, "味噌汁を飲みます。", "I drink miso soup."],
        ["おにぎり", "onigiri", "rice ball", "A rice ball, often wrapped in seaweed.", "Noun", null, null, "おにぎりを食べます。", "I eat a rice ball."],
        ["お茶", "ocha", "tea", "A hot drink made from tea leaves.", "Noun", null, null, "お茶を飲みます。", "I drink tea."],
        ["水", "mizu", "water", "Clear liquid essential for life.", "Noun", null, null, "水を一杯ください。", "A glass of water, please."],
        ["お酒", "osake", "alcohol / sake", "An alcoholic beverage.", "Noun", null, null, "お酒は飲みません。", "I don't drink alcohol."],
        ["ビール", "bīru", "beer", "An alcoholic drink made from grain.", "Noun", null, null, "ビールが冷たいです。", "The beer is cold."],
        ["コーヒー", "kōhī", "coffee", "A hot drink from roasted beans.", "Noun", null, null, "コーヒーをください。", "Coffee, please."],
        ["ジュース", "jūsu", "juice", "The liquid extracted from fruit.", "Noun", null, null, "ジュースが飲みたいです。", "I want to drink juice."],
        ["牛乳", "gyūnyū", "milk", "A white liquid from cows.", "Noun", null, null, "牛乳を飲みます。", "I drink milk."],
        ["肉", "niku", "meat", "Animal flesh used as food.", "Noun", null, null, "肉が好きです。", "I like meat."],
        ["牛肉", "gyūniku", "beef", "The meat of a cow.", "Noun", null, null, "牛肉は高いです。", "Beef is expensive."],
        ["豚肉", "butaniku", "pork", "The meat of a pig.", "Noun", null, null, "豚肉を焼きます。", "I grill pork."],
        ["鶏肉", "toriniku", "chicken meat", "The meat of a chicken.", "Noun", null, null, "鶏肉を食べます。", "I eat chicken."],
        ["魚", "sakana", "fish", "An aquatic animal with gills.", "Noun", null, null, "魚を焼きます。", "I grill fish."],
        ["鮭", "sake", "salmon", "A large edible fish with pink flesh.", "Noun", null, null, "鮭が新鮮です。", "The salmon is fresh."],
        ["海老", "ebi", "shrimp", "A small marine crustacean.", "Noun", null, null, "海老を食べます。", "I eat shrimp."],
        ["卵", "tamago", "egg", "An oval body laid by birds.", "Noun", null, null, "卵を割ります。", "I crack an egg."],
        ["野菜", "yasai", "vegetable", "A plant used as food.", "Noun", null, null, "野菜を食べます。", "I eat vegetables."],
        ["人参", "ninjin", "carrot", "A long orange root vegetable.", "Noun", null, null, "人参が好きです。", "I like carrots."],
        ["じゃがいも", "jagaimo", "potato", "A starchy underground tuber.", "Noun", null, null, "じゃがいもを茹でます。", "I boil potatoes."],
        ["トマト", "tomato", "tomato", "A red fruit eaten as a vegetable.", "Noun", null, null, "トマトが赤いです。", "The tomato is red."],
        ["玉ねぎ", "tamanegi", "onion", "A bulbous vegetable with a strong flavour.", "Noun", null, null, "玉ねぎが目にしみます。", "The onion stings my eyes."],
        ["にんにく", "ninniku", "garlic", "A strong-smelling bulb used as seasoning.", "Noun", null, null, "にんにくが効いています。", "The garlic is strong."],
        ["果物", "kudamono", "fruit", "The sweet product of a plant.", "Noun", null, null, "果物が好きです。", "I like fruit."],
        ["りんご", "ringo", "apple", "A round fruit with red or green skin.", "Noun", null, null, "りんごを食べます。", "I eat an apple."],
        ["バナナ", "banana", "banana", "A long curved fruit with sweet flesh.", "Noun", null, null, "バナナが黄色いです。", "The banana is yellow."],
        ["みかん", "mikan", "mandarin orange", "A small citrus fruit with a loose skin.", "Noun", null, null, "みかんは甘いです。", "The mandarin is sweet."],
        ["ぶどう", "budō", "grape", "A small round fruit growing in bunches.", "Noun", null, null, "ぶどうが美味しいです。", "The grapes are delicious."],
        ["いちご", "ichigo", "strawberry", "A small red fruit with tiny seeds.", "Noun", null, null, "いちごが好きです。", "I like strawberries."],
        ["さくらんぼ", "sakuranbo", "cherry", "A small round red stone fruit.", "Noun", null, null, "さくらんぼは高いです。", "Cherries are expensive."],
        ["レモン", "remon", "lemon", "A yellow citrus fruit with sour juice.", "Noun", null, null, "レモンは酸っぱいです。", "The lemon is sour."],
        ["塩", "shio", "salt", "A white mineral used as seasoning.", "Noun", null, null, "塩を入れてください。", "Add some salt."],
        ["砂糖", "satō", "sugar", "A sweet crystalline substance.", "Noun", null, null, "砂糖はいりません。", "I don't need sugar."],
        ["醤油", "shōyu", "soy sauce", "A dark salty sauce made from soybeans.", "Noun", null, null, "醤油をかけます。", "I pour soy sauce."],
        ["酢", "su", "vinegar", "A sour liquid used as a condiment.", "Noun", null, null, "酢が入っています。", "It contains vinegar."],
        ["油", "abura", "oil", "A viscous liquid used in cooking.", "Noun", null, null, "油を熱します。", "I heat the oil."],
        ["バター", "batā", "butter", "A soft yellow dairy product.", "Noun", null, null, "バターを塗ります。", "I spread butter."],
        ["チーズ", "chīzu", "cheese", "A dairy product from curdled milk.", "Noun", null, null, "チーズが好きです。", "I like cheese."],
        ["ケーキ", "kēki", "cake", "A sweet baked food.", "Noun", null, null, "ケーキを買います。", "I buy a cake."],
        ["チョコレート", "chokorēto", "chocolate", "A food made from cacao beans.", "Noun", null, null, "チョコレートを食べます。", "I eat chocolate."],
        ["アイスクリーム", "aisukurīmu", "ice cream", "A frozen sweet food made from dairy.", "Noun", null, null, "アイスクリームが溶けます。", "The ice cream melts."],
        ["レストラン", "resutoran", "restaurant", "A place where meals are served.", "Noun", null, null, "レストランで食べます。", "I eat at a restaurant."],
        ["喫茶店", "kissaten", "coffee shop", "A Japanese-style coffee shop.", "Noun", null, null, "喫茶店で休みます。", "I rest at the coffee shop."],
        ["台所", "daidokoro", "kitchen", "A room for preparing food.", "Noun", null, null, "台所はきれいです。", "The kitchen is clean."],
        ["料理人", "ryōrinin", "cook", "A person who prepares food professionally.", "Noun", null, null, "料理人が料理を作ります。", "The cook prepares the meal."],
        ["食べる", "taberu", "to eat", "To consume food.", "Verb", null, null, "ご飯を食べる。", "To eat a meal."],
        ["飲む", "nomu", "to drink", "To take liquid into the mouth.", "Verb", null, null, "水を飲む。", "To drink water."],
        ["作る", "tsukuru", "to make", "To form or produce something.", "Verb", null, null, "夕食を作ります。", "I make dinner."],
        ["焼く", "yaku", "to grill", "To cook food over direct heat.", "Verb", null, null, "魚を焼きます。", "I grill fish."],
        ["煮る", "niru", "to boil", "To cook in water at boiling point.", "Verb", null, null, "肉を煮ます。", "I boil the meat."],
        ["切る", "kiru", "to cut", "To divide with a sharp instrument.", "Verb", null, null, "野菜を切ります。", "I cut vegetables."],
        ["混ぜる", "mazeru", "to mix", "To combine ingredients together.", "Verb", null, null, "材料を混ぜます。", "I mix the ingredients."],
      ],
      School: [
        ["学校", "gakkō", "school", "An institution for educating children.", "Noun", null, null, "学校へ行きます。", "I go to school."],
        ["小学校", "shōgakkō", "elementary school", "A school for young children.", "Noun", null, null, "小学校に通います。", "I attend elementary school."],
        ["中学校", "chūgakkō", "middle school", "A school for older children.", "Noun", null, null, "中学校で勉強します。", "I study at middle school."],
        ["高校", "kōkō", "high school", "A school for teenagers.", "Noun", null, null, "高校に通います。", "I attend high school."],
        ["大学", "daigaku", "university", "An institution of higher education.", "Noun", null, null, "大学で勉強します。", "I study at university."],
        ["教室", "kyōshitsu", "classroom", "A room where classes are held.", "Noun", null, null, "教室は静かです。", "The classroom is quiet."],
        ["先生", "sensei", "teacher", "A person who teaches.", "Noun", null, null, "先生は優しいです。", "The teacher is kind."],
        ["学生", "gakusei", "student", "A person studying at a school.", "Noun", null, null, "私は学生です。", "I am a student."],
        ["生徒", "seito", "pupil", "A child at school.", "Noun", null, null, "生徒が集まります。", "The pupils gather."],
        ["校長", "kōchō", "principal", "The head of a school.", "Noun", null, null, "校長が話します。", "The principal speaks."],
        ["本", "hon", "book", "A written work bound in covers.", "Noun", null, null, "本を読みます。", "I read a book."],
        ["ノート", "nōto", "notebook", "A book for writing notes.", "Noun", null, null, "ノートを開きます。", "I open my notebook."],
        ["ペン", "pen", "pen", "An instrument for writing with ink.", "Noun", null, null, "ペンで書きます。", "I write with a pen."],
        ["鉛筆", "enpitsu", "pencil", "An instrument for writing.", "Noun", null, null, "鉛筆を貸してください。", "Please lend me a pencil."],
        ["消しゴム", "keshigomu", "eraser", "An object used to remove pencil marks.", "Noun", null, null, "消しゴムが必要です。", "I need an eraser."],
        ["定規", "jōgi", "ruler", "A straight strip used for measuring.", "Noun", null, null, "定規で測ります。", "I measure with a ruler."],
        ["筆箱", "fudebako", "pencil case", "A small container for pens and pencils.", "Noun", null, null, "筆箱は新しいです。", "My pencil case is new."],
        ["鞄", "kaban", "bag", "A bag for carrying school books.", "Noun", null, null, "鞄が重いです。", "My bag is heavy."],
        ["黒板", "kokuban", "blackboard", "A dark board used for writing.", "Noun", null, null, "黒板を見てください。", "Look at the blackboard."],
        ["机", "tsukue", "desk", "A piece of furniture with a flat top.", "Noun", null, null, "机の上に本。", "A book on the desk."],
        ["椅子", "isu", "chair", "A seat for one person.", "Noun", null, null, "椅子に座ります。", "I sit on the chair."],
        ["図書館", "toshokan", "library", "A place with a collection of books.", "Noun", null, null, "図書館へ行きます。", "I'm going to the library."],
        ["宿題", "shukudai", "homework", "Schoolwork to be done at home.", "Noun", null, null, "宿題をします。", "I do my homework."],
        ["授業", "jugyō", "class", "A period of teaching.", "Noun", null, null, "授業が始まります。", "Class begins."],
        ["練習", "renshū", "practice", "Repeated exercise to improve skill.", "Noun", null, null, "練習が大切です。", "Practice is important."],
        ["試験", "shiken", "exam", "A formal test of knowledge.", "Noun", null, null, "明日試験があります。", "I have an exam tomorrow."],
        ["質問", "shitsumon", "question", "A sentence worded to elicit information.", "Noun", null, null, "質問があります。", "I have a question."],
        ["答え", "kotae", "answer", "A reply to a question.", "Noun", null, null, "答えが正しいです。", "The answer is correct."],
        ["成績", "seiseki", "grades", "Marks indicating quality of work.", "Noun", null, null, "成績が良いです。", "My grades are good."],
        ["科目", "kamoku", "subject", "A branch of knowledge studied.", "Noun", null, null, "好きな科目は何ですか。", "What is your favourite subject?"],
        ["数学", "sūgaku", "mathematics", "The study of numbers and quantities.", "Noun", null, null, "数学が好きです。", "I like mathematics."],
        ["歴史", "rekishi", "history", "The study of past events.", "Noun", null, null, "歴史は面白いです。", "History is interesting."],
        ["地理", "chiri", "geography", "The study of the earth.", "Noun", null, null, "地理を勉強します。", "I study geography."],
        ["科学", "kagaku", "science", "The study of the physical world.", "Noun", null, null, "科学は面白いです。", "Science is interesting."],
        ["国語", "kokugo", "national language", "The Japanese language as a school subject.", "Noun", null, null, "国語を勉強します。", "I study Japanese."],
        ["英語", "eigo", "English", "The English language.", "Noun", null, null, "英語を話します。", "I speak English."],
        ["日本語", "nihongo", "Japanese", "The Japanese language.", "Noun", null, null, "日本語を勉強します。", "I study Japanese."],
        ["辞書", "jisho", "dictionary", "A book listing words and meanings.", "Noun", null, null, "辞書を使います。", "I use a dictionary."],
        ["教科書", "kyōkasho", "textbook", "A book used for study.", "Noun", null, null, "教科書を開きます。", "I open the textbook."],
        ["夏休み", "natsuyasumi", "summer holiday", "A school holiday in summer.", "Noun", null, null, "夏休みが楽しみです。", "I look forward to summer holiday."],
        ["冬休み", "fuyuyasumi", "winter holiday", "A school holiday in winter.", "Noun", null, null, "冬休みが始まります。", "Winter holiday begins."],
        ["入学", "nyūgaku", "school entrance", "Entering a school.", "Noun", null, null, "入学式は四月です。", "The entrance ceremony is in April."],
        ["卒業", "sotsugyō", "graduation", "Completing a course of study.", "Noun", null, null, "卒業おめでとう。", "Congratulations on graduating."],
        ["卒業式", "sotsugyōshiki", "graduation ceremony", "A ceremony for graduating students.", "Noun", null, null, "卒業式に出ます。", "I attend the graduation ceremony."],
        ["入学式", "nyūgakushiki", "entrance ceremony", "A ceremony for new students.", "Noun", null, null, "入学式が行われます。", "The entrance ceremony is held."],
        ["廊下", "rōka", "corridor", "A long passage in a building.", "Noun", null, null, "廊下を走らないで。", "Don't run in the corridor."],
        ["運動場", "undōjō", "playground", "An outdoor area for sports.", "Noun", null, null, "運動場で遊びます。", "I play in the playground."],
        ["給食", "kyūshoku", "school lunch", "A meal served at school.", "Noun", null, null, "給食が美味しいです。", "The school lunch is delicious."],
        ["制服", "seifuku", "uniform", "A school uniform.", "Noun", null, null, "制服を着ます。", "I wear the uniform."],
        ["勉強する", "benkyō suru", "to study", "To devote time to learning.", "Verb", null, null, "毎日勉強します。", "I study every day."],
        ["習う", "narau", "to learn", "To gain knowledge or skill.", "Verb", null, null, "日本語を習います。", "I learn Japanese."],
        ["覚える", "oboeru", "to memorize", "To commit to memory.", "Verb", null, null, "新しい言葉を覚えます。", "I memorize new words."],
        ["読む", "yomu", "to read", "To look at and understand written words.", "Verb", null, null, "本を読みます。", "I read a book."],
        ["書く", "kaku", "to write", "To mark letters on a surface.", "Verb", null, null, "名前を書きます。", "I write my name."],
        ["聞く", "kiku", "to listen", "To give attention to sound.", "Verb", null, null, "音楽を聞きます。", "I listen to music."],
        ["話す", "hanasu", "to speak", "To talk.", "Verb", null, null, "日本語を話す。", "To speak Japanese."],
        ["教える", "oshieru", "to teach", "To impart knowledge or skill.", "Verb", null, null, "先生が英語を教えます。", "The teacher teaches English."],
        ["質問する", "shitsumon suru", "to ask a question", "To request information.", "Verb", null, null, "先生に質問します。", "I ask the teacher."],
        ["答える", "kotaeru", "to answer", "To say or write something in reply.", "Verb", null, null, "質問に答えます。", "I answer the question."],
        ["復習する", "fukushū suru", "to review", "To go over material previously studied.", "Verb", null, null, "授業を復習します。", "I review the lesson."],
        ["合格する", "gōkaku suru", "to pass (an exam)", "To be successful in an exam.", "Verb", null, null, "試験に合格しました。", "I passed the exam."],
      ],
      Health: [
        ["健康", "kenkō", "health", "Physical and mental wellbeing.", "Noun", null, null, "健康が一番大切です。", "Health is most important."],
        ["医者", "isha", "doctor", "A person qualified in medicine.", "Noun", null, null, "医者に行きます。", "I go to the doctor."],
        ["医師", "ishi", "physician", "A medical doctor.", "Noun", null, null, "医師に相談します。", "I consult a doctor."],
        ["看護師", "kangoshi", "nurse", "A person trained to care for the sick.", "Noun", null, null, "看護師さんは親切です。", "The nurse is kind."],
        ["薬剤師", "yakuzaishi", "pharmacist", "A person who prepares medicines.", "Noun", null, null, "薬剤師に聞きます。", "I ask the pharmacist."],
        ["病院", "byōin", "hospital", "An institution for medical treatment.", "Noun", null, null, "病院へ行きます。", "I go to the hospital."],
        ["診療所", "shinryōjo", "clinic", "A small medical facility.", "Noun", null, null, "診療所が近くにあります。", "There is a clinic nearby."],
        ["薬局", "yakkyoku", "pharmacy", "A shop where medicines are sold.", "Noun", null, null, "薬局で買います。", "I buy it at the pharmacy."],
        ["薬", "kusuri", "medicine", "A substance used to treat disease.", "Noun", null, null, "薬を飲みます。", "I take medicine."],
        ["錠剤", "jōzai", "tablet", "A small disc of medicine.", "Noun", null, null, "錠剤を飲みます。", "I take a tablet."],
        ["包帯", "hōtai", "bandage", "A strip of material for a wound.", "Noun", null, null, "包帯を替えます。", "I change the bandage."],
        ["注射", "chūsha", "injection", "An act of injecting medicine.", "Noun", null, null, "注射は痛くないです。", "The injection doesn't hurt."],
        ["ワクチン", "wakuchin", "vaccine", "A substance that stimulates immunity.", "Noun", null, null, "ワクチンを受けます。", "I get the vaccine."],
        ["熱", "netsu", "fever", "An abnormally high body temperature.", "Noun", null, null, "熱があります。", "I have a fever."],
        ["風邪", "kaze", "cold", "A common viral infection.", "Noun", null, null, "風邪をひきました。", "I caught a cold."],
        ["インフルエンザ", "infuruenza", "flu", "An infectious viral illness.", "Noun", null, null, "インフルエンザにかかりました。", "I caught the flu."],
        ["咳", "seki", "cough", "A sudden expulsion of air.", "Noun", null, null, "咳が止まりません。", "The cough won't stop."],
        ["病気", "byōki", "illness", "A disease or period of sickness.", "Noun", null, null, "病気になりました。", "I became ill."],
        ["感染", "kansen", "infection", "The invasion of the body by organisms.", "Noun", null, null, "感染を防ぎます。", "I prevent infection."],
        ["怪我", "kega", "injury", "Physical harm to the body.", "Noun", null, null, "怪我をしました。", "I got injured."],
        ["痛み", "itami", "pain", "Physical suffering.", "Noun", null, null, "痛みがあります。", "I have pain."],
        ["頭", "atama", "head", "The upper part of the body.", "Noun", null, null, "頭が痛いです。", "My head hurts."],
        ["お腹", "onaka", "stomach", "The organ where digestion occurs.", "Noun", null, null, "お腹が痛いです。", "My stomach hurts."],
        ["喉", "nodo", "throat", "The passage from mouth to stomach.", "Noun", null, null, "喉が痛いです。", "My throat hurts."],
        ["歯", "ha", "tooth", "A hard structure used for biting.", "Noun", null, null, "歯が痛いです。", "My tooth hurts."],
        ["背中", "senaka", "back", "The rear surface of the body.", "Noun", null, null, "背中が痛いです。", "My back hurts."],
        ["腕", "ude", "arm", "The upper limb of the body.", "Noun", null, null, "腕を骨折しました。", "I broke my arm."],
        ["足", "ashi", "leg / foot", "A limb used for walking.", "Noun", null, null, "足が痛いです。", "My leg hurts."],
        ["心臓", "shinzō", "heart", "The organ that pumps blood.", "Noun", null, null, "心臓が速く打ちます。", "My heart beats fast."],
        ["肺", "hai", "lung", "The organ used for breathing.", "Noun", null, null, "肺が弱いです。", "My lungs are weak."],
        ["血", "chi", "blood", "The red liquid in the body.", "Noun", null, null, "血を採ります。", "They take blood."],
        ["骨", "hone", "bone", "The hard tissue forming the skeleton.", "Noun", null, null, "骨が折れました。", "The bone is broken."],
        ["皮膚", "hifu", "skin", "The outer covering of the body.", "Noun", null, null, "皮膚が柔らかいです。", "Her skin is soft."],
        ["休み", "yasumi", "rest", "A period of inactivity.", "Noun", null, null, "休みが必要です。", "I need rest."],
        ["睡眠", "suimin", "sleep", "A natural state of rest.", "Noun", null, null, "睡眠が大切です。", "Sleep is important."],
        ["疲労", "hirō", "fatigue", "A state of feeling tired.", "Noun", null, null, "疲労が取れません。", "I can't shake the fatigue."],
        ["ストレス", "sutoresu", "stress", "A state of mental strain.", "Noun", null, null, "ストレスがたまります。", "Stress builds up."],
        ["ダイエット", "daietto", "diet", "A special course of food.", "Noun", null, null, "ダイエットをしています。", "I am on a diet."],
        ["運動", "undō", "exercise", "Physical activity for health.", "Noun", null, null, "運動は健康に良いです。", "Exercise is good for health."],
        ["元気", "genki", "healthy / energetic", "In good health and spirits.", "Adjective", null, null, "元気ですか。", "Are you well?"],
        ["丈夫", "jōbu", "robust", "Strong and healthy.", "Adjective", null, null, "体が丈夫です。", "My body is robust."],
        ["弱い", "yowai", "weak", "Lacking physical strength.", "Adjective", null, null, "体が弱いです。", "My body is weak."],
        ["健康な", "kenkō na", "healthy", "In good health.", "Adjective", null, null, "健康な生活をします。", "I live a healthy lifestyle."],
        ["重い", "omoi", "serious", "Severe or grave.", "Adjective", null, null, "重い病気です。", "It is a serious illness."],
        ["軽い", "karui", "mild", "Not severe.", "Adjective", null, null, "軽い風邪です。", "It is a mild cold."],
        ["痛い", "itai", "painful", "Causing physical pain.", "Adjective", null, null, "足が痛いです。", "My leg hurts."],
        ["治す", "naosu", "to cure", "To restore to health.", "Verb", null, null, "病気を治します。", "I cure the illness."],
        ["治る", "naoru", "to heal", "To become healthy again.", "Verb", null, null, "傷が治ります。", "The wound heals."],
        ["治療する", "chiryō suru", "to treat", "To give medical care.", "Verb", null, null, "医師が治療します。", "The doctor treats the patient."],
        ["休む", "yasumu", "to rest", "To stop activity for a while.", "Verb", null, null, "今日は休みます。", "I will rest today."],
        ["寝る", "neru", "to sleep", "To rest with eyes closed.", "Verb", null, null, "早く寝ます。", "I go to bed early."],
        ["起きる", "okiru", "to wake up", "To stop sleeping.", "Verb", null, null, "七時に起きます。", "I wake up at seven."],
        ["呼吸する", "kokyū suru", "to breathe", "To take air into the lungs.", "Verb", null, null, "深呼吸します。", "I take a deep breath."],
        ["運動する", "undō suru", "to exercise", "To engage in physical activity.", "Verb", null, null, "毎日運動します。", "I exercise every day."],
        ["食べる", "taberu", "to eat", "To consume food.", "Verb", null, null, "野菜を食べます。", "I eat vegetables."],
        ["飲む", "nomu", "to drink", "To take liquid into the mouth.", "Verb", null, null, "薬を飲みます。", "I take medicine."],
        ["診る", "miru", "to examine", "To inspect a patient's body.", "Verb", null, null, "医師が患者を診ます。", "The doctor examines the patient."],
        ["回復する", "kaifuku suru", "to recover", "To return to normal health.", "Verb", null, null, "すぐに回復します。", "I will recover soon."],
        ["予防する", "yobō suru", "to prevent", "To stop something from happening.", "Verb", null, null, "病気を予防します。", "I prevent illness."],
      ],
      Travel: [
        ["旅行", "ryokō", "travel", "The act of traveling.", "Noun", null, null, "日本へ旅行します。", "I travel to Japan."],
        ["観光", "kankō", "sightseeing", "Visiting places of interest.", "Noun", null, null, "京都を観光します。", "I sightsee in Kyoto."],
        ["観光客", "kankōkyaku", "tourist", "A person traveling for pleasure.", "Noun", null, null, "観光客が多いです。", "There are many tourists."],
        ["駅", "eki", "station", "A place where trains stop.", "Noun", null, null, "駅はどこですか。", "Where is the station?"],
        ["空港", "kūkō", "airport", "A complex for aircraft.", "Noun", null, null, "空港は遠いです。", "The airport is far."],
        ["港", "minato", "port", "A harbour where ships dock.", "Noun", null, null, "港は賑やかです。", "The port is busy."],
        ["切符", "kippu", "ticket", "A paper allowing travel.", "Noun", null, null, "切符を買います。", "I buy a ticket."],
        ["予約", "yoyaku", "reservation", "An arrangement in advance.", "Noun", null, null, "予約をしました。", "I made a reservation."],
        ["パスポート", "pasupōto", "passport", "An official document for travel.", "Noun", null, null, "パスポートを見せてください。", "Please show your passport."],
        ["ビザ", "biza", "visa", "An endorsement for entry to a country.", "Noun", null, null, "ビザが必要です。", "You need a visa."],
        ["荷物", "nimotsu", "luggage", "Personal belongings for a journey.", "Noun", null, null, "荷物が重いです。", "My luggage is heavy."],
        ["スーツケース", "sūtsukēsu", "suitcase", "A rectangular bag for clothes.", "Noun", null, null, "スーツケースが大きいです。", "The suitcase is big."],
        ["鞄", "kaban", "bag", "A container with a handle.", "Noun", null, null, "鞄を持ちます。", "I carry the bag."],
        ["飛行機", "hikōki", "airplane", "A powered flying vehicle.", "Noun", null, null, "飛行機で行きます。", "I go by plane."],
        ["電車", "densha", "train", "A series of railway carriages.", "Noun", null, null, "電車に乗ります。", "I ride the train."],
        ["地下鉄", "chikatetsu", "subway", "An underground railway.", "Noun", null, null, "地下鉄は速いです。", "The subway is fast."],
        ["バス", "basu", "bus", "A road vehicle for passengers.", "Noun", null, null, "バスが遅れています。", "The bus is late."],
        ["車", "kuruma", "car", "A road vehicle with four wheels.", "Noun", null, null, "車を運転します。", "I drive a car."],
        ["タクシー", "takushī", "taxi", "A car with a driver for hire.", "Noun", null, null, "タクシーに乗ります。", "I take a taxi."],
        ["自転車", "jitensha", "bicycle", "A vehicle with two wheels.", "Noun", null, null, "自転車を借ります。", "I rent a bicycle."],
        ["船", "fune", "boat", "A vessel for traveling on water.", "Noun", null, null, "船で行きます。", "I go by boat."],
        ["ホテル", "hoteru", "hotel", "An establishment providing accommodation.", "Noun", null, null, "ホテルに泊まります。", "I stay at a hotel."],
        ["旅館", "ryokan", "Japanese inn", "A traditional Japanese inn.", "Noun", null, null, "旅館に泊まります。", "I stay at a Japanese inn."],
        ["部屋", "heya", "room", "A space within a building.", "Noun", null, null, "部屋はきれいです。", "The room is clean."],
        ["鍵", "kagi", "key", "An instrument for opening a lock.", "Noun", null, null, "鍵をなくしました。", "I lost my key."],
        ["地図", "chizu", "map", "A representation of an area.", "Noun", null, null, "地図を確認します。", "I check the map."],
        ["計画", "keikaku", "plan", "An arrangement for the future.", "Noun", null, null, "旅行の計画を立てます。", "I plan the trip."],
        ["海", "umi", "sea", "The expanse of salt water.", "Noun", null, null, "海がきれいです。", "The sea is beautiful."],
        ["山", "yama", "mountain", "A large elevation of the earth.", "Noun", null, null, "山に登ります。", "I climb the mountain."],
        ["町", "machi", "town", "A human settlement.", "Noun", null, null, "この町は静かです。", "This town is quiet."],
        ["村", "mura", "village", "A small rural community.", "Noun", null, null, "村に住んでいます。", "I live in a village."],
        ["都市", "toshi", "city", "A large human settlement.", "Noun", null, null, "都市は賑やかです。", "The city is lively."],
        ["博物館", "hakubutsukan", "museum", "A building displaying objects.", "Noun", null, null, "博物館へ行きます。", "I'm going to the museum."],
        ["美術館", "bijutsukan", "art museum", "A museum of fine art.", "Noun", null, null, "美術館を見学します。", "I visit the art museum."],
        ["お寺", "otera", "temple", "A Buddhist place of worship.", "Noun", null, null, "お寺は古いです。", "The temple is old."],
        ["神社", "jinja", "shrine", "A Shinto place of worship.", "Noun", null, null, "神社にお参りします。", "I visit the shrine."],
        ["城", "shiro", "castle", "A large fortified building.", "Noun", null, null, "城は立派です。", "The castle is magnificent."],
        ["公園", "kōen", "park", "A public green space.", "Noun", null, null, "公園を散歩します。", "I walk in the park."],
        ["通り", "tōri", "street", "A public road in a town.", "Noun", null, null, "この通りは静かです。", "This street is quiet."],
        ["道", "michi", "road", "A wide way leading from one place to another.", "Noun", null, null, "道が長いです。", "The road is long."],
        ["橋", "hashi", "bridge", "A structure carrying a road over a river.", "Noun", null, null, "橋を渡ります。", "I cross the bridge."],
        ["国境", "kokkyō", "border", "A line separating two countries.", "Noun", null, null, "国境を越えます。", "I cross the border."],
        ["税関", "zeikan", "customs", "The department that administers duties.", "Noun", null, null, "税関を通ります。", "I go through customs."],
        ["外国", "gaikoku", "foreign country", "A country other than one's own.", "Noun", null, null, "外国へ行きます。", "I go abroad."],
        ["行く", "iku", "to go", "To move to a place.", "Verb", null, null, "学校へ行きます。", "I go to school."],
        ["来る", "kuru", "to come", "To move towards a place.", "Verb", null, null, "友達が来ます。", "A friend is coming."],
        ["帰る", "kaeru", "to return home", "To come back to one's home.", "Verb", null, null, "六時に帰ります。", "I return home at six."],
        ["出発する", "shuppatsu suru", "to depart", "To leave, especially on a journey.", "Verb", null, null, "八時に出発します。", "We depart at eight."],
        ["到着する", "tōchaku suru", "to arrive", "To reach a destination.", "Verb", null, null, "夜に到着します。", "I arrive at night."],
        ["旅行する", "ryokō suru", "to travel", "To go from one place to another.", "Verb", null, null, "海外を旅行します。", "I travel abroad."],
        ["訪れる", "otozureru", "to visit", "To go to see a place.", "Verb", null, null, "京都を訪れます。", "I visit Kyoto."],
        ["予約する", "yoyaku suru", "to reserve", "To arrange in advance.", "Verb", null, null, "ホテルを予約します。", "I reserve a hotel."],
        ["探検する", "tanken suru", "to explore", "To travel through an area.", "Verb", null, null, "森を探検します。", "I explore the forest."],
        ["発見する", "hakken suru", "to discover", "To find something new.", "Verb", null, null, "新しい場所を発見します。", "I discover a new place."],
        ["運転する", "unten suru", "to drive", "To operate a motor vehicle.", "Verb", null, null, "車を運転します。", "I drive a car."],
        ["飛ぶ", "tobu", "to fly", "To move through the air.", "Verb", null, null, "飛行機が飛びます。", "The airplane flies."],
        ["歩く", "aruku", "to walk", "To move on foot.", "Verb", null, null, "街を歩きます。", "I walk around the city."],
        ["迷う", "mayou", "to get lost", "To lose one's way.", "Verb", null, null, "町で迷いました。", "I got lost in town."],
        ["尋ねる", "tazuneru", "to ask", "To ask for information.", "Verb", null, null, "駅を尋ねました。", "I asked for the station."],
      ],
      Business: [
        ["会社", "kaisha", "company", "A commercial business.", "Noun", null, null, "会社で働きます。", "I work at a company."],
        ["企業", "kigyō", "corporation", "A commercial organization.", "Noun", null, null, "大企業で働きます。", "I work at a big corporation."],
        ["事務所", "jimusho", "office", "A room or building used for work.", "Noun", null, null, "事務所は三階です。", "The office is on the third floor."],
        ["社長", "shachō", "president", "The head of a company.", "Noun", null, null, "社長は会議中です。", "The president is in a meeting."],
        ["部長", "buchō", "department head", "The head of a department.", "Noun", null, null, "部長が指示します。", "The department head gives instructions."],
        ["課長", "kachō", "section chief", "The head of a section.", "Noun", null, null, "課長に相談します。", "I consult the section chief."],
        ["社員", "shain", "employee", "A person who works for a company.", "Noun", null, null, "社員が集まります。", "The employees gather."],
        ["同僚", "dōryō", "colleague", "A person with whom one works.", "Noun", null, null, "同僚は親切です。", "My colleague is kind."],
        ["顧客", "kokyaku", "client", "A person using a service.", "Noun", null, null, "顧客に連絡します。", "I contact the client."],
        ["取引先", "torihikisaki", "business partner", "A company one does business with.", "Noun", null, null, "取引先と打ち合わせます。", "I meet with the business partner."],
        ["競争相手", "kyōsōaite", "competitor", "A rival in business.", "Noun", null, null, "競争相手が強いです。", "The competitor is strong."],
        ["市場", "shijō", "market", "The trade in a commodity.", "Noun", null, null, "市場を調査します。", "I research the market."],
        ["商品", "shōhin", "product", "An article manufactured for sale.", "Noun", null, null, "商品を見ます。", "I look at the products."],
        ["サービス", "sābisu", "service", "Work done for a customer.", "Noun", null, null, "サービスが良いです。", "The service is good."],
        ["販売", "hanbai", "sale", "The exchange of goods for money.", "Noun", null, null, "販売が好調です。", "Sales are strong."],
        ["購入", "kōnyū", "purchase", "The act of buying.", "Noun", null, null, "購入を検討します。", "I consider the purchase."],
        ["価格", "kakaku", "price", "The amount of money expected.", "Noun", null, null, "価格が高いです。", "The price is high."],
        ["費用", "hiyō", "cost", "The amount to be paid.", "Noun", null, null, "費用がかかります。", "It costs money."],
        ["請求書", "seikyūsho", "invoice", "A list of goods with amounts owed.", "Noun", null, null, "請求書を送ります。", "I send the invoice."],
        ["見積もり", "mitsumori", "quote", "An estimate of cost.", "Noun", null, null, "見積もりを出します。", "I give a quote."],
        ["契約", "keiyaku", "contract", "A written or spoken agreement.", "Noun", null, null, "契約を結びます。", "We sign a contract."],
        ["合意", "gōi", "agreement", "A negotiated arrangement.", "Noun", null, null, "合意に達しました。", "We reached an agreement."],
        ["交渉", "kōshō", "negotiation", "Discussion to reach an agreement.", "Noun", null, null, "交渉が進みます。", "The negotiation progresses."],
        ["会議", "kaigi", "meeting", "A gathering for discussion.", "Noun", null, null, "会議は三時です。", "The meeting is at three."],
        ["打ち合わせ", "uchiawase", "briefing", "A meeting for coordination.", "Noun", null, null, "打ち合わせをします。", "We have a briefing."],
        ["発表", "happyō", "presentation", "A demonstration or explanation.", "Noun", null, null, "発表は明快です。", "The presentation is clear."],
        ["プロジェクト", "purojekuto", "project", "An enterprise with a goal.", "Noun", null, null, "プロジェクトが進みます。", "The project progresses."],
        ["計画", "keikaku", "plan", "A proposal for doing something.", "Noun", null, null, "計画を立てます。", "I make a plan."],
        ["目標", "mokuhyō", "objective", "A goal or aim.", "Noun", null, null, "目標を達成しました。", "We achieved the objective."],
        ["戦略", "senryaku", "strategy", "A plan of action.", "Noun", null, null, "戦略を練ります。", "I refine the strategy."],
        ["予算", "yosan", "budget", "An estimate of income and expenditure.", "Noun", null, null, "予算が限られています。", "The budget is limited."],
        ["給料", "kyūryō", "salary", "A fixed regular payment for work.", "Noun", null, null, "給料が上がりました。", "My salary went up."],
        ["ボーナス", "bōnasu", "bonus", "An extra payment.", "Noun", null, null, "ボーナスをもらいます。", "I receive a bonus."],
        ["税金", "zeikin", "tax", "A compulsory contribution to the state.", "Noun", null, null, "税金を払います。", "I pay taxes."],
        ["銀行", "ginkō", "bank", "An institution for money.", "Noun", null, null, "銀行は九時に開きます。", "The bank opens at nine."],
        ["お金", "okane", "money", "A medium of exchange.", "Noun", null, null, "お金が必要です。", "Money is needed."],
        ["投資", "tōshi", "investment", "Money put into something to gain profit.", "Noun", null, null, "投資をします。", "I invest."],
        ["利益", "rieki", "profit", "Financial gain.", "Noun", null, null, "利益が増えました。", "Profits increased."],
        ["損失", "sonshitsu", "loss", "Money lost in a transaction.", "Noun", null, null, "損失が出ました。", "We incurred a loss."],
        ["売上", "uriage", "revenue", "The total money received.", "Noun", null, null, "売上が伸びています。", "Revenue is growing."],
        ["成長", "seichō", "growth", "The process of increasing.", "Noun", null, null, "成長が著しいです。", "The growth is remarkable."],
        ["危機", "kiki", "crisis", "A time of intense difficulty.", "Noun", null, null, "経済危機です。", "It's an economic crisis."],
        ["倒産", "tōsan", "bankruptcy", "Legal status of a company unable to pay debts.", "Noun", null, null, "会社が倒産しました。", "The company went bankrupt."],
        ["成功", "seikō", "success", "The accomplishment of an aim.", "Noun", null, null, "事業は成功です。", "The business is successful."],
        ["失敗", "shippai", "failure", "A lack of success.", "Noun", null, null, "失敗は怖くない。", "Failure is not scary."],
        ["働く", "hataraku", "to work", "To perform a job.", "Verb", null, null, "銀行で働きます。", "I work at a bank."],
        ["売る", "uru", "to sell", "To give in exchange for money.", "Verb", null, null, "商品を売ります。", "I sell products."],
        ["買う", "kau", "to buy", "To obtain in exchange for payment.", "Verb", null, null, "材料を買います。", "I purchase materials."],
        ["交渉する", "kōshō suru", "to negotiate", "To discuss to reach an agreement.", "Verb", null, null, "価格を交渉します。", "I negotiate the price."],
        ["投資する", "tōshi suru", "to invest", "To put money into something.", "Verb", null, null, "会社に投資します。", "I invest in the company."],
        ["雇う", "yatou", "to hire", "To employ someone for wages.", "Verb", null, null, "新しい社員を雇います。", "I hire a new employee."],
        ["解雇する", "kaiko suru", "to lay off", "To dismiss an employee.", "Verb", null, null, "社員を解雇します。", "They lay off an employee."],
        ["経営する", "keiei suru", "to manage", "To be in charge of a business.", "Verb", null, null, "会社を経営します。", "I manage a company."],
        ["計画する", "keikaku suru", "to plan", "To decide on and arrange in advance.", "Verb", null, null, "新しい事業を計画します。", "I plan a new business."],
        ["開発する", "kaihatsu suru", "to develop", "To grow or cause to grow.", "Verb", null, null, "新製品を開発します。", "I develop a new product."],
        ["管理する", "kanri suru", "to manage", "To be in charge of.", "Verb", null, null, "予算を管理します。", "I manage the budget."],
        ["請求する", "seikyū suru", "to invoice", "To send a bill.", "Verb", null, null, "顧客に請求します。", "I invoice the client."],
        ["会議する", "kaigi suru", "to meet", "To gather for discussion.", "Verb", null, null, "午後に会議します。", "We meet in the afternoon."],
      ],
      Technology: [
        ["コンピュータ", "konpyūta", "computer", "An electronic device for data.", "Noun", null, null, "コンピュータを使います。", "I use a computer."],
        ["パソコン", "pasokon", "personal computer", "A personal computer.", "Noun", null, null, "パソコンを買いました。", "I bought a computer."],
        ["ノートパソコン", "nōtopasokon", "laptop", "A portable computer.", "Noun", null, null, "ノートパソコンは軽いです。", "The laptop is light."],
        ["電話", "denwa", "phone", "A device for transmitting voice.", "Noun", null, null, "電話が鳴ります。", "The phone rings."],
        ["携帯電話", "keitaidenwa", "mobile phone", "A portable telephone.", "Noun", null, null, "携帯電話をなくしました。", "I lost my mobile phone."],
        ["スマートフォン", "sumātofon", "smartphone", "A mobile phone with advanced features.", "Noun", null, null, "スマートフォンを使います。", "I use a smartphone."],
        ["タブレット", "taburetto", "tablet", "A flat portable computer.", "Noun", null, null, "タブレットは便利です。", "The tablet is handy."],
        ["画面", "gamen", "screen", "A flat panel displaying images.", "Noun", null, null, "画面が明るいです。", "The screen is bright."],
        ["キーボード", "kībōdo", "keyboard", "A set of keys for typing.", "Noun", null, null, "キーボードを使います。", "I use a keyboard."],
        ["マウス", "mausu", "mouse", "A hand-held device controlling a cursor.", "Noun", null, null, "マウスが動きません。", "The mouse doesn't work."],
        ["プリンター", "purintā", "printer", "A device for printing documents.", "Noun", null, null, "プリンターが壊れました。", "The printer is broken."],
        ["スキャナー", "sukyanā", "scanner", "A device for digitizing documents.", "Noun", null, null, "スキャナーは速いです。", "The scanner is fast."],
        ["ヘッドホン", "heddohon", "headphones", "A device worn over the ears.", "Noun", null, null, "ヘッドホンは快適です。", "The headphones are comfortable."],
        ["スピーカー", "supīkā", "speaker", "A device that converts signals into sound.", "Noun", null, null, "スピーカーは強いです。", "The speaker is powerful."],
        ["カメラ", "kamera", "camera", "A device for recording images.", "Noun", null, null, "カメラで撮ります。", "I take pictures with the camera."],
        ["ケーブル", "kēburu", "cable", "A wire for transmitting signals.", "Noun", null, null, "ケーブルが短いです。", "The cable is short."],
        ["充電器", "jūdenki", "charger", "A device for recharging batteries.", "Noun", null, null, "充電器を忘れました。", "I forgot my charger."],
        ["電池", "denchi", "battery", "A device that stores electrical energy.", "Noun", null, null, "電池が少ないです。", "The battery is low."],
        ["インターネット", "intānetto", "internet", "A global computer network.", "Noun", null, null, "インターネットが遅いです。", "The internet is slow."],
        ["Wi-Fi", "waifai", "wifi", "A facility for wireless connection.", "Noun", null, null, "Wi-Fiが無料です。", "The wifi is free."],
        ["ネットワーク", "nettowāku", "network", "A group of interconnected computers.", "Noun", null, null, "ネットワークに接続します。", "I connect to the network."],
        ["サイト", "saito", "website", "A set of related web pages.", "Noun", null, null, "サイトが落ちています。", "The site is down."],
        ["ページ", "pēji", "page", "A single screen of a website.", "Noun", null, null, "ページが読み込めません。", "The page doesn't load."],
        ["リンク", "rinku", "link", "A connection between two things.", "Noun", null, null, "リンクが切れています。", "The link is broken."],
        ["ソフト", "sofuto", "software", "Programs used by a computer.", "Noun", null, null, "このソフトは便利です。", "This software is useful."],
        ["アプリ", "apuri", "application", "A program on a device.", "Noun", null, null, "アプリをインストールします。", "I install the app."],
        ["プログラム", "puroguramu", "program", "A set of instructions for a computer.", "Noun", null, null, "プログラムが止まりました。", "The program crashed."],
        ["ファイル", "fairu", "file", "A collection of data stored under one name.", "Noun", null, null, "ファイルを保存します。", "I save the file."],
        ["フォルダ", "foruda", "folder", "A container for organizing files.", "Noun", null, null, "フォルダは空です。", "The folder is empty."],
        ["文書", "bunsho", "document", "A piece of written or electronic work.", "Noun", null, null, "文書を送ります。", "I send the document."],
        ["写真", "shashin", "photo", "A picture made with a camera.", "Noun", null, null, "この写真はきれいです。", "This photo is beautiful."],
        ["動画", "dōga", "video", "A recording of moving visual images.", "Noun", null, null, "動画が長いです。", "The video is long."],
        ["音楽", "ongaku", "music", "Vocal or instrumental sounds.", "Noun", null, null, "音楽を聴きます。", "I listen to music."],
        ["ゲーム", "gēmu", "game", "An activity for amusement.", "Noun", null, null, "ゲームが楽しいです。", "The game is fun."],
        ["データ", "dēta", "data", "Facts and statistics collected.", "Noun", null, null, "データを保存します。", "I save the data."],
        ["パスワード", "pasuwādo", "password", "A secret word used to gain access.", "Noun", null, null, "パスワードを入力します。", "I enter the password."],
        ["アカウント", "akaunto", "account", "A registration with a service.", "Noun", null, null, "アカウントを作ります。", "I create an account."],
        ["メール", "mēru", "email", "Messages distributed electronically.", "Noun", null, null, "メールを送ります。", "I send an email."],
        ["メッセージ", "messēji", "message", "A communication sent from one person to another.", "Noun", null, null, "メッセージを送りました。", "I sent a message."],
        ["サーバー", "sābā", "server", "A computer that provides data.", "Noun", null, null, "サーバーが止まっています。", "The server is down."],
        ["データベース", "dētabēsu", "database", "A structured set of data.", "Noun", null, null, "データベースは安全です。", "The database is secure."],
        ["セキュリティ", "sekyuriti", "security", "The state of being safe.", "Noun", null, null, "セキュリティが大事です。", "Security is important."],
        ["ウイルス", "uirusu", "virus", "A piece of code that can damage a computer.", "Noun", null, null, "ウイルスが入りました。", "The virus got in."],
        ["更新", "kōshin", "update", "A new version of software.", "Noun", null, null, "更新が来ました。", "An update arrived."],
        ["バックアップ", "bakkuappu", "backup", "A copy of data stored separately.", "Noun", null, null, "バックアップを取ります。", "I make a backup."],
        ["クラウド", "kuraudo", "cloud storage", "Storage of data on remote servers.", "Noun", null, null, "クラウドは便利です。", "Cloud storage is handy."],
        ["ダウンロードする", "daunrōdo suru", "to download", "To copy data from a network.", "Verb", null, null, "ファイルをダウンロードします。", "I download the file."],
        ["インストールする", "insutōru suru", "to install", "To set up software for use.", "Verb", null, null, "アプリをインストールします。", "I install the app."],
        ["クリックする", "kurikku suru", "to click", "To press a button on a mouse.", "Verb", null, null, "ボタンをクリックします。", "I click the button."],
        ["入力する", "nyūryoku suru", "to type", "To write using a keyboard.", "Verb", null, null, "名前を入力します。", "I type my name."],
        ["保存する", "hozon suru", "to save", "To store data for later retrieval.", "Verb", null, null, "ファイルを保存します。", "I save the file."],
        ["印刷する", "insatsu suru", "to print", "To produce a paper copy.", "Verb", null, null, "ページを印刷します。", "I print the page."],
        ["送信する", "sōshin suru", "to send", "To cause to go to a destination.", "Verb", null, null, "メールを送信します。", "I send an email."],
        ["受信する", "jushin suru", "to receive", "To be given something.", "Verb", null, null, "メッセージを受信しました。", "I received your message."],
        ["検索する", "kensaku suru", "to search", "To look for information.", "Verb", null, null, "情報を検索します。", "I search for information."],
        ["共有する", "kyōyū suru", "to share", "To give a portion to others.", "Verb", null, null, "ファイルを共有します。", "I share the file."],
        ["プログラムする", "puroguramu suru", "to program", "To write computer code.", "Verb", null, null, "彼女はプログラムが得意です。", "She is good at programming."],
        ["修理する", "shūri suru", "to repair", "To fix something broken.", "Verb", null, null, "パソコンを修理します。", "I repair the computer."],
        ["接続する", "setsuzoku suru", "to connect", "To link to a network or device.", "Verb", null, null, "Wi-Fiに接続します。", "I connect to wifi."],
        ["消す", "kesu", "to turn off", "To stop the operation of a device.", "Verb", null, null, "電気を消します。", "I turn off the light."],
        ["つける", "tsukeru", "to turn on", "To start the operation of a device.", "Verb", null, null, "電気をつけます。", "I turn on the light."],
        ["更新する", "kōshin suru", "to update", "To make more modern or up to date.", "Verb", null, null, "アプリを更新します。", "I update the app."],
      ],
      Sports: [
        ["スポーツ", "supōtsu", "sport", "Physical activity involving skill.", "Noun", null, null, "スポーツが好きです。", "I like sports."],
        ["サッカー", "sakkā", "soccer", "A game played by two teams kicking a ball.", "Noun", null, null, "サッカーをします。", "I play soccer."],
        ["野球", "yakyū", "baseball", "A bat-and-ball game.", "Noun", null, null, "野球を見ます。", "I watch baseball."],
        ["テニス", "tenisu", "tennis", "A racket sport.", "Noun", null, null, "テニスが上手です。", "Good at tennis."],
        ["ラグビー", "ragubī", "rugby", "A team game with an oval ball.", "Noun", null, null, "ラグビーは激しいです。", "Rugby is intense."],
        ["バレーボール", "barēbōru", "volleyball", "A game where teams hit a ball over a net.", "Noun", null, null, "バレーボールをします。", "I play volleyball."],
        ["バスケットボール", "basukettobōru", "basketball", "A game with a hoop and ball.", "Noun", null, null, "バスケットボールが好きです。", "I like basketball."],
        ["水泳", "suiei", "swimming", "Moving through water.", "Noun", null, null, "水泳を習います。", "I learn swimming."],
        ["陸上", "rikujō", "athletics", "Running, jumping and throwing sports.", "Noun", null, null, "陸上が得意です。", "I'm good at athletics."],
        ["マラソン", "marason", "marathon", "A long-distance race.", "Noun", null, null, "マラソンを走ります。", "I run a marathon."],
        ["サイクリング", "saikuringu", "cycling", "The sport of riding a bicycle.", "Noun", null, null, "サイクリングが好きです。", "I like cycling."],
        ["スキー", "sukī", "skiing", "The sport of gliding over snow.", "Noun", null, null, "スキーをします。", "I ski."],
        ["ハイキング", "haikingu", "hiking", "The activity of going for long walks.", "Noun", null, null, "ハイキングに行きます。", "I go hiking."],
        ["クライミング", "kuraimingu", "climbing", "The sport of climbing rocks or walls.", "Noun", null, null, "クライミングは難しいです。", "Climbing is difficult."],
        ["体操", "taisō", "gymnastics", "Exercises developing agility.", "Noun", null, null, "体操が上手です。", "Good at gymnastics."],
        ["ダンス", "dansu", "dance", "Movement of the body in rhythm.", "Noun", null, null, "ダンスが好きです。", "I like dance."],
        ["ヨガ", "yoga", "yoga", "A discipline of breathing and posture.", "Noun", null, null, "ヨガでリラックスします。", "I relax with yoga."],
        ["チーム", "chīmu", "team", "A group forming one side.", "Noun", null, null, "チームが勝ちました。", "The team won."],
        ["選手", "senshu", "athlete", "A person trained in sports.", "Noun", null, null, "選手が練習します。", "The athlete practices."],
        ["コーチ", "kōchi", "coach", "A person who trains athletes.", "Noun", null, null, "コーチが指導します。", "The coach gives guidance."],
        ["審判", "shinpan", "referee", "A person who enforces rules.", "Noun", null, null, "審判が笛を吹きます。", "The referee blows the whistle."],
        ["チャンピオン", "chanpion", "champion", "A person who has defeated all rivals.", "Noun", null, null, "チャンピオンが笑います。", "The champion smiles."],
        ["試合", "shiai", "match", "A contest between two teams.", "Noun", null, null, "試合を見ます。", "I watch the match."],
        ["競技", "kyōgi", "competition", "An event where people compete.", "Noun", null, null, "競技が始まります。", "The competition begins."],
        ["トーナメント", "tōnamento", "tournament", "A series of contests.", "Noun", null, null, "トーナメントに出ます。", "I enter the tournament."],
        ["選手権", "senshuken", "championship", "A competition to determine a champion.", "Noun", null, null, "選手権が開催されます。", "The championship is held."],
        ["メダル", "medaru", "medal", "A metal disc awarded as an honour.", "Noun", null, null, "メダルをもらいました。", "I received a medal."],
        ["トロフィー", "torofī", "trophy", "A cup awarded as a prize.", "Noun", null, null, "トロフィーは金です。", "The trophy is gold."],
        ["勝利", "shōri", "victory", "An act of defeating an opponent.", "Noun", null, null, "勝利は素晴らしい。", "Victory is wonderful."],
        ["敗北", "haiboku", "defeat", "An instance of being beaten.", "Noun", null, null, "敗北はつらいです。", "Defeat is hard."],
        ["得点", "tokuten", "score", "The number of points gained.", "Noun", null, null, "得点を入れました。", "We scored a point."],
        ["ゴール", "gōru", "goal", "A point scored in certain games.", "Noun", null, null, "ゴールを決めました。", "I scored a goal."],
        ["スタジアム", "sutajiamu", "stadium", "A sports arena with tiers of seats.", "Noun", null, null, "スタジアムは満員です。", "The stadium is full."],
        ["グラウンド", "guraundo", "field", "An area where sports are played.", "Noun", null, null, "グラウンドが濡れています。", "The field is wet."],
        ["プール", "pūru", "swimming pool", "An artificial pool for swimming.", "Noun", null, null, "プールで泳ぎます。", "I swim in the pool."],
        ["体育館", "taiikukan", "gymnasium", "A building for indoor sports.", "Noun", null, null, "体育館で練習します。", "I practice in the gymnasium."],
        ["ボール", "bōru", "ball", "A round object used in games.", "Noun", null, null, "ボールを投げます。", "I throw the ball."],
        ["ラケット", "raketto", "racket", "A bat with strings used in tennis.", "Noun", null, null, "ラケットは新品です。", "The racket is new."],
        ["ユニフォーム", "yunifōmu", "uniform", "A uniform worn by sports players.", "Noun", null, null, "ユニフォームは赤です。", "The uniform is red."],
        ["靴", "kutsu", "shoes", "Footwear worn for sport.", "Noun", null, null, "靴がすり減っています。", "My shoes are worn."],
        ["強い", "tsuyoi", "strong", "Having great physical power.", "Adjective", null, null, "彼は強い選手です。", "He is a strong player."],
        ["速い", "hayai", "fast", "Moving at high speed.", "Adjective", null, null, "彼はとても速いです。", "He is very fast."],
        ["持久力がある", "jikyūryoku ga aru", "enduring", "Having great stamina.", "Adjective", null, null, "彼は持久力があります。", "He has endurance."],
        ["機敏な", "kibin na", "agile", "Able to move quickly and easily.", "Adjective", null, null, "機敏な動きです。", "Agile movement."],
        ["力強い", "chikarazuyoi", "powerful", "Having great strength or force.", "Adjective", null, null, "彼のシュートは力強いです。", "His shot is powerful."],
        ["運動能力のある", "undōnōryoku no aru", "athletic", "Physically strong and active.", "Adjective", null, null, "運動能力があります。", "He has athletic ability."],
        ["練習する", "renshū suru", "to practice", "To perform repeatedly to improve.", "Verb", null, null, "毎日練習します。", "I practice every day."],
        ["勝つ", "katsu", "to win", "To be successful in a contest.", "Verb", null, null, "チームが勝ちました。", "The team won."],
        ["負ける", "makeru", "to lose", "To be defeated in a contest.", "Verb", null, null, "試合に負けました。", "We lost the match."],
        ["走る", "hashiru", "to run", "To move quickly on foot.", "Verb", null, null, "毎朝走ります。", "I run every morning."],
        ["跳ぶ", "tobu", "to jump", "To push oneself off the ground.", "Verb", null, null, "高く跳びます。", "I jump high."],
        ["泳ぐ", "oyogu", "to swim", "To move through water.", "Verb", null, null, "プールで泳ぎます。", "I swim in the pool."],
        ["投げる", "nageru", "to throw", "To propel with force from the hand.", "Verb", null, null, "ボールを投げます。", "I throw the ball."],
        ["捕まえる", "tsukamaeru", "to catch", "To intercept and hold something moving.", "Verb", null, null, "ボールを捕まえます。", "I catch the ball."],
        ["得点する", "tokuten suru", "to score", "To gain a point in a game.", "Verb", null, null, "得点しました。", "We scored."],
        ["守る", "mamoru", "to defend", "To protect against attack.", "Verb", null, null, "ゴールを守ります。", "I defend the goal."],
        ["審判する", "shinpan suru", "to referee", "To act as referee in a match.", "Verb", null, null, "試合を審判します。", "I referee the match."],
        ["応援する", "ōen suru", "to cheer", "To shout in support.", "Verb", null, null, "チームを応援します。", "I cheer for the team."],
        ["引き分ける", "hikiwakeru", "to draw", "To end a game with equal scores.", "Verb", null, null, "試合は引き分けです。", "The match is a draw."],
        ["競う", "kisou", "to compete", "To strive to gain or win something.", "Verb", null, null, "選手たちが競います。", "The athletes compete."],
      ],
      Music: [
        ["音楽", "ongaku", "music", "Vocal or instrumental sounds.", "Noun", null, null, "音楽を聴きます。", "I listen to music."],
        ["歌", "uta", "song", "A short poem set to music.", "Noun", null, null, "歌が上手です。", "Good at singing."],
        ["メロディー", "merodī", "melody", "A sequence of musical notes.", "Noun", null, null, "メロディーが美しいです。", "The melody is beautiful."],
        ["リズム", "rizumu", "rhythm", "A strong, regular, repeated pattern of sound.", "Noun", null, null, "リズムが良いです。", "The rhythm is good."],
        ["ハーモニー", "hāmonī", "harmony", "The combination of simultaneous notes.", "Noun", null, null, "ハーモニーが完璧です。", "The harmony is perfect."],
        ["音符", "onpu", "note", "A single musical sound.", "Noun", null, null, "音符を読みます。", "I read musical notes."],
        ["コード", "kōdo", "chord", "A group of notes played together.", "Noun", null, null, "コードが響きます。", "The chord resonates."],
        ["楽器", "gakki", "musical instrument", "A device for making musical sounds.", "Noun", null, null, "楽器を演奏します。", "I play an instrument."],
        ["ギター", "gitā", "guitar", "A stringed instrument.", "Noun", null, null, "ギターを弾きます。", "I play the guitar."],
        ["ピアノ", "piano", "piano", "A keyboard instrument.", "Noun", null, null, "ピアノを習います。", "I learn piano."],
        ["バイオリン", "baiorin", "violin", "A stringed instrument played with a bow.", "Noun", null, null, "バイオリンは優しい音です。", "The violin has a gentle sound."],
        ["チェロ", "chero", "cello", "A large stringed instrument.", "Noun", null, null, "チェロは深い音です。", "The cello has a deep sound."],
        ["フルート", "furūto", "flute", "A woodwind instrument.", "Noun", null, null, "フルートは軽い音です。", "The flute has a light sound."],
        ["トランペット", "toranpetto", "trumpet", "A brass instrument with a flared bell.", "Noun", null, null, "トランペットが鳴ります。", "The trumpet sounds."],
        ["太鼓", "taiko", "drum", "A percussion instrument.", "Noun", null, null, "太鼓が響きます。", "The drum resonates."],
        ["ドラム", "doramu", "drum kit", "A set of percussion instruments.", "Noun", null, null, "ドラムが上手です。", "Good at drums."],
        ["サックス", "sakkusu", "saxophone", "A brass instrument with a single-reed mouthpiece.", "Noun", null, null, "サックスはジャズです。", "The saxophone is jazz."],
        ["ハープ", "hāpu", "harp", "A large stringed instrument.", "Noun", null, null, "ハープは天国のような音です。", "The harp sounds heavenly."],
        ["歌手", "kashu", "singer", "A person who sings.", "Noun", null, null, "彼女は歌手です。", "She is a singer."],
        ["音楽家", "ongakuka", "musician", "A person who plays music.", "Noun", null, null, "音楽家は上手です。", "The musician is skilled."],
        ["バンド", "bando", "band", "A group of musicians.", "Noun", null, null, "バンドはツアー中です。", "The band is on tour."],
        ["オーケストラ", "ōkesutora", "orchestra", "A group of instrumentalists.", "Noun", null, null, "オーケストラが演奏します。", "The orchestra performs."],
        ["指揮者", "shikisha", "conductor", "A person who directs an orchestra.", "Noun", null, null, "指揮者がタクトを振ります。", "The conductor raises his baton."],
        ["コンサート", "konsāto", "concert", "A musical performance in public.", "Noun", null, null, "コンサートは満席です。", "The concert is sold out."],
        ["ショー", "shō", "show", "A performance for entertainment.", "Noun", null, null, "ショーが始まります。", "The show begins."],
        ["ステージ", "sutēji", "stage", "A raised platform for performance.", "Noun", null, null, "彼女はステージに上がります。", "She goes on stage."],
        ["観客", "kankyaku", "audience", "The people watching a performance.", "Noun", null, null, "観客が拍手します。", "The audience applauds."],
        ["アルバム", "arubamu", "album", "A collection of musical recordings.", "Noun", null, null, "アルバムが出ました。", "The album is out."],
        ["歌詞", "kashi", "lyrics", "The words of a song.", "Noun", null, null, "歌詞が素敵です。", "The lyrics are nice."],
        ["声", "koe", "voice", "The sound produced in speaking or singing.", "Noun", null, null, "彼女の声は澄んでいます。", "Her voice is clear."],
        ["合唱団", "gasshōdan", "choir", "A group of singers.", "Noun", null, null, "合唱団が練習します。", "The choir rehearses."],
        ["オペラ", "opera", "opera", "A dramatic work set to music.", "Noun", null, null, "オペラは壮大です。", "The opera is grand."],
        ["バレエ", "barē", "ballet", "A dance performance set to music.", "Noun", null, null, "バレエは優雅です。", "The ballet is graceful."],
        ["ダンス", "dansu", "dance", "Movement of the body in rhythm.", "Noun", null, null, "ダンスが楽しそうです。", "The dance looks joyful."],
        ["ジャズ", "jazu", "jazz", "A genre of music with improvisation.", "Noun", null, null, "ジャズが好きです。", "I like jazz."],
        ["ロック", "rokku", "rock", "A genre of popular music with a strong beat.", "Noun", null, null, "ロックはエネルギッシュです。", "Rock is energetic."],
        ["クラシック", "kurashikku", "classical", "Relating to traditional Western music.", "Adjective", null, null, "クラシック音楽が好きです。", "I like classical music."],
        ["現代的な", "gendaiteki na", "modern", "Belonging to the present.", "Adjective", null, null, "現代的な音楽です。", "It is modern music."],
        ["リズミカルな", "rizumikaru na", "rhythmic", "Having a strong regular beat.", "Adjective", null, null, "リズミカルな曲です。", "It is a rhythmic song."],
        ["メロディアスな", "merodiasu na", "melodious", "Producing a pleasant musical sound.", "Adjective", null, null, "メロディアスな歌声です。", "It is a melodious voice."],
        ["調和のとれた", "chōwa no toreta", "harmonious", "Forming a pleasing combination.", "Adjective", null, null, "調和のとれた音です。", "The sound is harmonious."],
        ["うるさい", "urusai", "noisy", "Making a lot of noise.", "Adjective", null, null, "コンサートがうるさいです。", "The concert is noisy."],
        ["静かな", "shizuka na", "quiet", "Making little or no noise.", "Adjective", null, null, "静かな音楽です。", "It is quiet music."],
        ["優しい", "yasashii", "soft", "Gentle and not harsh.", "Adjective", null, null, "優しい音です。", "The sound is soft."],
        ["大きい", "ōkii", "loud", "Producing much noise.", "Adjective", null, null, "音が大きいです。", "The sound is loud."],
        ["歌う", "utau", "to sing", "To produce musical sounds with the voice.", "Verb", null, null, "歌を歌います。", "I sing a song."],
        ["聴く", "kiku", "to listen", "To give attention to sound.", "Verb", null, null, "音楽を聴きます。", "I listen to music."],
        ["弾く", "hiku", "to play", "To perform on a musical instrument.", "Verb", null, null, "ピアノを弾きます。", "I play the piano."],
        ["作曲する", "sakkyoku suru", "to compose", "To write music.", "Verb", null, null, "曲を作曲します。", "I compose a song."],
        ["録音する", "rokuon suru", "to record", "To capture sound on a medium.", "Verb", null, null, "歌を録音します。", "I record a song."],
        ["練習する", "renshū suru", "to rehearse", "To practise for a performance.", "Verb", null, null, "バンドが練習します。", "The band rehearses."],
        ["踊る", "odoru", "to dance", "To move rhythmically to music.", "Verb", null, null, "音楽に合わせて踊ります。", "I dance to the music."],
        ["拍手する", "hakushu suru", "to applaud", "To clap one's hands in approval.", "Verb", null, null, "観客が拍手します。", "The audience applauds."],
        ["口笛を吹く", "kuchibue o fuku", "to whistle", "To make a high-pitched sound.", "Verb", null, null, "彼は口笛を吹きます。", "He whistles."],
        ["調律する", "chōritsu suru", "to tune", "To adjust an instrument to the correct pitch.", "Verb", null, null, "ピアノを調律します。", "I tune the piano."],
        ["即興する", "sokkyō suru", "to improvise", "To create music spontaneously.", "Verb", null, null, "彼は即興が得意です。", "He is good at improvising."],
        ["伴奏する", "bansō suru", "to accompany", "To play music in support of another.", "Verb", null, null, "ピアノがバイオリンに伴奏します。", "The piano accompanies the violin."],
        ["演奏する", "ensō suru", "to perform", "To perform a piece of music.", "Verb", null, null, "彼女が歌を演奏します。", "She performs the song."],
        ["音量を上げる", "onryō o ageru", "to turn up", "To increase the volume.", "Verb", null, null, "音量を上げます。", "I turn up the volume."],
        ["音量を下げる", "onryō o sageru", "to turn down", "To decrease the volume.", "Verb", null, null, "音量を下げます。", "I turn down the volume."],
      ],
      Nature: [
        ["自然", "shizen", "nature", "The physical world including plants and animals.", "Noun", null, null, "自然は美しいです。", "Nature is beautiful."],
        ["木", "ki", "tree", "A woody perennial plant.", "Noun", null, null, "木が大きいです。", "The tree is big."],
        ["森", "mori", "forest", "A large area covered with trees.", "Noun", null, null, "森を歩きます。", "I walk through the forest."],
        ["林", "hayashi", "woods", "A small forest.", "Noun", null, null, "林を通ります。", "I pass through the woods."],
        ["花", "hana", "flower", "The reproductive structure of a plant.", "Noun", null, null, "花が咲きました。", "The flower bloomed."],
        ["バラ", "bara", "rose", "A fragrant flower with thorny stems.", "Noun", null, null, "バラは赤いです。", "The rose is red."],
        ["チューリップ", "chūrippu", "tulip", "A bulbous spring-flowering plant.", "Noun", null, null, "チューリップが咲いています。", "The tulips are blooming."],
        ["草", "kusa", "grass", "Low green plants covering the ground.", "Noun", null, null, "草が緑です。", "The grass is green."],
        ["葉", "ha", "leaf", "A flat green structure growing from a stem.", "Noun", null, null, "葉が落ちます。", "The leaf falls."],
        ["枝", "eda", "branch", "A part of a tree growing from the trunk.", "Noun", null, null, "枝が折れました。", "The branch broke."],
        ["根", "ne", "root", "The part of a plant that attaches to the ground.", "Noun", null, null, "根が深いです。", "The root is deep."],
        ["種", "tane", "seed", "A small part of a plant that grows into a new plant.", "Noun", null, null, "種をまきます。", "I sow seeds."],
        ["庭", "niwa", "garden", "A piece of ground for growing flowers.", "Noun", null, null, "庭に花を植えます。", "I plant flowers in the garden."],
        ["畑", "hatake", "field", "An area of open land for crops.", "Noun", null, null, "畑を耕します。", "I plough the field."],
        ["草原", "sōgen", "meadow", "A field with grass and wild flowers.", "Noun", null, null, "草原を歩きます。", "I walk across the meadow."],
        ["山", "yama", "mountain", "A large elevation of the earth.", "Noun", null, null, "山に登ります。", "I climb the mountain."],
        ["丘", "oka", "hill", "A naturally raised area of land.", "Noun", null, null, "丘を登ります。", "I climb the hill."],
        ["谷", "tani", "valley", "A low area of land between hills.", "Noun", null, null, "谷が深いです。", "The valley is deep."],
        ["川", "kawa", "river", "A large natural stream of water.", "Noun", null, null, "川が流れます。", "The river flows."],
        ["湖", "mizuumi", "lake", "A large body of water surrounded by land.", "Noun", null, null, "湖の水はきれいです。", "The lake water is clean."],
        ["海", "umi", "sea", "The expanse of salt water.", "Noun", null, null, "海が静かです。", "The sea is calm."],
        ["大洋", "taiyō", "ocean", "A very large expanse of sea.", "Noun", null, null, "大洋は広いです。", "The ocean is vast."],
        ["波", "nami", "wave", "A moving ridge on the surface of water.", "Noun", null, null, "波が高いです。", "The waves are high."],
        ["ビーチ", "bīchi", "beach", "A pebbly or sandy shore by the sea.", "Noun", null, null, "ビーチは静かです。", "The beach is quiet."],
        ["砂", "suna", "sand", "Loose granular material on beaches.", "Noun", null, null, "砂が暖かいです。", "The sand is warm."],
        ["岩", "iwa", "rock", "A large mass of stone.", "Noun", null, null, "岩が大きいです。", "The rock is large."],
        ["空", "sora", "sky", "The region above the earth.", "Noun", null, null, "空が青いです。", "The sky is blue."],
        ["太陽", "taiyō", "sun", "The star at the center of our system.", "Noun", null, null, "太陽が輝きます。", "The sun shines."],
        ["月", "tsuki", "moon", "The natural satellite of the earth.", "Noun", null, null, "月がきれいです。", "The moon is beautiful."],
        ["星", "hoshi", "star", "A luminous point in the night sky.", "Noun", null, null, "星が光ります。", "The stars shine."],
        ["雲", "kumo", "cloud", "A visible mass of water vapour.", "Noun", null, null, "雲が出ました。", "Clouds appeared."],
        ["雨", "ame", "rain", "Water falling from the sky.", "Noun", null, null, "雨が降ります。", "It rains."],
        ["雪", "yuki", "snow", "Frozen water vapour.", "Noun", null, null, "雪が降ります。", "It snows."],
        ["風", "kaze", "wind", "The movement of air.", "Noun", null, null, "風が強いです。", "The wind is strong."],
        ["嵐", "arashi", "storm", "A violent atmospheric disturbance.", "Noun", null, null, "嵐が来ます。", "The storm is coming."],
        ["虹", "niji", "rainbow", "An arch of colours in the sky after rain.", "Noun", null, null, "虹が出ています。", "A rainbow is out."],
        ["風景", "fūkei", "landscape", "All the visible features of an area.", "Noun", null, null, "風景が美しいです。", "The landscape is beautiful."],
        ["動物", "dōbutsu", "animal", "A living organism that feeds on organic matter.", "Noun", null, null, "動物が好きです。", "I like animals."],
        ["野生の", "yasei no", "wild", "Living in a natural state.", "Adjective", null, null, "野生の動物です。", "It is a wild animal."],
        ["自然な", "shizen na", "natural", "Existing in or produced by nature.", "Adjective", null, null, "自然な景色です。", "It is a natural landscape."],
        ["緑の", "midori no", "green", "The colour of grass.", "Adjective", null, null, "緑の野原です。", "It is a green field."],
        ["花咲く", "hanasaku", "flowery", "Covered with flowers.", "Adjective", null, null, "花咲く庭です。", "It is a flowery garden."],
        ["湿った", "shimetta", "humid", "Containing moisture.", "Adjective", null, null, "湿った空気です。", "The air is humid."],
        ["深い", "fukai", "deep", "Extending far down.", "Adjective", null, null, "深い湖です。", "It is a deep lake."],
        ["静かな", "shizuka na", "calm", "Free from disturbance.", "Adjective", null, null, "静かな海です。", "The sea is calm."],
        ["穏やかな", "odayaka na", "peaceful", "Free from disturbance.", "Adjective", null, null, "穏やかな村です。", "It is a peaceful village."],
        ["育つ", "sodatsu", "to grow", "To develop or increase in size.", "Verb", null, null, "木が育ちます。", "The tree grows."],
        ["植える", "ueru", "to plant", "To place in the ground to grow.", "Verb", null, null, "木を植えます。", "I plant a tree."],
        ["守る", "mamoru", "to protect", "To keep safe from harm.", "Verb", null, null, "自然を守ります。", "I protect nature."],
        ["咲く", "saku", "to bloom", "To produce flowers.", "Verb", null, null, "花が咲きます。", "The flowers bloom."],
        ["観察する", "kansatsu suru", "to observe", "To watch carefully.", "Verb", null, null, "鳥を観察します。", "I observe birds."],
        ["流れる", "nagareru", "to flow", "To move steadily, like a liquid.", "Verb", null, null, "川が流れています。", "The river is flowing."],
        ["登る", "noboru", "to climb", "To go up using the hands and feet.", "Verb", null, null, "山に登ります。", "I climb a mountain."],
        ["散歩する", "sanpo suru", "to stroll", "To walk in a leisurely way.", "Verb", null, null, "公園を散歩します。", "I stroll in the park."],
        ["深呼吸する", "shinkokyū suru", "to breathe deeply", "To take deep breaths.", "Verb", null, null, "深呼吸します。", "I take deep breaths."],
        ["輝く", "kagayaku", "to shine", "To give out bright light.", "Verb", null, null, "太陽が輝きます。", "The sun shines."],
        ["散る", "chiru", "to fall/scatter", "To scatter or fall, as petals.", "Verb", null, null, "桜の花が散ります。", "Cherry blossoms fall."],
      ],
      Emotions: [
        ["感情", "kanjō", "emotion", "A strong feeling.", "Noun", null, null, "感情を表現します。", "I express my emotions."],
        ["気持ち", "kimochi", "feeling", "An emotional state or reaction.", "Noun", null, null, "気持ちが良いです。", "I feel good."],
        ["喜び", "yorokobi", "joy", "A feeling of great pleasure.", "Noun", null, null, "喜びを感じます。", "I feel joy."],
        ["幸せ", "shiawase", "happiness", "The state of being happy.", "Noun", null, null, "幸せを感じます。", "I feel happiness."],
        ["悲しみ", "kanashimi", "sadness", "The condition of being sad.", "Noun", null, null, "悲しみが消えません。", "The sadness won't go away."],
        ["恐れ", "osore", "fear", "An unpleasant emotion caused by threat.", "Noun", null, null, "恐れを感じます。", "I feel fear."],
        ["怒り", "ikari", "anger", "A strong feeling of annoyance.", "Noun", null, null, "怒りが湧きます。", "Anger rises."],
        ["驚き", "odoroki", "surprise", "An unexpected event or emotion.", "Noun", null, null, "驚きを隠せません。", "I can't hide my surprise."],
        ["愛", "ai", "love", "A strong feeling of affection.", "Noun", null, null, "愛は大切です。", "Love is important."],
        ["憎しみ", "nikushimi", "hatred", "An intense dislike.", "Noun", null, null, "憎しみは危険です。", "Hatred is dangerous."],
        ["恥", "haji", "shame", "A painful feeling of humiliation.", "Noun", null, null, "恥を感じます。", "I feel shame."],
        ["誇り", "hokori", "pride", "A feeling of deep satisfaction.", "Noun", null, null, "誇りを持っています。", "I have pride."],
        ["嫉妬", "shitto", "jealousy", "A feeling of envy towards another.", "Noun", null, null, "嫉妬は辛いです。", "Jealousy is painful."],
        ["希望", "kibō", "hope", "A feeling of expectation and desire.", "Noun", null, null, "希望を持っています。", "I have hope."],
        ["絶望", "zetsubō", "despair", "A feeling of hopelessness.", "Noun", null, null, "絶望を感じます。", "I feel despair."],
        ["不安", "fuan", "anxiety", "A feeling of worry or unease.", "Noun", null, null, "少し不安です。", "I am a little anxious."],
        ["ストレス", "sutoresu", "stress", "A state of mental or emotional strain.", "Noun", null, null, "ストレスが溜まります。", "Stress builds up."],
        ["静けさ", "shizukesa", "calm", "A state of peace and quiet.", "Noun", null, null, "静けさが戻ります。", "Calm returns."],
        ["落ち着き", "ochitsuki", "serenity", "The state of being calm and peaceful.", "Noun", null, null, "落ち着きがあります。", "He is serene."],
        ["孤独", "kodoku", "loneliness", "Sadness because one has no company.", "Noun", null, null, "孤独を感じます。", "I feel lonely."],
        ["懐かしさ", "natsukashisa", "nostalgia", "A sentimental longing for the past.", "Noun", null, null, "懐かしさを感じます。", "I feel nostalgic."],
        ["熱意", "netsui", "enthusiasm", "Intense enjoyment or interest.", "Noun", null, null, "熱意があります。", "He has enthusiasm."],
        ["失望", "shitsubō", "disappointment", "Sadness caused by failing to fulfil hopes.", "Noun", null, null, "失望しました。", "I was disappointed."],
        ["感謝", "kansha", "gratitude", "The quality of being thankful.", "Noun", null, null, "感謝しています。", "I am grateful."],
        ["自信", "jishin", "confidence", "A feeling of self-assurance.", "Noun", null, null, "自信があります。", "I have confidence."],
        ["疑い", "utagai", "doubt", "A feeling of uncertainty.", "Noun", null, null, "疑いがあります。", "I have doubt."],
        ["勇気", "yūki", "courage", "The ability to face danger or difficulty.", "Noun", null, null, "勇気があります。", "He has courage."],
        ["臆病", "okubyō", "cowardice", "Lack of bravery.", "Noun", null, null, "臆病は恥ずかしい。", "Cowardice is shameful."],
        ["寛大さ", "kandaisa", "generosity", "The quality of being kind and giving.", "Noun", null, null, "寛大さに感謝します。", "I appreciate his generosity."],
        ["利己主義", "rikoshugi", "selfishness", "The quality of caring only about oneself.", "Noun", null, null, "利己主義は良くない。", "Selfishness is not good."],
        ["嬉しい", "ureshii", "happy", "Feeling pleasure or contentment.", "Adjective", null, null, "とても嬉しいです。", "I am very happy."],
        ["悲しい", "kanashii", "sad", "Feeling sorrow.", "Adjective", null, null, "今日は悲しいです。", "I am sad today."],
        ["怒っている", "okotteiru", "angry", "Feeling strong displeasure.", "Adjective", null, null, "彼は怒っています。", "He is angry."],
        ["心配な", "shinpai na", "worried", "Anxious about potential problems.", "Adjective", null, null, "彼は心配な様子です。", "He looks worried."],
        ["驚いた", "odoroita", "surprised", "Feeling mild astonishment.", "Adjective", null, null, "ニュースに驚きました。", "I was surprised by the news."],
        ["緊張した", "kinchō shita", "nervous", "Easily agitated or alarmed.", "Adjective", null, null, "試験前に緊張します。", "I get nervous before exams."],
        ["感謝している", "kansha shiteiru", "grateful", "Feeling thankful.", "Adjective", null, null, "感謝しています。", "I am grateful."],
        ["誇りに思う", "hokori ni omou", "proud", "Feeling deep satisfaction.", "Adjective", null, null, "あなたを誇りに思います。", "I am proud of you."],
        ["嫉妬深い", "shittobukai", "jealous", "Feeling envy towards another.", "Adjective", null, null, "彼は嫉妬深いです。", "He is jealous."],
        ["激怒した", "gekido shita", "furious", "Extremely angry.", "Adjective", null, null, "彼は激怒しました。", "He became furious."],
        ["嬉しそうな", "ureshisō na", "glad", "Pleased; happy.", "Adjective", null, null, "会えて嬉しいです。", "I'm glad to see you."],
        ["穏やかな", "odayaka na", "tranquil", "Free from disturbance.", "Adjective", null, null, "彼女は穏やかです。", "She is tranquil."],
        ["感動した", "kandō shita", "moved", "Affected by strong emotion.", "Adjective", null, null, "映画に感動しました。", "I was moved by the movie."],
        ["泣く", "naku", "to cry", "To shed tears.", "Verb", null, null, "赤ちゃんが泣きます。", "The baby cries."],
        ["笑う", "warau", "to laugh", "To make sounds expressing amusement.", "Verb", null, null, "みんなで笑います。", "Everyone laughs together."],
        ["微笑む", "hohoemu", "to smile", "To form a smile.", "Verb", null, null, "彼女は微笑みます。", "She smiles."],
        ["愛する", "aisuru", "to love", "To feel deep affection.", "Verb", null, null, "家族を愛します。", "I love my family."],
        ["憎む", "nikumu", "to hate", "To feel intense dislike.", "Verb", null, null, "彼は憎んでいます。", "He hates."],
        ["望む", "nozomu", "to hope", "To want something to happen.", "Verb", null, null, "成功を望みます。", "I hope for success."],
        ["恐れる", "osoreru", "to fear", "To be afraid of.", "Verb", null, null, "嵐を恐れます。", "I fear the storm."],
        ["心配する", "shinpai suru", "to worry", "To feel anxious.", "Verb", null, null, "家族を心配します。", "I worry about my family."],
        ["喜ぶ", "yorokobu", "to rejoice", "To feel or show great joy.", "Verb", null, null, "彼女は喜びました。", "She was delighted."],
        ["怒る", "okoru", "to get angry", "To become angry.", "Verb", null, null, "父が怒りました。", "My father got angry."],
        ["後悔する", "kōkai suru", "to regret", "To feel sorrow about something.", "Verb", null, null, "その決断を後悔しています。", "I regret that decision."],
        ["尊敬する", "sonkei suru", "to admire", "To regard with respect.", "Verb", null, null, "彼の勇気を尊敬します。", "I admire his courage."],
        ["飽きる", "akiru", "to be fed up", "To be tired of something.", "Verb", null, null, "待つのに飽きました。", "I'm fed up with waiting."],
        ["感じる", "kanjiru", "to feel", "To experience an emotion or sensation.", "Verb", null, null, "幸せを感じます。", "I feel happy."],
        ["落ち着く", "ochitsuku", "to calm down", "To become less agitated.", "Verb", null, null, "落ち着いてください。", "Please calm down."],
      ],
      Family: [
        ["家族", "kazoku", "family", "A group of parents and children.", "Noun", null, null, "家族が大好きです。", "I love my family."],
        ["母", "haha", "mother", "A woman in relation to her child.", "Noun", null, null, "母は優しいです。", "My mother is kind."],
        ["お母さん", "okāsan", "mom", "A familiar term for mother.", "Noun", null, null, "お母さんが呼んでいます。", "Mom is calling."],
        ["父", "chichi", "father", "A man in relation to his child.", "Noun", null, null, "父は働きます。", "My father works."],
        ["お父さん", "otōsan", "dad", "A familiar term for father.", "Noun", null, null, "お父さんはどこですか。", "Where is dad?"],
        ["両親", "ryōshin", "parents", "A person's father and mother.", "Noun", null, null, "両親が来ます。", "My parents are coming."],
        ["兄", "ani", "older brother", "A male sibling older than oneself.", "Noun", null, null, "兄は背が高いです。", "My older brother is tall."],
        ["お兄さん", "oniisan", "big brother", "A familiar term for older brother.", "Noun", null, null, "お兄さんは優しいです。", "My big brother is kind."],
        ["姉", "ane", "older sister", "A female sibling older than oneself.", "Noun", null, null, "姉は大学生です。", "My older sister is a university student."],
        ["お姉さん", "onēsan", "big sister", "A familiar term for older sister.", "Noun", null, null, "お姉さんはきれいです。", "My big sister is pretty."],
        ["弟", "otōto", "younger brother", "A male sibling younger than oneself.", "Noun", null, null, "弟はまだ幼いです。", "My younger brother is still young."],
        ["妹", "imōto", "younger sister", "A female sibling younger than oneself.", "Noun", null, null, "妹はかわいいです。", "My younger sister is cute."],
        ["兄弟", "kyōdai", "siblings (brothers)", "Brothers or siblings.", "Noun", null, null, "兄弟が三人います。", "I have three siblings."],
        ["姉妹", "shimai", "sisters", "Female siblings.", "Noun", null, null, "姉妹は仲が良いです。", "The sisters get along well."],
        ["子供", "kodomo", "child", "A young human being.", "Noun", null, null, "子供が遊びます。", "The child plays."],
        ["息子", "musuko", "son", "A male child.", "Noun", null, null, "息子は十歳です。", "My son is ten."],
        ["娘", "musume", "daughter", "A female child.", "Noun", null, null, "娘は学校に行きます。", "My daughter goes to school."],
        ["赤ちゃん", "akachan", "baby", "A very young child.", "Noun", null, null, "赤ちゃんが寝ています。", "The baby is sleeping."],
        ["祖父", "sofu", "grandfather", "The father of one's parent.", "Noun", null, null, "祖父は元気です。", "My grandfather is well."],
        ["おじいさん", "ojiisan", "grandpa", "A familiar term for grandfather.", "Noun", null, null, "おじいさんは散歩します。", "Grandpa takes a walk."],
        ["祖母", "sobo", "grandmother", "The mother of one's parent.", "Noun", null, null, "祖母はお茶を飲みます。", "My grandmother drinks tea."],
        ["おばあさん", "obāsan", "grandma", "A familiar term for grandmother.", "Noun", null, null, "おばあさんは親切です。", "Grandma is kind."],
        ["おじ", "oji", "uncle", "The brother of one's parent.", "Noun", null, null, "おじは東京にいます。", "My uncle is in Tokyo."],
        ["おば", "oba", "aunt", "The sister of one's parent.", "Noun", null, null, "おばは大阪にいます。", "My aunt is in Osaka."],
        ["いとこ", "itoko", "cousin", "A child of one's uncle or aunt.", "Noun", null, null, "いとこが遊びに来ます。", "My cousin is coming to visit."],
        ["甥", "oi", "nephew", "A son of one's sibling.", "Noun", null, null, "甥は小さいです。", "My nephew is small."],
        ["姪", "mei", "niece", "A daughter of one's sibling.", "Noun", null, null, "姪は可愛いです。", "My niece is adorable."],
        ["夫", "otto", "husband", "A married man.", "Noun", null, null, "夫は会社員です。", "My husband is an office worker."],
        ["妻", "tsuma", "wife", "A married woman.", "Noun", null, null, "妻は医者です。", "My wife is a doctor."],
        ["ご主人", "goshujin", "husband (polite)", "A polite term for someone's husband.", "Noun", null, null, "ご主人はお元気ですか。", "Is your husband well?"],
        ["奥さん", "okusan", "wife (polite)", "A polite term for someone's wife.", "Noun", null, null, "奥さんは優しいです。", "Your wife is kind."],
        ["婚約者", "kon'yakusha", "fiancé", "A person engaged to be married.", "Noun", null, null, "婚約者と一緒にいます。", "I am with my fiancé."],
        ["義理の父", "giri no chichi", "father-in-law", "The father of one's spouse.", "Noun", null, null, "義理の父は親切です。", "My father-in-law is kind."],
        ["義理の母", "giri no haha", "mother-in-law", "The mother of one's spouse.", "Noun", null, null, "義理の母は料理上手です。", "My mother-in-law cooks well."],
        ["義理の兄", "giri no ani", "brother-in-law", "The brother of one's spouse.", "Noun", null, null, "義理の兄は面白いです。", "My brother-in-law is funny."],
        ["義理の姉", "giri no ane", "sister-in-law", "The sister of one's spouse.", "Noun", null, null, "義理の姉は親切です。", "My sister-in-law is kind."],
        ["名付け親", "nazukeoya", "godparent", "A person who presents a child at baptism.", "Noun", null, null, "名付け親は優しいです。", "My godparent is kind."],
        ["年上の", "toshiue no", "older", "Having lived longer.", "Adjective", null, null, "年上の兄です。", "My older brother."],
        ["年下の", "toshishita no", "younger", "Having lived for a shorter time.", "Adjective", null, null, "年下の妹です。", "My younger sister."],
        ["若い", "wakai", "young", "Having lived for only a short time.", "Adjective", null, null, "妹は若いです。", "My younger sister is young."],
        ["年老いた", "toshiotaita", "old", "Having lived for a long time.", "Adjective", null, null, "年老いた祖父です。", "My aged grandfather."],
        ["結婚した", "kekkon shita", "married", "Joined in marriage.", "Adjective", null, null, "結婚しています。", "I am married."],
        ["独身の", "dokushin no", "single", "Not married.", "Adjective", null, null, "独身です。", "I am single."],
        ["離婚した", "rikon shita", "divorced", "Legally dissolved from a marriage.", "Adjective", null, null, "離婚しています。", "She is divorced."],
        ["配偶者を亡くした", "haigūsha o nakushita", "widowed", "Having lost a spouse.", "Adjective", null, null, "配偶者を亡くしました。", "He is widowed."],
        ["血のつながった", "chi no tsunagatta", "blood-related", "Related by blood.", "Adjective", null, null, "血のつながった家族です。", "A blood-related family."],
        ["優しい", "yasashii", "kind", "Having a friendly nature.", "Adjective", null, null, "母は優しいです。", "My mother is kind."],
        ["厳しい", "kibishii", "strict", "Demanding that rules be obeyed.", "Adjective", null, null, "父は厳しいです。", "My father is strict."],
        ["仲の良い", "naka no yoi", "close", "Having a friendly relationship.", "Adjective", null, null, "仲の良い家族です。", "We are a close family."],
        ["生まれる", "umareru", "to be born", "To come into existence.", "Verb", null, null, "赤ちゃんが生まれました。", "The baby was born."],
        ["育てる", "sodateru", "to raise", "To bring up a child.", "Verb", null, null, "子供を育てます。", "I raise children."],
        ["育つ", "sodatsu", "to grow up", "To become older.", "Verb", null, null, "子供が育ちます。", "The child grows up."],
        ["尊敬する", "sonkei suru", "to respect", "To show admiration or esteem.", "Verb", null, null, "両親を尊敬します。", "I respect my parents."],
        ["助ける", "tasukeru", "to help", "To assist.", "Verb", null, null, "家族を助けます。", "I help my family."],
        ["支える", "sasaeru", "to support", "To provide assistance.", "Verb", null, null, "家族を支えます。", "I support my family."],
        ["結婚する", "kekkon suru", "to marry", "To take as a spouse.", "Verb", null, null, "二人は結婚します。", "The two will marry."],
        ["離婚する", "rikon suru", "to divorce", "To legally dissolve a marriage.", "Verb", null, null, "二人は離婚します。", "The two will divorce."],
        ["世話をする", "sewa o suru", "to look after", "To take care of.", "Verb", null, null, "祖母の世話をします。", "I look after my grandmother."],
        ["訪ねる", "tazuneru", "to visit", "To go to see a person.", "Verb", null, null, "祖母を訪ねます。", "I visit my grandmother."],
        ["電話する", "denwa suru", "to call", "To use a telephone to contact someone.", "Verb", null, null, "母に電話します。", "I call my mother."],
        ["愛する", "aisuru", "to love", "To feel deep affection.", "Verb", null, null, "家族を愛します。", "I love my family."],
        ["集まる", "atsumaru", "to gather", "To come together as a group.", "Verb", null, null, "家族が集まります。", "The family gathers."],
      ],
      "Daily Life": [
        ["家", "ie", "house", "A building for habitation.", "Noun", null, null, "家に帰ります。", "I return home."],
        ["アパート", "apāto", "apartment", "A set of rooms within a larger building.", "Noun", null, null, "アパートに住んでいます。", "I live in an apartment."],
        ["マンション", "manshon", "condominium", "A multi-unit residential building.", "Noun", null, null, "マンションを買いました。", "I bought a condominium."],
        ["部屋", "heya", "room", "A space within a building.", "Noun", null, null, "部屋を掃除します。", "I clean the room."],
        ["居間", "ima", "living room", "A room for relaxing.", "Noun", null, null, "居間でテレビを見ます。", "I watch TV in the living room."],
        ["台所", "daidokoro", "kitchen", "A room for preparing food.", "Noun", null, null, "台所はきれいです。", "The kitchen is clean."],
        ["風呂", "furo", "bath", "A bath or bathroom.", "Noun", null, null, "風呂に入ります。", "I take a bath."],
        ["トイレ", "toire", "toilet", "A room with a toilet.", "Noun", null, null, "トイレはどこですか。", "Where is the toilet?"],
        ["ドア", "doa", "door", "A barrier used to close an entrance.", "Noun", null, null, "ドアを閉めてください。", "Please close the door."],
        ["窓", "mado", "window", "An opening in a wall fitted with glass.", "Noun", null, null, "窓を開けます。", "I open the window."],
        ["壁", "kabe", "wall", "A vertical structure enclosing an area.", "Noun", null, null, "壁が白いです。", "The wall is white."],
        ["床", "yuka", "floor", "The lower surface of a room.", "Noun", null, null, "床がきれいです。", "The floor is clean."],
        ["天井", "tenjō", "ceiling", "The upper interior surface of a room.", "Noun", null, null, "天井が高いです。", "The ceiling is high."],
        ["階段", "kaidan", "stairs", "A set of steps leading from one floor to another.", "Noun", null, null, "階段を上ります。", "I go up the stairs."],
        ["エレベーター", "erebētā", "elevator", "A platform for moving people between floors.", "Noun", null, null, "エレベーターが壊れています。", "The elevator is broken."],
        ["机", "tsukue", "table / desk", "A piece of furniture with a flat top.", "Noun", null, null, "机の上に本があります。", "There is a book on the table."],
        ["椅子", "isu", "chair", "A seat for one person.", "Noun", null, null, "椅子に座ります。", "I sit on the chair."],
        ["ソファ", "sofa", "sofa", "A long upholstered seat.", "Noun", null, null, "ソファは柔らかいです。", "The sofa is soft."],
        ["ベッド", "beddo", "bed", "A piece of furniture for sleeping.", "Noun", null, null, "ベッドで寝ます。", "I sleep in bed."],
        ["枕", "makura", "pillow", "A cushion for the head.", "Noun", null, null, "枕が柔らかいです。", "The pillow is soft."],
        ["毛布", "mōfu", "blanket", "A warm covering for a bed.", "Noun", null, null, "毛布が暖かいです。", "The blanket is warm."],
        ["シーツ", "shītsu", "sheet", "A large piece of cloth for a bed.", "Noun", null, null, "シーツを替えます。", "I change the sheets."],
        ["タンス", "tansu", "dresser", "A piece of furniture with drawers.", "Noun", null, null, "タンスに服を入れます。", "I put clothes in the dresser."],
        ["棚", "tana", "shelf", "A flat surface for holding items.", "Noun", null, null, "棚に本を並べます。", "I arrange books on the shelf."],
        ["ランプ", "ranpu", "lamp", "A device for giving light.", "Noun", null, null, "ランプをつけます。", "I turn on the lamp."],
        ["鏡", "kagami", "mirror", "A reflective surface showing a person's image.", "Noun", null, null, "鏡を見ます。", "I look in the mirror."],
        ["時計", "tokei", "clock", "An instrument for measuring time.", "Noun", null, null, "時計が止まりました。", "The clock has stopped."],
        ["カーペット", "kāpetto", "carpet", "A floor covering made of thick woven material.", "Noun", null, null, "カーペットが温かいです。", "The carpet is warm."],
        ["カーテン", "kāten", "curtain", "A piece of cloth hung to cover a window.", "Noun", null, null, "カーテンを閉めます。", "I close the curtain."],
        ["鍵", "kagi", "key", "An instrument for opening a lock.", "Noun", null, null, "鍵をなくしました。", "I lost my key."],
        ["目覚まし時計", "mezamashidokei", "alarm clock", "A clock that wakes a sleeper.", "Noun", null, null, "目覚まし時計をかけます。", "I set the alarm clock."],
        ["シャワー", "shawā", "shower", "A cubicle for washing.", "Noun", null, null, "シャワーを浴びます。", "I take a shower."],
        ["石鹸", "sekken", "soap", "A substance used with water for washing.", "Noun", null, null, "石鹸で手を洗います。", "I wash my hands with soap."],
        ["タオル", "taoru", "towel", "An absorbent cloth for drying.", "Noun", null, null, "タオルはきれいです。", "The towel is clean."],
        ["歯ブラシ", "haburashi", "toothbrush", "A small brush for cleaning the teeth.", "Noun", null, null, "歯ブラシを替えます。", "I change my toothbrush."],
        ["歯磨き粉", "hamigakiko", "toothpaste", "A paste for cleaning the teeth.", "Noun", null, null, "歯磨き粉がなくなりました。", "The toothpaste is finished."],
        ["シャンプー", "shanpū", "shampoo", "A liquid for washing hair.", "Noun", null, null, "シャンプーはいい匂いです。", "The shampoo smells good."],
        ["くし", "kushi", "comb", "A tool for arranging the hair.", "Noun", null, null, "くしで髪をとかします。", "I comb my hair."],
        ["きれいな", "kirei na", "clean", "Free from dirt or marks.", "Adjective", null, null, "部屋はきれいです。", "The room is clean."],
        ["汚い", "kitanai", "dirty", "Covered or marked with dirt.", "Adjective", null, null, "服が汚いです。", "My clothes are dirty."],
        ["片付いた", "katadzuita", "tidy", "Arranged neatly.", "Adjective", null, null, "台所は片付いています。", "The kitchen is tidy."],
        ["忙しい", "isogashii", "busy", "Having a great deal to do.", "Adjective", null, null, "今日は忙しいです。", "I am busy today."],
        ["疲れた", "tsukareta", "tired", "In need of rest or sleep.", "Adjective", null, null, "今日は疲れました。", "I am tired today."],
        ["起きる", "okiru", "to wake up", "To stop sleeping.", "Verb", null, null, "七時に起きます。", "I wake up at seven."],
        ["寝る", "neru", "to sleep", "To rest with eyes closed.", "Verb", null, null, "十一時に寝ます。", "I go to bed at eleven."],
        ["起き上がる", "okiagaru", "to get up", "To rise from bed.", "Verb", null, null, "早く起き上がります。", "I get up early."],
        ["洗う", "arau", "to wash", "To clean with water.", "Verb", null, null, "手を洗います。", "I wash my hands."],
        ["磨く", "migaku", "to brush", "To clean with a brush.", "Verb", null, null, "歯を磨きます。", "I brush my teeth."],
        ["着替える", "kigaeru", "to get dressed", "To put on clothes.", "Verb", null, null, "服を着替えます。", "I change my clothes."],
        ["働く", "hataraku", "to work", "To perform a job.", "Verb", null, null, "毎日働きます。", "I work every day."],
        ["片付ける", "katadzukeru", "to tidy", "To put things in their proper places.", "Verb", null, null, "部屋を片付けます。", "I tidy my room."],
        ["掃除する", "sōji suru", "to clean", "To free from dirt.", "Verb", null, null, "部屋を掃除します。", "I clean the room."],
        ["洗濯する", "sentaku suru", "to do laundry", "To wash clothes.", "Verb", null, null, "洗濯をします。", "I do the laundry."],
        ["料理する", "ryōri suru", "to cook", "To prepare food.", "Verb", null, null, "夕食を料理します。", "I cook dinner."],
        ["食べる", "taberu", "to eat", "To consume food.", "Verb", null, null, "ご飯を食べます。", "I eat a meal."],
        ["飲む", "nomu", "to drink", "To take liquid into the mouth.", "Verb", null, null, "水を飲みます。", "I drink water."],
        ["朝食を食べる", "chōshoku o taberu", "to have breakfast", "To eat breakfast.", "Verb", null, null, "朝食を食べます。", "I eat breakfast."],
        ["昼食を食べる", "chūshoku o taberu", "to have lunch", "To eat lunch.", "Verb", null, null, "昼食を食べます。", "I eat lunch."],
        ["夕食を食べる", "yūshoku o taberu", "to have dinner", "To eat dinner.", "Verb", null, null, "夕食を食べます。", "I eat dinner."],
        ["休む", "yasumu", "to rest", "To stop activity for a while.", "Verb", null, null, "少し休みます。", "I rest a little."],
        ["出かける", "dekakeru", "to go out", "To leave one's home.", "Verb", null, null, "午後に出かけます。", "I go out in the afternoon."],
      ],
      Shopping: [
        ["店", "mise", "store", "A place where goods are sold.", "Noun", null, null, "店に入ります。", "I enter the store."],
        ["商店", "shōten", "shop", "A small retail establishment.", "Noun", null, null, "商店が並んでいます。", "Shops are lined up."],
        ["スーパー", "sūpā", "supermarket", "A large self-service grocery store.", "Noun", null, null, "スーパーで買い物します。", "I shop at the supermarket."],
        ["市場", "ichiba", "market", "A regular gathering for purchase and sale.", "Noun", null, null, "市場で買い物します。", "I shop at the market."],
        ["デパート", "depāto", "department store", "A large store selling many kinds of goods.", "Noun", null, null, "デパートで服を買います。", "I buy clothes at the department store."],
        ["薬局", "yakkyoku", "pharmacy", "A shop where medicines are sold.", "Noun", null, null, "薬局で薬を買います。", "I buy medicine at the pharmacy."],
        ["パン屋", "pan'ya", "bakery", "A shop that sells bread.", "Noun", null, null, "パン屋でパンを買います。", "I buy bread at the bakery."],
        ["ケーキ屋", "kēkiya", "cake shop", "A shop that sells cakes.", "Noun", null, null, "ケーキ屋が人気です。", "The cake shop is popular."],
        ["肉屋", "nikuya", "butcher shop", "A shop that sells meat.", "Noun", null, null, "肉屋で肉を買います。", "I buy meat at the butcher shop."],
        ["本屋", "hon'ya", "bookstore", "A shop that sells books.", "Noun", null, null, "本屋で本を買います。", "I buy books at the bookstore."],
        ["値段", "nedan", "price", "The amount of money expected for something.", "Noun", null, null, "値段を確認します。", "I check the price."],
        ["客", "kyaku", "customer", "A person buying goods or services.", "Noun", null, null, "客が並んでいます。", "Customers are lined up."],
        ["店員", "ten'in", "store clerk", "A person who serves customers in a store.", "Noun", null, null, "店員に聞きます。", "I ask the store clerk."],
        ["レジ", "reji", "checkout", "A counter where payment is made.", "Noun", null, null, "レジに並びます。", "I line up at the checkout."],
        ["かご", "kago", "basket", "A container for shopping.", "Noun", null, null, "かごに入れます。", "I put it in the basket."],
        ["カート", "kāto", "shopping cart", "A cart used in a supermarket.", "Noun", null, null, "カートを押します。", "I push the shopping cart."],
        ["カード", "kādo", "card", "A plastic card for making payments.", "Noun", null, null, "カードで払います。", "I pay by card."],
        ["現金", "genkin", "cash", "Money in the form of coins or notes.", "Noun", null, null, "現金で払います。", "I pay in cash."],
        ["お釣り", "otsuri", "change", "Coins of low value returned after payment.", "Noun", null, null, "お釣りをもらいます。", "I receive change."],
        ["領収書", "ryōshūsho", "receipt", "A printed acknowledgment of payment.", "Noun", null, null, "領収書をください。", "Please give me a receipt."],
        ["請求書", "seikyūsho", "invoice", "A list of goods with amounts owed.", "Noun", null, null, "請求書を送ります。", "I send the invoice."],
        ["割引", "waribiki", "discount", "A reduction in price.", "Noun", null, null, "割引があります。", "There is a discount."],
        ["セール", "sēru", "sale", "A period when goods are sold at reduced prices.", "Noun", null, null, "セールが始まります。", "The sale begins."],
        ["特価", "tokka", "special price", "A special offer at a lower price.", "Noun", null, null, "特価で買いました。", "I bought it at a special price."],
        ["サイズ", "saizu", "size", "The dimensions of an item.", "Noun", null, null, "サイズを確認します。", "I check the size."],
        ["試着室", "shichakushitsu", "fitting room", "A small room for trying on clothes.", "Noun", null, null, "試着室はどこですか。", "Where is the fitting room?"],
        ["服", "fuku", "clothes", "Items worn to cover the body.", "Noun", null, null, "服を買います。", "I buy clothes."],
        ["ワンピース", "wanpīsu", "dress", "A one-piece garment for a woman.", "Noun", null, null, "ワンピースがきれいです。", "The dress is pretty."],
        ["シャツ", "shatsu", "shirt", "A garment for the upper body.", "Noun", null, null, "シャツは白いです。", "The shirt is white."],
        ["ズボン", "zubon", "trousers", "A garment covering the legs separately.", "Noun", null, null, "ズボンをはきます。", "I put on the trousers."],
        ["スカート", "sukāto", "skirt", "A garment hanging from the waist.", "Noun", null, null, "スカートが短いです。", "The skirt is short."],
        ["コート", "kōto", "coat", "A garment worn over other clothes for warmth.", "Noun", null, null, "コートが暖かいです。", "The coat is warm."],
        ["ジャケット", "jaketto", "jacket", "A short coat.", "Noun", null, null, "ジャケットはかっこいいです。", "The jacket is cool."],
        ["セーター", "sētā", "sweater", "A knitted garment for the upper body.", "Noun", null, null, "セーターが柔らかいです。", "The sweater is soft."],
        ["靴", "kutsu", "shoes", "Footwear for protecting the feet.", "Noun", null, null, "靴が新しいです。", "My shoes are new."],
        ["ブーツ", "būtsu", "boots", "Coverings for the feet and ankles.", "Noun", null, null, "ブーツは革です。", "The boots are leather."],
        ["サンダル", "sandaru", "sandals", "Light open shoes for warm weather.", "Noun", null, null, "サンダルを履きます。", "I wear sandals."],
        ["靴下", "kutsushita", "socks", "Garments worn on the feet.", "Noun", null, null, "靴下がきれいです。", "The socks are clean."],
        ["帽子", "bōshi", "hat", "A covering for the head.", "Noun", null, null, "帽子をかぶります。", "I wear a hat."],
        ["マフラー", "mafurā", "scarf", "A length of fabric worn around the neck.", "Noun", null, null, "マフラーが暖かいです。", "The scarf is warm."],
        ["手袋", "tebukuro", "gloves", "Coverings for the hands.", "Noun", null, null, "手袋をはめます。", "I put on gloves."],
        ["宝石", "hōseki", "jewel", "A precious ornament.", "Noun", null, null, "宝石は高いです。", "The jewel is expensive."],
        ["腕時計", "udedokei", "watch", "A small clock worn on the wrist.", "Noun", null, null, "腕時計が止まりました。", "The watch has stopped."],
        ["眼鏡", "megane", "glasses", "Frames with lenses worn to aid vision.", "Noun", null, null, "眼鏡をかけます。", "I wear glasses."],
        ["高い", "takai", "expensive", "Costing a lot of money.", "Adjective", null, null, "この商品は高いです。", "This product is expensive."],
        ["安い", "yasui", "cheap", "Costing little money.", "Adjective", null, null, "この店は安いです。", "This store is cheap."],
        ["無料の", "muryō no", "free", "Costing nothing.", "Adjective", null, null, "無料のサービスです。", "It is a free service."],
        ["手に入る", "te ni hairu", "available", "Able to be used or obtained.", "Adjective", null, null, "今は手に入ります。", "It is available now."],
        ["新品の", "shinpin no", "new", "Not previously used.", "Adjective", null, null, "新品のパソコンです。", "It is a new computer."],
        ["中古の", "chūko no", "used", "Previously owned.", "Adjective", null, null, "中古の車です。", "It is a used car."],
        ["手ごろな", "tegokoro na", "affordable", "Inexpensive enough.", "Adjective", null, null, "手ごろな値段です。", "The price is affordable."],
        ["エレガントな", "ereganto na", "elegant", "Graceful and stylish.", "Adjective", null, null, "エレガントな服です。", "Elegant clothes."],
        ["売る", "uru", "to sell", "To give something in exchange for money.", "Verb", null, null, "店で売ります。", "They sell at the store."],
        ["買う", "kau", "to buy", "To obtain in exchange for payment.", "Verb", null, null, "服を買います。", "I buy clothes."],
        ["払う", "harau", "to pay", "To give money for goods.", "Verb", null, null, "カードで払います。", "I pay by card."],
        ["選ぶ", "erabu", "to choose", "To pick from a range.", "Verb", null, null, "商品を選びます。", "I choose a product."],
        ["試着する", "shichaku suru", "to try on", "To test clothing for fit.", "Verb", null, null, "服を試着します。", "I try on the clothes."],
        ["比べる", "kuraberu", "to compare", "To assess similarities and differences.", "Verb", null, null, "値段を比べます。", "I compare prices."],
        ["注文する", "chūmon suru", "to order", "To request goods.", "Verb", null, null, "ネットで注文します。", "I order online."],
        ["届ける", "todokeru", "to deliver", "To bring goods to a destination.", "Verb", null, null, "店が届けます。", "The store will deliver."],
        ["返す", "kaesu", "to return", "To give back goods to a store.", "Verb", null, null, "商品を返します。", "I return the product."],
        ["使う", "tsukau", "to use", "To make use of something.", "Verb", null, null, "お金を使います。", "I spend money."],
        ["貯める", "tameru", "to save", "To keep money for future use.", "Verb", null, null, "お金を貯めます。", "I save money."],
      ],
      Weather: [
        ["天気", "tenki", "weather", "The state of the atmosphere.", "Noun", null, null, "天気がいいです。", "The weather is good."],
        ["気候", "kikō", "climate", "The weather conditions prevailing in an area.", "Noun", null, null, "気候が穏やかです。", "The climate is mild."],
        ["太陽", "taiyō", "sun", "The star at the center of our solar system.", "Noun", null, null, "太陽が出ています。", "The sun is out."],
        ["雨", "ame", "rain", "Moisture falling from the atmosphere.", "Noun", null, null, "雨が降っています。", "It is raining."],
        ["雪", "yuki", "snow", "Frozen water vapour.", "Noun", null, null, "雪が積もりました。", "The snow piled up."],
        ["風", "kaze", "wind", "The natural movement of the air.", "Noun", null, null, "風が強いです。", "The wind is strong."],
        ["雲", "kumo", "cloud", "A visible mass of water vapour.", "Noun", null, null, "雲がありません。", "There are no clouds."],
        ["嵐", "arashi", "storm", "A violent atmospheric disturbance.", "Noun", null, null, "嵐が来ています。", "The storm is coming."],
        ["台風", "taifū", "typhoon", "A tropical cyclone in the western Pacific.", "Noun", null, null, "台風が近づいています。", "The typhoon is approaching."],
        ["霧", "kiri", "fog", "A thick cloud of water droplets.", "Noun", null, null, "霧が深いです。", "The fog is thick."],
        ["露", "tsuyu", "dew", "Small drops of water on cool surfaces.", "Noun", null, null, "露が光っています。", "The dew glistens."],
        ["霜", "shimo", "frost", "A deposit of white ice crystals.", "Noun", null, null, "霜が降りました。", "The frost fell."],
        ["氷", "kōri", "ice", "Frozen water.", "Noun", null, null, "氷が張っています。", "Ice has formed."],
        ["暑さ", "atsusa", "heat", "The quality of being hot.", "Noun", null, null, "暑さが厳しいです。", "The heat is severe."],
        ["猛暑", "mōsho", "heatwave", "A period of unusually hot weather.", "Noun", null, null, "猛暑が続いています。", "The heatwave continues."],
        ["寒さ", "samusa", "cold", "A low temperature.", "Noun", null, null, "寒さが身に染みます。", "The cold seeps in."],
        ["涼しさ", "suzushisa", "coolness", "A state of being cool.", "Noun", null, null, "涼しさが気持ちいいです。", "The coolness is pleasant."],
        ["湿気", "shikke", "humidity", "The amount of water vapour in the air.", "Noun", null, null, "湿気が多いです。", "It is very humid."],
        ["干ばつ", "kanbatsu", "drought", "A prolonged period of abnormally low rainfall.", "Noun", null, null, "干ばつが続いています。", "The drought continues."],
        ["洪水", "kōzui", "flood", "An overflowing of water.", "Noun", null, null, "洪水で道が塞がれました。", "The road was blocked by the flood."],
        ["温度", "ondo", "temperature", "The degree of heat or cold.", "Noun", null, null, "温度が下がりました。", "The temperature dropped."],
        ["度", "do", "degree", "A unit of measurement for temperature.", "Noun", null, null, "二十度です。", "It is twenty degrees."],
        ["温度計", "ondokei", "thermometer", "An instrument for measuring temperature.", "Noun", null, null, "温度計を見ます。", "I look at the thermometer."],
        ["予報", "yohō", "forecast", "A prediction of weather.", "Noun", null, null, "天気予報を見ます。", "I check the weather forecast."],
        ["天気予報", "tenkiyohō", "weather forecast", "A report predicting the weather.", "Noun", null, null, "天気予報によると晴れです。", "According to the forecast, it will be sunny."],
        ["季節", "kisetsu", "season", "Each of the four divisions of the year.", "Noun", null, null, "季節が変わりました。", "The season changed."],
        ["春", "haru", "spring", "The season between winter and summer.", "Noun", null, null, "春が来ました。", "Spring has come."],
        ["夏", "natsu", "summer", "The warmest season of the year.", "Noun", null, null, "夏は暑いです。", "Summer is hot."],
        ["秋", "aki", "autumn", "The season between summer and winter.", "Noun", null, null, "秋は涼しいです。", "Autumn is cool."],
        ["冬", "fuyu", "winter", "The coldest season of the year.", "Noun", null, null, "冬は寒いです。", "Winter is cold."],
        ["虹", "niji", "rainbow", "An arch of colours in the sky after rain.", "Noun", null, null, "虹が出ました。", "A rainbow appeared."],
        ["雷", "kaminari", "lightning / thunder", "A flash of electricity in the sky.", "Noun", null, null, "雷が鳴っています。", "Thunder is rumbling."],
        ["稲妻", "inazuma", "lightning bolt", "A flash of lightning.", "Noun", null, null, "稲妻が光りました。", "A lightning bolt flashed."],
        ["雹", "hyō", "hail", "Pellets of frozen rain.", "Noun", null, null, "雹が降りました。", "Hail fell."],
        ["にわか雨", "niwakaame", "shower", "A brief fall of rain.", "Noun", null, null, "にわか雨が来ました。", "A shower came."],
        ["晴れ", "hare", "sunny", "Bright with sunlight.", "Adjective", null, null, "今日は晴れです。", "It is sunny today."],
        ["曇り", "kumori", "cloudy", "Covered with clouds.", "Adjective", null, null, "今日は曇りです。", "It is cloudy today."],
        ["雨模様", "amamoyō", "rainy", "Characterized by rainfall.", "Adjective", null, null, "雨模様の空です。", "The sky looks rainy."],
        ["風が強い", "kaze ga tsuyoi", "windy", "With strong winds.", "Adjective", null, null, "風が強い日です。", "It is a windy day."],
        ["霧が深い", "kiri ga fukai", "foggy", "Thick with fog.", "Adjective", null, null, "霧が深い朝です。", "It is a foggy morning."],
        ["凍えるような", "kogoeru yō na", "freezing", "Extremely cold.", "Adjective", null, null, "凍えるような寒さです。", "The cold is freezing."],
        ["温暖な", "ondan na", "mild", "Moderately warm.", "Adjective", null, null, "温暖な気候です。", "It is a mild climate."],
        ["湿った", "shimetta", "humid", "Containing moisture.", "Adjective", null, null, "湿った空気です。", "The air is humid."],
        ["乾いた", "kawaita", "dry", "Free from moisture.", "Adjective", null, null, "乾いた天気です。", "The weather is dry."],
        ["荒れた", "areta", "stormy", "Characterized by storms.", "Adjective", null, null, "荒れた海です。", "The sea is stormy."],
        ["寒い", "samui", "cold", "Of or at a low temperature.", "Adjective", null, null, "今日は寒いです。", "It is cold today."],
        ["暑い", "atsui", "hot", "Having a high temperature.", "Adjective", null, null, "今日は暑いです。", "It is hot today."],
        ["涼しい", "suzushii", "cool", "Moderately cold.", "Adjective", null, null, "朝は涼しいです。", "The morning is cool."],
        ["暖かい", "atatakai", "warm", "Moderately hot.", "Adjective", null, null, "今日は暖かいです。", "It is warm today."],
        ["凍る", "kōru", "to freeze", "To turn into ice.", "Verb", null, null, "水が凍りました。", "The water froze."],
        ["降る", "furu", "to fall", "To come down from the sky.", "Verb", null, null, "雨が降ります。", "It rains."],
        ["雪が降る", "yuki ga furu", "to snow", "To fall as snow.", "Verb", null, null, "雪が降っています。", "It is snowing."],
        ["吹く", "fuku", "to blow", "To move air.", "Verb", null, null, "風が吹いています。", "The wind is blowing."],
        ["晴れる", "hareru", "to clear up", "To become sunny.", "Verb", null, null, "午後に晴れます。", "It will clear up in the afternoon."],
        ["曇る", "kumoru", "to become cloudy", "To become covered with clouds.", "Verb", null, null, "空が曇りました。", "The sky became cloudy."],
        ["光る", "hikaru", "to shine", "To give out bright light.", "Verb", null, null, "太陽が光っています。", "The sun is shining."],
        ["雷が鳴る", "kaminari ga naru", "to thunder", "To make a loud noise in the sky.", "Verb", null, null, "雷が鳴っています。", "Thunder is rumbling."],
        ["溶ける", "tokeru", "to melt", "To become liquid by heat.", "Verb", null, null, "雪が溶けました。", "The snow melted."],
        ["冷える", "hieru", "to cool down", "To become cooler.", "Verb", null, null, "夜は冷えます。", "The night gets cold."],
        ["暖まる", "atatamaru", "to warm up", "To become warmer.", "Verb", null, null, "春は暖まります。", "Spring gets warm."],
        ["止む", "yamu", "to stop", "To come to an end.", "Verb", null, null, "雨が止みました。", "The rain stopped."],
      ],
      Numbers: [
        ["零", "rei", "zero", "The number 0.", "Numeral", null, null, "零は数字です。", "Zero is a number."],
        ["一", "ichi", "one", "The number 1.", "Numeral", null, null, "一つのりんご。", "One apple."],
        ["二", "ni", "two", "The number 2.", "Numeral", null, null, "二つの猫。", "Two cats."],
        ["三", "san", "three", "The number 3.", "Numeral", null, null, "三つの花。", "Three flowers."],
        ["四", "shi", "four", "The number 4.", "Numeral", null, null, "四つの季節。", "Four seasons."],
        ["五", "go", "five", "The number 5.", "Numeral", null, null, "五分。", "Five minutes."],
        ["六", "roku", "six", "The number 6.", "Numeral", null, null, "六時間。", "Six hours."],
        ["七", "shichi", "seven", "The number 7.", "Numeral", null, null, "七日。", "Seven days."],
        ["八", "hachi", "eight", "The number 8.", "Numeral", null, null, "八人。", "Eight people."],
        ["九", "kyū", "nine", "The number 9.", "Numeral", null, null, "九ヶ月。", "Nine months."],
        ["十", "jū", "ten", "The number 10.", "Numeral", null, null, "十円。", "Ten yen."],
        ["十一", "jūichi", "eleven", "The number 11.", "Numeral", null, null, "十一人。", "Eleven people."],
        ["十二", "jūni", "twelve", "The number 12.", "Numeral", null, null, "十二月。", "Twelve months."],
        ["十五", "jūgo", "fifteen", "The number 15.", "Numeral", null, null, "十五分。", "Fifteen minutes."],
        ["二十", "nijū", "twenty", "The number 20.", "Numeral", null, null, "二十歳。", "Twenty years old."],
        ["三十", "sanjū", "thirty", "The number 30.", "Numeral", null, null, "三十日。", "Thirty days."],
        ["四十", "yonjū", "forty", "The number 40.", "Numeral", null, null, "四十歳。", "Forty years old."],
        ["五十", "gojū", "fifty", "The number 50.", "Numeral", null, null, "五十円。", "Fifty yen."],
        ["六十", "rokujū", "sixty", "The number 60.", "Numeral", null, null, "六十秒。", "Sixty seconds."],
        ["百", "hyaku", "hundred", "The number 100.", "Numeral", null, null, "百円。", "Hundred yen."],
        ["千", "sen", "thousand", "The number 1000.", "Numeral", null, null, "千円。", "Thousand yen."],
        ["万", "man", "ten thousand", "The number 10000.", "Numeral", null, null, "一万円。", "Ten thousand yen."],
        ["百万", "hyakuman", "million", "The number 1000000.", "Numeral", null, null, "百万人。", "A million people."],
        ["億", "oku", "hundred million", "The number 100000000.", "Numeral", null, null, "一億円。", "A hundred million yen."],
        ["数", "kazu", "number", "A quantity or amount.", "Noun", null, null, "数を確認します。", "I check the number."],
        ["数字", "sūji", "numeral", "A symbol representing a number.", "Noun", null, null, "数字を書きます。", "I write numerals."],
        ["番号", "bangō", "number", "A number identifying something in a series.", "Noun", null, null, "電話番号を教えてください。", "Please tell me your phone number."],
        ["半分", "hanbun", "half", "One of two equal parts.", "Noun", null, null, "半分を使います。", "I use half."],
        ["三分の一", "sanbun no ichi", "one third", "One of three equal parts.", "Noun", null, null, "三分の一の生徒。", "A third of the students."],
        ["四分の一", "yonbun no ichi", "one quarter", "One of four equal parts.", "Noun", null, null, "四分の一が残っています。", "A quarter remains."],
        ["割合", "wariai", "percentage", "A rate per hundred.", "Noun", null, null, "割合を計算します。", "I calculate the percentage."],
        ["合計", "gōkei", "sum", "A total amount.", "Noun", null, null, "合計は十です。", "The total is ten."],
        ["総計", "sōkei", "total", "The whole amount.", "Noun", null, null, "総計を出します。", "I calculate the total."],
        ["足し算", "tashizan", "addition", "A mathematical sum.", "Noun", null, null, "足し算をします。", "I do addition."],
        ["引き算", "hikizan", "subtraction", "The process of taking one number from another.", "Noun", null, null, "引き算をします。", "I do subtraction."],
        ["掛け算", "kakezan", "multiplication", "The process of multiplying numbers.", "Noun", null, null, "掛け算をします。", "I do multiplication."],
        ["割り算", "warizan", "division", "The process of dividing numbers.", "Noun", null, null, "割り算をします。", "I do division."],
        ["分数", "bunsū", "fraction", "A numerical quantity that is not whole.", "Noun", null, null, "分数は難しいです。", "Fractions are difficult."],
        ["小数", "shōsū", "decimal", "Relating to a base-10 system.", "Noun", null, null, "小数で表します。", "It is expressed as a decimal."],
        ["整数", "seisū", "integer", "A whole number.", "Noun", null, null, "整数です。", "It is an integer."],
        ["偶数", "gūsū", "even number", "A number divisible by two.", "Noun", null, null, "八は偶数です。", "Eight is an even number."],
        ["奇数", "kisū", "odd number", "A number not divisible by two.", "Noun", null, null, "七は奇数です。", "Seven is an odd number."],
        ["正の数", "sei no kazu", "positive number", "A number greater than zero.", "Noun", null, null, "正の数です。", "It is a positive number."],
        ["負の数", "fu no kazu", "negative number", "A number less than zero.", "Noun", null, null, "負の数です。", "It is a negative number."],
        ["等しい", "hitoshii", "equal", "Being the same in quantity.", "Adjective", null, null, "二つの数は等しいです。", "The two numbers are equal."],
        ["異なる", "kotonaru", "different", "Not the same as another.", "Adjective", null, null, "数字が異なります。", "The numbers are different."],
        ["大きい", "ōkii", "large", "Of considerable size.", "Adjective", null, null, "大きい数字です。", "It is a large number."],
        ["小さい", "chiisai", "small", "Of a size that is less than normal.", "Adjective", null, null, "小さい数字です。", "It is a small number."],
        ["最初の", "saisho no", "first", "Coming before all others.", "Adjective", null, null, "最初の数です。", "It is the first number."],
        ["最後の", "saigo no", "last", "Coming after all others.", "Adjective", null, null, "最後の数です。", "It is the last number."],
        ["数える", "kazoeru", "to count", "To determine the number of.", "Verb", null, null, "数を数えます。", "I count numbers."],
        ["計算する", "keisan suru", "to calculate", "To compute a result.", "Verb", null, null, "合計を計算します。", "I calculate the total."],
        ["足す", "tasu", "to add", "To combine numbers.", "Verb", null, null, "五に三を足します。", "I add three to five."],
        ["引く", "hiku", "to subtract", "To take away from a number.", "Verb", null, null, "十から四を引きます。", "I subtract four from ten."],
        ["掛ける", "kakeru", "to multiply", "To increase by a factor.", "Verb", null, null, "三に四を掛けます。", "I multiply three by four."],
        ["割る", "waru", "to divide", "To separate into parts.", "Verb", null, null, "十を二で割ります。", "I divide ten by two."],
        ["倍にする", "bai ni suru", "to double", "To multiply by two.", "Verb", null, null, "量を倍にします。", "I double the quantity."],
        ["測る", "hakaru", "to measure", "To determine the size or amount of.", "Verb", null, null, "長さを測ります。", "I measure the length."],
        ["見積もる", "mitsumoru", "to estimate", "To approximate.", "Verb", null, null, "量を見積もります。", "I estimate the quantity."],
        ["四捨五入する", "shishagonyū suru", "to round", "To make a number simpler.", "Verb", null, null, "数字を四捨五入します。", "I round the number."],
      ],
      Time: [
        ["時間", "jikan", "time", "The indefinite continued progress of existence.", "Noun", null, null, "時間がありません。", "There's no time."],
        ["秒", "byō", "second", "A period of one sixtieth of a minute.", "Noun", null, null, "十秒待ちます。", "I wait ten seconds."],
        ["分", "fun", "minute", "A period of 60 seconds.", "Noun", null, null, "五分待ちます。", "I wait five minutes."],
        ["時", "ji", "hour / o'clock", "A period of 60 minutes.", "Noun", null, null, "三時です。", "It is three o'clock."],
        ["日", "hi", "day", "A period of 24 hours.", "Noun", null, null, "いい日ですね。", "What a nice day."],
        ["朝", "asa", "morning", "The period from sunrise to noon.", "Noun", null, null, "おはようございます。", "Good morning."],
        ["午前", "gozen", "a.m.", "The time before noon.", "Noun", null, null, "午前九時です。", "It is 9 a.m."],
        ["正午", "shōgo", "noon", "Twelve o'clock in the day.", "Noun", null, null, "正午です。", "It is noon."],
        ["午後", "gogo", "afternoon", "The time from noon to evening.", "Noun", null, null, "午後三時です。", "It is 3 p.m."],
        ["夕方", "yūgata", "evening", "The period from afternoon to night.", "Noun", null, null, "夕方に散歩します。", "I take a walk in the evening."],
        ["夜", "yoru", "night", "The period of darkness.", "Noun", null, null, "こんばんは。", "Good evening."],
        ["真夜中", "mayonaka", "midnight", "Twelve o'clock at night.", "Noun", null, null, "真夜中です。", "It is midnight."],
        ["夜明け", "yoake", "dawn", "The first appearance of light.", "Noun", null, null, "夜明けが来ました。", "Dawn has come."],
        ["日暮れ", "higure", "dusk", "The time just before nightfall.", "Noun", null, null, "日暮れが近いです。", "Dusk is near."],
        ["週", "shū", "week", "A period of seven days.", "Noun", null, null, "来週会いましょう。", "Let's meet next week."],
        ["週末", "shūmatsu", "weekend", "Saturday and Sunday.", "Noun", null, null, "週末は暇です。", "I am free on the weekend."],
        ["月", "tsuki", "month", "A period of about 30 days.", "Noun", null, null, "今月は忙しい。", "This month is busy."],
        ["年", "toshi", "year", "A period of 365 days.", "Noun", null, null, "良い年を。", "Happy New Year."],
        ["十年", "jūnen", "decade", "A period of ten years.", "Noun", null, null, "十年経ちました。", "Ten years have passed."],
        ["世紀", "seiki", "century", "A period of 100 years.", "Noun", null, null, "二十一世紀です。", "It is the 21st century."],
        ["千年紀", "sennenki", "millennium", "A period of 1000 years.", "Noun", null, null, "新しい千年紀です。", "It is a new millennium."],
        ["昨日", "kinō", "yesterday", "The day before today.", "Noun", null, null, "昨日会いました。", "We met yesterday."],
        ["今日", "kyō", "today", "On this present day.", "Noun", null, null, "今日はいい天気です。", "Today the weather is nice."],
        ["明日", "ashita", "tomorrow", "The day after today.", "Noun", null, null, "明日会いましょう。", "Let's meet tomorrow."],
        ["明後日", "asatte", "day after tomorrow", "Two days from now.", "Noun", null, null, "明後日に会います。", "We meet the day after tomorrow."],
        ["一昨日", "ototoi", "day before yesterday", "Two days ago.", "Noun", null, null, "一昨日会いました。", "We met the day before yesterday."],
        ["今", "ima", "now", "At the present time.", "Noun", null, null, "今行きます。", "I'm going now."],
        ["すぐ", "sugu", "soon", "In a short time.", "Adverb", null, null, "すぐ来ます。", "I'll come soon."],
        ["早く", "hayaku", "early", "Before the expected time.", "Adverb", null, null, "早く起きます。", "I get up early."],
        ["遅く", "osoku", "late", "After the expected time.", "Adverb", null, null, "遅く帰ります。", "I come home late."],
        ["いつも", "itsumo", "always", "At all times.", "Adverb", null, null, "いつも元気です。", "I'm always well."],
        ["よく", "yoku", "often", "Frequently.", "Adverb", null, null, "よく来ます。", "I come often."],
        ["時々", "tokidoki", "sometimes", "Occasionally.", "Adverb", null, null, "時々行きます。", "I sometimes go."],
        ["めったに", "metta ni", "rarely", "Not often.", "Adverb", null, null, "めったに行きません。", "I rarely go."],
        ["決して", "kesshite", "never", "At no time.", "Adverb", null, null, "決して忘れません。", "I will never forget."],
        ["もう", "mō", "already", "Before now.", "Adverb", null, null, "もう行きました。", "I already went."],
        ["まだ", "mada", "still", "Up to and including the present.", "Adverb", null, null, "まだいます。", "I'm still here."],
        ["間", "aida", "during", "Throughout the course of.", "Noun", null, null, "夏の間、暑いです。", "It is hot during summer."],
        ["以来", "irai", "since", "From a past time until now.", "Noun", null, null, "去年以来会っていません。", "I haven't met since last year."],
        ["前", "mae", "before", "During the period preceding.", "Noun", null, null, "正午前です。", "Before noon."],
        ["後", "ato", "after", "During the period following.", "Noun", null, null, "食事の後。", "After the meal."],
        ["カレンダー", "karendā", "calendar", "A chart showing days and months.", "Noun", null, null, "カレンダーを見ます。", "I look at the calendar."],
        ["時計", "tokei", "clock", "An instrument for measuring time.", "Noun", null, null, "時計が止まりました。", "The clock has stopped."],
        ["腕時計", "udedokei", "watch", "A small clock worn on the wrist.", "Noun", null, null, "腕時計をします。", "I wear a watch."],
        ["ストップウォッチ", "sutoppuwotchi", "stopwatch", "A watch used for timing events.", "Noun", null, null, "ストップウォッチを使います。", "I use a stopwatch."],
        ["予定", "yotei", "schedule / plan", "An arrangement to meet at a particular time.", "Noun", null, null, "予定があります。", "I have plans."],
        ["締め切り", "shimekiri", "deadline", "The latest time by which something must be done.", "Noun", null, null, "締め切りが近いです。", "The deadline is near."],
        ["期間", "kikan", "duration", "The time during which something continues.", "Noun", null, null, "期間が短いです。", "The duration is short."],
        ["瞬間", "shunkan", "moment", "A very brief period of time.", "Noun", null, null, "その瞬間を覚えています。", "I remember that moment."],
        ["時代", "jidai", "era", "A particular period of history.", "Noun", null, null, "その時代は平和でした。", "That era was peaceful."],
        ["過去", "kako", "past", "The time before now.", "Noun", null, null, "過去は変えられません。", "The past cannot be changed."],
        ["現在", "genzai", "present", "The current moment.", "Noun", null, null, "現在は忙しいです。", "I am busy now."],
        ["未来", "mirai", "future", "The time yet to come.", "Noun", null, null, "未来は明るいです。", "The future is bright."],
        ["将来", "shōrai", "future", "The time yet to come.", "Noun", null, null, "将来の夢があります。", "I have dreams for the future."],
        ["始まる", "hajimaru", "to begin", "To start.", "Verb", null, null, "映画が始まります。", "The movie begins."],
        ["終わる", "owaru", "to finish", "To come to an end.", "Verb", null, null, "授業が終わります。", "Class ends."],
        ["待つ", "matsu", "to wait", "To stay in place until something happens.", "Verb", null, null, "少し待ちます。", "I wait a little."],
        ["続く", "tsuzuku", "to continue", "To persist over time.", "Verb", null, null, "雨が続きます。", "The rain continues."],
        ["過ぎる", "sugiru", "to pass", "To go by (of time).", "Verb", null, null, "一時間が過ぎました。", "An hour has passed."],
        ["遅れる", "okureru", "to be late", "To arrive after the expected time.", "Verb", null, null, "電車が遅れます。", "The train is late."],
        ["急ぐ", "isogu", "to hurry", "To move or act quickly.", "Verb", null, null, "駅へ急ぎます。", "I hurry to the station."],
      ],
      Colors: [
        ["色", "iro", "color", "The property of reflecting light.", "Noun", null, null, "この色が好きです。", "I like this color."],
        ["赤", "aka", "red", "The colour of blood.", "Noun", null, null, "赤を選びます。", "I choose red."],
        ["青", "ao", "blue", "The colour of a clear sky.", "Noun", null, null, "青が好きです。", "I like blue."],
        ["緑", "midori", "green", "The colour of grass.", "Noun", null, null, "緑がきれいです。", "Green is beautiful."],
        ["黄色", "kiiro", "yellow", "The colour of a ripe lemon.", "Noun", null, null, "黄色を選びます。", "I choose yellow."],
        ["黒", "kuro", "black", "The darkest colour.", "Noun", null, null, "黒を選びます。", "I choose black."],
        ["白", "shiro", "white", "The colour of snow.", "Noun", null, null, "白が好きです。", "I like white."],
        ["オレンジ", "orenji", "orange", "A colour between red and yellow.", "Noun", null, null, "オレンジが明るいです。", "Orange is bright."],
        ["紫", "murasaki", "purple", "A colour between red and blue.", "Noun", null, null, "紫を使います。", "I use purple."],
        ["ピンク", "pinku", "pink", "A pale red colour.", "Noun", null, null, "ピンクが好きです。", "I like pink."],
        ["茶色", "chairo", "brown", "The colour of chocolate.", "Noun", null, null, "茶色の靴です。", "They are brown shoes."],
        ["灰色", "haiiro", "gray", "A colour between black and white.", "Noun", null, null, "灰色の空です。", "The sky is gray."],
        ["ベージュ", "bēju", "beige", "A pale sandy colour.", "Noun", null, null, "ベージュのソファ。", "The beige sofa."],
        ["ターコイズ", "tākoizu", "turquoise", "A bright blue-green colour.", "Noun", null, null, "ターコイズの海。", "The turquoise sea."],
        ["金色", "kin'iro", "golden", "Coloured like gold.", "Noun", null, null, "金色に光ります。", "It shines gold."],
        ["銀色", "gin'iro", "silver", "Coloured like silver.", "Noun", null, null, "銀色のスプーン。", "A silver spoon."],
        ["深紅", "shinku", "crimson", "A rich deep red colour.", "Noun", null, null, "深紅のバラ。", "A crimson rose."],
        ["緋色", "hiiro", "scarlet", "A brilliant red colour.", "Noun", null, null, "緋色の服です。", "Scarlet clothes."],
        ["ワインレッド", "wainreddo", "burgundy", "A dark red colour.", "Noun", null, null, "ワインレッドのワイン。", "Burgundy wine."],
        ["象牙色", "zōgeiro", "ivory", "A creamy white colour.", "Noun", null, null, "象牙色のピアノ。", "An ivory piano."],
        ["藍色", "aīro", "indigo", "A deep blue-violet colour.", "Noun", null, null, "藍色の空。", "The indigo sky."],
        ["黄土色", "ōdoiro", "ochre", "An earthy yellow-brown colour.", "Noun", null, null, "黄土色の地面。", "The ochre ground."],
        ["薄い", "usui", "pale", "Light in colour.", "Adjective", null, null, "薄いピンク色です。", "It is a pale pink color."],
        ["鮮やかな", "azayaka na", "vivid", "Producing powerful feelings.", "Adjective", null, null, "鮮やかな青です。", "It is vivid blue."],
        ["濃い", "koi", "dark", "Deep in colour.", "Adjective", null, null, "濃い緑色です。", "It is dark green."],
        ["明るい", "akarui", "bright", "Giving out much light.", "Adjective", null, null, "明るい色です。", "It is a bright color."],
        ["暗い", "kurai", "dark (shade)", "With little or no light.", "Adjective", null, null, "暗い色です。", "It is a dark color."],
        ["つやのある", "tsuya no aru", "shiny", "Reflecting light.", "Adjective", null, null, "つやのある赤です。", "The red is shiny."],
        ["つやのない", "tsuya no nai", "matte", "Not shiny.", "Adjective", null, null, "つやのないペンキ。", "Matte paint."],
        ["透明な", "tōmei na", "transparent", "Allowing light through.", "Adjective", null, null, "透明なガラスです。", "The glass is transparent."],
        ["不透明な", "futōmei na", "opaque", "Not able to be seen through.", "Adjective", null, null, "不透明な壁です。", "The wall is opaque."],
        ["カラフルな", "karafuru na", "colorful", "Having much or varied colour.", "Adjective", null, null, "カラフルな市場。", "The colorful market."],
        ["色合い", "iroai", "shade", "A particular variety of a colour.", "Noun", null, null, "柔らかい色合い。", "A soft shade."],
        ["ニュアンス", "nyuansu", "nuance", "A subtle difference in colour.", "Noun", null, null, "微妙なニュアンス。", "A subtle nuance."],
        ["顔料", "ganryō", "pigment", "A substance that gives colour.", "Noun", null, null, "顔料は自然です。", "The pigment is natural."],
        ["絵の具", "enogu", "paint", "A coloured substance applied to a surface.", "Noun", null, null, "絵の具で描きます。", "I paint with paint."],
        ["筆", "fude", "brush", "A tool with bristles for painting.", "Noun", null, null, "細い筆です。", "The brush is fine."],
        ["パレット", "paretto", "palette", "A range of colours used by an artist.", "Noun", null, null, "パレットに色を出します。", "I put colors on the palette."],
        ["虹", "niji", "rainbow", "An arch of colours in the sky.", "Noun", null, null, "虹は七色です。", "The rainbow has seven colors."],
        ["プリズム", "purizumu", "prism", "A glass shape that splits light into colours.", "Noun", null, null, "プリズムで光を分けます。", "I split the light with a prism."],
        ["色を塗る", "iro o nuru", "to color", "To add colour to.", "Verb", null, null, "絵に色を塗ります。", "I color the picture."],
        ["描く", "egaku", "to paint", "To apply paint.", "Verb", null, null, "壁を描きます。", "I paint the wall."],
        ["染める", "someru", "to dye", "To colour with dye.", "Verb", null, null, "布を赤く染めます。", "I dye the cloth red."],
        ["絵を描く", "e o kaku", "to draw", "To produce a picture.", "Verb", null, null, "絵を描くのが好きです。", "I like to draw."],
        ["混ぜる", "mazeru", "to mix", "To combine colours.", "Verb", null, null, "色を混ぜます。", "I mix the colors."],
        ["暗くする", "kuraku suru", "to darken", "To make darker.", "Verb", null, null, "色を暗くします。", "I darken the color."],
        ["明るくする", "akaruku suru", "to lighten", "To make lighter in colour.", "Verb", null, null, "色を明るくします。", "I lighten the color."],
        ["輝く", "kagayaku", "to shine", "To give out bright light.", "Verb", null, null, "色が輝きます。", "The color shines."],
        ["装飾する", "sōshoku suru", "to decorate", "To add ornament to.", "Verb", null, null, "部屋を装飾します。", "I decorate the room."],
        ["合わせる", "awaseru", "to match", "To be harmonious with.", "Verb", null, null, "色を合わせます。", "I match the colors."],
        ["対照する", "taishō suru", "to contrast", "To differ strikingly.", "Verb", null, null, "赤と緑が対照します。", "Red and green contrast."],
        ["似ている", "niteiru", "to resemble", "To look like.", "Verb", null, null, "色が似ています。", "The colors resemble each other."],
        ["区別する", "kubetsu suru", "to distinguish", "To recognize a difference.", "Verb", null, null, "色を区別します。", "I distinguish colors."],
        ["鑑賞する", "kanshō suru", "to admire", "To regard with respect.", "Verb", null, null, "色を鑑賞します。", "I admire the color."],
        ["好む", "konomu", "to prefer", "To like better than another.", "Verb", null, null, "青を好みます。", "I prefer blue."],
        ["選ぶ", "erabu", "to choose", "To pick from a range.", "Verb", null, null, "色を選びます。", "I choose a color."],
        ["好き", "suki", "to like", "To find agreeable.", "Adjective", null, null, "ピンクが好きです。", "I like pink."],
        ["嫌い", "kirai", "to hate", "To feel intense dislike.", "Adjective", null, null, "黄色が嫌いです。", "I hate yellow."],
      ],
      Animals: [
        ["動物", "dōbutsu", "animal", "A living organism that feeds on organic matter.", "Noun", null, null, "動物が好きです。", "I like animals."],
        ["犬", "inu", "dog", "A domesticated carnivorous mammal.", "Noun", null, null, "犬が好きです。", "I like dogs."],
        ["猫", "neko", "cat", "A small domesticated carnivorous mammal.", "Noun", null, null, "猫が寝ています。", "The cat is sleeping."],
        ["鳥", "tori", "bird", "A feathered egg-laying vertebrate.", "Noun", null, null, "鳥が飛びます。", "The bird flies."],
        ["馬", "uma", "horse", "A solid-hoofed herbivorous mammal.", "Noun", null, null, "馬が走ります。", "The horse runs."],
        ["牛", "ushi", "cow", "A fully grown female of cattle.", "Noun", null, null, "牛がいます。", "There is a cow."],
        ["雄牛", "oushi", "bull", "An uncastrated male bovine.", "Noun", null, null, "雄牛が強いです。", "The bull is strong."],
        ["羊", "hitsuji", "sheep", "A domesticated ruminant with a thick coat.", "Noun", null, null, "羊が草を食べます。", "The sheep eats grass."],
        ["山羊", "yagi", "goat", "A hardy domesticated ruminant animal.", "Noun", null, null, "山羊が登ります。", "The goat climbs."],
        ["豚", "buta", "pig", "An omnivorous domesticated hoofed mammal.", "Noun", null, null, "豚がいます。", "There is a pig."],
        ["鶏", "niwatori", "chicken", "A domestic fowl kept for eggs.", "Noun", null, null, "鶏がいます。", "There's a chicken."],
        ["雄鶏", "ondori", "rooster", "An adult male chicken.", "Noun", null, null, "雄鶏が鳴きます。", "The rooster crows."],
        ["アヒル", "ahiru", "duck", "A waterbird with a broad bill.", "Noun", null, null, "アヒルが泳ぎます。", "The duck swims."],
        ["ガチョウ", "gachō", "goose", "A large waterbird with a long neck.", "Noun", null, null, "ガチョウがいます。", "There is a goose."],
        ["七面鳥", "shichimenchō", "turkey", "A large bird native to North America.", "Noun", null, null, "七面鳥は伝統的です。", "Turkey is traditional."],
        ["兎", "usagi", "rabbit", "A burrowing plant-eating mammal.", "Noun", null, null, "兎が跳ねます。", "The rabbit hops."],
        ["鼠", "nezumi", "mouse", "A small rodent with a pointed snout.", "Noun", null, null, "鼠が走ります。", "The mouse runs."],
        ["ドブネズミ", "dobunezumi", "rat", "A large rodent with a pointed snout.", "Noun", null, null, "ドブネズミがいます。", "There is a rat."],
        ["リス", "risu", "squirrel", "A bushy-tailed tree-dwelling rodent.", "Noun", null, null, "リスが木に登ります。", "The squirrel climbs the tree."],
        ["ハリネズミ", "harinezumi", "hedgehog", "A small mammal with protective spines.", "Noun", null, null, "ハリネズミがいます。", "There is a hedgehog."],
        ["獅子", "shishi", "lion", "A large tawny wild cat.", "Noun", null, null, "獅子が吠えます。", "The lion roars."],
        ["虎", "tora", "tiger", "A large Asian wild cat.", "Noun", null, null, "虎が強いです。", "The tiger is strong."],
        ["豹", "hyō", "leopard", "A large spotted wild cat.", "Noun", null, null, "豹が速いです。", "The leopard is fast."],
        ["象", "zō", "elephant", "A very large mammal with a trunk.", "Noun", null, null, "象が大きいです。", "The elephant is big."],
        ["キリン", "kirin", "giraffe", "A tall African mammal with a long neck.", "Noun", null, null, "キリンが高いです。", "The giraffe is tall."],
        ["猿", "saru", "monkey", "A small primate with a long tail.", "Noun", null, null, "猿が木に登ります。", "The monkey climbs the tree."],
        ["ゴリラ", "gorira", "gorilla", "A large powerful ape.", "Noun", null, null, "ゴリラが強いです。", "The gorilla is strong."],
        ["熊", "kuma", "bear", "A large heavy mammal with thick fur.", "Noun", null, null, "熊が冬眠します。", "The bear hibernates."],
        ["狼", "ōkami", "wolf", "A wild carnivorous mammal.", "Noun", null, null, "狼が遠吠えします。", "The wolf howls."],
        ["狐", "kitsune", "fox", "A carnivorous mammal with a bushy tail.", "Noun", null, null, "狐が賢いです。", "The fox is clever."],
        ["鹿", "shika", "deer", "A hoofed animal with antlers.", "Noun", null, null, "鹿が走ります。", "The deer runs."],
        ["猪", "inoshishi", "wild boar", "A wild pig with tusks.", "Noun", null, null, "猪が獰猛です。", "The wild boar is fierce."],
        ["ラクダ", "rakuda", "camel", "A large desert mammal with humps.", "Noun", null, null, "ラクダが砂漠を歩きます。", "The camel walks in the desert."],
        ["シマウマ", "shimauma", "zebra", "An African wild horse with stripes.", "Noun", null, null, "シマウマが走ります。", "The zebra runs."],
        ["カンガルー", "kangarū", "kangaroo", "An Australian marsupial with powerful legs.", "Noun", null, null, "カンガルーが跳びます。", "The kangaroo jumps."],
        ["パンダ", "panda", "panda", "A black-and-white bear-like mammal.", "Noun", null, null, "パンダが竹を食べます。", "The panda eats bamboo."],
        ["蜂", "hachi", "bee", "A flying insect that collects nectar.", "Noun", null, null, "蜂が飛びます。", "A bee flies."],
        ["雀蜂", "suzumebachi", "hornet", "A large stinging wasp.", "Noun", null, null, "雀蜂が危ないです。", "The hornet is dangerous."],
        ["蝶", "chō", "butterfly", "An insect with large colourful wings.", "Noun", null, null, "蝶が舞います。", "The butterfly dances."],
        ["蜻蛉", "tonbo", "dragonfly", "A slender insect with transparent wings.", "Noun", null, null, "蜻蛉が飛びます。", "The dragonfly flies."],
        ["蟻", "ari", "ant", "A small insect that lives in colonies.", "Noun", null, null, "蟻が働きます。", "The ant works."],
        ["蜘蛛", "kumo", "spider", "An eight-legged arachnid that spins webs.", "Noun", null, null, "蜘蛛が巣を作ります。", "The spider spins a web."],
        ["蠅", "hae", "fly", "A small flying insect.", "Noun", null, null, "蠅が飛びます。", "The fly flies."],
        ["蚊", "ka", "mosquito", "A small flying insect that bites.", "Noun", null, null, "蚊が刺します。", "The mosquito bites."],
        ["蛇", "hebi", "snake", "A long limbless reptile.", "Noun", null, null, "蛇が這います。", "The snake slithers."],
        ["蜥蜴", "tokage", "lizard", "A reptile with a long body and tail.", "Noun", null, null, "蜥蜴が石の上にいます。", "The lizard is on the stone."],
        ["亀", "kame", "turtle", "A slow-moving reptile with a shell.", "Noun", null, null, "亀がゆっくり歩きます。", "The turtle walks slowly."],
        ["鰐", "wani", "crocodile", "A large predatory reptile with a long snout.", "Noun", null, null, "鰐が待ちます。", "The crocodile waits."],
        ["蛙", "kaeru", "frog", "A tailless amphibian that leaps.", "Noun", null, null, "蛙が跳ねます。", "The frog jumps."],
        ["魚", "sakana", "fish", "A cold-blooded aquatic animal.", "Noun", null, null, "魚が泳ぎます。", "The fish swims."],
        ["鮫", "same", "shark", "A large predatory fish with sharp teeth.", "Noun", null, null, "鮫が危険です。", "The shark is dangerous."],
        ["鯨", "kujira", "whale", "A very large marine mammal.", "Noun", null, null, "鯨が大きいです。", "The whale is big."],
        ["海豚", "iruka", "dolphin", "An intelligent aquatic mammal.", "Noun", null, null, "海豚が跳びます。", "The dolphin jumps."],
        ["アザラシ", "azarashi", "seal", "A fish-eating aquatic mammal.", "Noun", null, null, "アザラシが泳ぎます。", "The seal swims."],
        ["野生の", "yasei no", "wild", "Living in a natural state.", "Adjective", null, null, "野生の動物です。", "It is a wild animal."],
        ["家畜の", "kachiku no", "domestic", "Tamed and kept by humans.", "Adjective", null, null, "家畜の牛です。", "It is a domestic cow."],
        ["獰猛な", "dōmō na", "fierce", "Savage and aggressive.", "Adjective", null, null, "獰猛な虎です。", "A fierce tiger."],
        ["有毒な", "yūdoku na", "venomous", "Producing venom.", "Adjective", null, null, "有毒な蛇です。", "A venomous snake."],
        ["吠える", "hoeru", "to bark", "To make the sound of a dog.", "Verb", null, null, "犬が吠えます。", "The dog barks."],
        ["鳴く", "naku", "to meow", "To make the sound of a cat.", "Verb", null, null, "猫が鳴きます。", "The cat meows."],
        ["飛ぶ", "tobu", "to fly", "To move through the air.", "Verb", null, null, "鳥が飛びます。", "The bird flies."],
        ["泳ぐ", "oyogu", "to swim", "To move through water.", "Verb", null, null, "魚が泳ぎます。", "The fish swims."],
        ["狩る", "karu", "to hunt", "To pursue and kill for food.", "Verb", null, null, "ライオンが狩ります。", "The lion hunts."],
        ["這う", "hau", "to crawl", "To move on the belly.", "Verb", null, null, "蛇が這います。", "The snake crawls."],
        ["駆ける", "kakeru", "to gallop", "To run fast like a horse.", "Verb", null, null, "馬が駆けます。", "The horse gallops."],
        ["跳ねる", "haneru", "to hop", "To move by jumping.", "Verb", null, null, "兎が跳ねます。", "The rabbit hops."],
        ["噛む", "kamu", "to bite", "To use the teeth to cut into something.", "Verb", null, null, "犬が骨を噛みます。", "The dog bites the bone."],
        ["吠える", "hoeru", "to roar", "To make a deep, loud sound.", "Verb", null, null, "獅子が吠えます。", "The lion roars."],
        ["鳴く", "naku", "to hiss", "To make a sharp sound.", "Verb", null, null, "蛇が鳴きます。", "The snake hisses."],
        ["産む", "umu", "to lay eggs", "To produce eggs.", "Verb", null, null, "鶏が卵を産みます。", "The hen lays eggs."],
        ["飼う", "kau", "to keep as a pet", "To own and care for an animal.", "Verb", null, null, "猫を飼っています。", "I have a cat."],
        ["育てる", "sodateru", "to raise", "To bring up animals.", "Verb", null, null, "鶏を育てます。", "I raise chickens."],
        ["観察する", "kansatsu suru", "to observe", "To watch carefully.", "Verb", null, null, "鳥を観察します。", "I observe birds."],
        ["捕まえる", "tsukamaeru", "to catch", "To catch an animal.", "Verb", null, null, "魚を捕まえます。", "I catch fish."],
        ["守る", "mamoru", "to protect", "To keep safe from harm.", "Verb", null, null, "動物を守ります。", "I protect animals."],
        ["飼いならす", "kainarasu", "to tame", "To make an animal tame.", "Verb", null, null, "犬を飼いならします。", "I tame the dog."],
        ["撫でる", "naderu", "to stroke", "To gently touch an animal.", "Verb", null, null, "犬を撫でます。", "I stroke the dog."],
        ["訓練する", "kunren suru", "to train", "To teach an animal skills.", "Verb", null, null, "犬を訓練します。", "I train the dog."],
      ],
    },
        Spanish: {
      Food: [
        ["pan", null, "bread", "A staple food made of flour and water, baked into a loaf.", "Noun", "Masculine", "/pan/", "El pan está aún caliente.", "The bread is still warm."],
        ["baguette", null, "baguette", "A long, narrow French loaf with a crisp crust.", "Noun", "Feminine", "/ba.ˈɣe.te/", "Compro una baguette en la panadería.", "I buy a baguette at the bakery."],
        ["croissant", null, "croissant", "A crescent-shaped roll of leavened dough.", "Noun", "Masculine", "/kɾwa.ˈsan/", "El croissant está caliente.", "The croissant is warm."],
        ["queso", null, "cheese", "A dairy product made from curdled milk.", "Noun", "Masculine", "/ˈke.so/", "Me encanta el queso.", "I love cheese."],
        ["mantequilla", null, "butter", "A soft yellow dairy product made from cream.", "Noun", "Feminine", "/man.te.ˈki.ʝa/", "La mantequilla se derrite.", "The butter melts."],
        ["leche", null, "milk", "A white liquid produced by mammals for their young.", "Noun", "Feminine", "/ˈle.tʃe/", "La leche está fría.", "The milk is cold."],
        ["huevo", null, "egg", "An oval reproductive body laid by birds.", "Noun", "Masculine", "/ˈwe.βo/", "Como un huevo al desayuno.", "I eat an egg for breakfast."],
        ["carne", null, "meat", "Animal flesh used as food.", "Noun", "Feminine", "/ˈkaɾ.ne/", "No como carne.", "I don't eat meat."],
        ["pollo", null, "chicken", "A domestic fowl kept for its eggs or meat.", "Noun", "Masculine", "/ˈpo.ʝo/", "El pollo está delicioso.", "The chicken is delicious."],
        ["ternera", null, "beef", "The meat of a cow or bull.", "Noun", "Feminine", "/teɾ.ˈne.ɾa/", "La ternera está tierna.", "The beef is tender."],
        ["cerdo", null, "pork", "The meat of a pig.", "Noun", "Masculine", "/ˈθeɾ.ðo/", "No come cerdo.", "He doesn't eat pork."],
        ["pescado", null, "fish", "An aquatic animal used as food.", "Noun", "Masculine", "/pes.ˈka.ðo/", "El pescado está fresco.", "The fish is fresh."],
        ["salmón", null, "salmon", "A large edible fish with pink flesh.", "Noun", "Masculine", "/sal.ˈmon/", "El salmón a la plancha es rico.", "Grilled salmon is tasty."],
        ["gamba", null, "shrimp", "A small marine crustacean.", "Noun", "Feminine", "/ˈɡam.ba/", "Las gambas están ricas.", "The shrimp are tasty."],
        ["ostra", null, "oyster", "An edible bivalve mollusc.", "Noun", "Feminine", "/ˈos.tɾa/", "Las ostras son un manjar.", "Oysters are a delicacy."],
        ["verdura", null, "vegetable", "A plant or part of a plant used as food.", "Noun", "Feminine", "/beɾ.ˈðu.ɾa/", "Come tus verduras.", "Eat your vegetables."],
        ["zanahoria", null, "carrot", "A long orange root vegetable.", "Noun", "Feminine", "/θa.na.ˈo.ɾja/", "La zanahoria tiene vitaminas.", "The carrot has vitamins."],
        ["patata", null, "potato", "A starchy underground tuber used as a vegetable.", "Noun", "Feminine", "/pa.ˈta.ta/", "Las patatas están cocidas.", "The potatoes are cooked."],
        ["tomate", null, "tomato", "A red fruit eaten as a vegetable.", "Noun", "Masculine", "/to.ˈma.te/", "El tomate está maduro.", "The tomato is ripe."],
        ["cebolla", null, "onion", "A bulbous vegetable with a strong flavour.", "Noun", "Feminine", "/θe.ˈβo.ʝa/", "La cebolla me hace llorar.", "The onion makes me cry."],
        ["ajo", null, "garlic", "A strong-smelling bulb used as a seasoning.", "Noun", "Masculine", "/ˈa.xo/", "La receta lleva ajo.", "The recipe calls for garlic."],
        ["ensalada", null, "salad", "A cold dish of mixed raw vegetables.", "Noun", "Feminine", "/en.sa.ˈla.ða/", "La ensalada está fresca.", "The salad is fresh."],
        ["judía", null, "bean", "An edible seed of various plants.", "Noun", "Feminine", "/xu.ˈði.a/", "Las judías verdes son buenas.", "Green beans are good."],
        ["arroz", null, "rice", "A grain from a marsh grass, a staple food.", "Noun", "Masculine", "/a.ˈroθ/", "El arroz está listo.", "The rice is ready."],
        ["pasta", null, "pasta", "An Italian food made of durum wheat dough.", "Noun", "Feminine", "/ˈpas.ta/", "La pasta se cuece rápido.", "The pasta cooks quickly."],
        ["fruta", null, "fruit", "The sweet product of a plant.", "Noun", "Feminine", "/ˈfɾu.ta/", "La fruta está madura.", "The fruit is ripe."],
        ["manzana", null, "apple", "A round fruit with red or green skin.", "Noun", "Feminine", "/man.ˈθa.na/", "Como una manzana cada día.", "I eat an apple every day."],
        ["plátano", null, "banana", "A long curved fruit with soft sweet flesh.", "Noun", "Masculine", "/ˈpla.ta.no/", "El plátano está amarillo.", "The banana is yellow."],
        ["naranja", null, "orange", "A round citrus fruit with thick orange skin.", "Noun", "Feminine", "/na.ˈɾan.xa/", "La naranja es jugosa.", "The orange is juicy."],
        ["uva", null, "grape", "A small round fruit growing in bunches.", "Noun", "Feminine", "/ˈu.βa/", "La uva es dulce.", "The grape is sweet."],
        ["fresa", null, "strawberry", "A small red fruit with tiny seeds.", "Noun", "Feminine", "/ˈfɾe.sa/", "La fresa huele bien.", "The strawberry smells good."],
        ["cereza", null, "cherry", "A small round red stone fruit.", "Noun", "Feminine", "/θe.ˈɾe.θa/", "Las cerezas están maduras.", "The cherries are ripe."],
        ["limón", null, "lemon", "A yellow citrus fruit with sour juice.", "Noun", "Masculine", "/li.ˈmon/", "El limón es ácido.", "The lemon is sour."],
        ["agua", null, "water", "A clear liquid essential for life.", "Noun", "Feminine", "/ˈa.ɣwa/", "Un vaso de agua, por favor.", "A glass of water, please."],
        ["vino", null, "wine", "An alcoholic drink made from fermented grapes.", "Noun", "Masculine", "/ˈbi.no/", "Este vino es excelente.", "This wine is excellent."],
        ["cerveza", null, "beer", "An alcoholic drink made from fermented grain.", "Noun", "Feminine", "/θeɾ.ˈβe.θa/", "Una cerveza fría, por favor.", "A cold beer, please."],
        ["zumo", null, "juice", "The liquid extracted from fruit or vegetables.", "Noun", "Masculine", "/ˈθu.mo/", "El zumo de naranja es fresco.", "The orange juice is fresh."],
        ["café", null, "coffee", "A hot drink made from roasted coffee beans.", "Noun", "Masculine", "/ka.ˈfe/", "Bebo café por la mañana.", "I drink coffee in the morning."],
        ["té", null, "tea", "A hot drink made by infusing tea leaves.", "Noun", "Masculine", "/te/", "Prefiero el té.", "I prefer tea."],
        ["azúcar", null, "sugar", "A sweet crystalline substance.", "Noun", "Masculine", "/a.ˈθu.kaɾ/", "Sin azúcar, gracias.", "No sugar, thank you."],
        ["sal", null, "salt", "A white crystalline mineral used as seasoning.", "Noun", "Feminine", "/sal/", "Añade un poco de sal.", "Add a little salt."],
        ["pimienta", null, "pepper", "A spice made from ground peppercorns.", "Noun", "Feminine", "/pi.ˈmjen.ta/", "La pimienta está en la mesa.", "The pepper is on the table."],
        ["aceite", null, "oil", "A viscous liquid used in cooking.", "Noun", "Masculine", "/a.ˈθej.te/", "El aceite de oliva es excelente.", "Olive oil is excellent."],
        ["vinagre", null, "vinegar", "A sour liquid used as a condiment.", "Noun", "Masculine", "/bi.ˈna.ɣɾe/", "La vinagreta lleva vinagre.", "Vinaigrette contains vinegar."],
        ["mostaza", null, "mustard", "A yellow condiment made from mustard seeds.", "Noun", "Feminine", "/mos.ˈta.θa/", "La mostaza es fuerte.", "The mustard is strong."],
        ["mayonesa", null, "mayonnaise", "A thick creamy sauce made from eggs and oil.", "Noun", "Feminine", "/ma.ʝo.ˈne.sa/", "Le gusta la mayonesa.", "She likes mayonnaise."],
        ["sopa", null, "soup", "A liquid dish made by boiling ingredients.", "Noun", "Feminine", "/ˈso.pa/", "La sopa está caliente.", "The soup is hot."],
        ["entrada", null, "starter", "The first course of a meal.", "Noun", "Feminine", "/en.ˈtɾa.ða/", "La entrada ya está servida.", "The starter is served."],
        ["plato", null, "main course", "The main dish of a meal.", "Noun", "Masculine", "/ˈpla.to/", "El plato principal llega.", "The main course is coming."],
        ["postre", null, "dessert", "A sweet course served at the end of a meal.", "Noun", "Masculine", "/ˈpos.tɾe/", "El postre está delicioso.", "The dessert is delicious."],
        ["pastel", null, "cake", "A sweet baked food made from flour and sugar.", "Noun", "Masculine", "/pas.ˈtel/", "El pastel es riquísimo.", "The cake is delicious."],
        ["tarta", null, "tart", "A baked dish of fruit in pastry.", "Noun", "Feminine", "/ˈtaɾ.ta/", "La tarta de manzana es famosa.", "Apple tart is famous."],
        ["chocolate", null, "chocolate", "A food made from roasted cacao beans.", "Noun", "Masculine", "/tʃo.ko.ˈla.te/", "Adora el chocolate negro.", "He loves dark chocolate."],
        ["helado", null, "ice cream", "A frozen sweet food made from dairy cream.", "Noun", "Masculine", "/e.ˈla.ðo/", "El helado se derrite rápido.", "The ice cream melts fast."],
        ["restaurante", null, "restaurant", "A place where meals are prepared and served.", "Noun", "Masculine", "/res.tau.ˈɾan.te/", "Este restaurante está lleno.", "This restaurant is packed."],
        ["cocina", null, "kitchen", "A room for preparing food.", "Noun", "Feminine", "/ko.ˈθi.na/", "La cocina está limpia.", "The kitchen is clean."],
        ["cocinero", null, "cook", "A person who prepares food professionally.", "Noun", "Masculine", "/ko.θi.ˈne.ɾo/", "El cocinero prepara la comida.", "The cook prepares the meal."],
        ["comer", null, "to eat", "To consume food.", "Verb", null, "/ko.ˈmeɾ/", "Vamos a comer.", "We are going to eat."],
        ["beber", null, "to drink", "To take liquid into the mouth.", "Verb", null, "/be.ˈβeɾ/", "Le gusta beber té.", "He likes to drink tea."],
      ],
      School: [
        ["escuela", null, "school", "An institution where children are taught.", "Noun", "Feminine", "/es.ˈkwe.la/", "Mi escuela está cerca.", "My school is near."],
        ["colegio", null, "middle school", "A secondary school for younger teenagers.", "Noun", "Masculine", "/ko.ˈle.xjo/", "Va al colegio.", "He goes to middle school."],
        ["instituto", null, "high school", "A secondary school for older teenagers.", "Noun", "Masculine", "/ins.ti.ˈtu.to/", "Estudia en el instituto.", "She studies at high school."],
        ["universidad", null, "university", "An institution of higher education.", "Noun", "Feminine", "/u.ni.βeɾ.si.ˈðað/", "Estudio en la universidad.", "I study at university."],
        ["clase", null, "class", "A group of students taught together.", "Noun", "Feminine", "/ˈkla.se/", "La clase empieza a las ocho.", "Class starts at eight."],
        ["aula", null, "classroom", "A room where classes are held.", "Noun", "Feminine", "/ˈau.la/", "El aula está limpia.", "The classroom is clean."],
        ["profesor", null, "teacher", "A person who teaches, especially in a school.", "Noun", "Masculine", "/pɾo.fe.ˈsoɾ/", "El profesor explica la lección.", "The teacher explains the lesson."],
        ["alumno", null, "pupil", "A child at school.", "Noun", "Masculine", "/a.ˈlum.no/", "Este alumno es aplicado.", "This pupil is diligent."],
        ["estudiante", null, "student", "A person studying at a university or college.", "Noun", "Masculine", "/es.tu.ˈðjan.te/", "Soy estudiante.", "I am a student."],
        ["director", null, "headmaster", "The person in charge of a school.", "Noun", "Masculine", "/di.ɾek.ˈtoɾ/", "El director habla con los alumnos.", "The headmaster speaks to the pupils."],
        ["libro", null, "book", "A written or printed work bound in covers.", "Noun", "Masculine", "/ˈli.βɾo/", "Leo un libro.", "I read a book."],
        ["cuaderno", null, "notebook", "A book with blank pages for writing.", "Noun", "Masculine", "/kwa.ˈðeɾ.no/", "Abre tu cuaderno.", "Open your notebook."],
        ["bolígrafo", null, "pen", "An instrument for writing with ink.", "Noun", "Masculine", "/bo.ˈli.ɣɾa.fo/", "Mi bolígrafo no funciona.", "My pen doesn't work."],
        ["lápiz", null, "pencil", "An instrument for writing or drawing.", "Noun", "Masculine", "/ˈla.piθ/", "¿Me prestas tu lápiz?", "Can you lend me your pencil?"],
        ["goma", null, "eraser", "An object used to remove pencil marks.", "Noun", "Feminine", "/ˈɡo.ma/", "La goma está en el estuche.", "The eraser is in the pencil case."],
        ["regla", null, "ruler", "A straight strip used for measuring.", "Noun", "Feminine", "/ˈre.ɣla/", "Mide con la regla.", "Measure with the ruler."],
        ["estuche", null, "pencil case", "A small container for pens and pencils.", "Noun", "Masculine", "/es.ˈtu.tʃe/", "Mi estuche es nuevo.", "My pencil case is new."],
        ["mochila", null, "backpack", "A bag for carrying school books.", "Noun", "Feminine", "/mo.ˈtʃi.la/", "Mi mochila es pesada.", "My backpack is heavy."],
        ["pizarra", null, "blackboard", "A dark board used for writing with chalk.", "Noun", "Feminine", "/pi.ˈθa.ra/", "El profesor escribe en la pizarra.", "The teacher writes on the board."],
        ["pupitre", null, "desk", "A table used for writing or working.", "Noun", "Masculine", "/pu.ˈpi.tɾe/", "Mi pupitre está ordenado.", "My desk is tidy."],
        ["silla", null, "chair", "A seat for one person.", "Noun", "Feminine", "/ˈsi.ʝa/", "Toma una silla.", "Take a chair."],
        ["biblioteca", null, "library", "A building containing a collection of books.", "Noun", "Feminine", "/bi.βljo.ˈte.ka/", "Voy a la biblioteca.", "I go to the library."],
        ["deberes", null, "homework", "Schoolwork assigned to be done at home.", "Noun", "Masculine", "/de.ˈβe.ɾes/", "Tengo muchos deberes.", "I have a lot of homework."],
        ["lección", null, "lesson", "A period of learning or teaching.", "Noun", "Feminine", "/lek.ˈθjon/", "La lección es difícil.", "The lesson is difficult."],
        ["ejercicio", null, "exercise", "A task set to practise a skill.", "Noun", "Masculine", "/e.xeɾ.ˈθi.θjo/", "El ejercicio es fácil.", "The exercise is easy."],
        ["examen", null, "exam", "A formal test of knowledge or ability.", "Noun", "Masculine", "/ek.ˈsa.men/", "Tengo un examen mañana.", "I have an exam tomorrow."],
        ["pregunta", null, "question", "A sentence worded to elicit information.", "Noun", "Feminine", "/pɾe.ˈɣun.ta/", "Haz una pregunta.", "Ask a question."],
        ["respuesta", null, "answer", "A reply to a question.", "Noun", "Feminine", "/res.ˈpwes.ta/", "Tu respuesta es correcta.", "Your answer is correct."],
        ["nota", null, "grade", "A mark indicating the quality of work.", "Noun", "Feminine", "/ˈno.ta/", "Saqué una buena nota.", "I got a good grade."],
        ["asignatura", null, "subject", "A branch of knowledge studied.", "Noun", "Feminine", "/a.siɲ.na.ˈtu.ɾa/", "¿Cuál es tu asignatura favorita?", "What is your favourite subject?"],
        ["matemáticas", null, "mathematics", "The study of numbers and quantities.", "Noun", "Feminine", "/ma.te.ˈma.ti.kas/", "Me gustan las matemáticas.", "I like mathematics."],
        ["historia", null, "history", "The study of past events.", "Noun", "Feminine", "/is.ˈto.ɾja/", "La historia es fascinante.", "History is fascinating."],
        ["geografía", null, "geography", "The study of the earth and its features.", "Noun", "Feminine", "/xe.o.ɣɾa.ˈfi.a/", "La geografía es útil.", "Geography is useful."],
        ["ciencia", null, "science", "The study of the physical world.", "Noun", "Feminine", "/ˈθjen.θja/", "La ciencia explica el mundo.", "Science explains the world."],
        ["idioma", null, "language", "A system of communication used by a country.", "Noun", "Masculine", "/i.ˈðjo.ma/", "Aprendo un nuevo idioma.", "I'm learning a new language."],
        ["español", null, "Spanish", "The official language of Spain.", "Noun", "Masculine", "/es.pa.ˈɲol/", "Estudio español.", "I study Spanish."],
        ["inglés", null, "English", "The official language of the United Kingdom.", "Noun", "Masculine", "/iŋ.ˈɡles/", "Ella habla inglés.", "She speaks English."],
        ["vacaciones", null, "holidays", "A period of time away from work or school.", "Noun", "Feminine", "/ba.ka.ˈθjo.nes/", "Las vacaciones empiezan mañana.", "The holidays start tomorrow."],
        ["diploma", null, "diploma", "A certificate awarded on completing studies.", "Noun", "Masculine", "/di.ˈplo.ma/", "Recibe su diploma.", "He receives his diploma."],
        ["carpeta", null, "folder", "A folder for keeping loose papers.", "Noun", "Feminine", "/kaɾ.ˈpe.ta/", "Guarda los papeles en la carpeta.", "Put the papers in the folder."],
        ["hoja", null, "sheet of paper", "A piece of paper for writing on.", "Noun", "Feminine", "/ˈo.xa/", "Dame una hoja.", "Give me a sheet of paper."],
        ["tijeras", null, "scissors", "A cutting instrument with two blades.", "Noun", "Feminine", "/ti.ˈxe.ɾas/", "Las tijeras están en el estuche.", "The scissors are in the pencil case."],
        ["pegamento", null, "glue", "A sticky substance for joining things.", "Noun", "Masculine", "/pe.ɣa.ˈmen.to/", "Necesito pegamento.", "I need glue."],
        ["tiza", null, "chalk", "A soft white limestone used for writing.", "Noun", "Feminine", "/ˈti.θa/", "El profesor usa tiza.", "The teacher uses chalk."],
        ["entrada", null, "entrance", "A passage into a building.", "Noun", "Feminine", "/en.ˈtɾa.ða/", "La entrada está cerrada.", "The entrance is closed."],
        ["salida", null, "exit", "A passage out of a building.", "Noun", "Feminine", "/sa.ˈli.ða/", "La salida está a la derecha.", "The exit is on the right."],
        ["pasillo", null, "corridor", "A long passage in a building.", "Noun", "Masculine", "/pa.ˈsi.ʝo/", "El pasillo es largo.", "The corridor is long."],
        ["comedor", null, "canteen", "A restaurant in a school or workplace.", "Noun", "Masculine", "/ko.me.ˈðoɾ/", "Como en el comedor.", "I eat at the canteen."],
        ["curso", null, "course", "A series of lessons on a subject.", "Noun", "Masculine", "/ˈkuɾ.so/", "El curso empieza hoy.", "The course starts today."],
        ["aprender", null, "to learn", "To gain knowledge or skill.", "Verb", null, "/a.pɾen.ˈdeɾ/", "Nos gusta aprender.", "We like to learn."],
        ["estudiar", null, "to study", "To devote time to learning.", "Verb", null, "/es.tu.ˈðjaɾ/", "Debo estudiar.", "I must study."],
        ["repasar", null, "to revise", "To review material previously studied.", "Verb", null, "/re.pa.ˈsaɾ/", "Repaso antes del examen.", "I revise before the exam."],
        ["leer", null, "to read", "To look at and understand written words.", "Verb", null, "/le.ˈeɾ/", "Leo cada noche.", "I read every night."],
        ["escribir", null, "to write", "To mark letters or words on a surface.", "Verb", null, "/es.kɾi.ˈβiɾ/", "Debemos escribir una frase.", "We must write a sentence."],
        ["escuchar", null, "to listen", "To give attention to sound.", "Verb", null, "/es.ku.ˈtʃaɾ/", "Escuchad con atención.", "Listen carefully."],
        ["repetir", null, "to repeat", "To say or do something again.", "Verb", null, "/re.pe.ˈtiɾ/", "Repite la frase.", "Repeat the sentence."],
        ["aprobar", null, "to pass", "To be successful in an exam.", "Verb", null, "/a.pɾo.ˈβaɾ/", "Quiere aprobar el examen.", "He wants to pass the exam."],
        ["suspender", null, "to fail", "To be unsuccessful in an exam.", "Verb", null, "/sus.pen.ˈdeɾ/", "No quiere suspender.", "He doesn't want to fail."],
      ],
      Health: [
        ["salud", null, "health", "The state of being free from illness.", "Noun", "Feminine", "/sa.ˈluð/", "La salud es importante.", "Health is important."],
        ["médico", null, "doctor", "A person qualified to practise medicine.", "Noun", "Masculine", "/ˈme.ði.ko/", "El médico llega pronto.", "The doctor arrives soon."],
        ["doctor", null, "doctor", "A qualified medical practitioner.", "Noun", "Masculine", "/dok.ˈtoɾ/", "El doctor examina al paciente.", "The doctor examines the patient."],
        ["enfermera", null, "nurse", "A person trained to care for the sick.", "Noun", "Feminine", "/en.feɾ.ˈme.ɾa/", "La enfermera es muy amable.", "The nurse is very kind."],
        ["farmacéutico", null, "pharmacist", "A person who prepares and sells medicines.", "Noun", "Masculine", "/faɾ.ma.ˈθeu.ti.ko/", "El farmacéutico aconseja.", "The pharmacist advises."],
        ["hospital", null, "hospital", "An institution providing medical treatment.", "Noun", "Masculine", "/os.pi.ˈtal/", "El hospital está cerca.", "The hospital is nearby."],
        ["clínica", null, "clinic", "A private hospital or medical centre.", "Noun", "Feminine", "/ˈkli.ni.ka/", "La clínica es moderna.", "The clinic is modern."],
        ["farmacia", null, "pharmacy", "A shop where medicines are prepared and sold.", "Noun", "Feminine", "/faɾ.ˈma.θja/", "La farmacia está abierta.", "The pharmacy is open."],
        ["medicamento", null, "medicine", "A substance used to treat disease.", "Noun", "Masculine", "/me.ði.ka.ˈmen.to/", "Toma el medicamento después de comer.", "Take the medicine after eating."],
        ["pastilla", null, "tablet", "A small disc of compressed medicine.", "Noun", "Feminine", "/pas.ˈti.ʝa/", "Toma una pastilla.", "Take a tablet."],
        ["jarabe", null, "syrup", "A thick sweet liquid medicine.", "Noun", "Masculine", "/xa.ˈɾa.βe/", "El jarabe calma la tos.", "The syrup soothes the cough."],
        ["venda", null, "bandage", "A strip of material used to cover a wound.", "Noun", "Feminine", "/ˈben.da/", "Hay que cambiar la venda.", "The bandage needs changing."],
        ["vacuna", null, "vaccine", "A substance that stimulates antibody production.", "Noun", "Feminine", "/ba.ˈku.na/", "La vacuna está disponible.", "The vaccine is available."],
        ["inyección", null, "injection", "An act of injecting medicine with a needle.", "Noun", "Feminine", "/in.jek.ˈθjon/", "La inyección no duele.", "The injection doesn't hurt."],
        ["fiebre", null, "fever", "An abnormally high body temperature.", "Noun", "Feminine", "/ˈfje.βɾe/", "Tiene fiebre desde ayer.", "He's had a fever since yesterday."],
        ["resfriado", null, "cold", "A common viral infection of the nose and throat.", "Noun", "Masculine", "/res.fɾi.ˈa.ðo/", "Tengo un resfriado.", "I have a cold."],
        ["gripe", null, "flu", "An infectious viral illness with fever.", "Noun", "Feminine", "/ˈɡɾi.pe/", "La gripe es contagiosa.", "The flu is contagious."],
        ["tos", null, "cough", "A sudden expulsion of air from the lungs.", "Noun", "Feminine", "/tos/", "La tos persiste.", "The cough persists."],
        ["enfermedad", null, "illness", "A disease or period of sickness.", "Noun", "Feminine", "/en.feɾ.me.ˈðað/", "La enfermedad es grave.", "The illness is serious."],
        ["infección", null, "infection", "The invasion of the body by harmful organisms.", "Noun", "Feminine", "/in.fek.ˈθjon/", "La infección debe tratarse.", "The infection must be treated."],
        ["herida", null, "wound", "An injury to living tissue.", "Noun", "Feminine", "/e.ˈɾi.ða/", "La herida necesita atención.", "The wound needs attention."],
        ["dolor", null, "pain", "A physical suffering or discomfort.", "Noun", "Masculine", "/do.ˈloɾ/", "Tengo dolor de espalda.", "I have back pain."],
        ["cabeza", null, "head", "The upper part of the human body.", "Noun", "Feminine", "/ka.ˈβe.θa/", "Me duele la cabeza.", "My head hurts."],
        ["estómago", null, "stomach", "The internal organ in which digestion occurs.", "Noun", "Masculine", "/es.ˈto.ma.ɣo/", "Me duele el estómago.", "My stomach hurts."],
        ["garganta", null, "throat", "The passage from the mouth to the stomach.", "Noun", "Feminine", "/ɡaɾ.ˈɣan.ta/", "Me duele la garganta.", "My throat hurts."],
        ["diente", null, "tooth", "A hard structure in the jaws used for biting.", "Noun", "Masculine", "/ˈdjen.te/", "Me duele este diente.", "This tooth hurts."],
        ["espalda", null, "back", "The rear surface of the human body.", "Noun", "Feminine", "/es.ˈpal.da/", "Me duele la espalda.", "My back hurts."],
        ["brazo", null, "arm", "The upper limb of the human body.", "Noun", "Masculine", "/ˈbɾa.θo/", "Se rompió el brazo.", "He broke his arm."],
        ["pierna", null, "leg", "A limb used for walking.", "Noun", "Feminine", "/ˈpjeɾ.na/", "Le duele la pierna.", "Her leg hurts."],
        ["corazón", null, "heart", "The organ that pumps blood around the body.", "Noun", "Masculine", "/ko.ɾa.ˈθon/", "El corazón late rápido.", "The heart beats fast."],
        ["pulmón", null, "lung", "The organ used for breathing.", "Noun", "Masculine", "/pul.ˈmon/", "Fumar daña los pulmones.", "Smoking harms the lungs."],
        ["sangre", null, "blood", "The red liquid that circulates in the body.", "Noun", "Feminine", "/ˈsaŋ.ɡɾe/", "Hay que hacer un análisis de sangre.", "A blood test is needed."],
        ["hueso", null, "bone", "The hard tissue forming the skeleton.", "Noun", "Masculine", "/ˈwe.so/", "El hueso está roto.", "The bone is broken."],
        ["piel", null, "skin", "The outer covering of the body.", "Noun", "Feminine", "/pjel/", "Su piel es muy suave.", "Her skin is very soft."],
        ["descanso", null, "rest", "A state of inactivity for refreshment.", "Noun", "Masculine", "/des.ˈkan.so/", "Necesita descanso.", "He needs rest."],
        ["sueño", null, "sleep", "A natural state of rest.", "Noun", "Masculine", "/ˈswe.ɲo/", "El sueño es importante.", "Sleep is important."],
        ["fatiga", null, "tiredness", "A state of feeling tired.", "Noun", "Feminine", "/fa.ˈti.ɣa/", "La fatiga se nota.", "The tiredness shows."],
        ["estrés", null, "stress", "A state of mental or emotional strain.", "Noun", "Masculine", "/es.ˈtɾes/", "El estrés daña la salud.", "Stress harms health."],
        ["dieta", null, "diet", "A special course of food to lose weight.", "Noun", "Feminine", "/ˈdje.ta/", "Sigue una dieta.", "She is on a diet."],
        ["ejercicio", null, "exercise", "Physical activity for health.", "Noun", "Masculine", "/e.xeɾ.ˈθi.θjo/", "El ejercicio es beneficioso.", "Exercise is beneficial."],
        ["deporte", null, "sport", "An activity involving physical exertion.", "Noun", "Masculine", "/de.ˈpoɾ.te/", "El deporte es bueno para la salud.", "Sport is good for health."],
        ["sano", null, "healthy", "In good health; conducive to health.", "Adjective", null, "/ˈsa.no/", "Esta comida es sana.", "This food is healthy."],
        ["enfermo", null, "sick", "Affected by illness.", "Adjective", null, "/en.ˈfeɾ.mo/", "Está enfermo.", "He is sick."],
        ["cansado", null, "tired", "In need of rest or sleep.", "Adjective", null, "/kan.ˈsa.ðo/", "Estoy cansado.", "I am tired."],
        ["fuerte", null, "strong", "Having great physical power.", "Adjective", null, "/ˈfweɾ.te/", "Está fuerte.", "He is strong."],
        ["débil", null, "weak", "Lacking physical strength.", "Adjective", null, "/ˈde.βil/", "El paciente se siente débil.", "The patient feels weak."],
        ["gravemente", null, "seriously", "In a serious manner.", "Adverb", null, "/ˌɡɾa.βe.ˈmen.te/", "Está gravemente enfermo.", "He is seriously ill."],
        ["curar", null, "to heal", "To become sound or healthy again.", "Verb", null, "/ku.ˈɾaɾ/", "La herida va a curar.", "The wound will heal."],
        ["tratar", null, "to treat", "To give medical care to.", "Verb", null, "/tɾa.ˈtaɾ/", "El médico va a tratar al paciente.", "The doctor will treat the patient."],
        ["respirar", null, "to breathe", "To take air into the lungs.", "Verb", null, "/res.pi.ˈɾaɾ/", "Respira despacio.", "Breathe slowly."],
        ["dormir", null, "to sleep", "To rest with eyes closed.", "Verb", null, "/doɾ.ˈmiɾ/", "Hay que dormir bien.", "You need to sleep well."],
        ["sufrir", null, "to suffer", "To experience pain or distress.", "Verb", null, "/su.ˈfɾiɾ/", "Sufre de la espalda.", "He suffers from his back."],
        ["estornudar", null, "to sneeze", "To expel air suddenly through the nose.", "Verb", null, "/es.toɾ.nu.ˈðaɾ/", "Estornuda mucho.", "She sneezes a lot."],
        ["toser", null, "to cough", "To expel air from the lungs suddenly.", "Verb", null, "/to.ˈseɾ/", "El paciente tose mucho.", "The patient coughs a lot."],
        ["vomitar", null, "to vomit", "To eject the contents of the stomach.", "Verb", null, "/bo.mi.ˈtaɾ/", "Vomitó después de comer.", "He vomited after eating."],
        ["tomar", null, "to take", "To consume medicine or food.", "Verb", null, "/to.ˈmaɾ/", "Toma tus medicamentos.", "Take your medicine."],
        ["mejorar", null, "to improve", "To become better.", "Verb", null, "/me.xo.ˈɾaɾ/", "El paciente va a mejorar.", "The patient will improve."],
        ["empeorar", null, "to get worse", "To become worse.", "Verb", null, "/em.pe.o.ˈɾaɾ/", "Su salud puede empeorar.", "His health may get worse."],
        ["descansar", null, "to rest", "To stop activity for a while.", "Verb", null, "/des.kan.ˈsaɾ/", "Debes descansar más.", "You should rest more."],
      ],
      Travel: [
        ["viaje", null, "trip", "An act of traveling from one place to another.", "Noun", "Masculine", "/ˈbja.xe/", "Nuestro viaje fue increíble.", "Our trip was amazing."],
        ["vacaciones", null, "holidays", "A period of rest away from work.", "Noun", "Feminine", "/ba.ka.ˈθjo.nes/", "Las vacaciones de verano se acercan.", "Summer holidays are near."],
        ["turismo", null, "tourism", "Traveling for pleasure.", "Noun", "Masculine", "/tu.ˈɾis.mo/", "El turismo es importante aquí.", "Tourism is important here."],
        ["turista", null, "tourist", "A person traveling for pleasure.", "Noun", "Masculine", "/tu.ˈɾis.ta/", "El turista saca fotos.", "The tourist takes photos."],
        ["estación", null, "station", "A place where trains stop for passengers.", "Noun", "Feminine", "/es.ta.ˈθjon/", "La estación está lejos.", "The station is far."],
        ["aeropuerto", null, "airport", "A complex of runways and terminals for aircraft.", "Noun", "Masculine", "/a.e.ɾo.ˈpweɾ.to/", "Vamos al aeropuerto.", "We go to the airport."],
        ["puerto", null, "port", "A harbour where ships dock.", "Noun", "Masculine", "/ˈpweɾ.to/", "El puerto está animado.", "The port is busy."],
        ["billete", null, "ticket", "A piece of paper allowing entry or travel.", "Noun", "Masculine", "/bi.ˈʝe.te/", "Compré un billete de tren.", "I bought a train ticket."],
        ["reserva", null, "reservation", "An arrangement to have something kept for you.", "Noun", "Feminine", "/re.ˈseɾ.βa/", "Hice una reserva.", "I made a reservation."],
        ["pasaporte", null, "passport", "An official document for international travel.", "Noun", "Masculine", "/pa.sa.ˈpoɾ.te/", "No olvides tu pasaporte.", "Don't forget your passport."],
        ["visado", null, "visa", "An endorsement allowing entry to a country.", "Noun", "Masculine", "/bi.ˈsa.ðo/", "Se necesita visado para ese país.", "You need a visa for that country."],
        ["equipaje", null, "luggage", "Personal belongings packed for a journey.", "Noun", "Masculine", "/e.ki.ˈpa.xe/", "Recoge tu equipaje.", "Collect your luggage."],
        ["maleta", null, "suitcase", "A rectangular bag for carrying clothes.", "Noun", "Feminine", "/ma.ˈle.ta/", "Mi maleta es pesada.", "My suitcase is heavy."],
        ["bolsa", null, "bag", "A flexible container with a handle.", "Noun", "Feminine", "/ˈbol.sa/", "Mi bolsa está llena.", "My bag is full."],
        ["avión", null, "airplane", "A powered flying vehicle with fixed wings.", "Noun", "Masculine", "/a.ˈβjon/", "El avión despega al mediodía.", "The plane takes off at noon."],
        ["tren", null, "train", "A series of railway carriages pulled by a locomotive.", "Noun", "Masculine", "/tɾen/", "El tren llega a las ocho.", "The train arrives at eight."],
        ["metro", null, "subway", "An underground railway system in a city.", "Noun", "Masculine", "/ˈme.tɾo/", "El metro es rápido.", "The subway is fast."],
        ["autobús", null, "bus", "A large road vehicle for carrying passengers.", "Noun", "Masculine", "/au.to.ˈβus/", "El autobús va tarde.", "The bus is late."],
        ["coche", null, "car", "A road vehicle with four wheels and an engine.", "Noun", "Masculine", "/ˈko.tʃe/", "Mi coche está aparcado allí.", "My car is parked over there."],
        ["taxi", null, "taxi", "A car with a driver for hire.", "Noun", "Masculine", "/ˈtak.si/", "Vamos en taxi.", "Let's take a taxi."],
        ["bicicleta", null, "bicycle", "A vehicle with two wheels propelled by pedals.", "Noun", "Feminine", "/bi.θi.ˈkle.ta/", "Alquilo una bicicleta.", "I rent a bicycle."],
        ["barco", null, "boat", "A vessel for traveling on water.", "Noun", "Masculine", "/ˈbaɾ.ko/", "El barco sale del puerto.", "The boat leaves the port."],
        ["hotel", null, "hotel", "An establishment providing accommodation.", "Noun", "Masculine", "/o.ˈtel/", "Dormimos en el hotel.", "We sleep at the hotel."],
        ["hostal", null, "inn", "A small hotel or place to stay.", "Noun", "Masculine", "/os.ˈtal/", "El hostal es encantador.", "The inn is charming."],
        ["habitación", null, "room", "A space within a building for sleeping.", "Noun", "Feminine", "/a.βi.ta.ˈθjon/", "La habitación está limpia.", "The room is clean."],
        ["llave", null, "key", "A small metal object for opening a lock.", "Noun", "Feminine", "/ˈʝa.βe/", "Aquí está la llave.", "Here is the key."],
        ["mapa", null, "map", "A diagrammatic representation of an area.", "Noun", "Masculine", "/ˈma.pa/", "Mira el mapa, estamos perdidos.", "Look at the map, we're lost."],
        ["plano", null, "plan", "A detailed diagram of a place or route.", "Noun", "Masculine", "/ˈpla.no/", "El plano de la ciudad es útil.", "The city map is useful."],
        ["brújula", null, "compass", "An instrument for finding direction.", "Noun", "Feminine", "/ˈbɾu.xu.la/", "La brújula indica el norte.", "The compass points north."],
        ["playa", null, "beach", "A pebbly or sandy shore by the sea.", "Noun", "Feminine", "/ˈpla.ʝa/", "La playa es hermosa.", "The beach is beautiful."],
        ["montaña", null, "mountain", "A large natural elevation of the earth.", "Noun", "Feminine", "/mon.ˈta.ɲa/", "Subimos la montaña.", "We climb the mountain."],
        ["ciudad", null, "city", "A large human settlement.", "Noun", "Feminine", "/θju.ˈðað/", "Esta ciudad es grande.", "This city is big."],
        ["pueblo", null, "village", "A small community in a rural area.", "Noun", "Masculine", "/ˈpwe.βlo/", "El pueblo es tranquilo.", "The village is quiet."],
        ["museo", null, "museum", "A building displaying objects of interest.", "Noun", "Masculine", "/mu.ˈse.o/", "El museo cierra los lunes.", "The museum closes on Mondays."],
        ["monumento", null, "monument", "A structure erected to commemorate.", "Noun", "Masculine", "/mo.nu.ˈmen.to/", "Este monumento es famoso.", "This monument is famous."],
        ["iglesia", null, "church", "A building used for Christian worship.", "Noun", "Feminine", "/i.ˈɣle.sja/", "La iglesia es antigua.", "The church is old."],
        ["catedral", null, "cathedral", "The principal church of a diocese.", "Noun", "Feminine", "/ka.te.ˈðɾal/", "La catedral es enorme.", "The cathedral is huge."],
        ["castillo", null, "castle", "A large fortified building or mansion.", "Noun", "Masculine", "/kas.ˈti.ʝo/", "El castillo es magnífico.", "The castle is magnificent."],
        ["restaurante", null, "restaurant", "A place where meals are prepared and served.", "Noun", "Masculine", "/res.tau.ˈɾan.te/", "Este restaurante está lleno.", "This restaurant is packed."],
        ["calle", null, "street", "A public road in a town or city.", "Noun", "Feminine", "/ˈka.ʝe/", "Esta calle es peatonal.", "This street is pedestrian."],
        ["carretera", null, "road", "A wide way leading from one place to another.", "Noun", "Feminine", "/ka.re.ˈte.ɾa/", "La carretera es larga.", "The road is long."],
        ["autopista", null, "highway", "A main road for fast traffic.", "Noun", "Feminine", "/au.to.ˈpis.ta/", "La autopista está cargada.", "The highway is busy."],
        ["puente", null, "bridge", "A structure carrying a road over a river.", "Noun", "Masculine", "/ˈpwen.te/", "El puente es viejo.", "The bridge is old."],
        ["frontera", null, "border", "A line separating two countries.", "Noun", "Feminine", "/fɾon.ˈte.ɾa/", "Cruzamos la frontera.", "We cross the border."],
        ["aduana", null, "customs", "The official department that administers duties.", "Noun", "Feminine", "/a.ˈðwa.na/", "Pasamos la aduana.", "We go through customs."],
        ["extranjero", null, "abroad / foreigner", "A foreign country or person.", "Noun", "Masculine", "/eks.tɾaŋ.ˈxe.ɾo/", "Viaja al extranjero.", "He travels abroad."],
        ["salir", null, "to leave", "To go away from a place.", "Verb", null, "/sa.ˈliɾ/", "Debemos salir.", "We must leave."],
        ["llegar", null, "to arrive", "To reach a destination.", "Verb", null, "/ʝe.ˈɣaɾ/", "Vamos a llegar mañana.", "We will arrive tomorrow."],
        ["viajar", null, "to travel", "To go from one place to another.", "Verb", null, "/bja.ˈxaɾ/", "Nos gusta viajar.", "We like to travel."],
        ["visitar", null, "to visit", "To go to see a place or person.", "Verb", null, "/bi.si.ˈtaɾ/", "Vamos a visitar Roma.", "We are going to visit Rome."],
        ["reservar", null, "to book", "To arrange for something in advance.", "Verb", null, "/re.seɾ.ˈβaɾ/", "Voy a reservar una habitación.", "I will book a room."],
        ["explorar", null, "to explore", "To travel through an area to learn about it.", "Verb", null, "/eks.plo.ˈɾaɾ/", "Queremos explorar la ciudad.", "We want to explore the city."],
        ["descubrir", null, "to discover", "To find something for the first time.", "Verb", null, "/des.ku.ˈβɾiɾ/", "Me encanta descubrir culturas.", "I love discovering cultures."],
        ["conducir", null, "to drive", "To operate a motor vehicle.", "Verb", null, "/kon.du.ˈθiɾ/", "Sabe conducir.", "He knows how to drive."],
        ["volar", null, "to fly", "To move through the air.", "Verb", null, "/bo.ˈlaɾ/", "Vamos a volar mañana.", "We are going to fly tomorrow."],
        ["navegar", null, "to navigate", "To plan and direct the course of a ship.", "Verb", null, "/na.βe.ˈɣaɾ/", "Sabe navegar.", "He knows how to navigate."],
        ["pasear", null, "to stroll", "To walk in a leisurely way.", "Verb", null, "/pa.se.ˈaɾ/", "Nos gusta pasear.", "We like to stroll."],
        ["perderse", null, "to get lost", "To become lost.", "Verb", null, "/peɾ.ˈðeɾ.se/", "Nos perdimos en la ciudad.", "We got lost in the city."],
        ["preguntar", null, "to ask", "To ask for information.", "Verb", null, "/pɾe.ɣun.ˈtaɾ/", "Preguntó por la estación.", "He asked for the station."],
        ["caminar", null, "to walk", "To move on foot.", "Verb", null, "/ka.mi.ˈnaɾ/", "Caminamos por la playa.", "We walk on the beach."],
      ],
      Business: [
        ["empresa", null, "company", "A commercial business.", "Noun", "Feminine", "/em.ˈpɾe.sa/", "Dirijo una empresa.", "I run a company."],
        ["sociedad", null, "corporation", "A commercial organization.", "Noun", "Feminine", "/so.θje.ˈðað/", "La sociedad cotiza en bolsa.", "The corporation is publicly traded."],
        ["compañía", null, "company", "A commercial business or firm.", "Noun", "Feminine", "/kom.pa.ˈɲi.a/", "La compañía aérea cancela el vuelo.", "The airline cancels the flight."],
        ["oficina", null, "office", "A room or building used for work.", "Noun", "Feminine", "/o.fi.ˈθi.na/", "Mi oficina está en el tercer piso.", "My office is on the third floor."],
        ["jefe", null, "boss", "A person in charge of others at work.", "Noun", "Masculine", "/ˈxe.fe/", "El jefe está en reunión.", "The boss is in a meeting."],
        ["director", null, "director", "A person who manages an organization.", "Noun", "Masculine", "/di.ɾek.ˈtoɾ/", "El director anuncia los resultados.", "The director announces the results."],
        ["empleado", null, "employee", "A person who is paid to work for someone.", "Noun", "Masculine", "/em.ple.ˈa.ðo/", "Los empleados están contentos.", "The employees are happy."],
        ["colega", null, "colleague", "A person with whom one works.", "Noun", "Masculine", "/ko.ˈle.ɣa/", "Mi colega es simpático.", "My colleague is friendly."],
        ["cliente", null, "client", "A person using the services of a professional.", "Noun", "Masculine", "/ˈkljen.te/", "El cliente está satisfecho.", "The client is satisfied."],
        ["proveedor", null, "supplier", "A company that provides goods or services.", "Noun", "Masculine", "/pɾo.βe.e.ˈðoɾ/", "El proveedor entrega mañana.", "The supplier delivers tomorrow."],
        ["socio", null, "partner", "A person or organization that shares an activity.", "Noun", "Masculine", "/ˈso.θjo/", "Nuestro socio está en Europa.", "Our partner is in Europe."],
        ["competidor", null, "competitor", "A rival in business or sport.", "Noun", "Masculine", "/kom.pe.ti.ˈðoɾ/", "El competidor baja los precios.", "The competitor lowers prices."],
        ["mercado", null, "market", "The trade in a particular commodity.", "Noun", "Masculine", "/meɾ.ˈka.ðo/", "El mercado está creciendo.", "The market is growing."],
        ["producto", null, "product", "An article or substance manufactured for sale.", "Noun", "Masculine", "/pɾo.ˈðuk.to/", "El producto se vende bien.", "The product sells well."],
        ["servicio", null, "service", "Work done for a customer or company.", "Noun", "Masculine", "/seɾ.ˈβi.θjo/", "El servicio al cliente está abierto.", "Customer service is open."],
        ["venta", null, "sale", "The exchange of goods for money.", "Noun", "Feminine", "/ˈben.ta/", "La venta está cerrada.", "The sale is closed."],
        ["compra", null, "purchase", "The act of buying something.", "Noun", "Feminine", "/ˈkom.pɾa/", "La compra está confirmada.", "The purchase is confirmed."],
        ["precio", null, "price", "The amount of money expected for something.", "Noun", "Masculine", "/ˈpɾe.θjo/", "El precio es razonable.", "The price is reasonable."],
        ["coste", null, "cost", "The amount that must be paid to produce something.", "Noun", "Masculine", "/ˈkos.te/", "El coste aumenta.", "The cost is rising."],
        ["factura", null, "invoice", "A list of goods sent with amounts owed.", "Noun", "Feminine", "/fak.ˈtu.ɾa/", "La factura está en el sobre.", "The invoice is in the envelope."],
        ["presupuesto", null, "quote", "An estimate of the cost of work.", "Noun", "Masculine", "/pɾe.su.ˈpwes.to/", "El presupuesto está listo.", "The quote is ready."],
        ["contrato", null, "contract", "A written or spoken agreement.", "Noun", "Masculine", "/kon.ˈtɾa.to/", "El contrato está firmado.", "The contract is signed."],
        ["acuerdo", null, "agreement", "A negotiated arrangement.", "Noun", "Masculine", "/a.ˈkweɾ.ðo/", "Tenemos un acuerdo.", "We have an agreement."],
        ["negociación", null, "negotiation", "Discussion aimed at reaching an agreement.", "Noun", "Feminine", "/ne.ɣo.θja.ˈθjon/", "La negociación avanza.", "The negotiation is progressing."],
        ["reunión", null, "meeting", "A gathering of people for discussion.", "Noun", "Feminine", "/re.u.ˈnjon/", "La reunión es importante.", "The meeting is important."],
        ["conferencia", null, "conference", "A formal meeting for discussion.", "Noun", "Feminine", "/kon.fe.ˈɾen.θja/", "La conferencia es en línea.", "The conference is online."],
        ["presentación", null, "presentation", "A demonstration or explanation of something.", "Noun", "Feminine", "/pɾe.sen.ta.ˈθjon/", "Su presentación es clara.", "Her presentation is clear."],
        ["proyecto", null, "project", "An individual or collaborative enterprise.", "Noun", "Masculine", "/pɾo.ˈjek.to/", "El proyecto avanza.", "The project is progressing."],
        ["plan", null, "plan", "A detailed proposal for doing something.", "Noun", "Masculine", "/plan/", "El plan está aprobado.", "The plan is approved."],
        ["objetivo", null, "objective", "A goal or aim.", "Noun", "Masculine", "/ob.xe.ˈti.βo/", "Alcanzamos nuestro objetivo.", "We reach our objective."],
        ["estrategia", null, "strategy", "A plan of action to achieve a goal.", "Noun", "Feminine", "/es.tɾa.ˈte.xja/", "La estrategia debe cambiar.", "The strategy must change."],
        ["presupuesto", null, "budget", "An estimate of income and expenditure.", "Noun", "Masculine", "/pɾe.su.ˈpwes.to/", "El presupuesto es limitado.", "The budget is limited."],
        ["salario", null, "salary", "A fixed regular payment for work.", "Noun", "Masculine", "/sa.ˈla.ɾjo/", "Su salario aumenta.", "His salary increases."],
        ["prima", null, "bonus", "An extra payment for good performance.", "Noun", "Feminine", "/ˈpɾi.ma/", "Recibe una prima.", "She receives a bonus."],
        ["impuesto", null, "tax", "A compulsory contribution to the state.", "Noun", "Masculine", "/im.ˈpwes.to/", "Hay que pagar los impuestos.", "Taxes must be paid."],
        ["banco", null, "bank", "An institution for keeping and lending money.", "Noun", "Masculine", "/ˈbaŋ.ko/", "El banco abre a las nueve.", "The bank opens at nine."],
        ["dinero", null, "money", "A medium of exchange in coins or notes.", "Noun", "Masculine", "/di.ˈne.ɾo/", "El dinero es importante.", "Money is important."],
        ["inversión", null, "investment", "Money put into something to gain profit.", "Noun", "Feminine", "/im.beɾ.ˈsjon/", "La inversión es rentable.", "The investment is profitable."],
        ["beneficio", null, "profit", "Financial gain.", "Noun", "Masculine", "/be.ne.ˈfi.θjo/", "El beneficio aumenta.", "The profit increases."],
        ["pérdida", null, "loss", "Money lost in a transaction.", "Noun", "Feminine", "/ˈpeɾ.ði.ða/", "La empresa sufrió una pérdida.", "The company suffered a loss."],
        ["ingresos", null, "revenue", "The total amount of money received.", "Noun", "Masculine", "/iŋ.ˈɡɾe.sos/", "Los ingresos crecen.", "Revenue is growing."],
        ["crecimiento", null, "growth", "The process of increasing in size or value.", "Noun", "Masculine", "/kɾe.θi.ˈmjen.to/", "El crecimiento es fuerte.", "The growth is strong."],
        ["crisis", null, "crisis", "A time of intense difficulty or danger.", "Noun", "Feminine", "/ˈkɾi.sis/", "La crisis económica es grave.", "The economic crisis is serious."],
        ["quiebra", null, "bankruptcy", "Legal status of a company unable to pay debts.", "Noun", "Feminine", "/ˈkje.βɾa/", "La empresa está en quiebra.", "The company is bankrupt."],
        ["éxito", null, "success", "The accomplishment of an aim.", "Noun", "Masculine", "/ˈek.si.to/", "El éxito está merecido.", "The success is deserved."],
        ["fracaso", null, "failure", "A lack of success.", "Noun", "Masculine", "/fɾa.ˈka.so/", "El fracaso es duro.", "Failure is hard."],
        ["empleado", null, "employed", "Having paid work.", "Adjective", null, "/em.ple.ˈa.ðo/", "Está bien empleado.", "He is well employed."],
        ["parado", null, "unemployed", "Without a job.", "Adjective", null, "/pa.ˈɾa.ðo/", "Está en paro.", "He is unemployed."],
        ["trabajar", null, "to work", "To perform a job.", "Verb", null, "/tɾa.βa.ˈxaɾ/", "Debemos trabajar.", "We must work."],
        ["vender", null, "to sell", "To give something in exchange for money.", "Verb", null, "/ben.ˈdeɾ/", "Queremos vender este servicio.", "We want to sell this service."],
        ["comprar", null, "to buy", "To obtain in exchange for payment.", "Verb", null, "/kom.ˈpɾaɾ/", "La empresa quiere comprar.", "The company wants to buy."],
        ["negociar", null, "to negotiate", "To discuss to reach an agreement.", "Verb", null, "/ne.ɣo.ˈθjaɾ/", "Van a negociar.", "They are going to negotiate."],
        ["invertir", null, "to invest", "To put money into something to gain profit.", "Verb", null, "/im.beɾ.ˈtiɾ/", "Quieren invertir más.", "They want to invest more."],
        ["contratar", null, "to hire", "To employ someone for wages.", "Verb", null, "/kon.tɾa.ˈtaɾ/", "La empresa quiere contratar personal.", "The company wants to hire staff."],
        ["despedir", null, "to lay off", "To dismiss an employee.", "Verb", null, "/des.pe.ˈðiɾ/", "La empresa debe despedir personal.", "The company must lay off."],
        ["dirigir", null, "to manage", "To be in charge of.", "Verb", null, "/di.ɾi.ˈxiɾ/", "Dirige un equipo.", "She manages a team."],
        ["planificar", null, "to plan", "To decide on and arrange in advance.", "Verb", null, "/pla.ni.fi.ˈkaɾ/", "Debemos planificar el proyecto.", "We must plan the project."],
        ["desarrollar", null, "to develop", "To grow or cause to grow larger.", "Verb", null, "/des.a.ro.ˈʝaɾ/", "Queremos desarrollar el proyecto.", "We want to develop the project."],
        ["gestionar", null, "to manage", "To be in charge of a business or team.", "Verb", null, "/xes.tjo.ˈnaɾ/", "Sabe gestionar una empresa.", "He knows how to manage a company."],
        ["facturar", null, "to invoice", "To send a bill for goods or services.", "Verb", null, "/fak.tu.ˈɾaɾ/", "La empresa factura al cliente.", "The company invoices the client."],
      ],
      Technology: [
        ["ordenador", null, "computer", "An electronic device for storing and processing data.", "Noun", "Masculine", "/oɾ.ðe.na.ˈðoɾ/", "Mi ordenador es lento.", "My computer is slow."],
        ["portátil", null, "laptop", "A portable personal computer.", "Noun", "Masculine", "/poɾ.ˈta.til/", "Mi portátil es ligero.", "My laptop is light."],
        ["teléfono", null, "phone", "A device for transmitting voice over distances.", "Noun", "Masculine", "/te.ˈle.fo.no/", "Suena mi teléfono.", "My phone is ringing."],
        ["móvil", null, "mobile phone", "A portable telephone.", "Noun", "Masculine", "/ˈmo.βil/", "Mi móvil es nuevo.", "My mobile is new."],
        ["tableta", null, "tablet", "A flat portable computer with a touchscreen.", "Noun", "Feminine", "/ta.ˈble.ta/", "La tableta es práctica.", "The tablet is handy."],
        ["pantalla", null, "screen", "A flat panel displaying images or text.", "Noun", "Feminine", "/pan.ˈta.ʝa/", "La pantalla está rota.", "The screen is broken."],
        ["teclado", null, "keyboard", "A set of keys for operating a computer.", "Noun", "Masculine", "/te.ˈkla.ðo/", "El teclado es nuevo.", "The keyboard is new."],
        ["ratón", null, "mouse", "A hand-held device controlling a cursor.", "Noun", "Masculine", "/ra.ˈton/", "El ratón no funciona.", "The mouse doesn't work."],
        ["impresora", null, "printer", "A device for printing documents.", "Noun", "Feminine", "/im.pɾe.ˈso.ɾa/", "La impresora está averiada.", "The printer is broken."],
        ["escáner", null, "scanner", "A device for digitizing documents.", "Noun", "Masculine", "/es.ˈka.neɾ/", "El escáner es rápido.", "The scanner is fast."],
        ["auriculares", null, "headphones", "A device worn over the ears for listening.", "Noun", "Masculine", "/au.ɾi.ku.ˈla.ɾes/", "Mis auriculares son cómodos.", "My headphones are comfortable."],
        ["altavoz", null, "speaker", "A device that converts signals into sound.", "Noun", "Masculine", "/al.ta.ˈβoθ/", "El altavoz es potente.", "The speaker is powerful."],
        ["cámara", null, "camera", "A device for recording images and video.", "Noun", "Feminine", "/ˈka.ma.ɾa/", "La cámara graba.", "The camera is recording."],
        ["cable", null, "cable", "A wire for transmitting electrical signals.", "Noun", "Masculine", "/ˈka.βle/", "El cable es demasiado corto.", "The cable is too short."],
        ["cargador", null, "charger", "A device for recharging batteries.", "Noun", "Masculine", "/kaɾ.ɣa.ˈðoɾ/", "Olvidé mi cargador.", "I forgot my charger."],
        ["batería", null, "battery", "A device that stores electrical energy.", "Noun", "Feminine", "/ba.te.ˈɾi.a/", "La batería está baja.", "The battery is low."],
        ["internet", null, "internet", "A global computer network.", "Noun", "Masculine", "/in.teɾ.ˈnet/", "Internet es lento hoy.", "The internet is slow today."],
        ["wifi", null, "wifi", "A facility allowing devices to connect wirelessly.", "Noun", "Masculine", "/ˈwi.fi/", "El wifi es gratis.", "The wifi is free."],
        ["red", null, "network", "A group of interconnected computers.", "Noun", "Feminine", "/reð/", "La red funciona.", "The network works."],
        ["sitio", null, "website", "A set of related web pages.", "Noun", "Masculine", "/ˈsi.tjo/", "El sitio está caído.", "The site is down."],
        ["página", null, "page", "A single screen of a website or document.", "Noun", "Feminine", "/ˈpa.xi.na/", "La página no carga.", "The page doesn't load."],
        ["enlace", null, "link", "A connection between two things.", "Noun", "Masculine", "/en.ˈla.θe/", "El enlace está roto.", "The link is broken."],
        ["programa", null, "program", "A set of instructions for a computer.", "Noun", "Masculine", "/pɾo.ˈɣɾa.ma/", "El programa falla.", "The program crashes."],
        ["aplicación", null, "application", "A program on a device.", "Noun", "Feminine", "/a.pli.ka.ˈθjon/", "La aplicación es gratis.", "The application is free."],
        ["archivo", null, "file", "A collection of data stored under one name.", "Noun", "Masculine", "/aɾ.ˈtʃi.βo/", "El archivo está corrupto.", "The file is corrupted."],
        ["carpeta", null, "folder", "A container for organizing files.", "Noun", "Feminine", "/kaɾ.ˈpe.ta/", "La carpeta está vacía.", "The folder is empty."],
        ["documento", null, "document", "A piece of written or electronic work.", "Noun", "Masculine", "/do.ku.ˈmen.to/", "El documento está listo.", "The document is ready."],
        ["foto", null, "photo", "A picture made with a camera.", "Noun", "Feminine", "/ˈfo.to/", "Esta foto es preciosa.", "This photo is beautiful."],
        ["vídeo", null, "video", "A recording of moving visual images.", "Noun", "Masculine", "/ˈbi.ðe.o/", "El vídeo es largo.", "The video is long."],
        ["música", null, "music", "Vocal or instrumental sounds combined.", "Noun", "Feminine", "/ˈmu.si.ka/", "Escucho música en línea.", "I listen to music online."],
        ["juego", null, "game", "An activity for amusement or competition.", "Noun", "Masculine", "/ˈxwe.ɣo/", "Este juego es adictivo.", "This game is addictive."],
        ["datos", null, "data", "Facts and statistics collected for reference.", "Noun", "Masculine", "/ˈda.tos/", "Los datos están guardados.", "The data is saved."],
        ["contraseña", null, "password", "A secret word used to gain access.", "Noun", "Feminine", "/kon.tɾa.ˈse.ɲa/", "Introduce tu contraseña.", "Enter your password."],
        ["cuenta", null, "account", "A registration with a service provider.", "Noun", "Feminine", "/ˈkwen.ta/", "Creé una cuenta.", "I created an account."],
        ["correo", null, "email", "Messages distributed by electronic means.", "Noun", "Masculine", "/ko.ˈre.o/", "Recibí un correo.", "I received an email."],
        ["mensaje", null, "message", "A communication sent from one person to another.", "Noun", "Masculine", "/men.ˈsa.xe/", "Envió un mensaje.", "He sent a message."],
        ["servidor", null, "server", "A computer that provides data to others.", "Noun", "Masculine", "/seɾ.βi.ˈðoɾ/", "El servidor está caído.", "The server is down."],
        ["base de datos", null, "database", "A structured set of data held in a computer.", "Noun", "Feminine", "/ˈba.se ðe ˈda.tos/", "La base de datos es segura.", "The database is secure."],
        ["seguridad", null, "security", "The state of being free from danger.", "Noun", "Feminine", "/se.ɣu.ɾi.ˈðað/", "La seguridad es esencial.", "Security is essential."],
        ["virus", null, "virus", "A piece of code that can damage a computer.", "Noun", "Masculine", "/ˈbi.ɾus/", "El virus infectó el ordenador.", "The virus infected the computer."],
        ["actualización", null, "update", "A new version of software.", "Noun", "Feminine", "/ak.twa.li.θa.ˈθjon/", "La actualización está disponible.", "The update is available."],
        ["copia de seguridad", null, "backup", "A copy of data stored separately.", "Noun", "Feminine", "/ˈko.pja ðe se.ɣu.ɾi.ˈðað/", "Haz una copia de seguridad.", "Make a backup."],
        ["nube", null, "cloud storage", "Storage of data on remote servers.", "Noun", "Feminine", "/ˈnu.βe/", "La nube es práctica.", "Cloud storage is handy."],
        ["descargar", null, "to download", "To copy data from a network to a device.", "Verb", null, "/des.kaɾ.ˈɣaɾ/", "Voy a descargar el archivo.", "I will download the file."],
        ["instalar", null, "to install", "To set up software for use.", "Verb", null, "/ins.ta.ˈlaɾ/", "Voy a instalar la aplicación.", "I will install the application."],
        ["hacer clic", null, "to click", "To press a button on a mouse.", "Verb", null, "/a.ˈθeɾ klik/", "Haz clic en el botón.", "Click the button."],
        ["escribir", null, "to type", "To write using a keyboard.", "Verb", null, "/es.kɾi.ˈβiɾ/", "Escribe tu nombre aquí.", "Type your name here."],
        ["guardar", null, "to save", "To store data for later retrieval.", "Verb", null, "/ɣwaɾ.ˈðaɾ/", "Guarda el documento.", "Save the document."],
        ["imprimir", null, "to print", "To produce a paper copy of a document.", "Verb", null, "/im.pɾi.ˈmiɾ/", "Imprime esta página.", "Print this page."],
        ["enviar", null, "to send", "To cause to go to a destination.", "Verb", null, "/em.ˈbjaɾ/", "Envíame un correo.", "Send me an email."],
        ["recibir", null, "to receive", "To be given or paid something.", "Verb", null, "/re.θi.ˈβiɾ/", "Recibí tu mensaje.", "I received your message."],
        ["buscar", null, "to search", "To look for information.", "Verb", null, "/bus.ˈkaɾ/", "Busca en internet.", "Search on the internet."],
        ["compartir", null, "to share", "To give a portion to others.", "Verb", null, "/kom.paɾ.ˈtiɾ/", "Podemos compartir el enlace.", "We can share the link."],
        ["programar", null, "to program", "To write computer code.", "Verb", null, "/pɾo.ɣɾa.ˈmaɾ/", "Le gusta programar.", "She likes programming."],
        ["reparar", null, "to repair", "To fix something broken.", "Verb", null, "/re.pa.ˈɾaɾ/", "¿Puedes reparar mi ordenador?", "Can you repair my computer?"],
        ["enchufar", null, "to plug in", "To connect to a power source.", "Verb", null, "/en.tʃu.ˈfaɾ/", "Enchufa el cable.", "Plug in the cable."],
        ["apagar", null, "to turn off", "To stop the operation of a device.", "Verb", null, "/a.pa.ˈɣaɾ/", "Apaga el ordenador.", "Turn off the computer."],
        ["encender", null, "to turn on", "To start the operation of a device.", "Verb", null, "/en.θen.ˈdeɾ/", "Enciende la luz.", "Turn on the light."],
        ["actualizar", null, "to update", "To make more modern or up to date.", "Verb", null, "/ak.twa.li.ˈθaɾ/", "Debo actualizar el programa.", "I must update the program."],
      ],
      Sports: [
        ["deporte", null, "sport", "An activity involving physical exertion and skill.", "Noun", "Masculine", "/de.ˈpoɾ.te/", "Me gusta el deporte.", "I like sport."],
        ["fútbol", null, "football", "A game played by two teams kicking a ball.", "Noun", "Masculine", "/ˈfut.bol/", "El fútbol es popular.", "Football is popular."],
        ["baloncesto", null, "basketball", "A game where players throw a ball into a hoop.", "Noun", "Masculine", "/ba.lon.ˈθes.to/", "El baloncesto es rápido.", "Basketball is fast."],
        ["tenis", null, "tennis", "A game where players hit a ball over a net.", "Noun", "Masculine", "/ˈte.nis/", "El tenis es elegante.", "Tennis is elegant."],
        ["rugby", null, "rugby", "A team game played with an oval ball.", "Noun", "Masculine", "/ˈruɣ.bi/", "El rugby es físico.", "Rugby is physical."],
        ["voleibol", null, "volleyball", "A game where teams hit a ball over a net.", "Noun", "Masculine", "/bo.lej.ˈβol/", "El voleibol es divertido.", "Volleyball is fun."],
        ["balonmano", null, "handball", "A team sport where players throw a ball into a goal.", "Noun", "Masculine", "/ba.lon.ˈma.no/", "El balonmano se juega en pabellón.", "Handball is played indoors."],
        ["natación", null, "swimming", "The sport of moving through water.", "Noun", "Feminine", "/na.ta.ˈθjon/", "La natación es sana.", "Swimming is healthy."],
        ["atletismo", null, "athletics", "Running, jumping and throwing sports.", "Noun", "Masculine", "/at.le.ˈtis.mo/", "El atletismo requiere resistencia.", "Athletics requires endurance."],
        ["carrera", null, "running", "The activity of running as a sport.", "Noun", "Feminine", "/ka.ˈre.ɾa/", "La carrera es agotadora.", "Running is exhausting."],
        ["maratón", null, "marathon", "A long-distance running race of 42 km.", "Noun", "Masculine", "/ma.ɾa.ˈton/", "Corre un maratón.", "He runs a marathon."],
        ["ciclismo", null, "cycling", "The sport of riding a bicycle.", "Noun", "Masculine", "/θi.ˈklis.mo/", "El ciclismo es popular.", "Cycling is popular."],
        ["esquí", null, "skiing", "The sport of gliding over snow on skis.", "Noun", "Masculine", "/es.ˈki/", "El esquí es emocionante.", "Skiing is exciting."],
        ["senderismo", null, "hiking", "The activity of going for long walks.", "Noun", "Masculine", "/sen.de.ˈɾis.mo/", "El senderismo es magnífico.", "Hiking is magnificent."],
        ["escalada", null, "climbing", "The sport of climbing rocks or walls.", "Noun", "Feminine", "/es.ka.ˈla.ða/", "La escalada es difícil.", "Climbing is difficult."],
        ["gimnasia", null, "gymnastics", "Exercises developing agility and coordination.", "Noun", "Feminine", "/xim.ˈna.sja/", "La gimnasia es graciosa.", "Gymnastics is graceful."],
        ["baile", null, "dance", "Movement of the body in rhythm.", "Noun", "Masculine", "/ˈbaj.le/", "El baile es un deporte.", "Dance is a sport."],
        ["yoga", null, "yoga", "A Hindu discipline of breathing and posture.", "Noun", "Masculine", "/ˈʝo.ɣa/", "El yoga me relaja.", "Yoga relaxes me."],
        ["equipo", null, "team", "A group of players forming one side.", "Noun", "Masculine", "/e.ˈki.po/", "Nuestro equipo gana.", "Our team is winning."],
        ["jugador", null, "player", "A person who takes part in a sport.", "Noun", "Masculine", "/xu.ɣa.ˈðoɾ/", "El jugador marca un gol.", "The player scores a goal."],
        ["entrenador", null, "coach", "A person who trains athletes.", "Noun", "Masculine", "/en.tɾe.na.ˈðoɾ/", "El entrenador habla con los jugadores.", "The coach talks to the players."],
        ["árbitro", null, "referee", "A person who enforces rules in a sport.", "Noun", "Masculine", "/ˈaɾ.βi.tɾo/", "El árbitro pita.", "The referee blows the whistle."],
        ["campeón", null, "champion", "A person who has defeated all rivals.", "Noun", "Masculine", "/kam.ˈpe.on/", "El campeón sonríe.", "The champion smiles."],
        ["partido", null, "match", "A contest between two teams or players.", "Noun", "Masculine", "/paɾ.ˈti.ðo/", "El partido empieza.", "The match begins."],
        ["competición", null, "competition", "An event where people compete.", "Noun", "Feminine", "/kom.pe.ti.ˈθjon/", "La competición empieza mañana.", "The competition begins tomorrow."],
        ["torneo", null, "tournament", "A series of contests between competitors.", "Noun", "Masculine", "/toɾ.ˈne.o/", "El torneo es anual.", "The tournament is annual."],
        ["campeonato", null, "championship", "A competition to determine a champion.", "Noun", "Masculine", "/kam.pe.o.ˈna.to/", "El campeonato empieza mañana.", "The championship begins tomorrow."],
        ["medalla", null, "medal", "A metal disc awarded as an honour.", "Noun", "Feminine", "/me.ˈða.ʝa/", "Recibe una medalla.", "She receives a medal."],
        ["trofeo", null, "trophy", "A cup or object awarded as a prize.", "Noun", "Masculine", "/tɾo.ˈfe.o/", "El trofeo es de oro.", "The trophy is gold."],
        ["victoria", null, "victory", "An act of defeating an opponent.", "Noun", "Feminine", "/bik.ˈto.ɾja/", "La victoria es hermosa.", "The victory is beautiful."],
        ["derrota", null, "defeat", "An instance of being beaten.", "Noun", "Feminine", "/de.ˈro.ta/", "La derrota es dura.", "The defeat is hard."],
        ["marcador", null, "scoreboard", "A board showing the score.", "Noun", "Masculine", "/maɾ.ka.ˈðoɾ/", "El marcador marca dos a uno.", "The scoreboard shows two to one."],
        ["gol", null, "goal", "A point scored in certain games.", "Noun", "Masculine", "/ɡol/", "Marca un gol.", "He scores a goal."],
        ["estadio", null, "stadium", "A sports arena with tiers of seats.", "Noun", "Masculine", "/es.ˈta.ðjo/", "El estadio está lleno.", "The stadium is full."],
        ["campo", null, "field", "An area where sports are played.", "Noun", "Masculine", "/ˈkam.po/", "El campo está mojado.", "The field is wet."],
        ["piscina", null, "swimming pool", "An artificial pool for swimming.", "Noun", "Feminine", "/pis.ˈθi.na/", "La piscina está cubierta.", "The pool is indoor."],
        ["pabellón", null, "sports hall", "A building for indoor sports.", "Noun", "Masculine", "/pa.βe.ˈʝon/", "El pabellón es grande.", "The sports hall is large."],
        ["balón", null, "ball", "A round object used in games.", "Noun", "Masculine", "/ba.ˈlon/", "El balón rueda.", "The ball rolls."],
        ["raqueta", null, "racket", "A bat with strings used in tennis.", "Noun", "Feminine", "/ra.ˈke.ta/", "Mi raqueta es nueva.", "My racket is new."],
        ["camiseta", null, "jersey", "A shirt worn by a sports player.", "Noun", "Feminine", "/ka.mi.ˈse.ta/", "La camiseta es roja.", "The jersey is red."],
        ["zapatillas", null, "sports shoes", "Footwear worn for sport.", "Noun", "Feminine", "/θa.pa.ˈti.ʝas/", "Mis zapatillas están gastadas.", "My sports shoes are worn."],
        ["fuerte", null, "strong", "Having great physical power.", "Adjective", null, "/ˈfweɾ.te/", "El jugador es fuerte.", "The player is strong."],
        ["rápido", null, "fast", "Moving quickly.", "Adjective", null, "/ˈra.pi.ðo/", "El corredor es rápido.", "The runner is fast."],
        ["resistente", null, "enduring", "Having great stamina.", "Adjective", null, "/re.sis.ˈten.te/", "El atleta es resistente.", "The athlete has endurance."],
        ["ágil", null, "agile", "Able to move quickly and easily.", "Adjective", null, "/ˈa.xil/", "El jugador es ágil.", "The player is agile."],
        ["potente", null, "powerful", "Having great strength or force.", "Adjective", null, "/po.ˈten.te/", "Su tiro es potente.", "His shot is powerful."],
        ["atlético", null, "athletic", "Physically strong and active.", "Adjective", null, "/at.ˈle.ti.ko/", "Tiene un cuerpo atlético.", "He has an athletic body."],
        ["entrenar", null, "to train", "To practise for a sport.", "Verb", null, "/en.tɾe.ˈnaɾ/", "El equipo entrena cada día.", "The team trains every day."],
        ["ganar", null, "to win", "To be successful in a contest.", "Verb", null, "/ɣa.ˈnaɾ/", "Quieren ganar el partido.", "They want to win the match."],
        ["perder", null, "to lose", "To be defeated in a contest.", "Verb", null, "/peɾ.ˈðeɾ/", "Nadie quiere perder.", "Nobody wants to lose."],
        ["correr", null, "to run", "To move quickly on foot.", "Verb", null, "/ko.ˈreɾ/", "Me gusta correr.", "I like to run."],
        ["saltar", null, "to jump", "To push oneself off the ground.", "Verb", null, "/sal.ˈtaɾ/", "Ella puede saltar alto.", "She can jump high."],
        ["nadar", null, "to swim", "To move through water.", "Verb", null, "/na.ˈðaɾ/", "Le gusta nadar.", "He likes to swim."],
        ["lanzar", null, "to throw", "To propel with force from the hand.", "Verb", null, "/lan.ˈθaɾ/", "Va a lanzar el balón.", "He will throw the ball."],
        ["atrapar", null, "to catch", "To intercept and hold something moving.", "Verb", null, "/a.tɾa.ˈpaɾ/", "¡Atrapa la pelota!", "Catch the ball!"],
        ["marcar", null, "to score", "To gain a point in a game.", "Verb", null, "/maɾ.ˈkaɾ/", "Va a marcar.", "He will score."],
        ["defender", null, "to defend", "To protect against attack.", "Verb", null, "/de.fen.ˈdeɾ/", "El equipo debe defender.", "The team must defend."],
        ["arbitrar", null, "to referee", "To act as referee in a match.", "Verb", null, "/aɾ.βi.ˈtɾaɾ/", "Va a arbitrar el partido.", "He will referee the match."],
        ["animar", null, "to cheer", "To shout in support.", "Verb", null, "/a.ni.ˈmaɾ/", "Animamos al equipo.", "We cheer for the team."],
        ["empatar", null, "to draw", "To end a game with equal scores.", "Verb", null, "/em.pa.ˈtaɾ/", "Los equipos empatan.", "The teams draw."],
        ["competir", null, "to compete", "To strive to gain or win something.", "Verb", null, "/kom.pe.ˈtiɾ/", "Van a competir mañana.", "They will compete tomorrow."],
      ],
      Music: [
        ["música", null, "music", "Vocal or instrumental sounds combined.", "Noun", "Feminine", "/ˈmu.si.ka/", "Escucho música.", "I listen to music."],
        ["canción", null, "song", "A short poem or set of words set to music.", "Noun", "Feminine", "/kan.ˈθjon/", "Esta canción es bonita.", "This song is nice."],
        ["melodía", null, "melody", "A sequence of musical notes.", "Noun", "Feminine", "/me.lo.ˈði.a/", "La melodía es hermosa.", "The melody is beautiful."],
        ["ritmo", null, "rhythm", "A strong, regular, repeated pattern of sound.", "Noun", "Masculine", "/ˈrit.mo/", "El ritmo es pegadizo.", "The rhythm is catchy."],
        ["armonía", null, "harmony", "The combination of simultaneous musical notes.", "Noun", "Feminine", "/aɾ.mo.ˈni.a/", "La armonía es perfecta.", "The harmony is perfect."],
        ["nota", null, "note", "A single musical sound.", "Noun", "Feminine", "/ˈno.ta/", "Toca las notas correctas.", "He plays the right notes."],
        ["acorde", null, "chord", "A group of notes played together.", "Noun", "Masculine", "/a.ˈkoɾ.ðe/", "El acorde suena bien.", "The chord sounds good."],
        ["instrumento", null, "instrument", "A device for making musical sounds.", "Noun", "Masculine", "/ins.tɾu.ˈmen.to/", "Este instrumento es antiguo.", "This instrument is old."],
        ["guitarra", null, "guitar", "A stringed musical instrument.", "Noun", "Feminine", "/ɡi.ˈta.ra/", "Toca la guitarra.", "He plays the guitar."],
        ["piano", null, "piano", "A large keyboard musical instrument.", "Noun", "Masculine", "/ˈpja.no/", "El piano suena.", "The piano sounds."],
        ["violín", null, "violin", "A stringed instrument played with a bow.", "Noun", "Masculine", "/bi.o.ˈlin/", "El violín es dulce.", "The violin is soft."],
        ["violonchelo", null, "cello", "A large stringed instrument played with a bow.", "Noun", "Masculine", "/bi.o.lon.ˈtʃe.lo/", "El violonchelo es profundo.", "The cello is deep."],
        ["flauta", null, "flute", "A woodwind instrument played by blowing.", "Noun", "Feminine", "/ˈflau.ta/", "La flauta es ligera.", "The flute is light."],
        ["trompeta", null, "trumpet", "A brass instrument with a flared bell.", "Noun", "Feminine", "/tɾom.ˈpe.ta/", "La trompeta es fuerte.", "The trumpet is loud."],
        ["tambor", null, "drum", "A percussion instrument played with sticks.", "Noun", "Masculine", "/tam.ˈboɾ/", "El tambor resuena.", "The drum resonates."],
        ["batería", null, "drum kit", "A set of percussion instruments.", "Noun", "Feminine", "/ba.te.ˈɾi.a/", "La batería suena fuerte.", "The drums sound loud."],
        ["saxofón", null, "saxophone", "A brass instrument with a single-reed mouthpiece.", "Noun", "Masculine", "/sak.so.ˈfon/", "El saxofón es jazzy.", "The saxophone is jazzy."],
        ["arpa", null, "harp", "A large stringed instrument plucked with fingers.", "Noun", "Feminine", "/ˈaɾ.pa/", "El arpa es celestial.", "The harp is heavenly."],
        ["cantante", null, "singer", "A person who sings.", "Noun", "Masculine", "/kan.ˈtan.te/", "El cantante es famoso.", "The singer is famous."],
        ["músico", null, "musician", "A person who plays music.", "Noun", "Masculine", "/ˈmu.si.ko/", "El músico toca bien.", "The musician plays well."],
        ["grupo", null, "band", "A group of musicians who play together.", "Noun", "Masculine", "/ˈɡɾu.po/", "El grupo está de gira.", "The band is on tour."],
        ["orquesta", null, "orchestra", "A group of instrumentalists.", "Noun", "Feminine", "/oɾ.ˈkes.ta/", "La orquesta toca.", "The orchestra plays."],
        ["director", null, "conductor", "A person who directs an orchestra.", "Noun", "Masculine", "/di.ɾek.ˈtoɾ/", "El director levanta la batuta.", "The conductor raises his baton."],
        ["concierto", null, "concert", "A musical performance given in public.", "Noun", "Masculine", "/kon.ˈθjeɾ.to/", "El concierto está lleno.", "The concert is sold out."],
        ["espectáculo", null, "show", "A performance for entertainment.", "Noun", "Masculine", "/es.pek.ˈta.ku.lo/", "El espectáculo comienza.", "The show begins."],
        ["escenario", null, "stage", "A raised platform for performance.", "Noun", "Masculine", "/es.θe.ˈna.ɾjo/", "Ella sube al escenario.", "She goes on stage."],
        ["público", null, "audience", "The people watching a performance.", "Noun", "Masculine", "/ˈpu.βli.ko/", "El público aplaude.", "The audience applauds."],
        ["álbum", null, "album", "A collection of musical recordings.", "Noun", "Masculine", "/ˈal.βum/", "Su álbum salió.", "His album is out."],
        ["letra", null, "lyrics", "The words of a song.", "Noun", "Feminine", "/ˈle.tɾa/", "La letra es bonita.", "The lyrics are beautiful."],
        ["voz", null, "voice", "The sound produced by a person in singing.", "Noun", "Feminine", "/boθ/", "Su voz es clara.", "Her voice is clear."],
        ["coro", null, "choir", "A group of singers.", "Noun", "Masculine", "/ˈko.ɾo/", "El coro ensaya.", "The choir rehearses."],
        ["ópera", null, "opera", "A dramatic work set to music.", "Noun", "Feminine", "/ˈo.pe.ɾa/", "La ópera es grandiosa.", "The opera is grandiose."],
        ["ballet", null, "ballet", "A dance performance set to music.", "Noun", "Masculine", "/ba.ˈʝet/", "El ballet es gracioso.", "The ballet is graceful."],
        ["danza", null, "dance", "Movement of the body in rhythm.", "Noun", "Feminine", "/ˈdan.θa/", "La danza es alegre.", "The dance is joyful."],
        ["jazz", null, "jazz", "A genre of music with improvisation.", "Noun", "Masculine", "/ˈʝas/", "El jazz es pegadizo.", "Jazz is catchy."],
        ["rock", null, "rock", "A genre of popular music with a strong beat.", "Noun", "Masculine", "/rok/", "El rock es enérgico.", "Rock is energetic."],
        ["clásico", null, "classical", "Relating to traditional Western music.", "Adjective", null, "/ˈkla.si.ko/", "Me gusta la música clásica.", "I like classical music."],
        ["moderno", null, "modern", "Belonging to the present or recent times.", "Adjective", null, "/mo.ˈðeɾ.no/", "Su música es moderna.", "His music is modern."],
        ["rítmico", null, "rhythmic", "Having a strong regular beat.", "Adjective", null, "/ˈrit.mi.ko/", "El tema es rítmico.", "The song is rhythmic."],
        ["melódico", null, "melodious", "Producing a pleasant musical sound.", "Adjective", null, "/me.ˈlo.ði.ko/", "Su voz es melódica.", "Her voice is melodious."],
        ["armonioso", null, "harmonious", "Forming a pleasing combination.", "Adjective", null, "/aɾ.mo.ˈnjo.so/", "El sonido es armonioso.", "The sound is harmonious."],
        ["ruidoso", null, "noisy", "Making a lot of noise.", "Adjective", null, "/rwi.ˈðo.so/", "El concierto es ruidoso.", "The concert is noisy."],
        ["suave", null, "soft", "Gentle and not harsh.", "Adjective", null, "/ˈswa.βe/", "El sonido es suave.", "The sound is soft."],
        ["fuerte", null, "loud", "Producing much noise.", "Adjective", null, "/ˈfweɾ.te/", "La música está fuerte.", "The music is loud."],
        ["cantar", null, "to sing", "To produce musical sounds with the voice.", "Verb", null, "/kan.ˈtaɾ/", "Le gusta cantar.", "She likes to sing."],
        ["escuchar", null, "to listen", "To give attention to sound.", "Verb", null, "/es.ku.ˈtʃaɾ/", "Me gusta escuchar música.", "I like listening to music."],
        ["tocar", null, "to play", "To perform on a musical instrument.", "Verb", null, "/to.ˈkaɾ/", "Sabe tocar el piano.", "He can play the piano."],
        ["componer", null, "to compose", "To write music.", "Verb", null, "/kom.po.ˈneɾ/", "Le gusta componer.", "He likes to compose."],
        ["grabar", null, "to record", "To capture sound on a medium.", "Verb", null, "/ɡɾa.ˈβaɾ/", "Van a grabar una canción.", "They will record a song."],
        ["ensayar", null, "to rehearse", "To practise for a performance.", "Verb", null, "/en.sa.ˈʝaɾ/", "Deben ensayar esta noche.", "They must rehearse tonight."],
        ["bailar", null, "to dance", "To move rhythmically to music.", "Verb", null, "/baj.ˈlaɾ/", "Nos gusta bailar.", "We like to dance."],
        ["aplaudir", null, "to applaud", "To clap one's hands in approval.", "Verb", null, "/a.plau.ˈðiɾ/", "El público aplaude.", "The audience applauds."],
        ["silbar", null, "to whistle", "To make a high-pitched sound by forcing air.", "Verb", null, "/sil.ˈβaɾ/", "Le gusta silbar.", "He likes to whistle."],
        ["afinar", null, "to tune", "To adjust instruments to the same pitch.", "Verb", null, "/a.fi.ˈnaɾ/", "Los instrumentos afinan.", "The instruments tune together."],
        ["improvisar", null, "to improvise", "To create music spontaneously.", "Verb", null, "/im.pɾo.βi.ˈsaɾ/", "Le gusta improvisar.", "He likes to improvise."],
        ["acompañar", null, "to accompany", "To play music in support of another.", "Verb", null, "/a.kom.pa.ˈɲaɾ/", "El piano acompaña al violín.", "The piano accompanies the violin."],
        ["interpretar", null, "to interpret", "To perform a piece of music.", "Verb", null, "/in.teɾ.pɾe.ˈtaɾ/", "Ella interpreta la canción.", "She performs the song."],
        ["subir", null, "to turn up", "To increase the volume.", "Verb", null, "/su.ˈβiɾ/", "Sube el volumen.", "Turn up the volume."],
        ["bajar", null, "to turn down", "To decrease the volume.", "Verb", null, "/ba.ˈxaɾ/", "Baja la música.", "Turn down the music."],
      ],
      Nature: [
        ["naturaleza", null, "nature", "The physical world including plants and animals.", "Noun", "Feminine", "/na.tu.ɾa.ˈle.θa/", "La naturaleza es bella.", "Nature is beautiful."],
        ["árbol", null, "tree", "A woody perennial plant with a trunk.", "Noun", "Masculine", "/ˈaɾ.βol/", "El árbol es alto.", "The tree is tall."],
        ["bosque", null, "forest", "A large area covered with trees.", "Noun", "Masculine", "/ˈbos.ke/", "El bosque es denso.", "The forest is dense."],
        ["selva", null, "jungle", "A dense tropical forest.", "Noun", "Feminine", "/ˈsel.βa/", "La selva es impenetrable.", "The jungle is impenetrable."],
        ["flor", null, "flower", "The reproductive structure of a plant.", "Noun", "Feminine", "/floɾ/", "La flor huele bien.", "The flower smells good."],
        ["rosa", null, "rose", "A fragrant flower with thorny stems.", "Noun", "Feminine", "/ˈro.sa/", "La rosa es roja.", "The rose is red."],
        ["tulipán", null, "tulip", "A bulbous spring-flowering plant.", "Noun", "Masculine", "/tu.li.ˈpan/", "Los tulipanes son amarillos.", "The tulips are yellow."],
        ["hierba", null, "grass", "Low green plants covering the ground.", "Noun", "Feminine", "/ˈjeɾ.βa/", "La hierba es verde.", "The grass is green."],
        ["hoja", null, "leaf", "A flat green structure growing from a stem.", "Noun", "Feminine", "/ˈo.xa/", "La hoja cae.", "The leaf falls."],
        ["rama", null, "branch", "A part of a tree growing from the trunk.", "Noun", "Feminine", "/ˈra.ma/", "La rama se rompe.", "The branch breaks."],
        ["raíz", null, "root", "The part of a plant that attaches it to the ground.", "Noun", "Feminine", "/ra.ˈiθ/", "La raíz es profunda.", "The root is deep."],
        ["semilla", null, "seed", "A small part of a plant from which a new plant grows.", "Noun", "Feminine", "/se.ˈmi.ʝa/", "La semilla germina.", "The seed sprouts."],
        ["jardín", null, "garden", "A piece of ground for growing flowers.", "Noun", "Masculine", "/xaɾ.ˈðin/", "El jardín está florido.", "The garden is full of flowers."],
        ["campo", null, "field", "An area of open land for crops or pasture.", "Noun", "Masculine", "/ˈkam.po/", "El campo está arado.", "The field is ploughed."],
        ["pradera", null, "meadow", "A field with grass and wild flowers.", "Noun", "Feminine", "/pɾa.ˈðe.ɾa/", "La pradera es verde.", "The meadow is green."],
        ["montaña", null, "mountain", "A large natural elevation of the earth.", "Noun", "Feminine", "/mon.ˈta.ɲa/", "La montaña es enorme.", "The mountain is huge."],
        ["colina", null, "hill", "A naturally raised area of land.", "Noun", "Feminine", "/ko.ˈli.na/", "La colina es suave.", "The hill is gentle."],
        ["valle", null, "valley", "A low area of land between hills.", "Noun", "Masculine", "/ˈba.ʝe/", "El valle es hermoso.", "The valley is beautiful."],
        ["río", null, "river", "A large natural stream of water.", "Noun", "Masculine", "/ˈri.o/", "El río fluye.", "The river flows."],
        ["lago", null, "lake", "A large body of water surrounded by land.", "Noun", "Masculine", "/ˈla.ɣo/", "El lago está tranquilo.", "The lake is calm."],
        ["mar", null, "sea", "The expanse of salt water covering the earth.", "Noun", "Masculine", "/maɾ/", "El mar está tranquilo.", "The sea is calm."],
        ["océano", null, "ocean", "A very large expanse of sea.", "Noun", "Masculine", "/o.ˈθe.a.no/", "El océano es inmenso.", "The ocean is immense."],
        ["ola", null, "wave", "A moving ridge on the surface of water.", "Noun", "Feminine", "/ˈo.la/", "La ola es alta.", "The wave is high."],
        ["playa", null, "beach", "A pebbly or sandy shore by the sea.", "Noun", "Feminine", "/ˈpla.ʝa/", "La playa está desierta.", "The beach is deserted."],
        ["arena", null, "sand", "Loose granular material on beaches.", "Noun", "Feminine", "/a.ˈɾe.na/", "La arena está caliente.", "The sand is warm."],
        ["roca", null, "rock", "A large mass of stone.", "Noun", "Feminine", "/ˈro.ka/", "La roca es enorme.", "The rock is huge."],
        ["cielo", null, "sky", "The region of the atmosphere above the earth.", "Noun", "Masculine", "/ˈθje.lo/", "El cielo está azul.", "The sky is blue."],
        ["sol", null, "sun", "The star at the center of our solar system.", "Noun", "Masculine", "/sol/", "El sol brilla.", "The sun is shining."],
        ["luna", null, "moon", "The natural satellite of the earth.", "Noun", "Feminine", "/ˈlu.na/", "La luna está llena.", "The moon is full."],
        ["estrella", null, "star", "A fixed luminous point in the night sky.", "Noun", "Feminine", "/es.ˈtɾe.ʝa/", "Las estrellas brillan.", "The stars shine."],
        ["nube", null, "cloud", "A visible mass of condensed water vapour.", "Noun", "Feminine", "/ˈnu.βe/", "Una nube pasa.", "A cloud passes."],
        ["lluvia", null, "rain", "Moisture falling from the atmosphere in drops.", "Noun", "Feminine", "/ˈʝu.βja/", "La lluvia cae.", "The rain is falling."],
        ["nieve", null, "snow", "Water vapour frozen into ice crystals.", "Noun", "Feminine", "/ˈnje.βe/", "La nieve es blanca.", "The snow is white."],
        ["viento", null, "wind", "The natural movement of the air.", "Noun", "Masculine", "/ˈbjen.to/", "El viento sopla fuerte.", "The wind blows hard."],
        ["tormenta", null, "storm", "A violent atmospheric disturbance.", "Noun", "Feminine", "/toɾ.ˈmen.ta/", "Llega la tormenta.", "The storm is coming."],
        ["arcoíris", null, "rainbow", "An arch of colours in the sky after rain.", "Noun", "Masculine", "/aɾ.ko.ˈi.ɾis/", "El arcoíris es precioso.", "The rainbow is beautiful."],
        ["paisaje", null, "landscape", "All the visible features of an area.", "Noun", "Masculine", "/paj.ˈsa.xe/", "El paisaje es hermoso.", "The landscape is beautiful."],
        ["animal", null, "animal", "A living organism that feeds on organic matter.", "Noun", "Masculine", "/a.ni.ˈmal/", "El animal vive en el bosque.", "The animal lives in the forest."],
        ["salvaje", null, "wild", "Living in a natural state.", "Adjective", null, "/sal.ˈβa.xe/", "El bosque es salvaje.", "The forest is wild."],
        ["natural", null, "natural", "Existing in or produced by nature.", "Adjective", null, "/na.tu.ˈɾal/", "El paisaje es natural.", "The landscape is natural."],
        ["verde", null, "green", "The colour of grass.", "Adjective", null, "/ˈbeɾ.ðe/", "Los campos son verdes.", "The fields are green."],
        ["florido", null, "flowery", "Covered with or full of flowers.", "Adjective", null, "/flo.ˈɾi.ðo/", "El jardín está florido.", "The garden is flowery."],
        ["húmedo", null, "humid", "Containing moisture; damp.", "Adjective", null, "/ˈu.me.ðo/", "El suelo está húmedo.", "The soil is wet."],
        ["profundo", null, "deep", "Extending far down from the top.", "Adjective", null, "/pɾo.ˈfun.do/", "El lago es profundo.", "The lake is deep."],
        ["tranquilo", null, "calm", "Free from disturbance.", "Adjective", null, "/tɾaŋ.ˈki.lo/", "El mar está tranquilo.", "The sea is calm."],
        ["pacífico", null, "peaceful", "Free from disturbance; tranquil.", "Adjective", null, "/pa.ˈθi.fi.ko/", "El pueblo es pacífico.", "The village is peaceful."],
        ["crecer", null, "to grow", "To develop or increase in size.", "Verb", null, "/kɾe.ˈθeɾ/", "Las plantas crecen.", "The plants grow."],
        ["plantar", null, "to plant", "To place in the ground to grow.", "Verb", null, "/plan.ˈtaɾ/", "Vamos a plantar un árbol.", "We are going to plant a tree."],
        ["proteger", null, "to protect", "To keep safe from harm.", "Verb", null, "/pɾo.te.ˈxeɾ/", "Debemos proteger la naturaleza.", "We must protect nature."],
        ["florecer", null, "to bloom", "To produce flowers.", "Verb", null, "/flo.ɾe.ˈθeɾ/", "Las flores van a florecer.", "The flowers will bloom."],
        ["observar", null, "to observe", "To watch carefully.", "Verb", null, "/ob.seɾ.ˈβaɾ/", "Me gusta observar las aves.", "I like observing birds."],
        ["fluir", null, "to flow", "To move steadily, like a liquid.", "Verb", null, "/flw.iɾ/", "El agua empieza a fluir.", "The water begins to flow."],
        ["crecer", null, "to grow up", "To increase in size or maturity.", "Verb", null, "/kɾe.ˈθeɾ/", "Los árboles crecen rápido.", "The trees grow quickly."],
        ["escalar", null, "to climb", "To go up using the hands and feet.", "Verb", null, "/es.ka.ˈlaɾ/", "Escalan la colina.", "They climb the hill."],
        ["respirar", null, "to breathe", "To take air into the lungs.", "Verb", null, "/res.pi.ˈɾaɾ/", "Respira el aire fresco.", "Breathe the fresh air."],
        ["brillar", null, "to shine", "To give out bright light.", "Verb", null, "/bɾi.ˈʝaɾ/", "El sol brilla.", "The sun shines."],
        ["caer", null, "to fall", "To move downward, typically rapidly.", "Verb", null, "/ka.ˈeɾ/", "Las hojas caen.", "The leaves fall."],
      ],
      Emotions: [
        ["emoción", null, "emotion", "A strong feeling deriving from circumstances.", "Noun", "Feminine", "/e.mo.ˈθjon/", "La emoción es fuerte.", "The emotion is strong."],
        ["sentimiento", null, "feeling", "An emotional state or reaction.", "Noun", "Masculine", "/sen.ti.ˈmjen.to/", "Oculta sus sentimientos.", "He hides his feelings."],
        ["alegría", null, "joy", "A feeling of great pleasure.", "Noun", "Feminine", "/a.le.ˈɣɾi.a/", "La alegría llena la casa.", "Joy fills the house."],
        ["felicidad", null, "happiness", "The state of being happy.", "Noun", "Feminine", "/fe.li.θi.ˈðað/", "La felicidad es valiosa.", "Happiness is precious."],
        ["tristeza", null, "sadness", "The condition of being sad.", "Noun", "Feminine", "/tɾis.ˈte.θa/", "La tristeza lo invade.", "Sadness overwhelms him."],
        ["miedo", null, "fear", "An unpleasant emotion caused by threat.", "Noun", "Masculine", "/ˈmje.ðo/", "El miedo es natural.", "Fear is natural."],
        ["ira", null, "anger", "A strong feeling of annoyance.", "Noun", "Feminine", "/ˈi.ɾa/", "Su ira es visible.", "His anger is visible."],
        ["sorpresa", null, "surprise", "An unexpected event or emotion.", "Noun", "Feminine", "/soɾ.ˈpɾe.sa/", "La sorpresa es agradable.", "The surprise is pleasant."],
        ["amor", null, "love", "A strong feeling of affection.", "Noun", "Masculine", "/a.ˈmoɾ/", "El amor es poderoso.", "Love is powerful."],
        ["odio", null, "hatred", "An intense dislike.", "Noun", "Masculine", "/ˈo.ðjo/", "El odio es destructivo.", "Hatred is destructive."],
        ["vergüenza", null, "shame", "A painful feeling of humiliation.", "Noun", "Feminine", "/beɾ.ˈɣwen.θa/", "La vergüenza se va.", "The shame disappears."],
        ["orgullo", null, "pride", "A feeling of deep satisfaction.", "Noun", "Masculine", "/oɾ.ˈɣu.ʝo/", "Su orgullo es visible.", "His pride is visible."],
        ["celos", null, "jealousy", "A feeling of envy towards another.", "Noun", "Masculine", "/ˈθe.los/", "Los celos lo consumen.", "Jealousy eats at him."],
        ["esperanza", null, "hope", "A feeling of expectation and desire.", "Noun", "Feminine", "/es.pe.ˈɾan.θa/", "La esperanza permanece.", "Hope remains."],
        ["desesperación", null, "despair", "A feeling of hopelessness.", "Noun", "Feminine", "/des.es.pe.ɾa.ˈθjon/", "La desesperación lo abruma.", "Despair overwhelms him."],
        ["ansiedad", null, "anxiety", "A feeling of worry or unease.", "Noun", "Feminine", "/an.sje.ˈðað/", "La ansiedad disminuye.", "The anxiety decreases."],
        ["estrés", null, "stress", "A state of mental or emotional strain.", "Noun", "Masculine", "/es.ˈtɾes/", "El estrés lo agobia.", "Stress weighs on him."],
        ["calma", null, "calm", "A state of peace and quiet.", "Noun", "Feminine", "/ˈkal.ma/", "La calma vuelve.", "Calm returns."],
        ["serenidad", null, "serenity", "The state of being calm and peaceful.", "Noun", "Feminine", "/se.ɾe.ni.ˈðað/", "Su serenidad es admirable.", "His serenity is admirable."],
        ["soledad", null, "loneliness", "Sadness because one has no company.", "Noun", "Feminine", "/so.le.ˈðað/", "La soledad pesa.", "Loneliness weighs heavy."],
        ["nostalgia", null, "nostalgia", "A sentimental longing for the past.", "Noun", "Feminine", "/nos.tal.ˈxi.a/", "La nostalgia lo invade.", "Nostalgia overwhelms him."],
        ["entusiasmo", null, "enthusiasm", "Intense enjoyment or interest.", "Noun", "Masculine", "/en.tu.ˈsjas.mo/", "Su entusiasmo es contagioso.", "His enthusiasm is contagious."],
        ["decepción", null, "disappointment", "Sadness caused by failing to fulfil hopes.", "Noun", "Feminine", "/de.θep.ˈθjon/", "Su decepción es visible.", "His disappointment is visible."],
        ["gratitud", null, "gratitude", "The quality of being thankful.", "Noun", "Feminine", "/ɡɾa.ti.ˈtuð/", "Siento gratitud.", "I feel gratitude."],
        ["confianza", null, "confidence", "A feeling of self-assurance.", "Noun", "Feminine", "/kon.ˈfjan.θa/", "Tiene confianza en sí misma.", "She has confidence in herself."],
        ["duda", null, "doubt", "A feeling of uncertainty.", "Noun", "Feminine", "/ˈdu.ða/", "La duda persiste.", "Doubt persists."],
        ["valor", null, "courage", "The ability to face danger or difficulty.", "Noun", "Masculine", "/ba.ˈloɾ/", "Tiene mucho valor.", "He has a lot of courage."],
        ["cobardía", null, "cowardice", "Lack of bravery.", "Noun", "Feminine", "/ko.βaɾ.ˈði.a/", "La cobardía es despreciada.", "Cowardice is despised."],
        ["generosidad", null, "generosity", "The quality of being kind and giving.", "Noun", "Feminine", "/xe.ne.ɾo.si.ˈðað/", "Su generosidad es conocida.", "His generosity is well-known."],
        ["egoísmo", null, "selfishness", "The quality of caring only about oneself.", "Noun", "Masculine", "/e.ɣo.ˈis.mo/", "El egoísmo daña a otros.", "Selfishness harms others."],
        ["feliz", null, "happy", "Feeling pleasure or contentment.", "Adjective", null, "/fe.ˈliθ/", "Estoy muy feliz.", "I am very happy."],
        ["triste", null, "sad", "Feeling sorrow.", "Adjective", null, "/ˈtɾis.te/", "Está triste.", "She is sad."],
        ["enfadado", null, "angry", "Feeling strong displeasure.", "Adjective", null, "/en.fa.ˈða.ðo/", "Está enfadado.", "He is angry."],
        ["preocupado", null, "worried", "Anxious about potential problems.", "Adjective", null, "/pɾe.o.ku.ˈpa.ðo/", "Parece preocupado.", "He seems worried."],
        ["sorprendido", null, "surprised", "Feeling mild astonishment.", "Adjective", null, "/soɾ.pɾen.ˈdi.ðo/", "Está sorprendido.", "He is surprised."],
        ["nervioso", null, "nervous", "Easily agitated or alarmed.", "Adjective", null, "/neɾ.ˈβjo.so/", "Estoy nervioso.", "I am nervous."],
        ["agradecido", null, "grateful", "Feeling thankful.", "Adjective", null, "/a.ɣɾa.ðe.ˈθi.ðo/", "Estamos agradecidos.", "We are grateful."],
        ["orgulloso", null, "proud", "Feeling deep satisfaction.", "Adjective", null, "/oɾ.ɣu.ˈʝo.so/", "Está orgulloso de él.", "He is proud of him."],
        ["celoso", null, "jealous", "Feeling envy towards another.", "Adjective", null, "/θe.ˈlo.so/", "Está celoso.", "He is jealous."],
        ["furioso", null, "furious", "Extremely angry.", "Adjective", null, "/fu.ˈɾjo.so/", "Está furioso.", "He is furious."],
        ["contento", null, "glad", "Pleased; happy.", "Adjective", null, "/kon.ˈten.to/", "Estoy contento de verte.", "I'm glad to see you."],
        ["tranquilo", null, "tranquil", "Free from disturbance.", "Adjective", null, "/tɾaŋ.ˈki.lo/", "Ella está tranquila.", "She is tranquil."],
        ["emocionado", null, "moved", "Affected by strong emotion.", "Adjective", null, "/e.mo.θjo.ˈna.ðo/", "Está muy emocionado.", "He is very moved."],
        ["llorar", null, "to cry", "To shed tears.", "Verb", null, "/ʝo.ˈɾaɾ/", "Ella empieza a llorar.", "She starts to cry."],
        ["reír", null, "to laugh", "To make sounds expressing amusement.", "Verb", null, "/re.ˈiɾ/", "Les gusta reír.", "They like to laugh."],
        ["sonreír", null, "to smile", "To form a smile.", "Verb", null, "/son.re.ˈiɾ/", "Le gusta sonreír.", "She likes to smile."],
        ["amar", null, "to love", "To feel deep affection.", "Verb", null, "/a.ˈmaɾ/", "Amamos viajar.", "We love traveling."],
        ["odiar", null, "to hate", "To feel intense dislike.", "Verb", null, "/o.ˈðjaɾ/", "Odia esperar.", "He hates waiting."],
        ["esperar", null, "to hope", "To want something to happen.", "Verb", null, "/es.pe.ˈɾaɾ/", "Espero tener éxito.", "I hope to succeed."],
        ["temer", null, "to fear", "To be afraid of.", "Verb", null, "/te.ˈmeɾ/", "Teme la tormenta.", "She fears the storm."],
        ["preocuparse", null, "to worry", "To feel anxious.", "Verb", null, "/pɾe.o.ku.ˈpaɾ.se/", "No te preocupes.", "Don't worry."],
        ["alegrarse", null, "to rejoice", "To feel or show great joy.", "Verb", null, "/a.le.ˈɣɾaɾ.se/", "Se alegra de verte.", "She rejoices at seeing you."],
        ["enfadarse", null, "to get angry", "To become angry.", "Verb", null, "/en.fa.ˈðaɾ.se/", "No hay que enfadarse.", "You should not get angry."],
        ["arrepentirse", null, "to regret", "To feel sorrow about something.", "Verb", null, "/a.re.pen.ˈtiɾ.se/", "Me arrepiento de esa decisión.", "I regret that decision."],
        ["admirar", null, "to admire", "To regard with respect or warm approval.", "Verb", null, "/að.mi.ˈɾaɾ/", "Admiro su valor.", "I admire his courage."],
        ["cansarse", null, "to get tired", "To become tired of something.", "Verb", null, "/kan.ˈsaɾ.se/", "Me canso de esperar.", "I'm tired of waiting."],
        ["sentirse", null, "to feel", "To experience an emotion or sensation.", "Verb", null, "/sen.ˈtiɾ.se/", "Me siento bien.", "I feel good."],
        ["calmarse", null, "to calm down", "To become less agitated.", "Verb", null, "/kal.ˈmaɾ.se/", "Cálmate.", "Calm down."],
      ],
      Family: [
        ["familia", null, "family", "A group of parents and children.", "Noun", "Feminine", "/fa.ˈmi.lja/", "Mi familia es grande.", "My family is big."],
        ["madre", null, "mother", "A woman in relation to her child.", "Noun", "Feminine", "/ˈma.ðɾe/", "Mi madre cocina bien.", "My mother cooks well."],
        ["padre", null, "father", "A man in relation to his child.", "Noun", "Masculine", "/ˈpa.ðɾe/", "Mi padre trabaja.", "My father works."],
        ["progenitor", null, "parent", "A person's father or mother.", "Noun", "Masculine", "/pɾo.xe.ni.ˈtoɾ/", "El progenitor acompaña al niño.", "The parent accompanies the child."],
        ["hermano", null, "brother", "A man or boy in relation to other children of his parents.", "Noun", "Masculine", "/eɾ.ˈma.no/", "Mi hermano es más alto.", "My brother is taller."],
        ["hermana", null, "sister", "A woman or girl in relation to other children of her parents.", "Noun", "Feminine", "/eɾ.ˈma.na/", "Mi hermana estudia.", "My sister studies."],
        ["medio hermano", null, "half-brother", "A brother with one parent in common.", "Noun", "Masculine", "/ˈme.ðjo eɾ.ˈma.no/", "Mi medio hermano vive en Sevilla.", "My half-brother lives in Seville."],
        ["media hermana", null, "half-sister", "A sister with one parent in common.", "Noun", "Feminine", "/ˈme.ðja eɾ.ˈma.na/", "Mi media hermana es menor.", "My half-sister is younger."],
        ["niño", null, "child", "A young human being below the age of puberty.", "Noun", "Masculine", "/ˈni.ɲo/", "El niño juega.", "The child plays."],
        ["hijo", null, "son", "A boy or man in relation to his parents.", "Noun", "Masculine", "/ˈi.xo/", "Mi hijo tiene diez años.", "My son is ten."],
        ["hija", null, "daughter", "A girl or woman in relation to her parents.", "Noun", "Feminine", "/ˈi.xa/", "Mi hija va a la escuela.", "My daughter goes to school."],
        ["bebé", null, "baby", "A very young child.", "Noun", "Masculine", "/be.ˈβe/", "El bebé duerme.", "The baby sleeps."],
        ["abuelo", null, "grandfather", "The father of one's father or mother.", "Noun", "Masculine", "/a.ˈβwe.lo/", "Mi abuelo cuenta historias.", "My grandfather tells stories."],
        ["abuela", null, "grandmother", "The mother of one's father or mother.", "Noun", "Feminine", "/a.ˈβwe.la/", "Mi abuela es sabia.", "My grandmother is wise."],
        ["bisabuelo", null, "great-grandfather", "The father of one's grandparent.", "Noun", "Masculine", "/bi.sa.ˈβwe.lo/", "Mi bisabuelo es muy viejo.", "My great-grandfather is very old."],
        ["tío", null, "uncle", "The brother of one's father or mother.", "Noun", "Masculine", "/ˈti.o/", "Mi tío vive lejos.", "My uncle lives far away."],
        ["tía", null, "aunt", "The sister of one's father or mother.", "Noun", "Feminine", "/ˈti.a/", "Mi tía es amable.", "My aunt is kind."],
        ["primo", null, "cousin (male)", "A son of one's uncle or aunt.", "Noun", "Masculine", "/ˈpɾi.mo/", "Mi primo llega mañana.", "My cousin arrives tomorrow."],
        ["prima", null, "cousin (female)", "A daughter of one's uncle or aunt.", "Noun", "Feminine", "/ˈpɾi.ma/", "Mi prima estudia en Madrid.", "My cousin studies in Madrid."],
        ["sobrino", null, "nephew", "A son of one's brother or sister.", "Noun", "Masculine", "/so.ˈβɾi.no/", "Mi sobrino es pequeño.", "My nephew is small."],
        ["sobrina", null, "niece", "A daughter of one's brother or sister.", "Noun", "Feminine", "/so.ˈβɾi.na/", "Mi sobrina es adorable.", "My niece is adorable."],
        ["marido", null, "husband", "A married man considered in relation to his spouse.", "Noun", "Masculine", "/ma.ˈɾi.ðo/", "Su marido trabaja aquí.", "Her husband works here."],
        ["esposa", null, "wife", "A married woman considered in relation to her spouse.", "Noun", "Feminine", "/es.ˈpo.sa/", "Su esposa es médica.", "His wife is a doctor."],
        ["cónyuge", null, "spouse", "A husband or wife.", "Noun", "Masculine", "/ˈkon.xu.xe/", "Su cónyuge es encantador.", "Their spouse is charming."],
        ["prometido", null, "fiancé", "A man engaged to be married.", "Noun", "Masculine", "/pɾo.me.ˈti.ðo/", "Su prometido es amable.", "Her fiancé is kind."],
        ["prometida", null, "fiancée", "A woman engaged to be married.", "Noun", "Feminine", "/pɾo.me.ˈti.ða/", "Su prometida es guapa.", "His fiancée is beautiful."],
        ["padrastro", null, "stepfather", "The husband of one's mother.", "Noun", "Masculine", "/pa.ˈðɾas.tɾo/", "Mi padrastro es simpático.", "My stepfather is nice."],
        ["madrastra", null, "stepmother", "The wife of one's father.", "Noun", "Feminine", "/ma.ˈðɾas.tɾa/", "Mi madrastra cocina bien.", "My stepmother cooks well."],
        ["suegro", null, "father-in-law", "The father of one's spouse.", "Noun", "Masculine", "/ˈswe.ɣɾo/", "Mi suegro es agradable.", "My father-in-law is nice."],
        ["suegra", null, "mother-in-law", "The mother of one's spouse.", "Noun", "Feminine", "/ˈswe.ɣɾa/", "Mi suegra es encantadora.", "My mother-in-law is charming."],
        ["cuñado", null, "brother-in-law", "The brother of one's spouse.", "Noun", "Masculine", "/ku.ˈɲa.ðo/", "Mi cuñado es divertido.", "My brother-in-law is funny."],
        ["cuñada", null, "sister-in-law", "The sister of one's spouse.", "Noun", "Feminine", "/ku.ˈɲa.ða/", "Mi cuñada es médica.", "My sister-in-law is a doctor."],
        ["padrino", null, "godfather", "A man who presents a child at baptism.", "Noun", "Masculine", "/pa.ˈðɾi.no/", "Mi padrino es generoso.", "My godfather is generous."],
        ["madrina", null, "godmother", "A woman who presents a child at baptism.", "Noun", "Feminine", "/ma.ˈðɾi.na/", "Mi madrina es cariñosa.", "My godmother is caring."],
        ["mayor", null, "older", "Having lived longer.", "Adjective", null, "/ma.ˈʝoɾ/", "Mi hermano mayor trabaja.", "My older brother works."],
        ["menor", null, "younger", "Having lived for a shorter time.", "Adjective", null, "/me.ˈnoɾ/", "Mi hermana menor estudia.", "My younger sister studies."],
        ["joven", null, "young", "Having lived for only a short time.", "Adjective", null, "/ˈxo.βen/", "El niño es joven.", "The child is young."],
        ["viejo", null, "old", "Having lived for a long time.", "Adjective", null, "/ˈbje.xo/", "Mi abuelo es viejo.", "My grandfather is old."],
        ["casado", null, "married", "Joined in marriage.", "Adjective", null, "/ka.ˈsa.ðo/", "Están casados.", "They are married."],
        ["soltero", null, "single", "Not married.", "Adjective", null, "/sol.ˈte.ɾo/", "Está soltero.", "He is single."],
        ["divorciado", null, "divorced", "Legally dissolved from a marriage.", "Adjective", null, "/di.βoɾ.ˈθja.ðo/", "Está divorciada.", "She is divorced."],
        ["viudo", null, "widower", "A man whose spouse has died.", "Adjective", null, "/ˈbju.ðo/", "Es viudo.", "He is a widower."],
        ["adoptivo", null, "adoptive", "Related by adoption.", "Adjective", null, "/a.ðop.ˈti.βo/", "Su padre adoptivo es amable.", "His adoptive father is kind."],
        ["fraternal", null, "brotherly", "Of or like a brother.", "Adjective", null, "/fɾa.teɾ.ˈnal/", "Su vínculo es fraternal.", "Their bond is brotherly."],
        ["maternal", null, "maternal", "Of or like a mother.", "Adjective", null, "/ma.teɾ.ˈnal/", "Su instinto maternal es fuerte.", "Her maternal instinct is strong."],
        ["paternal", null, "paternal", "Of or like a father.", "Adjective", null, "/pa.teɾ.ˈnal/", "Su amor paternal es grande.", "His paternal love is great."],
        ["cariñoso", null, "affectionate", "Readily showing fondness.", "Adjective", null, "/ka.ɾi.ˈɲo.so/", "Es muy cariñoso.", "He is very affectionate."],
        ["cercano", null, "close", "Emotionally intimate.", "Adjective", null, "/θeɾ.ˈka.no/", "Somos muy cercanos.", "We are very close."],
        ["nacer", null, "to be born", "To come into existence.", "Verb", null, "/na.ˈθeɾ/", "El bebé acaba de nacer.", "The baby has just been born."],
        ["crecer", null, "to grow up", "To become older.", "Verb", null, "/kɾe.ˈθeɾ/", "Los niños crecen rápido.", "Children grow up quickly."],
        ["criar", null, "to raise", "To bring up a child.", "Verb", null, "/kɾi.ˈaɾ/", "Crían tres hijos.", "They raise three children."],
        ["respetar", null, "to respect", "To show admiration or esteem.", "Verb", null, "/res.pe.ˈtaɾ/", "Debemos respetar a nuestros padres.", "We must respect our parents."],
        ["ayudar", null, "to help", "To assist.", "Verb", null, "/a.ʝu.ˈðaɾ/", "Debemos ayudar a nuestros padres.", "We must help our parents."],
        ["compartir", null, "to share", "To give a portion to others.", "Verb", null, "/kom.paɾ.ˈtiɾ/", "Compartimos una comida.", "We share a meal."],
        ["casarse", null, "to marry", "To take as a spouse.", "Verb", null, "/ka.ˈsaɾ.se/", "Van a casarse.", "They are going to get married."],
        ["divorciarse", null, "to divorce", "To legally dissolve a marriage.", "Verb", null, "/di.βoɾ.ˈθjaɾ.se/", "Van a divorciarse.", "They are going to divorce."],
        ["cuidar", null, "to look after", "To take care of.", "Verb", null, "/kwi.ˈðaɾ/", "Cuida de su madre.", "She looks after her mother."],
        ["visitar", null, "to visit", "To go to see someone.", "Verb", null, "/bi.si.ˈtaɾ/", "Visito a mis abuelos.", "I visit my grandparents."],
        ["llamar", null, "to call", "To use a telephone to contact someone.", "Verb", null, "/ʝa.ˈmaɾ/", "Llamo a mi madre.", "I call my mother."],
        ["amar", null, "to love", "To feel deep affection.", "Verb", null, "/a.ˈmaɾ/", "Amo a mi familia.", "I love my family."],
      ],
      "Daily Life": [
        ["casa", null, "house", "A building for human habitation.", "Noun", "Feminine", "/ˈka.sa/", "Mi casa es pequeña.", "My house is small."],
        ["piso", null, "apartment", "A set of rooms within a larger building.", "Noun", "Masculine", "/ˈpi.so/", "Mi piso está en el tercer piso.", "My apartment is on the third floor."],
        ["edificio", null, "building", "A structure with a roof and walls.", "Noun", "Masculine", "/e.ði.ˈfi.θjo/", "El edificio es nuevo.", "The building is new."],
        ["dormitorio", null, "bedroom", "A room for sleeping.", "Noun", "Masculine", "/doɾ.mi.ˈto.ɾjo/", "Mi dormitorio es pequeño.", "My bedroom is small."],
        ["salón", null, "living room", "A room for relaxing and entertaining.", "Noun", "Masculine", "/sa.ˈlon/", "El salón es amplio.", "The living room is spacious."],
        ["cocina", null, "kitchen", "A room for preparing food.", "Noun", "Feminine", "/ko.ˈθi.na/", "La cocina está limpia.", "The kitchen is clean."],
        ["baño", null, "bathroom", "A room with a bath or shower.", "Noun", "Masculine", "/ˈba.ɲo/", "El baño es grande.", "The bathroom is large."],
        ["aseo", null, "toilet", "A room with a toilet.", "Noun", "Masculine", "/a.ˈse.o/", "¿Dónde está el aseo?", "Where is the toilet?"],
        ["puerta", null, "door", "A hinged barrier used to close an entrance.", "Noun", "Feminine", "/ˈpweɾ.ta/", "Cierra la puerta.", "Close the door."],
        ["ventana", null, "window", "An opening in a wall fitted with glass.", "Noun", "Feminine", "/ben.ˈta.na/", "Abre la ventana.", "Open the window."],
        ["pared", null, "wall", "A vertical structure enclosing an area.", "Noun", "Feminine", "/pa.ˈɾeð/", "La pared es blanca.", "The wall is white."],
        ["suelo", null, "floor", "The lower surface of a room.", "Noun", "Masculine", "/ˈswe.lo/", "El suelo está limpio.", "The floor is clean."],
        ["techo", null, "ceiling", "The upper interior surface of a room.", "Noun", "Masculine", "/ˈte.tʃo/", "El techo es alto.", "The ceiling is high."],
        ["escalera", null, "stairs", "A set of steps leading from one floor to another.", "Noun", "Feminine", "/es.ka.ˈle.ɾa/", "La escalera es empinada.", "The stairs are steep."],
        ["ascensor", null, "elevator", "A platform or cage for moving people between floors.", "Noun", "Masculine", "/as.θen.ˈsoɾ/", "El ascensor está averiado.", "The elevator is broken."],
        ["mesa", null, "table", "A piece of furniture with a flat top and legs.", "Noun", "Feminine", "/ˈme.sa/", "La mesa está puesta.", "The table is set."],
        ["silla", null, "chair", "A seat for one person.", "Noun", "Feminine", "/ˈsi.ʝa/", "Toma una silla.", "Take a chair."],
        ["sofá", null, "sofa", "A long upholstered seat for several people.", "Noun", "Masculine", "/so.ˈfa/", "El sofá es cómodo.", "The sofa is comfortable."],
        ["cama", null, "bed", "A piece of furniture for sleeping.", "Noun", "Feminine", "/ˈka.ma/", "La cama es cómoda.", "The bed is comfortable."],
        ["almohada", null, "pillow", "A cushion for the head in bed.", "Noun", "Feminine", "/al.mo.ˈa.ða/", "La almohada es suave.", "The pillow is soft."],
        ["manta", null, "blanket", "A warm covering for a bed.", "Noun", "Feminine", "/ˈman.ta/", "La manta es caliente.", "The blanket is warm."],
        ["sábana", null, "sheet", "A large piece of cloth used on a bed.", "Noun", "Feminine", "/ˈsa.βa.na/", "La sábana está limpia.", "The sheet is clean."],
        ["armario", null, "wardrobe", "A tall cupboard for hanging clothes.", "Noun", "Masculine", "/aɾ.ˈma.ɾjo/", "El armario está lleno.", "The wardrobe is full."],
        ["cómoda", null, "dresser", "A piece of furniture with drawers.", "Noun", "Feminine", "/ˈko.mo.ða/", "La cómoda es de madera.", "The dresser is wooden."],
        ["estante", null, "shelf", "A flat horizontal surface for holding items.", "Noun", "Masculine", "/es.ˈtan.te/", "El estante es alto.", "The shelf is high."],
        ["lámpara", null, "lamp", "A device for giving light.", "Noun", "Feminine", "/ˈlam.pa.ɾa/", "La lámpara está encendida.", "The lamp is on."],
        ["espejo", null, "mirror", "A reflective surface showing a person's image.", "Noun", "Masculine", "/es.ˈpe.xo/", "El espejo está roto.", "The mirror is broken."],
        ["reloj", null, "clock", "An instrument for measuring time.", "Noun", "Masculine", "/re.ˈlo.x/", "El reloj marca mediodía.", "The clock shows noon."],
        ["alfombra", null, "rug", "A floor covering made of thick woven material.", "Noun", "Feminine", "/al.ˈfom.bɾa/", "La alfombra es roja.", "The rug is red."],
        ["cortina", null, "curtain", "A piece of cloth hung to cover a window.", "Noun", "Feminine", "/koɾ.ˈti.na/", "La cortina está abierta.", "The curtain is open."],
        ["llave", null, "key", "A small metal object for opening a lock.", "Noun", "Feminine", "/ˈʝa.βe/", "Perdí mi llave.", "I lost my key."],
        ["despertador", null, "alarm clock", "A clock that wakes a sleeper.", "Noun", "Masculine", "/des.peɾ.ta.ˈðoɾ/", "El despertador suena temprano.", "The alarm clock rings early."],
        ["ducha", null, "shower", "A cubicle for washing.", "Noun", "Feminine", "/ˈdu.tʃa/", "La ducha está caliente.", "The shower is hot."],
        ["bañera", null, "bathtub", "A tub filled with water for washing.", "Noun", "Feminine", "/ba.ˈɲe.ɾa/", "La bañera está llena.", "The bathtub is full."],
        ["jabón", null, "soap", "A substance used with water for washing.", "Noun", "Masculine", "/xa.ˈβon/", "El jabón huele bien.", "The soap smells good."],
        ["toalla", null, "towel", "An absorbent cloth for drying.", "Noun", "Feminine", "/to.ˈa.ʝa/", "La toalla está limpia.", "The towel is clean."],
        ["cepillo de dientes", null, "toothbrush", "A small brush for cleaning the teeth.", "Noun", "Masculine", "/θe.ˈpi.ʝo ðe ˈdjen.tes/", "Mi cepillo de dientes es nuevo.", "My toothbrush is new."],
        ["pasta de dientes", null, "toothpaste", "A paste for cleaning the teeth.", "Noun", "Feminine", "/ˈpas.ta ðe ˈdjen.tes/", "La pasta de dientes se acabó.", "The toothpaste is finished."],
        ["champú", null, "shampoo", "A liquid for washing hair.", "Noun", "Masculine", "/tʃam.ˈpu/", "El champú huele a fresa.", "The shampoo smells like strawberry."],
        ["peine", null, "comb", "A tool for arranging the hair.", "Noun", "Masculine", "/ˈpej.ne/", "El peine está en el cajón.", "The comb is in the drawer."],
        ["limpio", null, "clean", "Free from dirt or marks.", "Adjective", null, "/ˈlim.pjo/", "La habitación está limpia.", "The room is clean."],
        ["sucio", null, "dirty", "Covered or marked with dirt.", "Adjective", null, "/ˈsu.θjo/", "Mi ropa está sucia.", "My clothes are dirty."],
        ["ordenado", null, "tidy", "Arranged neatly.", "Adjective", null, "/oɾ.ðe.ˈna.ðo/", "La cocina está ordenada.", "The kitchen is tidy."],
        ["ocupado", null, "busy", "Having a great deal to do.", "Adjective", null, "/o.ku.ˈpa.ðo/", "Estoy ocupado hoy.", "I am busy today."],
        ["cansado", null, "tired", "In need of rest or sleep.", "Adjective", null, "/kan.ˈsa.ðo/", "Estoy cansado esta noche.", "I am tired tonight."],
        ["despertarse", null, "to wake up", "To stop sleeping.", "Verb", null, "/des.peɾ.ˈtaɾ.se/", "Me despierto a las siete.", "I wake up at seven."],
        ["levantarse", null, "to get up", "To rise from bed.", "Verb", null, "/le.βan.ˈtaɾ.se/", "Tengo que levantarme temprano.", "I have to get up early."],
        ["lavarse", null, "to wash oneself", "To clean oneself.", "Verb", null, "/la.ˈβaɾ.se/", "Ella va a lavarse.", "She is going to wash herself."],
        ["cepillarse", null, "to brush", "To clean with a brush.", "Verb", null, "/θe.pi.ˈʝaɾ.se/", "Me cepillo los dientes.", "I brush my teeth."],
        ["vestirse", null, "to get dressed", "To put on clothes.", "Verb", null, "/bes.ˈtiɾ.se/", "Se viste rápido.", "He gets dressed quickly."],
        ["acostarse", null, "to go to bed", "To go to sleep.", "Verb", null, "/a.kos.ˈtaɾ.se/", "Me voy a acostar temprano.", "I am going to bed early."],
        ["descansar", null, "to rest", "To stop activity for a while.", "Verb", null, "/des.kan.ˈsaɾ/", "Quiere descansar.", "He wants to rest."],
        ["trabajar", null, "to work", "To perform a job.", "Verb", null, "/tɾa.βa.ˈxaɾ/", "Tenemos que trabajar.", "We must work."],
        ["ordenar", null, "to tidy", "To put things in their proper places.", "Verb", null, "/oɾ.ðe.ˈnaɾ/", "Debo ordenar mi cuarto.", "I must tidy my room."],
        ["limpiar", null, "to clean", "To free from dirt.", "Verb", null, "/lim.ˈpjaɾ/", "Voy a limpiar la casa.", "I will clean the house."],
        ["lavar", null, "to wash", "To clean with water.", "Verb", null, "/la.ˈβaɾ/", "Voy a lavar los platos.", "I will wash the plates."],
        ["cocinar", null, "to cook", "To prepare food.", "Verb", null, "/ko.θi.ˈnaɾ/", "Me gusta cocinar de noche.", "I like cooking in the evening."],
        ["comer", null, "to eat", "To consume food.", "Verb", null, "/ko.ˈmeɾ/", "Vamos a comer.", "We are going to eat."],
        ["beber", null, "to drink", "To take liquid into the mouth.", "Verb", null, "/be.ˈβeɾ/", "Bebe café.", "She drinks coffee."],
        ["desayunar", null, "to have breakfast", "To eat breakfast.", "Verb", null, "/des.a.ʝu.ˈnaɾ/", "Desayuno a las siete.", "I have breakfast at seven."],
        ["almorzar", null, "to have lunch", "To eat lunch.", "Verb", null, "/al.moɾ.ˈθaɾ/", "Almorzamos a las dos.", "We have lunch at two."],
        ["cenar", null, "to have dinner", "To eat dinner.", "Verb", null, "/θe.ˈnaɾ/", "Cenamos a las nueve.", "We have dinner at nine."],
      ],
      Shopping: [
        ["tienda", null, "store", "A shop.", "Noun", "Feminine", "/ˈtjen.da/", "La tienda cierra pronto.", "The store closes soon."],
        ["boutique", null, "boutique", "A small shop selling fashionable items.", "Noun", "Feminine", "/bu.ˈtik/", "La boutique cierra pronto.", "The boutique closes soon."],
        ["supermercado", null, "supermarket", "A large self-service grocery store.", "Noun", "Masculine", "/su.peɾ.meɾ.ˈka.ðo/", "El supermercado está abierto.", "The supermarket is open."],
        ["mercado", null, "market", "A regular gathering for purchase and sale.", "Noun", "Masculine", "/meɾ.ˈka.ðo/", "El mercado está animado.", "The market is lively."],
        ["centro comercial", null, "shopping mall", "A large building containing many shops.", "Noun", "Masculine", "/ˈθen.tɾo ko.meɾ.ˈθjal/", "El centro comercial es enorme.", "The mall is huge."],
        ["farmacia", null, "pharmacy", "A shop where medicines are prepared and sold.", "Noun", "Feminine", "/faɾ.ˈma.θja/", "La farmacia está abierta.", "The pharmacy is open."],
        ["panadería", null, "bakery", "A shop that sells bread and cakes.", "Noun", "Feminine", "/pa.na.ðe.ˈɾi.a/", "La panadería huele bien.", "The bakery smells good."],
        ["pastelería", null, "pastry shop", "A shop that sells pastries and cakes.", "Noun", "Feminine", "/pas.te.le.ˈɾi.a/", "La pastelería es famosa.", "The pastry shop is famous."],
        ["carnicería", null, "butcher shop", "A shop that sells meat.", "Noun", "Feminine", "/kaɾ.ni.θe.ˈɾi.a/", "La carnicería está cerrada.", "The butcher shop is closed."],
        ["librería", null, "bookshop", "A shop that sells books.", "Noun", "Feminine", "/li.βɾe.ˈɾi.a/", "Me gusta esta librería.", "I like this bookshop."],
        ["precio", null, "price", "The amount of money expected for something.", "Noun", "Masculine", "/ˈpɾe.θjo/", "El precio es razonable.", "The price is reasonable."],
        ["cliente", null, "customer", "A person buying goods or services.", "Noun", "Masculine", "/ˈkljen.te/", "El cliente espera su turno.", "The customer waits for his turn."],
        ["vendedor", null, "salesperson", "A person who sells goods.", "Noun", "Masculine", "/ben.de.ˈðoɾ/", "El vendedor es amable.", "The salesperson is friendly."],
        ["caja", null, "checkout", "A counter where payment is made.", "Noun", "Feminine", "/ˈka.xa/", "La caja está abierta.", "The checkout is open."],
        ["cesta", null, "basket", "A container for shopping.", "Noun", "Feminine", "/ˈθes.ta/", "La cesta está llena.", "The basket is full."],
        ["carrito", null, "shopping cart", "A cart used in a supermarket.", "Noun", "Masculine", "/ka.ˈri.to/", "El carrito es pesado.", "The cart is heavy."],
        ["tarjeta", null, "card", "A plastic card for making payments.", "Noun", "Feminine", "/taɾ.ˈxe.ta/", "Olvidé mi tarjeta.", "I forgot my card."],
        ["efectivo", null, "cash", "Money in the form of coins or notes.", "Noun", "Masculine", "/e.fek.ˈti.βo/", "Pago en efectivo.", "I pay in cash."],
        ["cambio", null, "change", "Coins of low value.", "Noun", "Masculine", "/ˈkam.bjo/", "Quédese con el cambio.", "Keep the change."],
        ["recibo", null, "receipt", "A printed acknowledgment of payment.", "Noun", "Masculine", "/re.ˈθi.βo/", "Aquí tiene su recibo.", "Here is your receipt."],
        ["factura", null, "invoice", "A list of goods sent with amounts owed.", "Noun", "Feminine", "/fak.ˈtu.ɾa/", "La factura está en el sobre.", "The invoice is in the envelope."],
        ["rebaja", null, "discount", "A reduction in price.", "Noun", "Feminine", "/re.ˈβa.xa/", "La rebaja es importante.", "The discount is significant."],
        ["oferta", null, "offer", "A special price offer.", "Noun", "Feminine", "/o.ˈfeɾ.ta/", "Esta oferta es interesante.", "This offer is interesting."],
        ["promoción", null, "promotion", "A special offer at a lower price.", "Noun", "Feminine", "/pɾo.mo.ˈθjon/", "La promoción es interesante.", "The promotion is interesting."],
        ["talla", null, "size", "The dimensions of an item.", "Noun", "Feminine", "/ˈta.ʝa/", "¿Qué talla busca?", "What size are you looking for?"],
        ["probador", null, "fitting room", "A small room for trying on clothes.", "Noun", "Masculine", "/pɾo.βa.ˈðoɾ/", "El probador está libre.", "The fitting room is free."],
        ["ropa", null, "clothing", "Items worn to cover the body.", "Noun", "Feminine", "/ˈro.pa/", "Esta ropa es cara.", "These clothes are expensive."],
        ["vestido", null, "dress", "A one-piece garment for a woman.", "Noun", "Masculine", "/bes.ˈti.ðo/", "El vestido es elegante.", "The dress is elegant."],
        ["camisa", null, "shirt", "A garment for the upper body with sleeves.", "Noun", "Feminine", "/ka.ˈmi.sa/", "La camisa es blanca.", "The shirt is white."],
        ["pantalón", null, "trousers", "A garment covering the legs separately.", "Noun", "Masculine", "/pan.ta.ˈlon/", "El pantalón es nuevo.", "The trousers are new."],
        ["falda", null, "skirt", "A garment hanging from the waist.", "Noun", "Feminine", "/ˈfal.da/", "La falda es corta.", "The skirt is short."],
        ["abrigo", null, "coat", "A garment worn over other clothes for warmth.", "Noun", "Masculine", "/a.ˈβɾi.ɣo/", "El abrigo es caliente.", "The coat is warm."],
        ["chaqueta", null, "jacket", "A short coat.", "Noun", "Feminine", "/tʃa.ˈke.ta/", "La chaqueta es bonita.", "The jacket is pretty."],
        ["jersey", null, "sweater", "A knitted garment for the upper body.", "Noun", "Masculine", "/xeɾ.ˈsej/", "El jersey es suave.", "The sweater is soft."],
        ["zapatos", null, "shoes", "Footwear for protecting the feet.", "Noun", "Masculine", "/θa.ˈpa.tos/", "Estos zapatos son bonitos.", "These shoes are beautiful."],
        ["botas", null, "boots", "Coverings for the feet and ankles.", "Noun", "Feminine", "/ˈbo.tas/", "Las botas son de cuero.", "The boots are leather."],
        ["sandalias", null, "sandals", "Light open shoes for warm weather.", "Noun", "Feminine", "/san.ˈda.ljas/", "Las sandalias son prácticas.", "The sandals are practical."],
        ["calcetines", null, "socks", "Garments worn on the feet.", "Noun", "Masculine", "/kal.θe.ˈti.nes/", "Los calcetines están limpios.", "The socks are clean."],
        ["sombrero", null, "hat", "A covering for the head.", "Noun", "Masculine", "/som.ˈbɾe.ɾo/", "El sombrero es elegante.", "The hat is elegant."],
        ["bufanda", null, "scarf", "A length of fabric worn around the neck.", "Noun", "Feminine", "/bu.ˈfan.da/", "La bufanda es caliente.", "The scarf is warm."],
        ["guantes", null, "gloves", "Coverings for the hands.", "Noun", "Masculine", "/ˈɡwan.tes/", "Los guantes son de lana.", "The gloves are wool."],
        ["joya", null, "jewel", "A precious ornament.", "Noun", "Feminine", "/ˈxo.ʝa/", "La joya es preciosa.", "The jewel is precious."],
        ["reloj", null, "watch", "A small clock worn on the wrist.", "Noun", "Masculine", "/re.ˈlo.x/", "El reloj está roto.", "The watch is broken."],
        ["gafas", null, "glasses", "Frames with lenses worn to aid vision.", "Noun", "Feminine", "/ˈɡa.fas/", "Mis gafas están sucias.", "My glasses are dirty."],
        ["caro", null, "expensive", "Costing a lot of money.", "Adjective", null, "/ˈka.ɾo/", "Este producto es caro.", "This product is expensive."],
        ["barato", null, "cheap", "Costing little money.", "Adjective", null, "/ba.ˈɾa.to/", "Esta camisa es barata.", "This shirt is cheap."],
        ["gratis", null, "free", "Costing nothing.", "Adjective", null, "/ˈɡɾa.tis/", "El servicio es gratis.", "The service is free."],
        ["disponible", null, "available", "Able to be used or obtained.", "Adjective", null, "/dis.po.ˈni.βle/", "El producto está disponible.", "The product is available."],
        ["nuevo", null, "new", "Not previously used.", "Adjective", null, "/ˈnwe.βo/", "Compro un teléfono nuevo.", "I am buying a new phone."],
        ["usado", null, "used", "Previously owned.", "Adjective", null, "/u.ˈsa.ðo/", "Vende una bici usada.", "He sells a used bicycle."],
        ["asequible", null, "affordable", "Inexpensive enough.", "Adjective", null, "/a.se.ˈki.βle/", "El precio es asequible.", "The price is affordable."],
        ["elegante", null, "elegant", "Graceful and stylish.", "Adjective", null, "/e.le.ˈɣan.te/", "Esta chaqueta es elegante.", "This jacket is elegant."],
        ["vender", null, "to sell", "To give something in exchange for money.", "Verb", null, "/ben.ˈdeɾ/", "La tienda vende vestidos.", "The shop sells dresses."],
        ["comprar", null, "to buy", "To obtain in exchange for payment.", "Verb", null, "/kom.ˈpɾaɾ/", "Quiero comprar zapatos.", "I want to buy shoes."],
        ["pagar", null, "to pay", "To give money for goods.", "Verb", null, "/pa.ˈɣaɾ/", "Voy a pagar ahora.", "I will pay now."],
        ["elegir", null, "to choose", "To pick from a range.", "Verb", null, "/e.le.ˈxiɾ/", "Debo elegir una talla.", "I must choose a size."],
        ["probarse", null, "to try on", "To test clothing for fit.", "Verb", null, "/pɾo.ˈβaɾ.se/", "Quiere probarse el vestido.", "She wants to try on the dress."],
        ["comparar", null, "to compare", "To assess similarities and differences.", "Verb", null, "/kom.pa.ˈɾaɾ/", "Quiero comparar los precios.", "I want to compare the prices."],
        ["pedir", null, "to order", "To request goods.", "Verb", null, "/pe.ˈðiɾ/", "Voy a pedir una talla más grande.", "I am going to order a larger size."],
        ["entregar", null, "to deliver", "To bring goods to a destination.", "Verb", null, "/en.tɾe.ˈɣaɾ/", "La tienda entrega mañana.", "The store will deliver tomorrow."],
        ["devolver", null, "to return", "To give back goods to a store.", "Verb", null, "/de.βol.ˈβeɾ/", "Quiero devolver esta camisa.", "I want to return this shirt."],
        ["gastar", null, "to spend", "To use money to buy things.", "Verb", null, "/ɣas.ˈtaɾ/", "No quiero gastar mucho.", "I don't want to spend much."],
        ["ahorrar", null, "to save", "To keep money for future use.", "Verb", null, "/a.o.ˈraɾ/", "Quiero ahorrar dinero.", "I want to save money."],
      ],
      Weather: [
        ["tiempo", null, "weather", "The state of the atmosphere.", "Noun", "Masculine", "/ˈtjem.po/", "El tiempo es bueno.", "The weather is nice."],
        ["clima", null, "climate", "The weather conditions prevailing in an area.", "Noun", "Masculine", "/ˈkli.ma/", "El clima es suave.", "The climate is mild."],
        ["sol", null, "sun", "The star at the center of our solar system.", "Noun", "Masculine", "/sol/", "El sol brilla.", "The sun is shining."],
        ["lluvia", null, "rain", "Moisture falling from the atmosphere in drops.", "Noun", "Feminine", "/ˈʝu.βja/", "La lluvia cae.", "The rain is falling."],
        ["nieve", null, "snow", "Water vapour frozen into ice crystals.", "Noun", "Feminine", "/ˈnje.βe/", "La nieve es blanca.", "The snow is white."],
        ["viento", null, "wind", "The natural movement of the air.", "Noun", "Masculine", "/ˈbjen.to/", "El viento sopla fuerte.", "The wind blows hard."],
        ["nube", null, "cloud", "A visible mass of condensed water vapour.", "Noun", "Feminine", "/ˈnu.βe/", "Una nube pasa.", "A cloud passes."],
        ["tormenta", null, "storm", "A violent atmospheric disturbance.", "Noun", "Feminine", "/toɾ.ˈmen.ta/", "Llega la tormenta.", "The storm is coming."],
        ["tempestad", null, "tempest", "A violent windy storm.", "Noun", "Feminine", "/tem.pes.ˈtað/", "La tempestad hace estragos.", "The tempest rages."],
        ["niebla", null, "fog", "A thick cloud of water droplets.", "Noun", "Feminine", "/ˈnje.βla/", "La niebla es densa.", "The fog is thick."],
        ["bruma", null, "mist", "A light fog.", "Noun", "Feminine", "/ˈbɾu.ma/", "La bruma se levanta.", "The mist is rising."],
        ["rocío", null, "dew", "Small drops of water on cool surfaces.", "Noun", "Masculine", "/ro.ˈθi.o/", "El rocío brilla.", "The dew glistens."],
        ["escarcha", null, "frost", "A deposit of white ice crystals.", "Noun", "Feminine", "/es.ˈkaɾ.tʃa/", "La escarcha ha llegado.", "The frost has come."],
        ["hielo", null, "ice", "Frozen water.", "Noun", "Masculine", "/ˈje.lo/", "El hielo cubre el lago.", "Ice covers the lake."],
        ["calor", null, "heat", "The quality of being hot.", "Noun", "Masculine", "/ka.ˈloɾ/", "El calor es intenso.", "The heat is intense."],
        ["ola de calor", null, "heatwave", "A period of unusually hot weather.", "Noun", "Feminine", "/ˈo.la ðe ka.ˈloɾ/", "La ola de calor continúa.", "The heatwave continues."],
        ["frío", null, "cold", "A low temperature.", "Noun", "Masculine", "/ˈfɾi.o/", "El frío es cortante.", "The cold is biting."],
        ["frescura", null, "coolness", "A state of being cool.", "Noun", "Feminine", "/fɾes.ˈku.ɾa/", "La frescura de la mañana.", "The coolness of the morning."],
        ["humedad", null, "humidity", "The amount of water vapour in the air.", "Noun", "Feminine", "/u.me.ˈðað/", "La humedad es alta.", "The humidity is high."],
        ["sequía", null, "drought", "A prolonged period of abnormally low rainfall.", "Noun", "Feminine", "/se.ˈki.a/", "La sequía es grave.", "The drought is serious."],
        ["inundación", null, "flood", "An overflowing of a large amount of water.", "Noun", "Feminine", "/i.nun.da.ˈθjon/", "La inundación causó daños.", "The flood caused damage."],
        ["temperatura", null, "temperature", "The degree of heat or cold.", "Noun", "Feminine", "/tem.pe.ɾa.ˈtu.ɾa/", "La temperatura baja.", "The temperature drops."],
        ["grado", null, "degree", "A unit of measurement for temperature.", "Noun", "Masculine", "/ˈɡɾa.ðo/", "Hace veinte grados.", "It is twenty degrees."],
        ["termómetro", null, "thermometer", "An instrument for measuring temperature.", "Noun", "Masculine", "/teɾ.ˈmo.me.tɾo/", "El termómetro marca cero.", "The thermometer shows zero."],
        ["pronóstico", null, "forecast", "A prediction of weather.", "Noun", "Masculine", "/pɾo.ˈnos.ti.ko/", "El pronóstico anuncia lluvia.", "The forecast predicts rain."],
        ["meteorología", null, "weather report", "A broadcast about the weather.", "Noun", "Feminine", "/me.te.o.ɾo.lo.ˈxi.a/", "La meteorología anuncia sol.", "The weather report predicts sun."],
        ["estación", null, "season", "Each of the four divisions of the year.", "Noun", "Feminine", "/es.ta.ˈθjon/", "Cada estación tiene su encanto.", "Each season has its charm."],
        ["primavera", null, "spring", "The season between winter and summer.", "Noun", "Feminine", "/pɾi.ma.ˈβe.ɾa/", "La primavera está florida.", "Spring is in flower."],
        ["verano", null, "summer", "The warmest season of the year.", "Noun", "Masculine", "/be.ˈɾa.no/", "El verano es caluroso.", "Summer is hot."],
        ["otoño", null, "autumn", "The season between summer and winter.", "Noun", "Masculine", "/o.ˈto.ɲo/", "El otoño es colorido.", "Autumn is colourful."],
        ["invierno", null, "winter", "The coldest season of the year.", "Noun", "Masculine", "/im.ˈbjeɾ.no/", "El invierno es duro.", "Winter is harsh."],
        ["arcoíris", null, "rainbow", "An arch of colours in the sky after rain.", "Noun", "Masculine", "/aɾ.ko.ˈi.ɾis/", "El arcoíris es precioso.", "The rainbow is beautiful."],
        ["relámpago", null, "lightning", "A flash of electricity in the sky.", "Noun", "Masculine", "/re.ˈlam.pa.ɣo/", "Un relámpago ilumina el cielo.", "Lightning illuminates the sky."],
        ["trueno", null, "thunder", "A loud rumbling sound in the sky.", "Noun", "Masculine", "/ˈtɾwe.no/", "El trueno retumba.", "The thunder rumbles."],
        ["granizo", null, "hail", "Pellets of frozen rain falling from the sky.", "Noun", "Masculine", "/ɡɾa.ˈni.θo/", "El granizo cae.", "The hail falls."],
        ["chaparrón", null, "shower", "A brief fall of rain.", "Noun", "Masculine", "/tʃa.pa.ˈron/", "Llega un chaparrón.", "A shower is coming."],
        ["soleado", null, "sunny", "Bright with sunlight.", "Adjective", null, "/so.le.ˈa.ðo/", "El cielo está soleado.", "The sky is sunny."],
        ["nublado", null, "cloudy", "Covered with clouds.", "Adjective", null, "/nu.ˈbla.ðo/", "El cielo está nublado.", "The sky is cloudy."],
        ["lluvioso", null, "rainy", "Characterized by rainfall.", "Adjective", null, "/ʝu.ˈβjo.so/", "El tiempo es lluvioso.", "The weather is rainy."],
        ["ventoso", null, "windy", "With strong winds.", "Adjective", null, "/ben.ˈto.so/", "El día está ventoso.", "The day is windy."],
        ["brumoso", null, "foggy", "Thick with fog.", "Adjective", null, "/bɾu.ˈmo.so/", "La mañana es brumosa.", "The morning is foggy."],
        ["glacial", null, "freezing", "Extremely cold.", "Adjective", null, "/ɡla.ˈθjal/", "El viento es glacial.", "The wind is freezing."],
        ["suave", null, "mild", "Moderately warm.", "Adjective", null, "/ˈswa.βe/", "El clima es suave.", "The climate is mild."],
        ["húmedo", null, "humid", "Containing moisture.", "Adjective", null, "/ˈu.me.ðo/", "El aire está húmedo.", "The air is humid."],
        ["seco", null, "dry", "Free from moisture.", "Adjective", null, "/ˈse.ko/", "El tiempo está seco.", "The weather is dry."],
        ["tormentoso", null, "stormy", "Characterized by storms.", "Adjective", null, "/toɾ.men.ˈto.so/", "El cielo está tormentoso.", "The sky is stormy."],
        ["frío", null, "cold", "Of or at a low temperature.", "Adjective", null, "/ˈfɾi.o/", "La mañana es fría.", "The morning is cold."],
        ["caluroso", null, "hot", "Having a high temperature.", "Adjective", null, "/ka.lu.ˈɾo.so/", "El verano es caluroso.", "Summer is hot."],
        ["fresco", null, "cool", "Moderately cold.", "Adjective", null, "/ˈfɾes.ko/", "La noche es fresca.", "The evening is cool."],
        ["helado", null, "frozen", "Turned into ice.", "Adjective", null, "/e.ˈla.ðo/", "El lago está helado.", "The lake is frozen."],
        ["helar", null, "to freeze", "To turn into ice.", "Verb", null, "/e.ˈlaɾ/", "El agua va a helar.", "The water will freeze."],
        ["llover", null, "to rain", "To fall as rain.", "Verb", null, "/ʝo.ˈβeɾ/", "Va a llover.", "It is going to rain."],
        ["nevar", null, "to snow", "To fall as snow.", "Verb", null, "/ne.ˈβaɾ/", "Va a nevar esta noche.", "It will snow tonight."],
        ["soplar", null, "to blow", "To move air.", "Verb", null, "/so.ˈplaɾ/", "El viento empieza a soplar.", "The wind starts blowing."],
        ["brillar", null, "to shine", "To give out bright light.", "Verb", null, "/bɾi.ˈʝaɾ/", "El sol va a brillar.", "The sun will shine."],
        ["granizar", null, "to hail", "To fall as hail.", "Verb", null, "/ɡɾa.ni.ˈθaɾ/", "Empieza a granizar.", "It starts to hail."],
        ["tronar", null, "to thunder", "To make a loud noise in the sky.", "Verb", null, "/tɾo.ˈnaɾ/", "Va a tronar.", "It is going to thunder."],
        ["relampaguear", null, "to flash lightning", "To emit flashes of lightning.", "Verb", null, "/re.lam.pa.ɣe.ˈaɾ/", "Empieza a relampaguear.", "It starts lightning."],
        ["derretirse", null, "to melt", "To become liquid by heat.", "Verb", null, "/de.re.ˈtiɾ.se/", "La nieve va a derretirse.", "The snow will melt."],
        ["oscurecer", null, "to get dark", "To become dark.", "Verb", null, "/os.ku.ɾe.ˈθeɾ/", "Va a oscurecer pronto.", "It will get dark soon."],
        ["aclarar", null, "to clear up", "To become brighter.", "Verb", null, "/a.kla.ˈɾaɾ/", "El cielo va a aclarar.", "The sky is going to clear up."],
      ],
      Numbers: [
        ["cero", null, "zero", "The number 0.", "Numeral", null, "/ˈθe.ɾo/", "Cero es un número.", "Zero is a number."],
        ["uno", null, "one", "The number 1.", "Numeral", null, "/ˈu.no/", "Tengo un libro.", "I have one book."],
        ["dos", null, "two", "The number 2.", "Numeral", null, "/dos/", "Dos niños juegan.", "Two children play."],
        ["tres", null, "three", "The number 3.", "Numeral", null, "/tɾes/", "Tres gatos duermen.", "Three cats sleep."],
        ["cuatro", null, "four", "The number 4.", "Numeral", null, "/ˈkwa.tɾo/", "Cuatro estaciones.", "Four seasons."],
        ["cinco", null, "five", "The number 5.", "Numeral", null, "/ˈθiŋ.ko/", "Cinco minutos.", "Five minutes."],
        ["seis", null, "six", "The number 6.", "Numeral", null, "/sejs/", "Seis horas.", "Six hours."],
        ["siete", null, "seven", "The number 7.", "Numeral", null, "/ˈsje.te/", "Siete días.", "Seven days."],
        ["ocho", null, "eight", "The number 8.", "Numeral", null, "/ˈo.tʃo/", "Ocho personas.", "Eight people."],
        ["nueve", null, "nine", "The number 9.", "Numeral", null, "/ˈnwe.βe/", "Nueve meses.", "Nine months."],
        ["diez", null, "ten", "The number 10.", "Numeral", null, "/djeθ/", "Diez euros.", "Ten euros."],
        ["once", null, "eleven", "The number 11.", "Numeral", null, "/ˈon.θe/", "Once jugadores.", "Eleven players."],
        ["doce", null, "twelve", "The number 12.", "Numeral", null, "/ˈdo.θe/", "Doce meses.", "Twelve months."],
        ["quince", null, "fifteen", "The number 15.", "Numeral", null, "/ˈkin.θe/", "Quince minutos.", "Fifteen minutes."],
        ["veinte", null, "twenty", "The number 20.", "Numeral", null, "/ˈbein.te/", "Veinte estudiantes.", "Twenty students."],
        ["treinta", null, "thirty", "The number 30.", "Numeral", null, "/ˈtɾejn.ta/", "Treinta días.", "Thirty days."],
        ["cuarenta", null, "forty", "The number 40.", "Numeral", null, "/kwa.ˈɾen.ta/", "Cuarenta años.", "Forty years."],
        ["cincuenta", null, "fifty", "The number 50.", "Numeral", null, "/θiŋ.ˈkwen.ta/", "Cincuenta euros.", "Fifty euros."],
        ["sesenta", null, "sixty", "The number 60.", "Numeral", null, "/se.ˈsen.ta/", "Sesenta segundos.", "Sixty seconds."],
        ["cien", null, "hundred", "The number 100.", "Numeral", null, "/θjen/", "Cien años.", "A hundred years."],
        ["mil", null, "thousand", "The number 1000.", "Numeral", null, "/mil/", "Mil gracias.", "A thousand thanks."],
        ["millón", null, "million", "One thousand thousands.", "Numeral", null, "/mi.ˈʝon/", "Un millón es grande.", "A million is large."],
        ["mil millones", null, "billion", "One thousand millions.", "Numeral", null, "/mil mi.ˈʝo.nes/", "Mil millones de estrellas.", "A billion stars."],
        ["número", null, "number", "An arithmetical value.", "Noun", "Masculine", "/ˈnu.me.ɾo/", "El número es correcto.", "The number is correct."],
        ["cifra", null, "digit", "A single numeral.", "Noun", "Feminine", "/ˈθi.fɾa/", "Esta cifra es importante.", "This digit is important."],
        ["mitad", null, "half", "One of two equal parts.", "Noun", "Feminine", "/mi.ˈtað/", "La mitad es suficiente.", "Half is enough."],
        ["tercio", null, "third", "One of three equal parts.", "Noun", "Masculine", "/ˈteɾ.θjo/", "Un tercio de los alumnos.", "A third of the students."],
        ["cuarto", null, "quarter", "One of four equal parts.", "Noun", "Masculine", "/ˈkwaɾ.to/", "Queda un cuarto.", "A quarter remains."],
        ["porcentaje", null, "percentage", "A rate per hundred.", "Noun", "Masculine", "/poɾ.θen.ˈta.xe/", "El porcentaje aumenta.", "The percentage increases."],
        ["suma", null, "sum", "A total amount.", "Noun", "Feminine", "/ˈsu.ma/", "La suma es correcta.", "The sum is correct."],
        ["total", null, "total", "The whole amount.", "Noun", "Masculine", "/to.ˈtal/", "El total es veinte.", "The total is twenty."],
        ["suma", null, "addition", "A mathematical sum.", "Noun", "Feminine", "/ˈsu.ma/", "La suma es fácil.", "The addition is easy."],
        ["resta", null, "subtraction", "The process of taking one number from another.", "Noun", "Feminine", "/ˈres.ta/", "La resta es fácil.", "Subtraction is easy."],
        ["multiplicación", null, "multiplication", "The process of multiplying numbers.", "Noun", "Feminine", "/mul.ti.pli.ka.ˈθjon/", "La multiplicación es útil.", "Multiplication is useful."],
        ["división", null, "division", "The process of dividing numbers.", "Noun", "Feminine", "/di.βi.ˈsjon/", "La división es difícil.", "Division is difficult."],
        ["fracción", null, "fraction", "A numerical quantity that is not whole.", "Noun", "Feminine", "/fɾak.ˈθjon/", "La fracción es sencilla.", "The fraction is simple."],
        ["decimal", null, "decimal", "Relating to a base-10 system.", "Adjective", null, "/de.θi.ˈmal/", "Es un número decimal.", "It is a decimal number."],
        ["entero", null, "whole", "Not a fraction.", "Adjective", null, "/en.ˈte.ɾo/", "Es un número entero.", "It is a whole number."],
        ["par", null, "even", "Divisible by two.", "Adjective", null, "/paɾ/", "Ocho es un número par.", "Eight is an even number."],
        ["impar", null, "odd", "Not divisible by two.", "Adjective", null, "/im.ˈpaɾ/", "Siete es un número impar.", "Seven is an odd number."],
        ["positivo", null, "positive", "Greater than zero.", "Adjective", null, "/po.si.ˈti.βo/", "El resultado es positivo.", "The result is positive."],
        ["negativo", null, "negative", "Less than zero.", "Adjective", null, "/ne.ɣa.ˈti.βo/", "El número es negativo.", "The number is negative."],
        ["igual", null, "equal", "Being the same in quantity.", "Adjective", null, "/i.ˈɣwal/", "Los dos números son iguales.", "The two numbers are equal."],
        ["diferente", null, "different", "Not the same as another.", "Adjective", null, "/di.fe.ˈɾen.te/", "Las cifras son diferentes.", "The digits are different."],
        ["grande", null, "large", "Of considerable size.", "Adjective", null, "/ˈɡɾan.de/", "El número es grande.", "The number is large."],
        ["pequeño", null, "small", "Of a size that is less than normal.", "Adjective", null, "/pe.ˈke.ɲo/", "La cifra es pequeña.", "The digit is small."],
        ["primero", null, "first", "Coming before all others.", "Adjective", null, "/pɾi.ˈme.ɾo/", "Es mi primera opción.", "It is my first choice."],
        ["último", null, "last", "Coming after all others.", "Adjective", null, "/ˈul.ti.mo/", "Es el último número.", "It is the last number."],
        ["contar", null, "to count", "To determine the number of.", "Verb", null, "/kon.ˈtaɾ/", "Los niños aprenden a contar.", "The children learn to count."],
        ["calcular", null, "to calculate", "To compute a result.", "Verb", null, "/kal.ku.ˈlaɾ/", "Voy a calcular el total.", "I will calculate the total."],
        ["sumar", null, "to add", "To combine numbers.", "Verb", null, "/su.ˈmaɾ/", "Los alumnos aprenden a sumar.", "The students learn to add."],
        ["restar", null, "to subtract", "To take away from a number.", "Verb", null, "/res.ˈtaɾ/", "Hay que restar cinco.", "You need to subtract five."],
        ["multiplicar", null, "to multiply", "To increase by a factor.", "Verb", null, "/mul.ti.pli.ˈkaɾ/", "Hay que multiplicar por dos.", "You must multiply by two."],
        ["dividir", null, "to divide", "To separate into parts.", "Verb", null, "/di.βi.ˈðiɾ/", "Debemos dividir el número.", "We must divide the number."],
        ["doblar", null, "to double", "To multiply by two.", "Verb", null, "/do.ˈβlaɾ/", "Vamos a doblar la cantidad.", "We will double the quantity."],
        ["medir", null, "to measure", "To determine the size or amount of.", "Verb", null, "/me.ˈðiɾ/", "Mide la longitud.", "Measure the length."],
        ["estimar", null, "to estimate", "To approximate.", "Verb", null, "/es.ti.ˈmaɾ/", "Podemos estimar la cantidad.", "We can estimate the quantity."],
        ["redondear", null, "to round", "To make a number simpler.", "Verb", null, "/re.don.de.ˈaɾ/", "Redondea la cifra.", "Round the number."],
      ],
      Time: [
        ["tiempo", null, "time", "The indefinite continued progress of existence.", "Noun", "Masculine", "/ˈtjem.po/", "El tiempo pasa rápido.", "Time passes quickly."],
        ["segundo", null, "second", "A period of one sixtieth of a minute.", "Noun", "Masculine", "/se.ˈɣun.do/", "Un segundo es suficiente.", "One second is enough."],
        ["minuto", null, "minute", "A period of 60 seconds.", "Noun", "Masculine", "/mi.ˈnu.to/", "Espera un minuto.", "Wait a minute."],
        ["hora", null, "hour", "A period of 60 minutes.", "Noun", "Feminine", "/ˈo.ɾa/", "¿Qué hora es?", "What time is it?"],
        ["día", null, "day", "A period of 24 hours.", "Noun", "Masculine", "/ˈdi.a/", "Buenos días.", "Good morning."],
        ["mañana", null, "morning", "The period from sunrise to noon.", "Noun", "Feminine", "/ma.ˈɲa.na/", "La mañana es fresca.", "The morning is cool."],
        ["mediodía", null, "noon", "Twelve o'clock in the day.", "Noun", "Masculine", "/me.ðjo.ˈdi.a/", "Es mediodía.", "It is noon."],
        ["tarde", null, "afternoon", "The time from noon to evening.", "Noun", "Feminine", "/ˈtaɾ.ðe/", "La tarde es tranquila.", "The afternoon is calm."],
        ["noche", null, "night", "The period of darkness between sunset and sunrise.", "Noun", "Feminine", "/ˈno.tʃe/", "Buenas noches.", "Good night."],
        ["medianoche", null, "midnight", "Twelve o'clock at night.", "Noun", "Feminine", "/me.ðja.ˈno.tʃe/", "Es medianoche.", "It is midnight."],
        ["amanecer", null, "dawn", "The first appearance of light in the morning.", "Noun", "Masculine", "/a.ma.ne.ˈθeɾ/", "El amanecer es hermoso.", "Dawn is beautiful."],
        ["atardecer", null, "dusk", "The time just before nightfall.", "Noun", "Masculine", "/a.taɾ.ðe.ˈθeɾ/", "El atardecer es bonito.", "Dusk is beautiful."],
        ["semana", null, "week", "A period of seven days.", "Noun", "Feminine", "/se.ˈma.na/", "La semana empieza el lunes.", "The week begins Monday."],
        ["fin de semana", null, "weekend", "Saturday and Sunday.", "Noun", "Masculine", "/fin ðe se.ˈma.na/", "¡Buen fin de semana!", "Have a good weekend!"],
        ["mes", null, "month", "A period of about 30 days.", "Noun", "Masculine", "/mes/", "El mes pasa rápido.", "The month passes quickly."],
        ["año", null, "year", "A period of 365 days.", "Noun", "Masculine", "/ˈa.ɲo/", "¡Feliz año nuevo!", "Happy New Year!"],
        ["década", null, "decade", "A period of ten years.", "Noun", "Feminine", "/ˈde.ka.ða/", "Pasa una década.", "A decade passes."],
        ["siglo", null, "century", "A period of 100 years.", "Noun", "Masculine", "/ˈsi.ɣlo/", "Un siglo son cien años.", "A century is a hundred years."],
        ["milenio", null, "millennium", "A period of 1000 years.", "Noun", "Masculine", "/mi.ˈle.njo/", "Un milenio es largo.", "A millennium is long."],
        ["ayer", null, "yesterday", "The day before today.", "Adverb", null, "/a.ˈʝeɾ/", "Lo vi ayer.", "I saw him yesterday."],
        ["hoy", null, "today", "On this present day.", "Adverb", null, "/oj/", "Trabajamos hoy.", "We are working today."],
        ["mañana", null, "tomorrow", "The day after today.", "Adverb", null, "/ma.ˈɲa.na/", "Saldremos mañana.", "We will leave tomorrow."],
        ["pasado mañana", null, "day after tomorrow", "Two days from now.", "Adverb", null, "/pa.ˈsa.ðo ma.ˈɲa.na/", "Hasta pasado mañana.", "See you the day after tomorrow."],
        ["anteayer", null, "day before yesterday", "Two days ago.", "Adverb", null, "/an.te.a.ˈʝeɾ/", "Se fue anteayer.", "He left the day before yesterday."],
        ["ahora", null, "now", "At the present time.", "Adverb", null, "/a.ˈo.ɾa/", "Me voy ahora.", "I am leaving now."],
        ["pronto", null, "soon", "In a short time.", "Adverb", null, "/ˈpɾon.to/", "Llegaremos pronto.", "We will arrive soon."],
        ["temprano", null, "early", "Before the expected time.", "Adverb", null, "/tem.ˈpɾa.no/", "Me levanto temprano.", "I get up early."],
        ["tarde", null, "late", "After the expected time.", "Adverb", null, "/ˈtaɾ.ðe/", "Llega tarde.", "He comes home late."],
        ["siempre", null, "always", "At all times.", "Adverb", null, "/ˈsjem.pɾe/", "Siempre está aquí.", "She is always here."],
        ["a menudo", null, "often", "Frequently.", "Adverb", null, "/a me.ˈnu.ðo/", "Viene a menudo.", "He comes often."],
        ["a veces", null, "sometimes", "Occasionally.", "Adverb", null, "/a ˈβe.θes/", "Viajo a veces.", "I travel sometimes."],
        ["raramente", null, "rarely", "Not often.", "Adverb", null, "/ra.ɾa.ˈmen.te/", "Sale raramente.", "She rarely goes out."],
        ["nunca", null, "never", "At no time.", "Adverb", null, "/ˈnuŋ.ka/", "Nunca fumo.", "I never smoke."],
        ["ya", null, "already", "Before now.", "Adverb", null, "/ʝa/", "Ya se fue.", "He has already left."],
        ["todavía", null, "still", "Up to and including the present.", "Adverb", null, "/to.ða.ˈβi.a/", "Todavía está aquí.", "He is still here."],
        ["durante", null, "during", "Throughout the course of.", "Preposition", null, "/du.ˈɾan.te/", "Durante el verano hace calor.", "During summer it is hot."],
        ["desde", null, "since / for", "From a past time until now.", "Preposition", null, "/ˈdes.ðe/", "Trabajo desde hace una hora.", "I've been working for an hour."],
        ["antes", null, "before", "During the period preceding.", "Preposition", null, "/ˈan.tes/", "Antes del mediodía.", "Before noon."],
        ["después", null, "after", "During the period following.", "Preposition", null, "/des.ˈpwes/", "Después de comer.", "After the meal."],
        ["calendario", null, "calendar", "A chart showing days and months.", "Noun", "Masculine", "/ka.len.ˈda.ɾjo/", "El calendario está actualizado.", "The calendar is up to date."],
        ["reloj", null, "clock", "An instrument for measuring time.", "Noun", "Masculine", "/re.ˈlo.x/", "El reloj marca mediodía.", "The clock shows noon."],
        ["cronómetro", null, "stopwatch", "A watch used for timing events.", "Noun", "Masculine", "/kɾo.ˈno.me.tɾo/", "El cronómetro corre.", "The stopwatch is running."],
        ["cita", null, "appointment", "An arrangement to meet at a particular time.", "Noun", "Feminine", "/ˈθi.ta/", "Tengo una cita a las tres.", "I have an appointment at three."],
        ["plazo", null, "deadline", "The latest time by which something must be done.", "Noun", "Masculine", "/ˈpla.θo/", "El plazo es corto.", "The deadline is short."],
        ["duración", null, "duration", "The time during which something continues.", "Noun", "Feminine", "/du.ɾa.ˈθjon/", "La duración es corta.", "The duration is short."],
        ["momento", null, "moment", "A brief period of time.", "Noun", "Masculine", "/mo.ˈmen.to/", "Espera un momento.", "Wait a moment."],
        ["instante", null, "instant", "An extremely brief period of time.", "Noun", "Masculine", "/ins.ˈtan.te/", "Un instante, por favor.", "One moment, please."],
        ["época", null, "era", "A particular period of history.", "Noun", "Feminine", "/ˈe.po.ka/", "En esa época, todo era tranquilo.", "In that era, everything was calm."],
        ["pasado", null, "past", "The time before now.", "Noun", "Masculine", "/pa.ˈsa.ðo/", "El pasado sigue importante.", "The past remains important."],
        ["presente", null, "present", "The current moment.", "Noun", "Masculine", "/pɾe.ˈsen.te/", "El presente importa.", "The present matters."],
        ["porvenir", null, "future", "The time yet to come.", "Noun", "Masculine", "/poɾ.βe.ˈniɾ/", "El porvenir es incierto.", "The future is uncertain."],
        ["futuro", null, "future", "The time yet to come.", "Noun", "Masculine", "/fu.ˈtu.ɾo/", "El futuro nos pertenece.", "The future belongs to us."],
        ["empezar", null, "to begin", "To start.", "Verb", null, "/em.pe.ˈθaɾ/", "La película va a empezar.", "The movie will begin."],
        ["terminar", null, "to finish", "To come to an end.", "Verb", null, "/teɾ.mi.ˈnaɾ/", "La clase va a terminar.", "The class will finish."],
        ["esperar", null, "to wait", "To stay in place until something happens.", "Verb", null, "/es.pe.ˈɾaɾ/", "Voy a esperar una hora.", "I will wait for an hour."],
        ["durar", null, "to last", "To continue for a period.", "Verb", null, "/du.ˈɾaɾ/", "El viaje va a durar tres horas.", "The trip will last three hours."],
        ["tardar", null, "to take (time)", "To require a period of time.", "Verb", null, "/taɾ.ˈðaɾ/", "Tarda mucho en llegar.", "It takes a long time to arrive."],
        ["pasar", null, "to pass", "To go by (of time).", "Verb", null, "/pa.ˈsaɾ/", "El tiempo pasa rápido.", "Time passes quickly."],
        ["retrasar", null, "to delay", "To make late.", "Verb", null, "/re.tɾa.ˈsaɾ/", "La lluvia puede retrasar la salida.", "The rain can delay the departure."],
        ["adelantar", null, "to move forward", "To progress.", "Verb", null, "/a.ðe.lan.ˈtaɾ/", "El reloj adelanta.", "The clock moves forward."],
        ["posponer", null, "to postpone", "To move to a later time.", "Verb", null, "/pos.po.ˈneɾ/", "Hay que posponer la reunión.", "We need to postpone the meeting."],
        ["planificar", null, "to schedule", "To arrange according to a plan.", "Verb", null, "/pla.ni.fi.ˈkaɾ/", "Voy a planificar mi semana.", "I will plan my week."],
        ["apurarse", null, "to hurry", "To move or act quickly.", "Verb", null, "/a.pu.ˈɾaɾ.se/", "¡Apúrate!", "Hurry up!"],
      ],
      Colors: [
        ["color", null, "color", "The property of reflecting light.", "Noun", "Masculine", "/ko.ˈloɾ/", "Este color es precioso.", "This color is beautiful."],
        ["rojo", null, "red", "The colour of blood.", "Adjective", null, "/ˈro.xo/", "Una manzana roja.", "A red apple."],
        ["azul", null, "blue", "The colour of a clear sky.", "Adjective", null, "/a.ˈθul/", "El cielo está azul.", "The sky is blue."],
        ["verde", null, "green", "The colour of grass.", "Adjective", null, "/ˈbeɾ.ðe/", "La hierba es verde.", "The grass is green."],
        ["amarillo", null, "yellow", "The colour of a ripe lemon.", "Adjective", null, "/a.ma.ˈɾi.ʝo/", "El sol es amarillo.", "The sun is yellow."],
        ["negro", null, "black", "The darkest colour.", "Adjective", null, "/ˈne.ɣɾo/", "Un gato negro.", "A black cat."],
        ["blanco", null, "white", "The colour of snow.", "Adjective", null, "/ˈblaŋ.ko/", "La nieve es blanca.", "The snow is white."],
        ["naranja", null, "orange", "A colour between red and yellow.", "Adjective", null, "/na.ˈɾan.xa/", "La flor es naranja.", "The flower is orange."],
        ["violeta", null, "violet", "A bluish-purple colour.", "Adjective", null, "/bjo.ˈle.ta/", "El cielo es violeta.", "The sky is violet."],
        ["morado", null, "purple", "A colour between red and blue.", "Adjective", null, "/mo.ˈɾa.ðo/", "El morado es mi color favorito.", "Purple is my favorite color."],
        ["rosa", null, "pink", "A pale red colour.", "Adjective", null, "/ˈro.sa/", "La flor es rosa.", "The flower is pink."],
        ["marrón", null, "brown", "The colour of chocolate.", "Adjective", null, "/ma.ˈron/", "El bolso es marrón.", "The bag is brown."],
        ["gris", null, "gray", "A colour between black and white.", "Adjective", null, "/ɡɾis/", "El cielo está gris.", "The sky is gray."],
        ["beige", null, "beige", "A pale sandy colour.", "Adjective", null, "/ˈbej.xe/", "El sofá es beige.", "The sofa is beige."],
        ["turquesa", null, "turquoise", "A bright blue-green colour.", "Adjective", null, "/tuɾ.ˈke.sa/", "El mar es turquesa.", "The sea is turquoise."],
        ["dorado", null, "golden", "Coloured like gold.", "Adjective", null, "/do.ˈɾa.ðo/", "El sol es dorado.", "The sun is golden."],
        ["plateado", null, "silver", "Coloured like silver.", "Adjective", null, "/pla.te.ˈa.ðo/", "El metal es plateado.", "The metal is silver."],
        ["púrpura", null, "crimson", "A rich deep red colour.", "Adjective", null, "/ˈpuɾ.pu.ɾa/", "La cortina es púrpura.", "The curtain is crimson."],
        ["escarlata", null, "scarlet", "A brilliant red colour.", "Adjective", null, "/es.kaɾ.ˈla.ta/", "El vestido es escarlata.", "The dress is scarlet."],
        ["granate", null, "burgundy", "A dark red colour.", "Adjective", null, "/ɡɾa.ˈna.te/", "El vino es granate.", "The wine is burgundy."],
        ["marfil", null, "ivory", "A creamy white colour.", "Adjective", null, "/maɾ.ˈfil/", "El piano es marfil.", "The piano is ivory."],
        ["índigo", null, "indigo", "A deep blue-violet colour.", "Adjective", null, "/ˈin.di.ɣo/", "El cielo es índigo.", "The sky is indigo."],
        ["ocre", null, "ochre", "An earthy yellow-brown colour.", "Adjective", null, "/ˈo.kɾe/", "La tierra es ocre.", "The earth is ochre."],
        ["pálido", null, "pale", "Light in colour.", "Adjective", null, "/ˈpa.li.ðo/", "El amarillo es pálido.", "The yellow is pale."],
        ["vivo", null, "bright", "Intense in colour.", "Adjective", null, "/ˈbi.βo/", "El rojo es vivo.", "The red is bright."],
        ["oscuro", null, "dark", "Deep in colour.", "Adjective", null, "/os.ˈku.ɾo/", "El verde es oscuro.", "The green is dark."],
        ["claro", null, "light", "Pale in colour.", "Adjective", null, "/ˈkla.ɾo/", "El azul claro es bonito.", "Light blue is pretty."],
        ["brillante", null, "shiny", "Reflecting light.", "Adjective", null, "/bɾi.ˈʝan.te/", "El rojo es brillante.", "The red is shiny."],
        ["mate", null, "matte", "Not shiny.", "Adjective", null, "/ˈma.te/", "La pintura es mate.", "The paint is matte."],
        ["transparente", null, "transparent", "Allowing light through.", "Adjective", null, "/tɾans.pa.ˈɾen.te/", "El vaso es transparente.", "The glass is transparent."],
        ["opaco", null, "opaque", "Not able to be seen through.", "Adjective", null, "/o.ˈpa.ko/", "La pared es opaca.", "The wall is opaque."],
        ["colorido", null, "colorful", "Having much or varied colour.", "Adjective", null, "/ko.lo.ˈɾi.ðo/", "El mercado es colorido.", "The market is colorful."],
        ["tono", null, "shade", "A particular variety of a colour.", "Noun", "Masculine", "/ˈto.no/", "El tono es suave.", "The shade is soft."],
        ["matiz", null, "nuance", "A subtle difference in colour.", "Noun", "Masculine", "/ma.ˈtiθ/", "El matiz es sutil.", "The nuance is subtle."],
        ["pigmento", null, "pigment", "A substance that gives colour.", "Noun", "Masculine", "/piɣ.ˈmen.to/", "El pigmento es natural.", "The pigment is natural."],
        ["pintura", null, "paint", "A coloured substance applied to a surface.", "Noun", "Feminine", "/pin.ˈtu.ɾa/", "La pintura está fresca.", "The paint is fresh."],
        ["pincel", null, "brush", "A tool with bristles for painting.", "Noun", "Masculine", "/pin.ˈθel/", "El pincel es fino.", "The brush is fine."],
        ["paleta", null, "palette", "A range of colours used by an artist.", "Noun", "Feminine", "/pa.ˈle.ta/", "La paleta tiene muchos colores.", "The palette has many colors."],
        ["arcoíris", null, "rainbow", "An arch of colours in the sky.", "Noun", "Masculine", "/aɾ.ko.ˈi.ɾis/", "El arcoíris tiene siete colores.", "The rainbow has seven colors."],
        ["prisma", null, "prism", "A glass shape that splits light into colours.", "Noun", "Masculine", "/ˈpɾis.ma/", "El prisma descompone la luz.", "The prism splits the light."],
        ["colorear", null, "to color", "To add colour to.", "Verb", null, "/ko.lo.ɾe.ˈaɾ/", "A los niños les gusta colorear.", "The children like to color."],
        ["pintar", null, "to paint", "To apply paint.", "Verb", null, "/pin.ˈtaɾ/", "Le gusta pintar las paredes.", "She likes to paint the walls."],
        ["teñir", null, "to dye", "To colour with dye.", "Verb", null, "/te.ˈɲiɾ/", "Quiere teñir su pelo.", "He wants to dye his hair."],
        ["dibujar", null, "to draw", "To produce a picture.", "Verb", null, "/di.βu.ˈxaɾ/", "Me gusta dibujar.", "I like to draw."],
        ["mezclar", null, "to mix", "To combine colours.", "Verb", null, "/meθ.ˈklaɾ/", "Vamos a mezclar los colores.", "We are going to mix the colors."],
        ["oscurecer", null, "to darken", "To make darker.", "Verb", null, "/os.ku.ɾe.ˈθeɾ/", "La lluvia oscurece el cielo.", "The rain darkens the sky."],
        ["aclarar", null, "to lighten", "To make lighter in colour.", "Verb", null, "/a.kla.ˈɾaɾ/", "El sol va a aclarar la pintura.", "The sun will lighten the paint."],
        ["brillar", null, "to shine", "To give out bright light.", "Verb", null, "/bɾi.ˈʝaɾ/", "Los colores brillan.", "The colors shine."],
        ["decorar", null, "to decorate", "To add ornament to.", "Verb", null, "/de.ko.ˈɾaɾ/", "Vamos a decorar la habitación.", "We are going to decorate the room."],
        ["combinar", null, "to match", "To be harmonious with.", "Verb", null, "/kom.bi.ˈnaɾ/", "Estos colores combinan bien.", "These colors match well."],
        ["contrastar", null, "to contrast", "To differ strikingly.", "Verb", null, "/kon.tɾas.ˈtaɾ/", "El rojo contrasta con el verde.", "Red contrasts with green."],
        ["parecerse", null, "to resemble", "To look like.", "Verb", null, "/pa.ɾe.ˈθeɾ.se/", "Estos tonos se parecen.", "These shades resemble each other."],
        ["distinguir", null, "to distinguish", "To recognize a difference.", "Verb", null, "/dis.tiŋ.ˈɡiɾ/", "Apenas distingo los colores.", "I can barely distinguish colors."],
        ["admirar", null, "to admire", "To regard with respect.", "Verb", null, "/að.mi.ˈɾaɾ/", "Admiro este color.", "I admire this color."],
        ["preferir", null, "to prefer", "To like better than another.", "Verb", null, "/pɾe.fe.ˈɾiɾ/", "Prefiero el azul.", "I prefer blue."],
        ["elegir", null, "to choose", "To pick from a range.", "Verb", null, "/e.le.ˈxiɾ/", "Elige un color.", "Choose a color."],
        ["gustar", null, "to like", "To find agreeable.", "Verb", null, "/ɡus.ˈtaɾ/", "Me gusta el rosa.", "I like pink."],
        ["odiar", null, "to hate", "To feel intense dislike.", "Verb", null, "/o.ˈðjaɾ/", "Odia el amarillo.", "He hates yellow."],
      ],
      Animals: [
        ["animal", null, "animal", "A living organism that feeds on organic matter.", "Noun", "Masculine", "/a.ni.ˈmal/", "El animal vive en el bosque.", "The animal lives in the forest."],
        ["perro", null, "dog", "A domesticated carnivorous mammal.", "Noun", "Masculine", "/ˈpe.ro/", "El perro ladra.", "The dog barks."],
        ["gato", null, "cat", "A small domesticated carnivorous mammal.", "Noun", "Masculine", "/ˈɡa.to/", "El gato duerme en el sofá.", "The cat sleeps on the sofa."],
        ["pájaro", null, "bird", "A feathered, egg-laying vertebrate.", "Noun", "Masculine", "/ˈpa.xa.ɾo/", "El pájaro canta.", "The bird sings."],
        ["caballo", null, "horse", "A solid-hoofed herbivorous mammal.", "Noun", "Masculine", "/ka.ˈβa.ʝo/", "El caballo galopa.", "The horse gallops."],
        ["vaca", null, "cow", "A fully grown female of cattle.", "Noun", "Feminine", "/ˈba.ka/", "La vaca come hierba.", "The cow eats grass."],
        ["toro", null, "bull", "An uncastrated male bovine.", "Noun", "Masculine", "/ˈto.ɾo/", "El toro es fuerte.", "The bull is strong."],
        ["oveja", null, "sheep", "A domesticated ruminant with a thick coat.", "Noun", "Feminine", "/o.ˈβe.xa/", "La oveja pasta.", "The sheep grazes."],
        ["cabra", null, "goat", "A hardy domesticated ruminant animal.", "Noun", "Feminine", "/ˈka.βɾa/", "La cabra trepa.", "The goat climbs."],
        ["cerdo", null, "pig", "An omnivorous domesticated hoofed mammal.", "Noun", "Masculine", "/ˈθeɾ.ðo/", "El cerdo se revuelca en el barro.", "The pig rolls in the mud."],
        ["gallina", null, "hen", "A female domestic fowl kept for eggs.", "Noun", "Feminine", "/ɡa.ˈʝi.na/", "La gallina pone huevos.", "The hen lays eggs."],
        ["gallo", null, "rooster", "An adult male chicken.", "Noun", "Masculine", "/ˈɡa.ʝo/", "El gallo canta por la mañana.", "The rooster crows in the morning."],
        ["pato", null, "duck", "A waterbird with a broad bill and short legs.", "Noun", "Masculine", "/ˈpa.to/", "El pato nada.", "The duck swims."],
        ["ganso", null, "goose", "A large waterbird with a long neck.", "Noun", "Masculine", "/ˈɡan.so/", "El ganso es ruidoso.", "The goose is noisy."],
        ["pavo", null, "turkey", "A large bird native to North America.", "Noun", "Masculine", "/ˈpa.βo/", "El pavo es tradicional.", "Turkey is traditional."],
        ["conejo", null, "rabbit", "A burrowing plant-eating mammal.", "Noun", "Masculine", "/ko.ˈne.xo/", "El conejo salta.", "The rabbit hops."],
        ["ratón", null, "mouse", "A small rodent with a pointed snout.", "Noun", "Masculine", "/ra.ˈton/", "El ratón corre rápido.", "The mouse runs fast."],
        ["rata", null, "rat", "A large rodent with a pointed snout.", "Noun", "Feminine", "/ˈra.ta/", "La rata vive en las alcantarillas.", "The rat lives in the sewers."],
        ["ardilla", null, "squirrel", "A bushy-tailed tree-dwelling rodent.", "Noun", "Feminine", "/aɾ.ˈði.ʝa/", "La ardilla sube al árbol.", "The squirrel climbs the tree."],
        ["erizo", null, "hedgehog", "A small mammal with protective spines.", "Noun", "Masculine", "/e.ˈɾi.θo/", "El erizo se hace una bola.", "The hedgehog rolls into a ball."],
        ["león", null, "lion", "A large tawny wild cat of Africa.", "Noun", "Masculine", "/le.ˈon/", "El león ruge.", "The lion roars."],
        ["tigre", null, "tiger", "A large Asian wild cat with a striped coat.", "Noun", "Masculine", "/ˈti.ɣɾe/", "El tigre caza.", "The tiger hunts."],
        ["leopardo", null, "leopard", "A large spotted wild cat.", "Noun", "Masculine", "/le.o.ˈpaɾ.ðo/", "El leopardo es rápido.", "The leopard is fast."],
        ["elefante", null, "elephant", "A very large plant-eating mammal with a trunk.", "Noun", "Masculine", "/e.le.ˈfan.te/", "El elefante es enorme.", "The elephant is huge."],
        ["jirafa", null, "giraffe", "A tall African mammal with a long neck.", "Noun", "Feminine", "/xi.ˈɾa.fa/", "La jirafa come hojas.", "The giraffe eats leaves."],
        ["mono", null, "monkey", "A small primate with a long tail.", "Noun", "Masculine", "/ˈmo.no/", "El mono trepa.", "The monkey climbs."],
        ["gorila", null, "gorilla", "A large powerful ape.", "Noun", "Masculine", "/ɡo.ˈɾi.la/", "El gorila es fuerte.", "The gorilla is strong."],
        ["oso", null, "bear", "A large heavy mammal with thick fur.", "Noun", "Masculine", "/ˈo.so/", "El oso duerme en invierno.", "The bear sleeps in winter."],
        ["lobo", null, "wolf", "A wild carnivorous mammal of the dog family.", "Noun", "Masculine", "/ˈlo.βo/", "El lobo aúlla.", "The wolf howls."],
        ["zorro", null, "fox", "A carnivorous mammal with a bushy tail.", "Noun", "Masculine", "/ˈθo.ro/", "El zorro es astuto.", "The fox is cunning."],
        ["ciervo", null, "deer", "A hoofed animal with antlers.", "Noun", "Masculine", "/ˈθjeɾ.βo/", "El ciervo corre rápido.", "The deer runs fast."],
        ["jabalí", null, "wild boar", "A wild pig with tusks.", "Noun", "Masculine", "/xa.βa.ˈli/", "El jabalí es feroz.", "The wild boar is fierce."],
        ["camello", null, "camel", "A large desert mammal with humps.", "Noun", "Masculine", "/ka.ˈme.ʝo/", "El camello camina por el desierto.", "The camel walks in the desert."],
        ["cebra", null, "zebra", "An African wild horse with black-and-white stripes.", "Noun", "Feminine", "/ˈθe.βɾa/", "La cebra corre.", "The zebra runs."],
        ["canguro", null, "kangaroo", "An Australian marsupial with powerful hind legs.", "Noun", "Masculine", "/kaŋ.ˈɡu.ɾo/", "El canguro salta.", "The kangaroo jumps."],
        ["panda", null, "panda", "A large black-and-white bear-like mammal.", "Noun", "Masculine", "/ˈpan.da/", "El panda come bambú.", "The panda eats bamboo."],
        ["abeja", null, "bee", "A flying insect that collects nectar.", "Noun", "Feminine", "/a.ˈβe.xa/", "La abeja zumba.", "The bee buzzes."],
        ["avispa", null, "wasp", "A stinging winged insect.", "Noun", "Feminine", "/a.ˈβis.pa/", "La avispa pica.", "The wasp stings."],
        ["mariposa", null, "butterfly", "An insect with large colourful wings.", "Noun", "Feminine", "/ma.ɾi.ˈpo.sa/", "La mariposa vuela.", "The butterfly flies."],
        ["libélula", null, "dragonfly", "A slender insect with transparent wings.", "Noun", "Feminine", "/li.ˈβe.lu.la/", "La libélula vuela rápido.", "The dragonfly flies fast."],
        ["hormiga", null, "ant", "A small insect that lives in colonies.", "Noun", "Feminine", "/oɾ.ˈmi.ɣa/", "La hormiga trabaja duro.", "The ant works hard."],
        ["araña", null, "spider", "An eight-legged arachnid that spins webs.", "Noun", "Feminine", "/a.ˈɾa.ɲa/", "La araña teje su tela.", "The spider spins its web."],
        ["mosca", null, "fly", "A small flying insect.", "Noun", "Feminine", "/ˈmos.ka/", "La mosca vuela.", "The fly flies."],
        ["mosquito", null, "mosquito", "A small flying insect that bites.", "Noun", "Masculine", "/mos.ˈki.to/", "El mosquito pica.", "The mosquito bites."],
        ["serpiente", null, "snake", "A long limbless reptile.", "Noun", "Feminine", "/seɾ.ˈpjen.te/", "La serpiente se arrastra.", "The snake slithers."],
        ["lagarto", null, "lizard", "A reptile with a long body and tail.", "Noun", "Masculine", "/la.ˈɣaɾ.to/", "El lagarto se calienta al sol.", "The lizard warms in the sun."],
        ["tortuga", null, "turtle", "A slow-moving reptile with a shell.", "Noun", "Feminine", "/toɾ.ˈtu.ɣa/", "La tortuga camina despacio.", "The turtle walks slowly."],
        ["cocodrilo", null, "crocodile", "A large predatory reptile with a long snout.", "Noun", "Masculine", "/ko.ko.ˈðɾi.lo/", "El cocodrilo espera a su presa.", "The crocodile waits for its prey."],
        ["rana", null, "frog", "A tailless amphibian that leaps.", "Noun", "Feminine", "/ˈra.na/", "La rana salta.", "The frog jumps."],
        ["pez", null, "fish", "A cold-blooded aquatic animal with gills.", "Noun", "Masculine", "/peθ/", "El pez nada.", "The fish swims."],
        ["tiburón", null, "shark", "A large predatory fish with sharp teeth.", "Noun", "Masculine", "/ti.βu.ˈɾon/", "El tiburón es peligroso.", "The shark is dangerous."],
        ["ballena", null, "whale", "A very large marine mammal.", "Noun", "Feminine", "/ba.ˈʝe.na/", "La ballena es enorme.", "The whale is huge."],
        ["delfín", null, "dolphin", "An intelligent aquatic mammal.", "Noun", "Masculine", "/del.ˈfin/", "El delfín salta.", "The dolphin jumps."],
        ["foca", null, "seal", "A fish-eating aquatic mammal with flippers.", "Noun", "Feminine", "/ˈfo.ka/", "La foca nada bien.", "The seal swims well."],
        ["salvaje", null, "wild", "Living in a natural state.", "Adjective", null, "/sal.ˈβa.xe/", "Este animal es salvaje.", "This animal is wild."],
        ["doméstico", null, "domestic", "Tamed and kept by humans.", "Adjective", null, "/do.ˈmes.ti.ko/", "El gato es doméstico.", "The cat is domestic."],
        ["feroz", null, "fierce", "Savage and aggressive.", "Adjective", null, "/fe.ˈɾoθ/", "El depredador es feroz.", "The predator is fierce."],
        ["venenoso", null, "venomous", "Producing venom.", "Adjective", null, "/be.ne.ˈno.so/", "Esta serpiente es venenosa.", "This snake is venomous."],
        ["ladrar", null, "to bark", "To make the sound of a dog.", "Verb", null, "/la.ˈðɾaɾ/", "Al perro le gusta ladrar.", "The dog likes to bark."],
        ["maullar", null, "to meow", "To make the sound of a cat.", "Verb", null, "/mau.ˈʝaɾ/", "El gato empieza a maullar.", "The cat starts to meow."],
        ["volar", null, "to fly", "To move through the air.", "Verb", null, "/bo.ˈlaɾ/", "El pájaro puede volar.", "The bird can fly."],
        ["nadar", null, "to swim", "To move through water.", "Verb", null, "/na.ˈðaɾ/", "Al delfín le gusta nadar.", "The dolphin likes to swim."],
        ["cazar", null, "to hunt", "To pursue and kill for food.", "Verb", null, "/ka.ˈθaɾ/", "El león va a cazar.", "The lion will hunt."],
        ["arrastrarse", null, "to crawl", "To move on the belly.", "Verb", null, "/a.ras.ˈtɾaɾ.se/", "La serpiente se arrastra.", "The snake slithers."],
        ["galopar", null, "to gallop", "To run fast like a horse.", "Verb", null, "/ɡa.lo.ˈpaɾ/", "El caballo galopa.", "The horse gallops."],
        ["saltar", null, "to jump", "To push oneself off the ground.", "Verb", null, "/sal.ˈtaɾ/", "El conejo salta.", "The rabbit hops."],
        ["morder", null, "to bite", "To use the teeth to cut into something.", "Verb", null, "/moɾ.ˈðeɾ/", "El perro puede morder.", "The dog can bite."],
        ["rugir", null, "to roar", "To make a deep, loud sound.", "Verb", null, "/ru.ˈxiɾ/", "El león ruge.", "The lion roars."],
        ["sisear", null, "to hiss", "To make a sharp sound.", "Verb", null, "/si.se.ˈaɾ/", "La serpiente sisea.", "The snake hisses."],
        ["poner", null, "to lay eggs", "To produce eggs.", "Verb", null, "/po.ˈneɾ/", "La gallina pone huevos.", "The hen lays eggs."],
        ["alimentar", null, "to feed", "To give food to.", "Verb", null, "/a.li.men.ˈtaɾ/", "Hay que alimentar al caballo.", "The horse needs to be fed."],
        ["criar", null, "to raise", "To bring up animals.", "Verb", null, "/kɾi.ˈaɾ/", "Crían gallinas.", "They raise chickens."],
        ["observar", null, "to observe", "To watch carefully.", "Verb", null, "/ob.seɾ.ˈβaɾ/", "Me gusta observar los pájaros.", "I like observing birds."],
        ["capturar", null, "to capture", "To catch an animal.", "Verb", null, "/kap.tu.ˈɾaɾ/", "Capturan a un león.", "They capture a lion."],
        ["proteger", null, "to protect", "To keep safe from harm.", "Verb", null, "/pɾo.te.ˈxeɾ/", "Debemos proteger a los animales.", "We must protect animals."],
        ["adoptar", null, "to adopt", "To take an animal into one's home.", "Verb", null, "/a.ðop.ˈtaɾ/", "Adoptó un gato.", "She adopted a cat."],
        ["acariciar", null, "to stroke", "To gently touch an animal.", "Verb", null, "/a.ka.ɾi.ˈθjaɾ/", "Acaricia al perro.", "He strokes the dog."],
        ["amaestrar", null, "to train", "To teach an animal skills.", "Verb", null, "/a.ma.es.ˈtɾaɾ/", "Amaestra a su perro.", "She trains her dog."],
      ],
    },
  };

  /* Expand RAW → flat array */
  function buildDictionary() {
    const out = [];
    for (const language of Object.keys(RAW)) {
      const byTopic = RAW[language];
      for (const topic of Object.keys(byTopic)) {
        for (const row of byTopic[topic]) {
          const [word, romaji, translation, definition, pos, gender, ipa, example, exampleEn] = row;
          out.push({
            word, romaji: romaji || null, translation, definition,
            pos, gender, ipa, example, exampleEn, language, topic,
          });
        }
      }
    }
    return out;
  }

  const SEED = buildDictionary();

  /* =======================================================================
     STATE
     ======================================================================= */
  const state = {
    settings: {
      languages: ["French"],
      topics: ["All Topics"],
      interval: "newtab",
      theme: "dark",
      lastWordChange: 0,
      currentWord: null,
      customVocab: [],
      goals: "",
      onboarded: false,
    },
    bank: [],
    favourites: [],
    dictionary: [...SEED],
    collapsed: false,
  };

  /* =======================================================================
     STORAGE
     ======================================================================= */
  const sGet = (keys) =>
    new Promise((res) => chrome.storage.local.get(keys, (r) => res(r || {})));
  const sSet = (o) =>
    new Promise((res) => chrome.storage.local.set(o, () => res()));

  async function loadState() {
    const r = await sGet([
      STORAGE.SETTINGS, STORAGE.BANK, STORAGE.FAVS, STORAGE.COLLAPSED,
    ]);
    if (r[STORAGE.SETTINGS]) state.settings = { ...state.settings, ...r[STORAGE.SETTINGS] };
    if (Array.isArray(r[STORAGE.BANK])) state.bank = r[STORAGE.BANK];
    if (Array.isArray(r[STORAGE.FAVS])) state.favourites = r[STORAGE.FAVS];
    state.collapsed = !!r[STORAGE.COLLAPSED];
  }
  const saveSettings = () => sSet({ [STORAGE.SETTINGS]: state.settings });
  const saveBank = () => sSet({ [STORAGE.BANK]: state.bank });
  const saveFavs = () => sSet({ [STORAGE.FAVS]: state.favourites });

  /* =======================================================================
     SETUP FLAG
     ======================================================================= */
  function isSetupComplete() {
    try { return localStorage.getItem(SETUP_FLAG) === "true"; }
    catch (e) { return false; }
  }
  function markSetupComplete() {
    try { localStorage.setItem(SETUP_FLAG, "true"); }
    catch (e) { console.warn("[OpenWord] Could not persist setup flag:", e); }
  }
  function clearSetupFlag() {
    try { localStorage.removeItem(SETUP_FLAG); }
    catch (e) { console.warn("[OpenWord] Could not clear setup flag:", e); }
  }

  /* =======================================================================
     DICTIONARY LOAD (self-contained now)
     ======================================================================= */
    async function loadDictionary() {
    const merged = new Map();
    SEED.forEach((e) => {
      if (!e?.word || !e?.language) return;
      merged.set(`${e.language}::${e.word}`, e);
    });
    (state.settings.customVocab || []).forEach((e) => {
      if (!e?.word || !e?.language) return;
      merged.set(`${e.language}::${e.word}`, e);
    });
    state.dictionary = [...merged.values()];
    console.log(`[OpenWord] Total dictionary size: ${state.dictionary.length} entries`);
  }

  /* =======================================================================
     STRICT FILTERING
     ======================================================================= */
  function buildActivePool() {
    const selectedLangs = state.settings.languages.length
      ? state.settings.languages
      : ["French"];

    const topicsFlagged = state.settings.topics || [];
    const useAllTopics =
      topicsFlagged.length === 0 || topicsFlagged.includes("All Topics");
    const selectedTopics = useAllTopics ? [...TOPICS] : [...topicsFlagged];

    const pool = state.dictionary.filter((w) => {
      if (!selectedLangs.includes(w.language)) return false;
      if (!selectedTopics.includes(w.topic)) return false;
      return true;
    });

    if (!pool.length) {
      const langOnly = state.dictionary.filter((w) =>
        selectedLangs.includes(w.language)
      );
      return langOnly.length ? langOnly : [...SEED];
    }
    return pool;
  }

  function pickWord() {
    const pool = buildActivePool();
    const filtered =
      pool.length > 1 && state.settings.currentWord
        ? pool.filter(
            (w) =>
              !(
                w.word === state.settings.currentWord.word &&
                w.language === state.settings.currentWord.language
              )
          )
        : pool;
    return filtered[Math.floor(Math.random() * filtered.length)] || pool[0];
  }

  function today() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }

  function recordWord(w) {
    if (!w) return;
    if (state.bank.some((b) => b.word === w.word && b.language === w.language)) return;
    state.bank.push({ ...w, dateEncountered: today() });
    if (state.bank.length > 5000) state.bank = state.bank.slice(-5000);
    saveBank();
  }

  function needsRefresh() {
    const iv = state.settings.interval;
    if (iv === "newtab") return false;
    const ms = { "1h": 3.6e6, "4h": 1.44e7, "24h": 8.64e7 }[iv] || 0;
    return Date.now() - (state.settings.lastWordChange || 0) >= ms;
  }

  async function setNewWord(force = false) {
    if (!force && state.settings.currentWord && !needsRefresh()) return;
    const w = pickWord();
    state.settings.currentWord = w;
    state.settings.lastWordChange = Date.now();
    await saveSettings();
    recordWord(w);
    renderWord(w);
    renderMiniList();
  }

  /* =======================================================================
     RENDER — word
     ======================================================================= */
  function renderWord(w) {
    if (!w) return;
    const $ = (id) => document.getElementById(id);

    $("ow-lang").textContent = w.language;
    $("ow-topic").textContent = w.topic;

    const posParts = [];
    if (w.pos) posParts.push(w.pos);
    if (w.gender) posParts.push(w.gender);
    $("ow-pos").textContent = posParts.join(" · ");
    $("ow-pos").style.display = posParts.length ? "" : "none";

    $("ow-word").textContent = w.word + (w.romaji ? ` (${w.romaji})` : "");
    $("ow-ipa").textContent = w.ipa || "";
    $("ow-ipa").style.display = w.ipa ? "" : "none";

    $("ow-def").textContent = w.definition || w.translation || "";
    $("ow-example").textContent = w.example ? `"${w.example}"` : "";
    $("ow-example").style.display = w.example ? "" : "none";
    $("ow-example-en").textContent = w.exampleEn ? `"${w.exampleEn}"` : "";
    $("ow-example-en").style.display = w.exampleEn ? "" : "none";

    const fav = state.favourites.some(
      (f) => f.word === w.word && f.language === w.language
    );
    const favBtn = $("ow-fav");
    favBtn.textContent = fav ? "★" : "☆";
    favBtn.classList.toggle("active", fav);

    const main = document.querySelector('[data-panel="main"]');
    if (main) {
      main.style.animation = "none";
      void main.offsetWidth;
      main.style.animation = "";
    }
  }

  /* =======================================================================
     PANELS
     ======================================================================= */
  function showPanel(name) {
    document.querySelectorAll(".ow-panel").forEach((p) => {
      p.classList.toggle("hidden", p.dataset.panel !== name);
    });
    document.querySelectorAll(".ow-footer-btn").forEach((b) => {
      const map = {
        "open-main": "main", "open-bank": "bank", "open-settings": "settings",
      };
      b.classList.toggle("active", map[b.dataset.action] === name);
    });
    if (name === "settings") renderSettings();
    if (name === "bank") renderBankList();
  }

  function forceOnboardingView() {
    document.querySelectorAll(".ow-panel").forEach((p) => p.classList.add("hidden"));
    const sidebar = document.getElementById("ow-sidebar");
    if (sidebar) {
      sidebar.classList.add("hidden");
      sidebar.classList.remove("collapsed");
    }
    const handle = document.getElementById("ow-handle");
    if (handle) handle.classList.add("hidden");
    const quiz = document.getElementById("ow-quiz");
    if (quiz) quiz.classList.add("hidden");
    const onboard = document.getElementById("ow-onboard");
    if (onboard) onboard.classList.remove("hidden");
    document.body.classList.add("ow-locked");
    obStep = 1;
    renderOnboardingChoices();
    updateOnboardStep();
  }

  function forceDashboardView() {
    const onboard = document.getElementById("ow-onboard");
    if (onboard) onboard.classList.add("hidden");
    document.body.classList.remove("ow-locked");
    const sidebar = document.getElementById("ow-sidebar");
    if (sidebar) sidebar.classList.remove("hidden");
  }

  /* =======================================================================
     MINI LIST
     ======================================================================= */
  function renderMiniList() {
    const wrap = document.getElementById("ow-mini-list");
    if (!wrap) return;
    wrap.innerHTML = "";
    const recent = [...state.bank]
      .sort((a, b) => (a.dateEncountered || "") < (b.dateEncountered || "") ? 1 : -1)
      .slice(0, 4);
    if (!recent.length) {
      wrap.innerHTML = `<p style="font-size:11px;opacity:0.5;text-align:center;padding:8px;">No words yet.</p>`;
      return;
    }
    recent.forEach((w) => {
      const el = document.createElement("div");
      el.className = "ow-mini-item";
      el.innerHTML = `<strong>${escapeHtml(w.word)}</strong><span>${escapeHtml(w.translation || "")}</span>`;
      el.addEventListener("click", () => {
        state.settings.currentWord = w;
        saveSettings();
        renderWord(w);
        showPanel("main");
      });
      wrap.appendChild(el);
    });
  }

  /* =======================================================================
     SETTINGS
     ======================================================================= */
  function renderSettings() {
    const sidebar = document.getElementById("ow-sidebar");
    if (!sidebar) return;

    sidebar.querySelectorAll(".ow-theme-swatch").forEach((sw) => {
      sw.classList.toggle("selected", sw.dataset.theme === state.settings.theme);
    });

    const langs = document.getElementById("ow-langs");
    if (langs) {
      langs.innerHTML = "";
      LANGUAGES.forEach((l) => {
        const c = document.createElement("span");
        c.className = "ow-chip" + (state.settings.languages.includes(l) ? " selected" : "");
        c.textContent = l;
        c.addEventListener("click", async () => {
          toggle(state.settings.languages, l);
          await saveSettings();
          renderSettings();
          await setNewWord(true);
        });
        langs.appendChild(c);
      });
    }

    const topics = document.getElementById("ow-topics");
    if (topics) {
      topics.innerHTML = "";
      ["All Topics", ...TOPICS].forEach((t) => {
        const c = document.createElement("span");
        c.className = "ow-chip" + (state.settings.topics.includes(t) ? " selected" : "");
        c.textContent = t;
        c.addEventListener("click", async () => {
          toggle(state.settings.topics, t);
          await saveSettings();
          renderSettings();
          await setNewWord(true);
        });
        topics.appendChild(c);
      });
    }

    const interval = document.getElementById("ow-interval");
    if (interval) interval.value = state.settings.interval;

    const custom = document.getElementById("ow-custom");
    if (custom)
      custom.value = (state.settings.customVocab || [])
        .map((c) => `${c.word} = ${c.translation}`)
        .join("\n");

    const goals = document.getElementById("ow-goals");
    if (goals) goals.value = state.settings.goals || "";
  }

  function toggle(arr, v) {
    const i = arr.indexOf(v);
    if (i >= 0) arr.splice(i, 1);
    else arr.push(v);
  }

  /* =======================================================================
     BANK LIST
     ======================================================================= */
  function renderBankList() {
    const list = document.getElementById("ow-bank-list");
    if (!list) return;
    const search = document.getElementById("ow-bank-search");
    const q = (search ? search.value : "").toLowerCase();
    list.innerHTML = "";

    const items = state.bank
      .filter(
        (w) =>
          !q ||
          (w.word || "").toLowerCase().includes(q) ||
          (w.translation || "").toLowerCase().includes(q)
      )
      .sort((a, b) => (a.dateEncountered || "") < (b.dateEncountered || "") ? 1 : -1)
      .slice(0, 300);

    if (!items.length) {
      list.innerHTML = `<p style="font-size:11px;opacity:0.5;text-align:center;padding:20px;">No words yet.</p>`;
      return;
    }
    items.forEach((w) => {
      const el = document.createElement("div");
      el.className = "ow-bank-item";
      el.innerHTML = `
        <h5>${escapeHtml(w.word)}${w.romaji ? ` · ${escapeHtml(w.romaji)}` : ""}</h5>
        <p>${escapeHtml(w.translation || "")} · ${escapeHtml(w.language || "")}${w.topic ? " · " + escapeHtml(w.topic) : ""}</p>
      `;
      el.addEventListener("click", () => {
        state.settings.currentWord = w;
        saveSettings();
        renderWord(w);
        showPanel("main");
      });
      list.appendChild(el);
    });
  }

  /* =======================================================================
     GOAL PARSER
     ======================================================================= */
  function parseGoals(text) {
    const t = (text || "").toLowerCase();
    const langs = [], topics = [];
    const langMap = {
      french: "French", français: "French",
      japanese: "Japanese", 日本語: "Japanese",
      spanish: "Spanish", español: "Spanish",
    };
    Object.keys(langMap).forEach((k) => t.includes(k) && langs.push(langMap[k]));

    const topicMap = {
      food: "Food", eat: "Food", cook: "Food", restaurant: "Food",
      school: "School", study: "School", exam: "School",
      health: "Health", medic: "Health", doctor: "Health",
      travel: "Travel", trip: "Travel", flight: "Travel",
      business: "Business", work: "Business", meeting: "Business",
      technolog: "Technology", computer: "Technology",
      sport: "Sports", music: "Music", nature: "Nature", emotion: "Emotions",
      famil: "Family", shop: "Shopping", weather: "Weather",
      number: "Numbers", time: "Time", color: "Colors", animal: "Animals",
    };
    Object.keys(topicMap).forEach((k) => t.includes(k) && topics.push(topicMap[k]));

    return {
      languages: [...new Set(langs)],
      topics: [...new Set(topics)],
    };
  }

  function deepDive(w) {
    if (!w) return;
    const q = `${w.word} ${w.language} ${w.pos || "dictionary"} meaning conjugation pronunciation etymology`;
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
  }

  function applyTheme(theme) {
    const sidebar = document.getElementById("ow-sidebar");
    if (sidebar) sidebar.dataset.theme = theme;
    document.body.dataset.owTheme = theme;
    state.settings.theme = theme;
    saveSettings();
    renderSettings();
  }

  /* =======================================================================
     COLLAPSE / EXPAND
     ======================================================================= */
  function setCollapsed(collapsed) {
    const sidebar = document.getElementById("ow-sidebar");
    const handle = document.getElementById("ow-handle");
    if (!sidebar || !handle) return;

    if (collapsed) {
      sidebar.classList.add("collapsed");
      setTimeout(() => {
        handle.classList.remove("hidden");
        handle.style.animation = "none";
        void handle.offsetWidth;
        handle.style.animation = "";
      }, 160);
    } else {
      handle.classList.add("hidden");
      sidebar.classList.remove("collapsed");
    }

    state.collapsed = collapsed;
    chrome.storage.local.set({ [STORAGE.COLLAPSED]: collapsed });
  }

  function wireHandle() {
    const handle = document.getElementById("ow-handle");
    if (!handle) return;
    handle.addEventListener("click", () => setCollapsed(false));
    handle.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setCollapsed(false);
      }
    });
  }

  /* =======================================================================
     ONBOARDING
     ======================================================================= */
  const OB_TOPICS = [...TOPICS, "All Topics"];
  let obStep = 1;

  function showOnboarding() { forceOnboardingView(); }

  function hideOnboarding() {
    const el = document.getElementById("ow-onboard");
    if (el) el.classList.add("hidden");
    document.body.classList.remove("ow-locked");
  }

  function renderOnboardingChoices() {
    const langWrap = document.getElementById("onboard-langs");
    if (langWrap && !langWrap.dataset.built) {
      langWrap.dataset.built = "1";
      LANGUAGES.forEach((l) => {
        const c = document.createElement("span");
        c.className = "ow-chip";
        c.textContent = l;
        c.addEventListener("click", () => c.classList.toggle("selected"));
        langWrap.appendChild(c);
      });
    }
    const topicWrap = document.getElementById("onboard-topics");
    if (topicWrap && !topicWrap.dataset.built) {
      topicWrap.dataset.built = "1";
      OB_TOPICS.forEach((t) => {
        const c = document.createElement("span");
        c.className = "ow-chip";
        c.textContent = t;
        c.addEventListener("click", () => c.classList.toggle("selected"));
        topicWrap.appendChild(c);
      });
    }
  }

  function updateOnboardStep() {
    document.querySelectorAll(".ow-onboard-step").forEach((s) => {
      s.classList.toggle("hidden", Number(s.dataset.step) !== obStep);
    });
    document.querySelectorAll(".ow-step-dot").forEach((d) => {
      const n = Number(d.dataset.step);
      d.classList.toggle("active", n === obStep);
      d.classList.toggle("completed", n < obStep);
    });
    const back = document.getElementById("onboard-back");
    const next = document.getElementById("onboard-next");
    const start = document.getElementById("onboard-start");
    if (back) back.classList.toggle("hidden", obStep === 1);
    if (next) next.classList.toggle("hidden", obStep === 3);
    if (start) start.classList.toggle("hidden", obStep !== 3);
  }

  async function finishOnboarding() {
    const langs = [...document.querySelectorAll("#onboard-langs .ow-chip.selected")]
      .map((c) => c.textContent);
    const topics = [...document.querySelectorAll("#onboard-topics .ow-chip.selected")]
      .map((c) => c.textContent);
    const intervalEl = document.getElementById("onboard-interval");
    const interval = intervalEl ? intervalEl.value : "newtab";

    state.settings.languages = langs.length ? langs : ["French"];
    state.settings.topics = topics.length ? topics : ["All Topics"];
    state.settings.interval = interval;
    state.settings.onboarded = true;
    state.settings.lastWordChange = 0;

    try { await saveSettings(); }
    catch (e) { console.warn("[OpenWord] saveSettings failed:", e); }

    markSetupComplete();

    const freshWord = pickWord();
    state.settings.currentWord = freshWord;
    state.settings.lastWordChange = Date.now();
    recordWord(freshWord);
    try { await saveSettings(); }
    catch (e) { console.warn("[OpenWord] save word failed:", e); }

    forceDashboardView();

    showPanel("main");
    renderWord(freshWord);
    renderMiniList();
    renderSettings();
    setCollapsed(false);

    const sidebar = document.getElementById("ow-sidebar");
    if (sidebar) {
      sidebar.classList.remove("hidden");
      sidebar.dataset.theme = state.settings.theme || "dark";
    }
    document.body.dataset.owTheme = state.settings.theme || "dark";
  }

  function wireOnboarding() {
    const next = document.getElementById("onboard-next");
    const back = document.getElementById("onboard-back");
    const start = document.getElementById("onboard-start");

    if (next) next.addEventListener("click", () => {
      if (obStep < 3) { obStep++; updateOnboardStep(); }
    });
    if (back) back.addEventListener("click", () => {
      if (obStep > 1) { obStep--; updateOnboardStep(); }
    });
    if (start) start.addEventListener("click", finishOnboarding);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.settings.onboarded) hideOnboarding();
    });
  }

  /* =======================================================================
     QUIZ
     ======================================================================= */
  const quizState = {
    questions: [], index: 0, correct: 0, answered: false, active: false,
  };

  function daysBetween(a, b) {
    const d1 = new Date(a + "T00:00:00");
    const d2 = new Date(b + "T00:00:00");
    return Math.round((d2 - d1) / 86400000);
  }

  function getBankDateRange() {
    if (!state.bank.length) return { minDays: 1, maxDays: 1 };
    const stamps = state.bank.map((w) => w.dateEncountered).filter(Boolean).sort();
    if (!stamps.length) return { minDays: 1, maxDays: 1 };
    const spread = daysBetween(stamps[0], today());
    return { minDays: 1, maxDays: Math.max(1, spread) };
  }

  function openQuiz() {
    const el = document.getElementById("ow-quiz");
    if (!el) return;
    el.classList.remove("hidden");
    document.body.classList.add("ow-locked");
    renderQuizSetup();
    showQuizView("setup");
  }

  function closeQuiz() {
    const el = document.getElementById("ow-quiz");
    if (!el) return;
    el.classList.add("hidden");
    document.body.classList.remove("ow-locked");
    quizState.active = false;
  }

  function showQuizView(name) {
    document.querySelectorAll("[data-quiz-view]").forEach((v) => {
      v.classList.toggle("hidden", v.dataset.quizView !== name);
    });
  }

  function renderQuizSetup() {
    const { maxDays } = getBankDateRange();

    const topicSel = document.getElementById("quiz-topic");
    if (topicSel) {
      const topics = [...new Set(state.bank.map((w) => w.topic).filter(Boolean))].sort();
      topicSel.innerHTML = '<option value="all">All Topics</option>';
      topics.forEach((t) => topicSel.appendChild(new Option(t, t)));
    }

    const langSel = document.getElementById("quiz-lang");
    if (langSel) {
      const langs = [...new Set(state.bank.map((w) => w.language).filter(Boolean))].sort();
      langSel.innerHTML = '<option value="all">All Languages</option>';
      langs.forEach((l) => langSel.appendChild(new Option(l, l)));
    }

    const range = document.getElementById("quiz-range");
    const rangeMax = document.getElementById("quiz-range-max-label");

    if (range) {
      range.min = 1;
      range.max = maxDays;
      range.value = maxDays;
      range.disabled = maxDays <= 1;
      updateRangeLabel(range.value);

      const clone = range.cloneNode(true);
      range.parentNode.replaceChild(clone, range);
      clone.addEventListener("input", (e) => {
        updateRangeLabel(e.target.value);
        updateQuizPoolSummary();
      });
    }

    if (rangeMax) rangeMax.textContent = `${maxDays} day${maxDays === 1 ? "" : "s"}`;

    [topicSel, langSel].forEach((sel) => {
      if (!sel) return;
      const clone = sel.cloneNode(true);
      sel.parentNode.replaceChild(clone, sel);
      clone.addEventListener("change", updateQuizPoolSummary);
    });

    updateQuizPoolSummary();
  }

  function updateRangeLabel(val) {
    const n = Number(val);
    const el = document.getElementById("quiz-range-value");
    if (el) el.textContent = `Last ${n} day${n === 1 ? "" : "s"}`;
  }

  function getQuizPool() {
    const rangeEl = document.getElementById("quiz-range");
    const topicEl = document.getElementById("quiz-topic");
    const langEl = document.getElementById("quiz-lang");
    const days = rangeEl ? Number(rangeEl.value) : 30;
    const topic = topicEl ? topicEl.value : "all";
    const lang = langEl ? langEl.value : "all";

    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (days - 1));
    const cutoffStr = cutoff.toISOString().slice(0, 10);

    return state.bank.filter((w) => {
      if ((w.dateEncountered || "") < cutoffStr) return false;
      if (topic !== "all" && w.topic !== topic) return false;
      if (lang !== "all" && w.language !== lang) return false;
      return true;
    });
  }

  function updateQuizPoolSummary() {
    const sum = document.getElementById("quiz-pool-summary");
    const startBtn = document.querySelector('[data-action="quiz-start"]');
    if (!sum) return;

    const pool = getQuizPool();
    const unique = new Set(pool.map((w) => `${w.language}::${w.word}`)).size;

    if (unique < 4) {
      sum.classList.add("empty");
      sum.textContent = `Only ${unique} word${unique === 1 ? "" : "s"} in this range — need at least 4 for a quiz. Try widening the time range or removing filters.`;
      if (startBtn) startBtn.disabled = true;
    } else {
      sum.classList.remove("empty");
      sum.textContent = `${unique} word${unique === 1 ? "" : "s"} match — quiz will use up to 5.`;
      if (startBtn) startBtn.disabled = false;
    }
  }

  function shuffleArr(a) {
    const x = [...a];
    for (let i = x.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [x[i], x[j]] = [x[j], x[i]];
    }
    return x;
  }

  function buildQuizQuestions(pool) {
    const unique = [], seen = new Set();
    pool.forEach((w) => {
      const k = `${w.language}::${w.word}`;
      if (!seen.has(k)) { seen.add(k); unique.push(w); }
    });
    if (unique.length < 4) return null;

    const picks = shuffleArr(unique).slice(0, 5);
    return picks.map((target) => {
      const decoys = [], used = new Set([target.translation]);
      for (const w of shuffleArr(unique)) {
        if (w.word === target.word && w.language === target.language) continue;
        if (used.has(w.translation)) continue;
        decoys.push(w.translation);
        used.add(w.translation);
        if (decoys.length === 3) break;
      }
      if (decoys.length < 3) return null;
      return { target, options: shuffleArr([target.translation, ...decoys]) };
    }).filter(Boolean);
  }

  function startQuiz() {
    const pool = getQuizPool();
    const questions = buildQuizQuestions(pool);
    const warning = document.getElementById("quiz-warning");
    if (!questions || !questions.length) {
      if (warning) {
        warning.textContent = "Not enough unique words to build a quiz. Try widening the range or clearing filters.";
        warning.classList.remove("hidden");
      }
      return;
    }
    if (warning) warning.classList.add("hidden");
    quizState.questions = questions;
    quizState.index = 0;
    quizState.correct = 0;
    quizState.answered = false;
    quizState.active = true;
    showQuizView("engine");
    renderQuizQuestion();
  }

  function renderQuizQuestion() {
    const q = quizState.questions[quizState.index];
    if (!q) return finishQuiz();

    quizState.answered = false;

    const prog = document.getElementById("quiz-progress-text");
    const fill = document.getElementById("quiz-progress-fill");
    if (prog) prog.textContent = `Question ${quizState.index + 1} of ${quizState.questions.length}`;
    if (fill) fill.style.width = `${(quizState.index / quizState.questions.length) * 100}%`;

    document.getElementById("quiz-prompt").textContent = q.target.word;
    const subParts = [q.target.language];
    if (q.target.pos) subParts.push(q.target.pos);
    if (q.target.gender) subParts.push(q.target.gender);
    document.getElementById("quiz-prompt-sub").textContent = subParts.join(" · ");

    const wrap = document.getElementById("quiz-options");
    wrap.innerHTML = "";
    q.options.forEach((text) => {
      const btn = document.createElement("button");
      btn.className = "ow-quiz-option";
      btn.textContent = text;
      btn.addEventListener("click", () => handleQuizAnswer(btn, text, q.target.translation));
      wrap.appendChild(btn);
    });

    const nextBtn = document.getElementById("quiz-next-btn");
    if (nextBtn) {
      nextBtn.classList.add("hidden");
      nextBtn.textContent = quizState.index === quizState.questions.length - 1
        ? "See Results →"
        : "Next →";
    }
  }

  function handleQuizAnswer(button, chosen, correct) {
    if (quizState.answered) return;
    quizState.answered = true;
    document.querySelectorAll(".ow-quiz-option").forEach((b) => {
      b.disabled = true;
      if (b.textContent === correct) b.classList.add("correct");
    });
    if (chosen === correct) quizState.correct++;
    else button.classList.add("wrong");
    const nextBtn = document.getElementById("quiz-next-btn");
    if (nextBtn) nextBtn.classList.remove("hidden");
  }

  function nextQuizQuestion() {
    quizState.index++;
    if (quizState.index >= quizState.questions.length) return finishQuiz();
    renderQuizQuestion();
  }

  function finishQuiz() {
    showQuizView("result");
    const total = quizState.questions.length;
    const correct = quizState.correct;
    const pct = Math.round((correct / total) * 100);

    document.getElementById("quiz-result-score").textContent = correct;
    document.getElementById("quiz-result-detail").textContent =
      `You answered ${correct} of ${total} correctly (${pct}%).`;

    let msg = "Keep going!";
    if (pct === 100) msg = "Perfect score! 🎉";
    else if (pct >= 80) msg = "Excellent work!";
    else if (pct >= 60) msg = "Nice progress!";
    else if (pct >= 40) msg = "Getting there.";
    document.getElementById("quiz-result-msg").textContent = msg;

    quizState.active = false;
  }

  /* =======================================================================
     ACTIONS
     ======================================================================= */
  function wireActions() {
    document.addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;
      const action = btn.dataset.action;

      switch (action) {
        case "shuffle": await setNewWord(true); break;
        case "deep-dive": deepDive(state.settings.currentWord); break;

        case "favourite": {
          const w = state.settings.currentWord;
          if (!w) break;
          const i = state.favourites.findIndex(
            (f) => f.word === w.word && f.language === w.language
          );
          if (i >= 0) state.favourites.splice(i, 1);
          else state.favourites.push({ ...w, dateSaved: today() });
          await saveFavs();
          renderWord(w);
          break;
        }

        case "open-settings": showPanel("settings"); break;
        case "open-bank":     showPanel("bank");     break;
        case "open-main":     showPanel("main");     break;
        case "back-to-main":  showPanel("main");     break;
        case "open-quiz":     openQuiz();            break;
        case "quiz-close":    closeQuiz();           break;
        case "quiz-start":    startQuiz();           break;
        case "quiz-next":     nextQuizQuestion();    break;
        case "quiz-retry":    showQuizView("setup"); renderQuizSetup(); break;

        case "toggle-collapse":
          setCollapsed(!document.getElementById("ow-sidebar").classList.contains("collapsed"));
          break;
        case "expand": setCollapsed(false); break;

        case "save-custom": {
          const raw = document.getElementById("ow-custom").value.trim();
          if (!raw) break;
          const parsed = [];
          raw.split("\n").forEach((line) => {
            const [w, t] = line.split("=").map((s) => (s || "").trim());
            if (w && t) {
              parsed.push({
                word: w, translation: t, definition: t, pos: "Noun",
                language: state.settings.languages[0] || "Custom",
                topic: "Custom", example: "", exampleEn: "",
              });
            }
          });
          state.settings.customVocab = [...(state.settings.customVocab || []), ...parsed];
          state.dictionary = [...state.dictionary, ...parsed];
          parsed.forEach(recordWord);
          await saveSettings();
          const status = document.getElementById("ow-goal-status");
          if (status) {
            status.textContent = `✓ Added ${parsed.length} word(s).`;
            setTimeout(() => (status.textContent = ""), 4000);
          }
          break;
        }

        case "apply-goals": {
          const text = document.getElementById("ow-goals").value.trim();
          state.settings.goals = text;
          const parsed = parseGoals(text);
          parsed.languages.forEach((l) => {
            if (!state.settings.languages.includes(l)) state.settings.languages.push(l);
          });
          parsed.topics.forEach((t) => {
            if (!state.settings.topics.includes(t)) state.settings.topics.push(t);
          });
          await saveSettings();
          renderSettings();
          const status = document.getElementById("ow-goal-status");
          if (status) {
            status.textContent = parsed.languages.length || parsed.topics.length
              ? `✓ Detected: ${[...parsed.languages, ...parsed.topics].join(" · ")}`
              : "No specific preferences detected.";
          }
          await setNewWord(true);
          break;
        }

        case "rerun-setup":
          clearSetupFlag();
          state.settings.onboarded = false;
          try { await saveSettings(); } catch (e) { /* non-fatal */ }
          forceOnboardingView();
          break;

        case "export": {
          const payload = {
            settings: state.settings,
            bank: state.bank,
            favourites: state.favourites,
          };
          const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `openword-backup-${today()}.json`;
          a.click();
          URL.revokeObjectURL(url);
          break;
        }

        case "reset": {
          const confirmed = confirm(
            "This will erase all OpenWord data — settings, word bank, favourites, and quiz stats. Continue?"
          );
          if (!confirmed) break;
          try {
            await new Promise((resolve) => chrome.storage.local.clear(() => resolve()));
            try { localStorage.clear(); sessionStorage.clear(); } catch (e) { /* ignore */ }
            clearSetupFlag();
            state.settings = {
              languages: [], topics: [], interval: "newtab", theme: "dark",
              lastWordChange: 0, currentWord: null, customVocab: [], goals: "",
              onboarded: false,
            };
            state.bank = [];
            state.favourites = [];
            state.collapsed = false;
            window.location.reload();
          } catch (err) {
            console.error("[OpenWord] Reset failed:", err);
            clearSetupFlag();
            alert("Reset encountered an error. Reloading manually.");
            window.location.reload();
          }
          break;
        }
      }
    });

    document.querySelectorAll(".ow-theme-swatch").forEach((sw) => {
      sw.addEventListener("click", () => applyTheme(sw.dataset.theme));
    });

    const interval = document.getElementById("ow-interval");
    if (interval)
      interval.addEventListener("change", (e) => {
        state.settings.interval = e.target.value;
        saveSettings();
      });

    const bankSearch = document.getElementById("ow-bank-search");
    if (bankSearch) bankSearch.addEventListener("input", renderBankList);
  }

  function escapeHtml(s) {
    return String(s || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  /* =======================================================================
     BOOT
     ======================================================================= */
  async function init() {
    wireActions();
    wireHandle();
    wireOnboarding();

    const setupDone = isSetupComplete();

    if (!setupDone) {
      loadState().catch((e) => console.warn("[OpenWord] loadState failed:", e));
      loadDictionary().catch((e) => console.warn("[OpenWord] loadDictionary failed:", e));
      forceOnboardingView();
      return;
    }

    await loadState();
    await loadDictionary();

    forceDashboardView();

    const savedTheme = state.settings.theme || "dark";
    const sidebar = document.getElementById("ow-sidebar");
    if (sidebar) sidebar.dataset.theme = savedTheme;
    document.body.dataset.owTheme = savedTheme;

    if (state.collapsed) {
      if (sidebar) sidebar.classList.add("collapsed");
      const handle = document.getElementById("ow-handle");
      if (handle) {
        handle.style.animation = "none";
        handle.classList.remove("hidden");
      }
    }

    if (
      state.settings.interval === "newtab" ||
      !state.settings.currentWord ||
      needsRefresh()
    ) {
      await setNewWord(true);
    } else {
      renderWord(state.settings.currentWord);
    }

    renderMiniList();
    renderSettings();
    showPanel("main");
  }

  document.addEventListener("DOMContentLoaded", init);
})();