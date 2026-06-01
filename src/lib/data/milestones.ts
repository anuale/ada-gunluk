export interface MilestoneTemplate {
  key: string;
  category: "motor" | "language" | "cognitive" | "social";
  title: string;
  description: string;
  ageMonth: number;
}

export const milestoneTemplates: MilestoneTemplate[] = [
  // 0-3 Months
  { key: "head_up_45", category: "motor", title: "Yüzüstü yatarken başını kaldırır", description: "Başını 45 derece kaldırabilir ve kısa süre tutar", ageMonth: 1 },
  { key: "follows_object", category: "cognitive", title: "Nesneleri gözleriyle takip eder", description: "20-30 cm mesafedeki nesneyi orta hattı geçerek takip eder", ageMonth: 1 },
  { key: "smiles_social", category: "social", title: "Sosyal gülümseme", description: "Tanıdık yüzlere bilinçli olarak gülümser", ageMonth: 2 },
  { key: "coos", category: "language", title: "Agulama sesleri çıkarır", description: "'Agu', 'ugu' gibi sesli harf benzeri sesler çıkarır", ageMonth: 2 },
  { key: "head_steady", category: "motor", title: "Başını dik tutar", description: "Destekle otururken başını sabit tutar", ageMonth: 3 },
  { key: "hands_open", category: "motor", title: "Ellerini açar", description: "Yenidoğan refleksi olan el sıkma azalır, eller yarı açık durur", ageMonth: 3 },

  // 3-6 Months
  { key: "rolls_over", category: "motor", title: "Dönme hareketi", description: "Sırttan yana veya karından sırta dönebilir", ageMonth: 4 },
  { key: "reaches_grasps", category: "motor", title: "Uzanır ve kavrar", description: "Nesnelere bilinçli olarak uzanır ve avucuyla kavrar", ageMonth: 4 },
  { key: "laughs", category: "social", title: "Kahkaha ile güler", description: "Cee-e ve komik seslere kahkaha atar", ageMonth: 4 },
  { key: "babbles", category: "language", title: "Babıldamaya başlar", description: "'Ba-ba', 'da-da' gibi ünsüz-ünlü tekrarları yapar", ageMonth: 5 },
  { key: "sit_with_support", category: "motor", title: "Destekle oturur", description: "Bel desteğiyle veya tripod pozisyonda oturabilir", ageMonth: 5 },
  { key: "responds_name", category: "cognitive", title: "İsmine tepki verir", description: "Adı söylendiğinde sesin geldiği yöne döner", ageMonth: 6 },
  { key: "object_permanence", category: "cognitive", title: "Nesne devamlılığı başlar", description: "Saklanan nesneyi aramaya başlar, ce-e oyununu anlar", ageMonth: 6 },

  // 6-9 Months
  { key: "sits_alone", category: "motor", title: "Desteksiz oturur", description: "En az 30 saniye desteksiz oturabilir", ageMonth: 7 },
  { key: "pincer_grasp", category: "motor", title: "Kıskaç tutuşu gelişir", description: "Başparmak ve işaret parmağıyla küçük nesneleri tutar", ageMonth: 8 },
  { key: "stranger_anxiety", category: "social", title: "Yabancı kaygısı", description: "Tanımadığı kişilere karşı çekingenlik veya ağlama gösterir", ageMonth: 8 },
  { key: "mama_dada", category: "language", title: "'Anne, baba' benzeri heceler", description: "Anne veya babaya yönelik olmasa da 'ma-ma', 'ba-ba' der", ageMonth: 8 },
  { key: "crawls", category: "motor", title: "Emekler", description: "Elleri ve dizleri üzerinde emekler veya popo üstünde sürünür", ageMonth: 9 },
  { key: "waves_bye", category: "social", title: "El sallar", description: "Güle güle yaparken el sallar, taklit etmeye başlar", ageMonth: 9 },

  // 9-12 Months
  { key: "pulls_to_stand", category: "motor", title: "Tutunarak ayağa kalkar", description: "Mobilyalara tutunarak kendini çeker ve ayakta durur", ageMonth: 10 },
  { key: "first_words", category: "language", title: "İlk anlamlı kelimeler", description: "1-3 anlamlı kelime söyler (anne, baba, mama vb.)", ageMonth: 11 },
  { key: "imitates_actions", category: "cognitive", title: "Eylemleri taklit eder", description: "Telefonla konuşma, alkış yapma gibi hareketleri taklit eder", ageMonth: 10 },
  { key: "plays_peekaboo", category: "social", title: "Ce-e oyunu oynar", description: "Saklanan kişiyi bulur, sırayla oynar", ageMonth: 10 },
  { key: "claps", category: "motor", title: "Alkış yapar", description: "Ellerini birbirine vurarak alkış yapar", ageMonth: 11 },
  { key: "drinks_cup", category: "motor", title: "Bardaktan içer", description: "İki elle tutarak bardaktan su içebilir", ageMonth: 12 },
  { key: "separation_anxiety", category: "social", title: "Ayrılık kaygısı zirve yapar", description: "Ebeveynden ayrıldığında yoğun kaygı gösterir (normal)", ageMonth: 12 },

  // 12-18 Months
  { key: "walks_alone", category: "motor", title: "Tek başına yürür", description: "Desteksiz en az 5-6 adım yürür", ageMonth: 13 },
  { key: "points", category: "language", title: "Parmağıyla işaret eder", description: "İstediği veya dikkatini çeken şeyi parmağıyla gösterir", ageMonth: 13 },
  { key: "3_words", category: "language", title: "3-10 kelime söyler", description: "Anlamlı kelime dağarcığı 3-10 arasındadır", ageMonth: 14 },
  { key: "stacks_blocks", category: "cognitive", title: "Küpleri üst üste dizer", description: "2-3 küpü üst üste koyabilir", ageMonth: 14 },
  { key: "follows_command", category: "language", title: "Basit komutları anlar", description: "'Topu getir' gibi tek adımlı komutları yerine getirir", ageMonth: 15 },
  { key: "scribbles", category: "motor", title: "Karalar", description: "Kalemi avuçlayarak kağıda çizgiler çizer", ageMonth: 15 },
  { key: "uses_spoon", category: "motor", title: "Kaşık kullanır", description: "Kaşıkla kendi kendine yemeye başlar (dağınık)", ageMonth: 15 },
  { key: "hugs", category: "social", title: "Sarılarak sevgi gösterir", description: "Tanıdıklarına sarılır, oyuncak bebeğini öper", ageMonth: 16 },
  { key: "climbs", category: "motor", title: "Tırmanır", description: "Merdivenleri emekleyerek çıkar, mobilyalara tırmanır", ageMonth: 16 },
  { key: "names_body_parts", category: "language", title: "Vücut parçalarını gösterir", description: "'Burnun nerede?' dendiğinde en az 1-2 yerini gösterir", ageMonth: 17 },
  { key: "symbolic_play", category: "cognitive", title: "Sembolik oyun başlar", description: "Oyuncak telefonla konuşur, bebeğini besler", ageMonth: 18 },

  // 18-24 Months
  { key: "runs", category: "motor", title: "Koşar", description: "Düşmeden kısa mesafe koşar", ageMonth: 19 },
  { key: "kicks_ball", category: "motor", title: "Topa vurur", description: "Dengesini kaybetmeden topa ayağıyla vurur", ageMonth: 19 },
  { key: "20_words", category: "language", title: "20-50 kelime söyler", description: "Kelime dağarcığı hızla genişler, 20'den fazla anlamlı kelime", ageMonth: 20 },
  { key: "two_word_phrases", category: "language", title: "İki kelimeli cümleler", description: "'Anne gel', 'su ver' gibi iki kelimeyi birleştirir", ageMonth: 21 },
  { key: "helps_dress", category: "motor", title: "Giyinmeye yardım eder", description: "Kollarını kollara sokar, ayaklarını kaldırır", ageMonth: 21 },
  { key: "pretend_play", category: "cognitive", title: "Hayali oyun gelişir", description: "Bebeğine yemek yedirir, arabayı sürer gibi yapar", ageMonth: 22 },
  { key: "shows_empathy", category: "social", title: "Empati işaretleri gösterir", description: "Başkası üzgün olduğunda ilgilenir, oyuncağını verir", ageMonth: 22 },
  { key: "sorts_shapes", category: "cognitive", title: "Şekilleri eşleştirir", description: "Basit şekil eşleştirme oyuncağını çözebilir", ageMonth: 23 },
  { key: "jumps", category: "motor", title: "Zıplamaya başlar", description: "İki ayağıyla yerden hafifçe zıplar", ageMonth: 24 },

  // 24-36 Months
  { key: "stairs_alternating", category: "motor", title: "Merdiven çıkar", description: "Alternatif ayakla veya iki ayağını basamakta birleştirerek çıkar", ageMonth: 25 },
  { key: "200_words", category: "language", title: "200+ kelime", description: "Kelime dağarcığı 200'ü geçer, 3-4 kelimeli cümleler kurar", ageMonth: 26 },
  { key: "uses_pronouns", category: "language", title: "Zamir kullanır", description: "'Ben', 'sen', 'benim' gibi zamirleri doğru kullanır", ageMonth: 27 },
  { key: "dresses_self", category: "motor", title: "Kendi giyinir", description: "Bol kıyafetleri yardımsız giyer, düğme açabilir", ageMonth: 28 },
  { key: "toilet_trained_day", category: "motor", title: "Gündüz tuvalet eğitimi", description: "Gündüzleri bezsiz kalabilir, tuvalet ihtiyacını söyler", ageMonth: 28 },
  { key: "draws_circle", category: "motor", title: "Daire çizer", description: "Taklit ederek veya kendiliğinden daire çizebilir", ageMonth: 29 },
  { key: "knows_colors", category: "cognitive", title: "Renkleri tanır", description: "En az 2-3 rengi doğru eşleştirir veya adlandırır", ageMonth: 29 },
  { key: "tells_stories", category: "language", title: "Kısa hikaye anlatır", description: "Yaşadığı bir olayı 2-3 cümle ile anlatabilir", ageMonth: 30 },
  { key: "takes_turns", category: "social", title: "Sıra bekler", description: "Oyunda veya konuşmada sıra alma davranışı gösterir", ageMonth: 31 },
  { key: "pedals_tricycle", category: "motor", title: "Üç tekerlekli bisiklet", description: "Pedal çevirerek bisiklet sürebilir", ageMonth: 32 },
  { key: "counts_objects", category: "cognitive", title: "Sayı saymaya başlar", description: "3-5 nesneyi sayabilir, sayı kavramı gelişir", ageMonth: 33 },
  { key: "asks_why", category: "language", title: "'Neden?' soruları", description: "Sürekli 'neden, niçin, nasıl' soruları sorar", ageMonth: 34 },
  { key: "plays_with_others", category: "social", title: "Akranlarıyla oynar", description: "İşbirliğine dayalı oyunlar oynar, arkadaş edinir", ageMonth: 35 },
  { key: "draws_person", category: "motor", title: "İnsan çizer", description: "Baş ve en az bir vücut parçası olan insan figürü çizer", ageMonth: 36 },
];
