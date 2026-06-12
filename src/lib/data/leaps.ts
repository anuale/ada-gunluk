export interface LeapData {
  week: number;
  title: string;
  world: string;
  ageLabel: string;
  durationDays: string;
  signs: string[];
  skills: string[];
  activities: string[];
  tips: string[];
}

export const leaps: LeapData[] = [
  {
    week: 5,
    title: "Değişen Duyular Dünyası",
    world: "Bebek dış dünyadan gelen duyusal sinyalleri daha net algılamaya başlar.",
    ageLabel: "5. Hafta (1 Ay)",
    durationDays: "1-7 gün",
    signs: [
      "Daha fazla ağlama veya huzursuzluk",
      "Anneye daha fazla yapışma, sarılma isteği",
      "Sadece annenin kucağında sakinleşme",
      "Uyku düzeninde bozulma",
      "Daha sık emmek isteme"
    ],
    skills: [
      "Daha uzun süre uyanık kalma",
      "Nesnelere ve yüzlere daha uzun bakma",
      "Çevreye daha fazla ilgi gösterme",
      "İlk bilinçli gülümseme",
      "Daha fazla ses çıkarma (agulama)"
    ],
    activities: [
      "Kontrastlı siyah-beyaz kartlar gösterin",
      "Farklı dokuları hissettirin (ipek, pamuk, havlu)",
      "Yüzünüze odaklanması için 20-30 cm mesafede durun",
      "Yumuşak ninniler söyleyin",
      "Göz teması kurarak konuşun"
    ],
    tips: [
      "Bu dönem bebeğin duyuları açılıyor. Çok fazla uyaran vermeyin.",
      "Ten tene teması artırın. Güven verir.",
      "Bebeğiniz daha çok ağlayabilir, bu geçici bir dönemdir.",
      "Kendi uyku ve yemek düzeninizi de ihmal etmeyin."
    ]
  },
  {
    week: 8,
    title: "Oluşumlar Dünyası",
    world: "Bebek artık nesnelerin bütünlüğünü algılamaya başlar. Kollar ve bacaklar artık onundur.",
    ageLabel: "8. Hafta (2 Ay)",
    durationDays: "3-14 gün",
    signs: [
      "Başını çevirerek ilgi gösterir",
      "Daha fazla sosyal gülümseme",
      "Kendi ellerini keşfetmeye başlar",
      "Seslere tepki verir",
      "Daha uzun uyanık kalma süreleri"
    ],
    skills: [
      "Kendi ellerini ve ayaklarını inceler",
      "Nesneleri kısa süre tutabilir",
      "Sesin geldiği yöne döner",
      "Gülümsemeye gülümsemeyle karşılık verir",
      "Daha fazla ses çıkarır (agu, ugu)"
    ],
    activities: [
      "Bebek spor salonu (oyuncaklı halı) kullanın",
      "Çıngırak ve hafif sesli oyuncaklar verin",
      "Karın üstü zamanı artırın",
      "Taklit oyunları oynayın (dil çıkarma, gülümseme)",
      "Farklı müzik türleri dinletin"
    ],
    tips: [
      "Bu haftalarda bebeğiniz vücudunu keşfediyor. Bol bol serbest hareket imkanı verin.",
      "Sıkı kundaklamayın, kollarını ve bacaklarını hareket ettirmesine izin verin.",
      "Her uyandığında onunla 'sohbet' edin. Ses çıkarmasını teşvik edin."
    ]
  },
  {
    week: 12,
    title: "Yumuşak Geçişler Dünyası",
    world: "Bebek artık yumuşak geçişleri, ses tonu değişimlerini ve hareketlerdeki akışkanlığı fark eder.",
    ageLabel: "12. Hafta (3 Ay)",
    durationDays: "1-7 gün",
    signs: [
      "Başını dik tutabilir ve çevirebilir",
      "Sesli kahkaha atmaya başlar",
      "Daha sosyal ve etkileşimli",
      "Nesneleri ağzına götürür",
      "Dönmeye başlar"
    ],
    skills: [
      "Yüzüstü pozisyonda kollarıyla vücudunu kaldırabilir",
      "Nesnelere uzanıp kavrayabilir",
      "Yumuşak-yüksek ses ayrımı yapabilir",
      "Farklı duygulara ses tonuyla tepki verir",
      "El-göz koordinasyonu gelişir"
    ],
    activities: [
      "Farklı kumaş ve dokularla oynama imkanı verin",
      "Yumuşak müzik ve şarkılar söyleyin",
      "Basit saklambaç (ce-e) oyunları başlatın",
      "Sallanma ve hafif sıçratma hareketleri yapın",
      "Su oyunlarına başlayın (banyo eğlencesi)"
    ],
    tips: [
      "Bu dönemde bebeğiniz her şeyi ağzına götürecek. Bu normal, keşif yöntemidir.",
      "Oyuncağın birini saklayıp diğerini vererek neden-sonuç ilişkisi kurmasına yardım edin.",
      "Ses tonunuzla duyguyu ifade edin, bebeğiniz bunu anlamaya başlıyor."
    ]
  },
  {
    week: 19,
    title: "Olaylar Dünyası",
    world: "Bebek olaylar arasındaki sıralamayı anlamaya başlar. 'Önce bu olur, sonra şu olur.'",
    ageLabel: "19. Hafta (4.5 Ay)",
    durationDays: "1-7 gün",
    signs: [
      "Nesneleri bir elinden diğerine geçirir",
      "Destekle oturmaya başlar",
      "Daha fazla uzanır ve kavrar",
      "Sesleri taklit etmeye başlar",
      "İsmine daha net tepki verir"
    ],
    skills: [
      "Destekli oturma",
      "Nesneleri sallama, vurma",
      "Düşen nesneyi gözleriyle takip",
      "Ayna karşısında kendine gülümseme",
      "Babıldamaya başlama (ba-ba, da-da)"
    ],
    activities: [
      "Neden-sonuç oyuncakları verin (düğmeye basınca ses çıkaran)",
      "Ce-e oyunlarını geliştirin (yüzünü kapat-aç)",
      "Birlikte aynaya bakın, isimlendirin",
      "Yumuşak toplarla oynayın (atma-tutma)",
      "Basit resimli kitaplar gösterin"
    ],
    tips: [
      "Bu dönem bebeğin 'araştırmacı' olduğu dönemdir. Merakını destekleyin.",
      "Tehlikeli nesneleri ulaşamayacağı yere kaldırın, gerisini keşfetmesine izin verin.",
      "Her gördüğü şeyi isimlendirin. Kelime dağarcığı oluşmaya başlıyor."
    ]
  },
  {
    week: 26,
    title: "İlişkiler Dünyası",
    world: "Bebek nesneler ve insanlar arasındaki ilişkileri anlamaya başlar. Uzaklık, konum, 'içinde-dışında' gibi.",
    ageLabel: "26. Hafta (6 Ay)",
    durationDays: "1-7 gün",
    signs: [
      "Desteksiz kısa süre oturabilir",
      "Emekleme hazırlığı (karın üstü dönme, sürünme)",
      "Yabancı kaygısı başlangıcı",
      "Nesneleri bir kaba koyma-çıkarma",
      "Ayrılık kaygısı işaretleri"
    ],
    skills: [
      "Desteksiz oturma",
      "İnce motor becerilerde ilerleme",
      "'Mama', 'dada' gibi heceler",
      "Nesne devamlılığı (saklanan şeyi arama)",
      "İnsanları yakın-uzak ayrımı"
    ],
    activities: [
      "Kap-kacak oyunları (kaba nesneleri koy-çıkar)",
      "Saklambaç oyunları (oyuncağı örtü altına sakla)",
      "Parmak oyunları ve basit şarkılı oyunlar",
      "Farklı mesafelerden seslenme oyunları",
      "Yumuşak bloklarla inşa etme"
    ],
    tips: [
      "Ayrılık kaygısı bu dönemde başlayabilir. Kısa süreli ayrılıklar deneyimletin.",
      "Nesne devamlılığı gelişiyor. Oyuncağını saklayın, bulsun. Bu önemli bir bilişsel sıçramadır.",
      "Beslenme düzenini oturtun, yeni gıdaları yavaş yavaş tanıtın."
    ]
  },
  {
    week: 37,
    title: "Kategoriler Dünyası",
    world: "Bebek nesneleri kategoriler halinde gruplamaya başlar. 'Bu bir hayvan, bu bir yiyecek.'",
    ageLabel: "37. Hafta (8.5 Ay)",
    durationDays: "1-7 gün",
    signs: [
      "Emeklemeye başlama",
      "İnce motor becerilerde belirgin ilerleme",
      "Nesneleri sınıflandırma davranışı",
      "Daha fazla ses ve hece tekrarı",
      "Tanıdıkları ve yabancıları net ayırt etme"
    ],
    skills: [
      "Emekleme veya popo üstü sürünme",
      "Parmak ucuyla küçük nesneleri tutma (kıskaç tutuşu)",
      "Nesneleri kategoriler halinde keşfetme",
      "Anlamlı 'anne', 'baba' çağrıları",
      "Basit taklit oyunları"
    ],
    activities: [
      "Hayvan sesleri çıkarma oyunu ('inek möö der')",
      "Küçük nesneleri ayırma (güvenli, büyük parçalar)",
      "Mutfak kapları ile oynama (farklı boyutlarda)",
      "Parmak gıdalarla kendi yeme alıştırması",
      "Bol bol emekleme alanı sağlayın"
    ],
    tips: [
      "Evinizi bebek güvenli hale getirin. Emekleme dönemi başlıyor.",
      "Nesneleri isimlendirirken kategorisini de belirtin: 'Bu bir araba, taşıt.'",
      "Kendi kendine yeme denemelerini destekleyin, dağınıklığa hazır olun."
    ]
  },
  {
    week: 46,
    title: "Zincirleme Olaylar Dünyası",
    world: "Bebek olayların birbirini nasıl takip ettiğini anlar. Eylemleri sıralayarak hedefe ulaşır.",
    ageLabel: "46. Hafta (10.5 Ay)",
    durationDays: "1-7 gün",
    signs: [
      "Tutunarak ayağa kalkma",
      "Eşyalara tutunarak sıralama (yan yan yürüme)",
      "Daha karmaşık oyunlar kurma",
      "Ağlayarak veya jestlerle istek belirtme",
      "İlk anlamlı kelimeler"
    ],
    skills: [
      "Tutunarak ayağa kalkma ve sıralama",
      "İlk adımlar (tutunarak)",
      "Alkış yapma, baş baş yapma",
      "Basit komutları anlama ('topu ver')",
      "İlk kelimeler (1-3 anlamlı kelime)"
    ],
    activities: [
      "Alçak mobilyalarla güvenli sıralama alanı oluşturun",
      "İtmeli-çekmeli oyuncaklar verin",
      "Müzikli oyuncaklarla dans edin",
      "Basit yapbozlar (büyük parçalı)",
      "'Nerede?' oyunu (burun, ağız gösterme)"
    ],
    tips: [
      "Bu dönem motor becerilerin patladığı dönemdir. Güvenli ortam sağlayın.",
      "Her başarısını alkışlayın, özgüveni gelişiyor.",
      "Anlamasa bile yaptığınız her şeyi anlatın, dil gelişimi için çok kritik dönem."
    ]
  },
  {
    week: 55,
    title: "Programlar Dünyası",
    world: "Bebek günlük olayların bir programı olduğunu anlar. Rutinleri fark eder.",
    ageLabel: "55. Hafta (12.5 Ay)",
    durationDays: "1-7 gün",
    signs: [
      "İlk bağımsız adımlar",
      "Daha fazla öfke nöbeti (isteklerini ifade edemediğinde)",
      "Rutinlere bağlılık (aynı sırayla yapılmasını isteme)",
      "Sahiplenme davranışı ('benim')",
      "Daha fazla kelime anlama ve söyleme"
    ],
    skills: [
      "Yürümeye başlama",
      "3-10 anlamlı kelime kullanma",
      "Kaşıkla kendi yemeğini yiyebilme",
      "Basit işleri taklit etme (süpürme, silme)",
      "Olayların sırasını hatırlama"
    ],
    activities: [
      "Günlük rutinleri birlikte yapın (oyuncak toplama, el yıkama)",
      "Basit hikaye kitapları okuyun, resimleri isimlendirin",
      "Yürüme alıştırmaları için geniş, güvenli alan",
      "Müzik eşliğinde hareket oyunları",
      "Birlikte basit yemek hazırlığı (karıştırma, koyma)"
    ],
    tips: [
      "Rutinlere sadık kalın. Bu dönemde düzen bebek için çok önemlidir.",
      "Öfke nöbetleri normaldir. Sakin kalın, nöbet geçene kadar yanında olun.",
      "Seçenek sunarak bağımsızlığını destekleyin: 'Mavi mi kırmızı mı?'"
    ]
  },
  {
    week: 64,
    title: "İlkeler Dünyası",
    world: "Bebek eylemlerin arkasındaki ilkeleri anlamaya başlar. Nedensellik ve kuralları kavrar.",
    ageLabel: "64. Hafta (14.5 Ay)",
    durationDays: "1-14 gün",
    signs: [
      "Güvenli yürüme ve koşma başlangıcı",
      "Daha karmaşık cümleler anlama",
      "İnatlaşma ve 'hayır' deme",
      "Sembolik oyun başlangıcı",
      "Daha fazla bağımsızlık arayışı"
    ],
    skills: [
      "Dengeli yürüme ve koşma",
      "Karalama yapma (kalem tutma)",
      "Kule yapma (2-3 blok)",
      "15-30 kelime",
      "'Lütfen', 'teşekkür' gibi kavramları öğrenme"
    ],
    activities: [
      "Boyama ve karalama aktiviteleri",
      "Bloklarla inşa etme oyunları",
      "Basit kurallı oyunlar (sıra bekleme)",
      "Ev işlerine yardım etme (çamaşır makinesine atma)",
      "Rol yapma oyunları (bebek besleme, telefonla konuşma)"
    ],
    tips: [
      "Bu dönem 'hayır' dönemidir. Sınırları net ama esnek tutun.",
      "Seçme şansı verin ama seçenekler sınırlı olsun. Her ikisi de kabul edilebilir olmalı.",
      "Olumlu davranışları anında pekiştirin, olumsuzları görmezden gelin."
    ]
  },
  {
    week: 75,
    title: "Sistemler Dünyası",
    world: "Bebek artık sistemleri anlar. Toplum kuralları, ahlaki değerler ve karmaşık nedensellikleri kavramaya başlar.",
    ageLabel: "75. Hafta (17 Ay)",
    durationDays: "1-14 gün",
    signs: [
      "Daha karmaşık cümleler kurma",
      "Kendi başına bir şeyler yapma ısrarı",
      "Duyguları daha net ifade etme",
      "Sosyal kuralları anlamaya başlama",
      "Hayali arkadaş ve oyunlar"
    ],
    skills: [
      "50+ kelime, 2-3 kelimeli cümleler",
      "Kendi giyinme-soyunma denemeleri",
      "Tuvalet eğitimi hazırlığı",
      "Paylaşma ve sıra bekleme",
      "Basit problem çözme"
    ],
    activities: [
      "Karmaşık hayali oyunlar (doktorculuk, evcilik)",
      "Basit mutfak işleri (karıştırma, yoğurma)",
      "Parkta tırmanma, kayma, sallanma",
      "Renk ve şekil eşleştirme oyunları",
      "Şarkılı, danslı grup aktiviteleri"
    ],
    tips: [
      "'Ben yapacağım!' dönemi. Sabırlı olun, kendi yapmasına izin verin.",
      "Tuvalet eğitimi için hazırlık işaretlerini takip edin ama zorlamayın.",
      "Sosyal beceriler hızla gelişiyor. Oyun gruplarına katılmasını sağlayın."
    ]
  }
];
