export interface MilestoneTemplate {
  key: string;
  category: "motor" | "language" | "cognitive" | "social";
  title: string;
  description: string;
  ageMonth: number;
}

export const milestoneTemplates: MilestoneTemplate[] = [
  // ======= HAFTA 0-4 (Yenidoğan) =======
  { key: "newborn_grasp_reflex", category: "motor", title: "Yakalama refleksi", description: "Avucuna dokunulduğunda parmaklarını sıkıca kapatır", ageMonth: 0 },
  { key: "newborn_moro_reflex", category: "motor", title: "Moro (sıçrama) refleksi", description: "Ani ses veya harekette kollarını açar, sonra kendine çeker", ageMonth: 0 },
  { key: "newborn_sucking_reflex", category: "motor", title: "Emme refleksi", description: "Ağzına dokunulduğunda emme hareketi yapar", ageMonth: 0 },
  { key: "newborn_startle_sound", category: "cognitive", title: "Sese irkilme", description: "Yüksek sese irkilme veya göz kırpma tepkisi verir", ageMonth: 0 },
  { key: "newborn_face_stare", category: "social", title: "Yüzlere bakar", description: "20-25 cm mesafedeki insan yüzüne odaklanır", ageMonth: 0 },

  // 1. Hafta
  { key: "week1_lift_head_brief", category: "motor", title: "Başını anlık kaldırır", description: "Yüzüstü yatarken başını birkaç saniye kaldırabilir", ageMonth: 0.25 },
  { key: "week1_recognizes_mom_scent", category: "social", title: "Anne kokusunu tanır", description: "Anne sütü kokusuna yönelir, diğer kokulardan ayırt eder", ageMonth: 0.25 },

  // 2. Hafta
  { key: "week2_track_horiz", category: "cognitive", title: "Yatay takip başlar", description: "Yavaşça hareket eden nesneyi göz ucuyla kısa süre takip eder", ageMonth: 0.5 },
  { key: "week2_calmed_by_voice", category: "social", title: "Sesle sakinleşir", description: "Tanıdık bir ses duyduğunda ağlaması azalır, sakinleşir", ageMonth: 0.5 },

  // 3. Hafta
  { key: "week3_head_turn_side", category: "motor", title: "Başını yana çevirir", description: "Yüzüstü yatarken başını bir yandan diğer yana çevirebilir", ageMonth: 0.75 },
  { key: "week3_different_cries", category: "language", title: "Farklı ağlama tipleri", description: "Açlık, rahatsızlık, yorgunluk için farklı ağlama sesleri çıkarır", ageMonth: 0.75 },

  // 1. Ay
  { key: "month1_head_supine_turn", category: "motor", title: "Sırtüstü baş çevirme", description: "Sırtüstü yatarken başını iki yana da çevirebilir", ageMonth: 1 },
  { key: "month1_brief_eye_contact", category: "social", title: "Kısa göz teması", description: "2-3 saniye göz teması kurabilir", ageMonth: 1 },
  { key: "month1_startles_loud", category: "cognitive", title: "Yüksek sese tepki", description: "Ani yüksek seste irkilir, ağlayabilir", ageMonth: 1 },
  { key: "month1_fists_mostly_closed", category: "motor", title: "Eller çoğunlukla kapalı", description: "Yenidoğan döneminde eller yumruk şeklinde kapalıdır (normal)", ageMonth: 1 },

  // 6. Hafta
  { key: "week6_first_smile", category: "social", title: "İlk bilinçli gülümseme", description: "Tanıdık bir yüze veya sese yanıt olarak gülümser", ageMonth: 1.5 },
  { key: "week6_coos_first", category: "language", title: "İlk agulama sesleri", description: "Boğazdan gelen yumuşak 'a-gu', 'u-gu' benzeri sesler çıkarır", ageMonth: 1.5 },

  // 2. Ay
  { key: "month2_smiles_social", category: "social", title: "Sosyal gülümseme", description: "İnsanlara bilinçli ve düzenli olarak gülümser", ageMonth: 2 },
  { key: "month2_follows_object_midline", category: "cognitive", title: "Nesneyi orta hattı geçerek takip", description: "Hareket eden nesneyi gözleriyle orta hattan yanlara doğru takip eder", ageMonth: 2 },
  { key: "month2_coos_vowels", category: "language", title: "Sesli harflerle agulama", description: "'Aaa', 'ooo', 'uuu' gibi sesli harf ağırlıklı sesler çıkarır", ageMonth: 2 },
  { key: "month2_head_up_45", category: "motor", title: "Başını 45° kaldırır", description: "Yüzüstü yatarken başını 45 derece kaldırıp kısa süre tutar", ageMonth: 2 },
  { key: "month2_calms_when_spoken", category: "social", title: "Konuşunca sakinleşir", description: "Kendisiyle konuşulduğunda sakinleşir, seslere tepki verir", ageMonth: 2 },

  // 3. Ay
  { key: "month3_head_steady", category: "motor", title: "Başını dik tutar", description: "Kucakta dik tutulduğunda başını sabit tutar, sallanma azalır", ageMonth: 3 },
  { key: "month3_hands_open", category: "motor", title: "Ellerini açar", description: "Artık ellerini yarı açık tutar, yumruk yapma refleksi azalır", ageMonth: 3 },
  { key: "month3_swipes_objects", category: "motor", title: "Nesnelere uzanmaya çalışır", description: "Gördüğü nesnelere kollarını sallayarak ulaşmaya çalışır", ageMonth: 3 },
  { key: "month3_kicks_legs", category: "motor", title: "Bacaklarını kuvvetlice iter", description: "Sırtüstü yatarken bacaklarını kuvvetlice hareket ettirir", ageMonth: 3 },
  { key: "month3_recognizes_parents", category: "social", title: "Ebeveynleri tanır", description: "Anne-babasını diğer insanlardan ayırt eder, onlara daha çok gülümser", ageMonth: 3 },
  { key: "month3_turns_head_sound", category: "cognitive", title: "Sesin geldiği yöne döner", description: "Bir ses duyduğunda başını o yöne çevirir", ageMonth: 3 },

  // 4. Ay
  { key: "month4_rolls_tummy_to_side", category: "motor", title: "Yüzüstünden yana döner", description: "Yüzüstü pozisyondan yana doğru dönmeye başlar", ageMonth: 4 },
  { key: "month4_reaches_grasps", category: "motor", title: "Uzanır ve kavrar", description: "Nesnelere bilinçli olarak uzanır ve iki eliyle kavrar", ageMonth: 4 },
  { key: "month4_hands_to_mouth", category: "motor", title: "Ellerini ağzına götürür", description: "Ellerini ve oyuncakları ağzına götürerek keşfeder", ageMonth: 4 },
  { key: "month4_laughs", category: "social", title: "Kahkaha ile güler", description: "Ce-e oyunu, komik yüzler veya seslere kahkaha atar", ageMonth: 4 },
  { key: "month4_babbles_many", category: "language", title: "Çeşitli sesler çıkarır", description: "'Ba', 'ma', 'ga' gibi farklı ünsüz-ünlü kombinasyonları dener", ageMonth: 4 },
  { key: "month4_explores_hands", category: "cognitive", title: "Ellerini inceler", description: "Kendi ellerini uzun süre inceler, parmaklarını keşfeder", ageMonth: 4 },

  // 5. Ay
  { key: "month5_rolls_back_to_side", category: "motor", title: "Sırttan yana döner", description: "Sırtüstü yatarken yanlarına doğru dönmeye başlar", ageMonth: 5 },
  { key: "month5_sits_with_support", category: "motor", title: "Destekle oturur", description: "Bel desteğiyle veya etrafı yastıklarla desteklenerek oturabilir", ageMonth: 5 },
  { key: "month5_shakes_rattle", category: "motor", title: "Çıngırak sallar", description: "Eline verilen çıngırağı sallar ve ses çıkarmaktan hoşlanır", ageMonth: 5 },
  { key: "month5_babbles_conversation", category: "language", title: "Karşılıklı babıldama", description: "Kendisiyle konuşulduğunda sırayla ses çıkarır, 'sohbet' eder", ageMonth: 5 },
  { key: "month5_distinguishes_emotions", category: "social", title: "Duyguları ayırt eder", description: "Mutlu ve kızgın ses tonlarını ayırt edebilir, mutlu sese gülümser", ageMonth: 5 },
  { key: "month5_tracks_fast", category: "cognitive", title: "Hızlı takip eder", description: "Hareket eden nesneyi daha hızlı ve akıcı şekilde gözleriyle takip eder", ageMonth: 5 },

  // 6. Ay
  { key: "month6_rolls_both_directions", category: "motor", title: "İki yöne de döner", description: "Sırttan karına ve karından sırta dönebilir", ageMonth: 6 },
  { key: "month6_sits_tripod", category: "motor", title: "Tripod oturuş", description: "Ellerini öne koyarak tripod pozisyonunda kısa süre oturur", ageMonth: 6 },
  { key: "month6_transfers_hands", category: "motor", title: "Elden ele geçirir", description: "Nesneleri bir elinden diğerine geçirebilir", ageMonth: 6 },
  { key: "month6_responds_name", category: "cognitive", title: "İsmine tepki verir", description: "Adı söylendiğinde sesin geldiği yöne döner", ageMonth: 6 },
  { key: "month6_object_permanence", category: "cognitive", title: "Nesne devamlılığı başlar", description: "Kısmen saklanan nesneyi aramaya başlar", ageMonth: 6 },
  { key: "month6_stranger_awareness", category: "social", title: "Yabancı farkındalığı", description: "Tanımadığı kişilere karşı dikkatli bakar, bazen çekingen davranır", ageMonth: 6 },

  // 7. Ay
  { key: "month7_sits_alone", category: "motor", title: "Desteksiz oturur", description: "En az 30 saniye desteksiz, elleri serbest oturabilir", ageMonth: 7 },
  { key: "month7_rakes_grasp", category: "motor", title: "Tırmık tutuşu", description: "Küçük nesneleri tüm parmaklarıyla tırmıklayarak alır", ageMonth: 7 },
  { key: "month7_explores_body", category: "cognitive", title: "Vücudunu keşfeder", description: "Ayaklarını ağzına götürür, vücut parçalarını keşfeder", ageMonth: 7 },
  { key: "month7_vocalizes_moods", category: "language", title: "Ruh halini sesle ifade eder", description: "Mutlu, heyecanlı, rahatsız olduğunu farklı ses tonlarıyla belli eder", ageMonth: 7 },
  { key: "month7_enjoys_social_play", category: "social", title: "Sosyal oyundan hoşlanır", description: "Ce-e, taklit oyunları gibi karşılıklı oyunlardan keyif alır", ageMonth: 7 },

  // 8. Ay
  { key: "month8_pincer_grasp_early", category: "motor", title: "Makas tutuşu başlar", description: "Başparmak ve işaret parmağıyla küçük nesneleri almaya başlar", ageMonth: 8 },
  { key: "month8_sits_reaches", category: "motor", title: "Otururken uzanır", description: "Desteksiz otururken dengesini bozmadan yana uzanıp oyuncak alır", ageMonth: 8 },
  { key: "month8_stranger_anxiety", category: "social", title: "Yabancı kaygısı belirginleşir", description: "Tanımadığı kişilere karşı belirgin çekingenlik veya ağlama gösterir", ageMonth: 8 },
  { key: "month8_mama_dada", category: "language", title: "'Anne, baba' heceleri", description: "Anne veya babaya yönelik olmasa da 'ma-ma', 'ba-ba' hecelerini tekrarlar", ageMonth: 8 },
  { key: "month8_looks_dropped_object", category: "cognitive", title: "Düşen nesneyi arar", description: "Elinden düşürdüğü nesnenin nereye gittiğine bakar", ageMonth: 8 },

  // 9. Ay
  { key: "month9_crawls", category: "motor", title: "Emekler", description: "Elleri ve dizleri üzerinde emekler veya popo üstünde sürünerek ilerler", ageMonth: 9 },
  { key: "month9_pulls_to_stand", category: "motor", title: "Tutunarak ayağa kalkar", description: "Mobilyalara tutunarak kendini çeker ve ayakta durur", ageMonth: 9 },
  { key: "month9_bangs_objects", category: "cognitive", title: "Nesneleri vurur", description: "İki nesneyi birbirine vurarak ses çıkarır, neden-sonuç ilişkisini keşfeder", ageMonth: 9 },
  { key: "month9_separation_anxiety", category: "social", title: "Ayrılık kaygısı başlar", description: "Ebeveynden ayrıldığında huzursuzlanır, arkasından ağlayabilir", ageMonth: 9 },
  { key: "month9_waves_bye", category: "social", title: "El sallar", description: "Güle güle yaparken el sallar, basit hareketleri taklit eder", ageMonth: 9 },
  { key: "month9_understands_no", category: "language", title: "'Hayır'ı anlamaya başlar", description: "'Hayır' dendiğinde kısa süreliğine durur, ses tonundan anlar", ageMonth: 9 },

  // 10. Ay
  { key: "month10_cruises", category: "motor", title: "Sıralar", description: "Mobilyalara tutunarak yan yan yürür (sıralama)", ageMonth: 10 },
  { key: "month10_pincer_mature", category: "motor", title: "Kıskaç tutuşu gelişir", description: "Başparmak ve işaret parmağı ucuyla küçük nesneleri hassasça tutar", ageMonth: 10 },
  { key: "month10_imitates_actions", category: "cognitive", title: "Eylemleri taklit eder", description: "Telefonla konuşma, alkış yapma gibi gördüğü hareketleri taklit eder", ageMonth: 10 },
  { key: "month10_plays_peekaboo", category: "social", title: "Ce-e oyunu oynar", description: "Saklanan kişiyi aktif olarak arar, sırayla oynar", ageMonth: 10 },
  { key: "month10_gestures_communicate", category: "language", title: "Jestlerle iletişim", description: "İstediği şeyi göstermek için uzanır, iter, çeker", ageMonth: 10 },

  // 11. Ay
  { key: "month11_stands_momentarily", category: "motor", title: "Anlık ayakta durur", description: "Desteksiz birkaç saniye ayakta durabilir", ageMonth: 11 },
  { key: "month11_claps", category: "motor", title: "Alkış yapar", description: "Ellerini birbirine vurarak alkış yapar, 'baş baş' yapabilir", ageMonth: 11 },
  { key: "month11_first_words", category: "language", title: "İlk anlamlı kelimeler", description: "1-3 anlamlı kelime söyler (anne, baba, mama, dede vb.)", ageMonth: 11 },
  { key: "month11_explores_containers", category: "cognitive", title: "Kapları keşfeder", description: "Nesneleri kaba koyup çıkarır, boşaltma-doldurma oyunları oynar", ageMonth: 11 },
  { key: "month11_shows_objects_to_share", category: "social", title: "Nesneleri gösterir/paylaşır", description: "İlgisini çeken şeyi ebeveynine gösterir, bazen verir", ageMonth: 11 },

  // 12. Ay (1 Yaş)
  { key: "month12_first_steps", category: "motor", title: "İlk adımlar", description: "Tutunarak veya desteksiz 2-3 adım atar", ageMonth: 12 },
  { key: "month12_drinks_cup", category: "motor", title: "Bardaktan içer", description: "İki elle tutarak bardaktan su içebilir, biraz dökebilir", ageMonth: 12 },
  { key: "month12_pincer_perfected", category: "motor", title: "Kıskaç tutuşu ustalaşır", description: "Küçük yiyecek parçalarını parmak ucuyla alıp ağzına götürür", ageMonth: 12 },
  { key: "month12_separation_anxiety_peak", category: "social", title: "Ayrılık kaygısı zirve yapar", description: "Ebeveynden ayrıldığında yoğun kaygı gösterir (normal gelişim)", ageMonth: 12 },
  { key: "month12_follows_simple_commands", category: "language", title: "Basit komutları anlar", description: "'Topu ver', 'gel' gibi jestle desteklenen tek adımlı komutları yerine getirir", ageMonth: 12 },
  { key: "month12_joint_attention", category: "cognitive", title: "Ortak dikkat", description: "Ebeveynin baktığı yere bakar, işaret edilen nesneye odaklanır", ageMonth: 12 },

  // 14. Ay
  { key: "month14_walks_well", category: "motor", title: "İyi yürür", description: "Dengesini sağlayarak odada serbestçe yürür, nadiren düşer", ageMonth: 14 },
  { key: "month14_stacks_2_blocks", category: "cognitive", title: "2 küp dizer", description: "İki küpü üst üste koyabilir", ageMonth: 14 },
  { key: "month14_points_desire", category: "language", title: "Parmağıyla işaret eder", description: "İstediği şeyi parmağıyla gösterir, 'ver' jesti yapar", ageMonth: 14 },
  { key: "month14_3_5_words", category: "language", title: "3-5 anlamlı kelime", description: "Aktif kelime dağarcığı 3-5 arasındadır", ageMonth: 14 },
  { key: "month14_empties_containers", category: "cognitive", title: "Kapları boşaltır", description: "Kutuları, çekmeceleri açıp içindekileri boşaltmaktan keyif alır", ageMonth: 14 },
  { key: "month14_shows_affection", category: "social", title: "Sevgi gösterir", description: "Tanıdıklarına sarılır, öpücük verir", ageMonth: 14 },

  // 16. Ay
  { key: "month16_stoops_picks_up", category: "motor", title: "Eğilip nesne alır", description: "Yürürken eğilip yerden nesne alabilir, dengesini korur", ageMonth: 16 },
  { key: "month16_scribbles", category: "motor", title: "Karalar", description: "Kalemi avuçlayarak kağıt üzerinde çizgiler çizer", ageMonth: 16 },
  { key: "month16_uses_spoon", category: "motor", title: "Kaşık kullanır", description: "Kaşıkla kendi kendine yemeye başlar (hâlâ dağınık)", ageMonth: 16 },
  { key: "month16_5_10_words", category: "language", title: "5-10 kelime", description: "Aktif kelime dağarcığı 5-10 kelimeye çıkar", ageMonth: 16 },
  { key: "month16_climbs_furniture", category: "motor", title: "Mobilyaya tırmanır", description: "Koltuk, sandalye gibi alçak mobilyalara tırmanabilir", ageMonth: 16 },
  { key: "month16_demands_attention", category: "social", title: "Dikkat çekme davranışı", description: "Ebeveynin dikkatini çekmek için ses çıkarır, çekiştirir", ageMonth: 16 },

  // 18. Ay
  { key: "month18_runs", category: "motor", title: "Koşar", description: "Düşmeden kısa mesafe koşar, sert dönüşlerde dengesi bozulabilir", ageMonth: 18 },
  { key: "month18_stacks_3_4_blocks", category: "cognitive", title: "3-4 küp dizer", description: "3-4 küpü üst üste koyabilir", ageMonth: 18 },
  { key: "month18_10_20_words", category: "language", title: "10-20 kelime", description: "Kelime dağarcığı 10-20 arasına çıkar, her hafta yeni kelime eklenir", ageMonth: 18 },
  { key: "month18_names_body_parts", category: "language", title: "Vücut parçalarını tanır", description: "'Burnun nerede?' dendiğinde en az 3-4 vücut parçasını gösterir", ageMonth: 18 },
  { key: "month18_symbolic_play", category: "cognitive", title: "Sembolik oyun gelişir", description: "Oyuncak telefonla konuşur, bebeğini besler, arabayı sürer gibi yapar", ageMonth: 18 },
  { key: "month18_tantrums_begin", category: "social", title: "Öfke nöbetleri başlar", description: "İstediği olmadığında kendini yere atma, ağlama nöbetleri (normal)", ageMonth: 18 },
  { key: "month18_helps_dress_simple", category: "motor", title: "Giyinmeye yardım eder", description: "Kollarını giysinin koluna sokar, şapkasını çıkarır", ageMonth: 18 },

  // 20. Ay
  { key: "month20_kicks_ball", category: "motor", title: "Topa vurur", description: "Dengesini kaybetmeden yerden topa ayağıyla vurur", ageMonth: 20 },
  { key: "month20_20_50_words", category: "language", title: "20-50 kelime", description: "Kelime patlaması yaşanır, günde 1-2 yeni kelime öğrenebilir", ageMonth: 20 },
  { key: "month20_points_pictures", category: "language", title: "Resimleri gösterir", description: "Kitapta adı söylenen resmi parmağıyla gösterir", ageMonth: 20 },
  { key: "month20_throws_ball", category: "motor", title: "Top atar", description: "Topu baş üstünden olmasa da ileri doğru fırlatabilir", ageMonth: 20 },
  { key: "month20_walks_up_stairs_held", category: "motor", title: "Elden tutarak merdiven çıkar", description: "Bir elinden tutulduğunda merdivenleri adımlayarak çıkar", ageMonth: 20 },
  { key: "month20_possessive_mine", category: "social", title: "Sahiplik duygusu", description: "'Benim' kavramı gelişir, oyuncaklarını paylaşmak istemeyebilir", ageMonth: 20 },

  // 22. Ay
  { key: "month22_two_word_phrases", category: "language", title: "İki kelimeli cümleler", description: "'Anne gel', 'su ver', 'top at' gibi iki kelimeyi birleştirir", ageMonth: 22 },
  { key: "month22_50_100_words", category: "language", title: "50-100+ kelime", description: "Kelime dağarcığı hızla genişler, 50-100+ kelimeye ulaşır", ageMonth: 22 },
  { key: "month22_opens_doors", category: "motor", title: "Kapı açar", description: "Kapı kollarını çevirebilir, dolap kapaklarını açabilir", ageMonth: 22 },
  { key: "month22_pretend_play", category: "cognitive", title: "Hayali oyun zenginleşir", description: "Bebeğine yemek yedirir, yemek pişirir, alışveriş yapar gibi oyunlar", ageMonth: 22 },
  { key: "month22_shows_empathy_signs", category: "social", title: "Empati işaretleri", description: "Başkası üzgün olduğunda ilgilenir, oyuncağını verir, sarılır", ageMonth: 22 },
  { key: "month22_follows_two_step", category: "language", title: "İki adımlı komutu anlar", description: "'Topu al ve bana getir' gibi iki adımlı komutları yerine getirir", ageMonth: 22 },

  // 24. Ay (2 Yaş)
  { key: "month24_jumps_both_feet", category: "motor", title: "İki ayakla zıplar", description: "İki ayağıyla yerden hafifçe zıplayabilir", ageMonth: 24 },
  { key: "month24_runs_well", category: "motor", title: "Koşar ve durur", description: "Koşarken ani duruş yapabilir, yön değiştirebilir", ageMonth: 24 },
  { key: "month24_200_words", category: "language", title: "200+ kelime", description: "Kelime dağarcığı 200'ü geçer", ageMonth: 24 },
  { key: "month24_3_4_word_sentences", category: "language", title: "3-4 kelimeli cümleler", description: "'Anne top nerede', 'ben de geliyorum' gibi cümleler kurar", ageMonth: 24 },
  { key: "month24_sorts_colors_shapes", category: "cognitive", title: "Renk ve şekil eşleştirir", description: "Basit şekilleri ve ana renkleri eşleştirebilir", ageMonth: 24 },
  { key: "month24_parallel_play", category: "social", title: "Yan yana oyun", description: "Diğer çocukların yanında oynar, ara sıra etkileşime girer", ageMonth: 24 },
  { key: "month24_dresses_with_help", category: "motor", title: "Yardımla giyinir", description: "Bol giysileri yardımla giyer, ayakkabılarını çıkarabilir", ageMonth: 24 },
  { key: "month24_kicks_ball_skill", category: "motor", title: "Topa iyi vurur", description: "Dengesini kaybetmeden topa koşarak vurabilir", ageMonth: 24 },

  // 26. Ay
  { key: "month26_uses_pronouns", category: "language", title: "Zamir kullanır", description: "'Ben', 'sen', 'benim' gibi zamirleri doğru bağlamda kullanmaya başlar", ageMonth: 26 },
  { key: "month26_asks_questions", category: "language", title: "Soru sorar", description: "'Bu ne?', 'Nerede?', 'Kim?' gibi basit sorular sorar", ageMonth: 26 },
  { key: "month26_stairs_alternating", category: "motor", title: "Alternatif ayakla merdiven", description: "Merdiven inip çıkarken iki ayağını aynı basamakta birleştirir", ageMonth: 26 },
  { key: "month26_complex_pretend", category: "cognitive", title: "Karmaşık hayali oyun", description: "Birden fazla senaryolu, sıralı hayali oyunlar oynar", ageMonth: 26 },
  { key: "month26_begins_sharing", category: "social", title: "Paylaşmaya başlar", description: "Yönlendirildiğinde oyuncaklarını kısa süreliğine paylaşabilir", ageMonth: 26 },

  // 28. Ay
  { key: "month28_toilet_training_start", category: "motor", title: "Tuvalet eğitimi başlangıcı", description: "Tuvalet ihtiyacını söylemeye başlar, lazımlığa ilgi gösterir", ageMonth: 28 },
  { key: "month28_draws_lines_circles", category: "motor", title: "Daire ve çizgi çizer", description: "Taklit ederek daire ve düz çizgi çizebilir", ageMonth: 28 },
  { key: "month28_tells_name_age", category: "language", title: "Adını ve yaşını söyler", description: "Adını ve '2 yaşındayım' diyebilir", ageMonth: 28 },
  { key: "month28_matches_pictures", category: "cognitive", title: "Resim eşleştirir", description: "Benzer resimleri eşleştirebilir, basit yapboz yapabilir", ageMonth: 28 },
  { key: "month28_plays_with_others_more", category: "social", title: "Diğer çocuklarla daha çok oynar", description: "İnteraktif oyun süresi uzar, arkadaş tercihleri oluşmaya başlar", ageMonth: 28 },

  // 30. Ay
  { key: "month30_dresses_self_mostly", category: "motor", title: "Kendi giyinir", description: "Bol kıyafetleri yardımsız giyer, fermuar çekebilir, düğme açabilir", ageMonth: 30 },
  { key: "month30_washes_dries_hands", category: "motor", title: "El yıkama", description: "Yardımla ellerini yıkar ve kurular", ageMonth: 30 },
  { key: "month30_300_500_words", category: "language", title: "300-500+ kelime", description: "Kelime dağarcığı 300-500+ kelimeye ulaşır", ageMonth: 30 },
  { key: "month30_tells_short_stories", category: "language", title: "Kısa hikaye anlatır", description: "Yaşadığı bir olayı 2-3 cümle ile anlatabilir", ageMonth: 30 },
  { key: "month30_knows_colors", category: "cognitive", title: "3-4 rengi tanır", description: "En az 3-4 ana rengi adlandırabilir", ageMonth: 30 },
  { key: "month30_takes_turns", category: "social", title: "Sıra bekler", description: "Oyunda veya konuşmada sıra alma davranışı gösterir", ageMonth: 30 },

  // 33. Ay
  { key: "month33_pedals_tricycle", category: "motor", title: "Pedal çevirir", description: "Üç tekerlekli bisikletin pedallarını çevirerek sürebilir", ageMonth: 33 },
  { key: "month33_counts_objects_5", category: "cognitive", title: "5'e kadar sayar", description: "3-5 nesneyi sayabilir, sayı kavramı gelişir", ageMonth: 33 },
  { key: "month33_full_sentences", category: "language", title: "Tam cümleler kurar", description: "5+ kelimeli, dilbilgisi kurallarına yakın cümleler kurar", ageMonth: 33 },
  { key: "month33_understands_big_small", category: "cognitive", title: "Büyük-küçük kavrar", description: "Büyük/küçük, az/çok, uzun/kısa gibi karşılaştırmaları anlar", ageMonth: 33 },
  { key: "month33_plays_cooperatively", category: "social", title: "İşbirliğiyle oynar", description: "Ortak hedefli oyunlar oynar, rol dağılımı yapar", ageMonth: 33 },

  // 36. Ay (3 Yaş)
  { key: "month36_jumps_forward", category: "motor", title: "İleri zıplar", description: "İki ayağıyla 30-50 cm ileri zıplayabilir", ageMonth: 36 },
  { key: "month36_balances_one_foot", category: "motor", title: "Tek ayak üstünde durur", description: "3-5 saniye tek ayak üstünde dengede durabilir", ageMonth: 36 },
  { key: "month36_uses_scissors", category: "motor", title: "Makas kullanır", description: "Çocuk makasıyla düz çizgide kesebilir", ageMonth: 36 },
  { key: "month36_draws_person", category: "motor", title: "İnsan çizer", description: "Baş, gövde, kol ve bacakları olan insan figürü çizer", ageMonth: 36 },
  { key: "month36_1000_words", category: "language", title: "1000+ kelime", description: "Kelime dağarcığı 1000+ kelimeye ulaşır, karmaşık cümleler kurar", ageMonth: 36 },
  { key: "month36_asks_why", category: "language", title: "'Neden?' çağı", description: "Sürekli 'neden, niçin, nasıl' soruları sorar, merak duygusu zirvededir", ageMonth: 36 },
  { key: "month36_uses_past_tense", category: "language", title: "Geçmiş zaman kullanır", description: "Konuşmasında geçmiş zaman eklerini kullanmaya başlar", ageMonth: 36 },
  { key: "month36_daytime_toilet_trained", category: "motor", title: "Gündüz tuvalet eğitimi tamam", description: "Gündüzleri tamamen bezsiz kalabilir, tuvalete kendi gider", ageMonth: 36 },
  { key: "month36_knows_full_name", category: "cognitive", title: "Tam adını bilir", description: "Adını ve soyadını söyleyebilir", ageMonth: 36 },
  { key: "month36_imaginary_friends", category: "social", title: "Hayali arkadaş", description: "Hayali arkadaş edinebilir, zengin hayal gücü oyunları oynar", ageMonth: 36 },
  { key: "month36_makes_friends", category: "social", title: "Arkadaş edinir", description: "Akranlarıyla kalıcı arkadaşlıklar kurar, isimleriyle hitap eder", ageMonth: 36 },
  { key: "month36_shows_empathy_mature", category: "social", title: "Gelişmiş empati", description: "Arkadaşı üzgün olduğunda onu teselli etmeye çalışır", ageMonth: 36 },
];

export const milestoneCount = milestoneTemplates.length;
