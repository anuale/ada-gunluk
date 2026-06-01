import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const prisma = new PrismaClient({
  adapter: new PrismaPg(process.env["DATABASE_URL"]!),
});

const knowledgeItems = [
  {
    source: "30 Milyon Kelime",
    category: "language",
    ageRangeMinMonths: 0,
    ageRangeMaxMonths: 36,
    title: "3T Metodu: Tune In, Talk More, Take Turns",
    content: "Beyin gelişiminin %85'i ilk 3 yılda tamamlanır. Tune In (Uyumlan): Çocuğunuzun odaklandığı şeye siz de odaklanın. Talk More (Daha Fazla Konuş): Yaptığınız her şeyi anlatın, zengin kelime haznesi kullanın. Take Turns (Sırayla Konuş): Bebeğinizin agulamalarına sohbet eder gibi yanıt verin.",
    methodologyTags: ["3T", "dil gelişimi", "beyin gelişimi"],
  },
  {
    source: "Bebeğinize Fransız Kalın",
    category: "sleep",
    ageRangeMinMonths: 0,
    ageRangeMaxMonths: 12,
    title: "La Pause (Bekleme) ve Kendi Kendine Uyuma",
    content: "Bebek ağladığında birkaç dakika bekleyin. Bu 'pause' bebeğin uyku döngüleri arasında kendi kendine sakinleşmesine fırsat verir. Fransız bebeklerin çoğu 2-3 ay civarında gece boyunca uyur.",
    methodologyTags: ["uyku", "fransız ebeveynlik", "cadre"],
  },
  {
    source: "Good Inside",
    category: "social",
    ageRangeMinMonths: 12,
    ageRangeMaxMonths: 36,
    title: "MGI (En Cömert Yorumlama) ve Bağlantı Odaklı Ebeveynlik",
    content: "Çocuğunuzun davranışının altında her zaman karşılanmamış bir ihtiyaç vardır. 'Senden nefret ediyorum' = 'Şu anda çok zorlanıyorum' demektir. Bağlantı koptuğunda tamir edin, ceza vermeyin. Tüm çocuklar özünde iyidir.",
    methodologyTags: ["bağlanma", "disiplin", "duygusal gelişim"],
  },
  {
    source: "Dramsız Disiplin",
    category: "social",
    ageRangeMinMonths: 12,
    ageRangeMaxMonths: 72,
    title: "Bağlan ve Yönlendir (Connect and Redirect)",
    content: "1-2-3 Disiplin: 1) Bağlan (duygusal olarak yanında ol), 2) Yönlendir (sakinleşince öğret), 3) Pekiştir (daha sonra konuyu tekrar aç). Çocuk 'kapağı attığında' önce sakinleşmesini bekleyin, yukarı beyin çevrimdışıyken öğretemezsiniz.",
    methodologyTags: ["disiplin", "beyin gelişimi", "duygu düzenleme"],
  },
  {
    source: "No Bad Kids",
    category: "social",
    ageRangeMinMonths: 12,
    ageRangeMaxMonths: 48,
    title: "RIE: Saygılı Ebeveynlik ve Net Sınırlar",
    content: "Bebekler bütün insanlardır. Dürüst iletişim kurun, yaptığınız her şeyi anlatın. Sınırları sakin ve net koyun: 'Vurmak yok, seni tutmam gerekiyor.' Duyguları kabul edin, davranışı sınırlayın. Zaman aşımı, ödül ve ceza kullanmayın.",
    methodologyTags: ["RIE", "sınır koyma", "saygılı ebeveynlik"],
  },
  {
    source: "Oyun Oynama Sanatı",
    category: "cognitive",
    ageRangeMinMonths: 0,
    ageRangeMaxMonths: 96,
    title: "9 Bağlanma Oyunu Tipi",
    content: "1) Çocuk merkezli serbest oyun 2) Temalı sembolik oyun 3) Davranışa duyarlı oyun 4) Saçma/komik oyun 5) Ayrılık oyunları (ce-e) 6) Çocuğun güçlü olduğu oyunlar 7) Regresyon oyunu 8) Fiziksel temas oyunları 9) İşbirliği oyunları. Kahkaha en değerli oyundur, gerginliği azaltır.",
    methodologyTags: ["oyun", "bağlanma", "duygusal iyileşme"],
  },
  {
    source: "Tuvalet İletişimi",
    category: "motor",
    ageRangeMinMonths: 0,
    ageRangeMaxMonths: 30,
    title: "EC: Doğumdan İtibaren Tuvalet İletişimi",
    content: "Bebekler doğuştan tuvalet ihtiyaçlarını iletir. İşaret sesleri (çişşş, psss) kullanın. Zamanlama: uyandıktan sonra, beslendikten 10-15 dk sonra, dışarı çıkmadan önce. Pozisyon: Bebeğin sırtı size dönük, lavabo/klozet üzerinde tutun. Bez yedek olarak kullanılabilir.",
    methodologyTags: ["EC", "tuvalet eğitimi", "bezsiz"],
  },
  {
    source: "Montessori Metodu",
    category: "cognitive",
    ageRangeMinMonths: 0,
    ageRangeMaxMonths: 36,
    title: "Emici Zihin ve Hassas Dönemler",
    content: "0-3 yaş 'bilinçsiz emici zihin' dönemidir. Çocuk çevresindeki her şeyi sünger gibi emer. Hassas dönemler: Düzen (0-3), Hareket (0-4), Dil (0-6), Duyusal incelik (0-5), Küçük nesneler (1-4), Sosyal davranış (2.5-6). Çocuğu gözlemleyin, müdahale etmeyin, hazırlanmış çevre sunun.",
    methodologyTags: ["montessori", "hassas dönemler", "emici zihin"],
  },
  {
    source: "Geliştiren Anne-Baba",
    category: "social",
    ageRangeMinMonths: 0,
    ageRangeMaxMonths: 216,
    title: "Ebeveyn Çocuğun En Güçlü Tanığıdır",
    content: "Çocuğunuzun iç dünyasını anlamaya çalışın. Değerler öğretilmez, yaşanır. Aile toplantıları yapın. Kendi ebeveynliğinizin farkında olun. Çocuğunuza koşulsuz sevgi ve güven verin. Türk kültüründe aile bağları ve saygı temel değerlerdir.",
    methodologyTags: ["türk ebeveynlik", "aile değerleri", "farkındalık"],
  },
  {
    source: "Anne Baba ve Çocuk Arasında",
    category: "language",
    ageRangeMinMonths: 12,
    ageRangeMaxMonths: 216,
    title: "Ginott İletişim Metodu",
    content: "Duyguları onaylayın: 'Kızgın olduğunu görüyorum.' Betimleyin, yargılamayın: 'Yerde boya var' vs 'Ne kadar dağınıksın!' Övgüde çabayı vurgulayın, karakteri değil: 'Bu problemi çözmek için çok uğraştın.' Tehdit, rüşvet, alay ve nutuk çekmekten kaçının.",
    methodologyTags: ["iletişim", "duygu onaylama", "övgü"],
  },
];

async function main() {
  console.log("Seeding knowledge base...");

  for (const item of knowledgeItems) {
    await prisma.knowledgeItem.upsert({
      where: {
        id: `${item.source}-${item.title}`.replace(/\s+/g, "-").toLowerCase().slice(0, 50),
      },
      update: item,
      create: {
        id: `${item.source}-${item.title}`.replace(/\s+/g, "-").toLowerCase().slice(0, 50),
        ...item,
      },
    });
  }

  console.log(`Seeded ${knowledgeItems.length} knowledge items.`);
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
