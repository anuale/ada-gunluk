"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UtensilsCrossed,
  Moon,
  Baby,
  Droplets,
  Lightbulb,
  Syringe,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Send,
} from "lucide-react";
import { formatDuration, formatTimeAgo } from "@/components/tracking/timer";

interface Child {
  id: string;
  name: string;
  birthDate: string;
  gender: string | null;
}

interface DailyLog {
  id: string;
  type: string;
  startedAt: string;
  endedAt: string | null;
  data: Record<string, unknown> | null;
}

const tips = [
  { text: "Bebeğiniz ile bol bol konuşun. Yaptığınız her şeyi anlatın. İlk 3 yılda beyin gelişiminin %85'i tamamlanır.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Bebek ağladığında hemen koşmayın, birkaç saniye bekleyin. Bu 'pause' bebeğin kendi kendine sakinleşmesini öğrenmesine yardımcı olur.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Çocuğunuzun davranışının altında her zaman karşılanmamış bir ihtiyaç vardır. 'Senden nefret ediyorum' = 'Şu anda çok zorlanıyorum' demektir.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Öfke anında çocuk 'kapağı attıysa' önce sakinleşmesini bekleyin. Beynin düşünen kısmı çevrimdışıyken öğretemezsiniz.", source: "Dramsız Disiplin — Siegel & Bryson" },
  { text: "Kahkaha en değerli oyundur. Çocuğun güçlü olduğu oyunlar (yastık savaşı, güreş) saldırganlığı azaltır.", source: "Oyun Oynama Sanatı — Aletha Solter" },
  { text: "Sınırları sakin ve net koyun: 'Vurmak yok, seni tutmam gerekiyor.' Duyguları kabul edin, davranışı sınırlayın. Ödül ve ceza kullanmayın.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Çocuğunuzun iç dünyasını anlamaya çalışın. Değerler öğretilmez, yaşanır. Ebeveyn çocuğun en güçlü tanığıdır.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Çocuklar doğuştan tuvalet ihtiyaçlarını iletir. İşaret sesleri (çişşş, psss) kullanarak doğumdan itibaren tuvalet iletişimi kurabilirsiniz.", source: "Tuvalet İletişimi — Evren Bay Şengül" },
  { text: "0-3 yaş 'bilinçsiz emici zihin' dönemidir. Çocuk çevresindeki her şeyi sünger gibi emer. Gözlemleyin, müdahale etmeyin.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Çocuğunuza 'Kızgın olduğunu görüyorum' deyin. Duyguları onaylayın, yargılamayın. Övgüde çabayı vurgulayın, karakteri değil.", source: "Anne Baba ve Çocuk Arasında — Haim Ginott" },
  { text: "Ebeveyn olarak çocuğunuza en büyük hediyeniz, sakin ve tutarlı bir varlık olmanızdır. Onlar sizin duygusal durumunuzu ayna gibi yansıtır.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Bebeğinizin ağlamasına bir süre izin verin. Her ağlama acil durum değildir. Kendi kendine sakinleşme becerisi kazanması için fırsat tanıyın.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Çocuğunuza sınır koyarken 'Hayır'dan sonra alternatif sunun. 'Hayır, vurmak yok. Bunun yerine yastığa vurabilirsin.'", source: "Dramsız Disiplin — Siegel & Bryson" },
  { text: "Bebeğinizle göz teması kurarak konuşun. Yüzünüzü 20-30 cm mesafede tutun — yeni doğanlar en iyi bu mesafeyi görür.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Her gün en az 15 dakika, sadece çocuğunuza odaklanın. Telefonu bırakın, TV'yi kapatın, sadece onunla olun.", source: "Hold On to Your Kids — Neufeld & Maté" },
  { text: "Çocuğunuz size bir şey gösterdiğinde, ona tam dikkatinizi verin. Bu anlar bağlanma için altın değerindedir.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Yemek zamanlarını ailece geçirin. Fransızlar gibi tek bir ara öğün (16:30 goûter) yeterlidir. Sürekli atıştırma iştahı bozar.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Çocuğunuzun yanında asla onun hakkında olumsuz konuşmayın. Sizi anlamasa bile ses tonunuzu hisseder.", source: "Anne Baba ve Çocuk Arasında — Haim Ginott" },
  { text: "Oyuncak sayısını azaltın. Az sayıda, açık uçlu oyuncak (bloklar, toplar, basit bebekler) yaratıcılığı daha çok destekler.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Çocuğunuzun duygularını adlandırmasına yardımcı olun: 'Şu anda hayal kırıklığına uğramış görünüyorsun.'", source: "Dramsız Disiplin — Siegel & Bryson" },
  { text: "Bebeğiniz emeklemeye başladığında evi güvenli hale getirin, ama her şeyi yasaklamayın. Keşfetmesine izin verin.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Uyku rutini oluşturun: banyo, kitap, ninni, uyku. Her gün aynı sırayla yapın. Rutinler bebeğe güven verir.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Çocuğunuzun size anlattıklarını ciddiye alın. Onun dünyasında çok önemli olan şeyleri küçümsemeyin.", source: "Anne Baba ve Çocuk Arasında — Haim Ginott" },
  { text: "Her gün çocuğunuza kitap okuyun. 0-3 yaş arası kitap okumak, dil gelişiminin en güçlü destekleyicisidir.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Çocuğunuzun öfke nöbeti sırasında sakin kalın. Onun yanında olun ama nöbeti durdurmaya çalışmayın. Geçmesini bekleyin.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Tuvalet eğitimine çocuğunuz hazır olduğunda başlayın. Zorlamayın. Hazırlık işaretleri: 2 saat kuru kalma, tuvalete ilgi gösterme.", source: "Tuvalet İletişimi — Evren Bay Şengül" },
  { text: "Bebeğinizin ağlama tiplerini öğrenin: açlık ağlaması, yorgunluk ağlaması, rahatsızlık ağlaması farklıdır.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Çocuğunuzla birlikte doğada vakit geçirin. Toprak, çimen, yapraklar en iyi oyuncaklardır.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Kardeş kıskançlığında büyük çocuğa özel birebir zaman ayırın. 'Sen benim ilk göz ağrımsın' mesajını verin.", source: "Oyun Oynama Sanatı — Aletha Solter" },
  { text: "Çocuğunuza seçenek sunun ama sınırlı olsun: 'Mavi tişört mü giymek istersin, kırmızı mı?' — iki seçenek de kabul edilebilir olmalı.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Övgüyü betimleyici yapın: 'Bu resimde çok güzel renkler kullanmışsın' — 'Ne kadar yeteneklisin' yerine.", source: "Anne Baba ve Çocuk Arasında — Haim Ginott" },
  { text: "Bebeğinizin beslenme sinyallerini takip edin. Ağlamak geç bir sinyaldir; dudak şapırdatma, el ağıza götürme erken sinyallerdir.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Çocuğunuzun kendi kendine oynamasına izin verin. Sürekli onu eğlendirmek zorunda değilsiniz. Bağımsız oyun önemlidir.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Beslenme saatlerini düzene sokun. Düzenli öğün saatleri, çocuğun vücut saatini ve iştahını düzenler.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Çocuğunuzla konuşurken basit ve net olun. Uzun açıklamalar küçük çocuklar için kafa karıştırıcıdır.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Disiplini öğrenme fırsatı olarak görün. 'Bu davranışın sonucu şu oldu. Bir dahaki sefere ne yapabiliriz?'", source: "Dramsız Disiplin — Siegel & Bryson" },
  { text: "Bebeğinize her gün aynı ninniyi söyleyin. Tanıdık ses ve melodi, en zor anlarda bile onu sakinleştirir.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Küçük çocuklar için düzen çok önemlidir. Eşyaların yeri, günlük rutin değişmemeli. Bu onlara güven verir.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Çocuğunuz ağlarken 'ağlama' demeyin. 'Ağlamanı anlıyorum, buradasın, güvendesin' deyin.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Emzirme süresini takip edin. Her iki memeyi de eşit süre emzirmek süt üretimini dengeler.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Çocuğunuzla tensel temas kurun. Ten tene temas, bağlanma hormonu oksitosini artırır ve bebeği sakinleştirir.", source: "Hold On to Your Kids — Neufeld & Maté" },
  { text: "Hayır kelimesini sadece gerçekten önemli durumlarda kullanın. Her şeye hayır derseniz, anlamını yitirir.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Uyku öncesi ekran maruziyetini kesin. Mavi ışık melatonin üretimini baskılar, uykuya dalmayı zorlaştırır.", source: "Dramsız Disiplin — Siegel & Bryson" },
  { text: "Çocuğunuz bir şey başardığında süreci övün: 'Bu yapbozu tamamlamak için çok uğraştın, pes etmedin.'", source: "Anne Baba ve Çocuk Arasında — Haim Ginott" },
  { text: "Bebeğinizin ilk gülümsemesi, ilk kelimesi gibi anları kaçırmamak için telefonunuzu bir kenara bırakıp anın tadını çıkarın.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Çocuğunuzla birlikte yemek yapın. 2 yaşından itibaren basit mutfak işlerine yardım edebilir (yoğurma, karıştırma).", source: "Montessori Metodu — Maria Montessori" },
  { text: "Öfke nöbeti sırasında çocuğa 'sakin ol' demek işe yaramaz. Önce siz sakin olun, o size bakarak sakinleşecektir.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Her çocuğun gelişim hızı farklıdır. Kilometre taşlarını takip edin ama diğer çocuklarla kıyaslamayın.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Çocuğunuz yemek seçiyorsa ısrar etmeyin. Aynı yiyeceği farklı şekillerde sunmayı deneyin. 15-20 deneme gerekebilir.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Aile toplantıları yapın. Haftada bir, herkesin duygularını paylaştığı kısa bir aile toplantısı bağları güçlendirir.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Çocuğunuza 'aferin' yerine neyi iyi yaptığını söyleyin. 'Aferin' belirsizdir, betimleyici övgü öğreticidir.", source: "Anne Baba ve Çocuk Arasında — Haim Ginott" },
  { text: "Bebeğinizin altını değiştirirken ona ne yaptığınızı anlatın. Bu günlük rutinler bile dil gelişimi için fırsattır.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Evinizde çocuğunuzun seviyesinde bir dünya oluşturun: alçak askılar, ulaşılabilir oyuncak rafları, küçük masa-sandalye.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Çocuklar soru sorduğunda cevabı hemen vermek yerine 'Sence neden?' diye sorun. Düşünme becerisini geliştirir.", source: "Evet Beyinli Çocuk — Siegel & Bryson" },
  { text: "Her akşam günün en güzel anını paylaşın. Bu ritüel, minnettarlık duygusunu geliştirir.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Çocuğunuzla konuşurken cümlelerinizi bir seviye yukarıda kurun. 2 kelimeli cümle kuruyorsa, siz 3 kelimeli karşılık verin.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Çocuğunuza sarılmak için özel bir an yaratın. Günde en az 12 sarılma, duygusal gelişim için önerilir.", source: "Hold On to Your Kids — Neufeld & Maté" },
  { text: "Parmak boyası, kil, kum gibi duyusal materyallerle oynamasına izin verin. Duyusal keşif beyin gelişimini destekler.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Ağlama bir manipülasyon değil, iletişimdir. Bebekler ağlayarak ihtiyaçlarını iletir, sizi manipüle etmezler.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Çocuğunuzun korkularını ciddiye alın. 'Korkacak bir şey yok' demek yerine 'Bu sana korkutucu gelmiş' deyin.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Her aile bireyinin özel alanına saygı gösterin. Bu saygı, çocuğa da başkalarının sınırlarına saygı duymayı öğretir.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Gece uyanmalarında ışıkları açmayın, sessiz ve sakin olun. Bebeğinize 'gece uyku zamanı' mesajını tutarlı verin.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Çocuğunuzla geçirdiğiniz kaliteli zaman, miktarından önemlidir. 15 dakikalık tam odaklanmış oyun, 1 saatlik yarım ilgiden iyidir.", source: "Hold On to Your Kids — Neufeld & Maté" },
  { text: "Yemek masasında herkesin tabağında aynı yemek olsun. Çocuklar için ayrı yemek yapmak, seçici yeme davranışını pekiştirir.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Çocuğunuza 'kızma, üzülme' demek yerine duyguyu kabul edin. Tüm duygular geçerlidir, sadece bazı davranışlar sınırlanır.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Bebeğinizle müzik dinleyin, dans edin. Ritim duygusu ve beden farkındalığı erken yaşta gelişir.", source: "Oyun Oynama Sanatı — Aletha Solter" },
  { text: "Gün içinde bol bol isimlendirme yapın: 'Bu kırmızı bir elma', 'Bu mavi bir araba'. Nesne-isim eşleştirmesi dilin temelidir.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Çocuğunuzla ce-e oyunu oynayın. Bu basit oyun, nesne devamlılığı kavramını geliştirir ve ayrılık kaygısını azaltır.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Çocuğunuz bir hata yaptığında cezalandırmak yerine sonuçlarıyla yüzleşmesine izin verin ve birlikte çözüm bulun.", source: "Dramsız Disiplin — Siegel & Bryson" },
  { text: "Her gün dışarıda vakit geçirin. Güneş ışığı D vitamini için, temiz hava uyku kalitesi için önemlidir.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Bebeğinizin çıkardığı sesleri taklit ederek 'sohbet' edin. Bu sıra alma becerisini öğretir.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Evinizde koşulsuz sevgi ortamı yaratın. Çocuğunuz hata yaptığında bile sevildiğini bilmeli.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Oyuncakları rotasyonla verin. Tüm oyuncakları aynı anda sunmak yerine, haftalık değiştirerek ilgiyi canlı tutun.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Bebeğinizin altını değiştirirken yüzüne bakın, konuşun. Bu rutin bakım anları, bağlanma için önemli fırsatlardır.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Mükemmel ebeveyn olmaya çalışmayın. 'Yeterince iyi ebeveyn' olmak yeterlidir. Önemli olan tutarlılık ve sevgidir.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Çocuğunuz uyandığında kendi kendine biraz vakit geçirmesine izin verin. Hemen yanına koşmayın.", source: "Bebeğinize Fransız Kalın — Pamela Druckerman" },
  { text: "Küçük yaştan itibaren 'lütfen' ve 'teşekkür ederim' kullanın. Çocuklar görerek öğrenir, duyarak değil.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Bebeğinizin uyku işaretlerini takip edin: göz ovuşturma, esneme, huzursuzluk. Bu işaretleri gördüğünüzde hemen uyku rutinine başlayın.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Çocuğunuzla konuşurken göz hizanıza inin. Fiziksel olarak aynı seviyede olmak, kendini güvende ve önemli hissetmesini sağlar.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Beslenme zamanlarını stresten uzak tutun. Yemek savaşına girmeyin. Siz sağlıklı seçenekler sunun, o ne kadar yiyeceğine karar versin.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Çocuğunuzun kendi kıyafetini seçmesine izin verin. 2 yaşından itibaren basit seçimler yapabilir.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Özür dilemekten çekinmeyin. Ebeveyn olarak hata yaptığınızda özür dilemek, çocuğunuza sorumluluk almayı öğretir.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Bebeğiniz karın üstü zamanını sevmiyorsa kısa sürelerle başlayın. Ayna karşısında yapmak ilgisini çekebilir.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Dil gelişimi için şarkı söyleyin. Basit tekrarlı şarkılar, kelime öğrenimini hızlandırır.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Çocuğunuzla birlikte gülün. Mizah duygusu, stres hormonlarını azaltır ve bağlanmayı güçlendirir.", source: "Oyun Oynama Sanatı — Aletha Solter" },
  { text: "Her çocuğun mizacı farklıdır. Bazıları daha hassas, bazıları daha girişkendir. Mizacı değiştirmeye çalışmayın, onunla çalışın.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Ekran süresini 0-2 yaş için sıfırlayın, 2-3 yaş için günde 30 dakikayla sınırlayın. Birlikte izleyin ve içerik hakkında konuşun.", source: "WHO Ekran Süresi Rehberi" },
  { text: "Çocuğunuzun doktor kontrollerini aksatmayın. Aşıları zamanında yaptırın. Koruyucu sağlık, tedaviden her zaman iyidir.", source: "T.C. Sağlık Bakanlığı" },
  { text: "Bebeğinize kitap okurken ses tonunuzu değiştirin, farklı karakterler için farklı sesler kullanın. Bu dikkatini çeker.", source: "30 Milyon Kelime — Dana Suskind" },
  { text: "Banyo zamanını oyun zamanına dönüştürün. Su oyunları duyusal gelişimi destekler ve banyoyu keyifli hale getirir.", source: "Oyun Oynama Sanatı — Aletha Solter" },
  { text: "Çocuğunuzun kendi başına giyinme çabasını sabırla izleyin. 15 dakika sürebilir ama bu bağımsızlık için önemli bir adımdır.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Yürümeye yeni başlayan çocuğunuzun düşmesine izin verin (güvenli ortamda). Her düşüş, kalkmayı öğrenmek için bir fırsattır.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Her sabah çocuğunuza 'Seni seviyorum' deyin. Bu basit cümle, onun güven duygusunun temelini oluşturur.", source: "Geliştiren Anne-Baba — Doğan Cüceloğlu" },
  { text: "Çocukların en iyi öğrenme şekli oyundur. Oyunu bir lüks değil, gelişimin temel aracı olarak görün.", source: "Oyun Oynama Sanatı — Aletha Solter" },
  { text: "Bebeğinize masaj yapın. Özellikle banyo sonrası 5 dakikalık masaj, uyku kalitesini artırır ve bağlanmayı güçlendirir.", source: "L'età dei Miracoli — Hedvig Montgomery" },
  { text: "Tutarlı olun. Bugün 'hayır' dediğiniz şeye yarın 'evet' derseniz, çocuğunuzun kafası karışır ve sınırları test etmeye başlar.", source: "No Bad Kids — Janet Lansbury" },
  { text: "Çocuğunuza basit ev işleri verin. Oyuncakları toplamak, çamaşır sepete atmak gibi görevler sorumluluk duygusunu geliştirir.", source: "Montessori Metodu — Maria Montessori" },
  { text: "Ebeveyn olarak kendinize de zaman ayırın. Siz iyi olmadan çocuğunuza iyi bakamazsınız. Yorulduğunuzda yardım istemekten çekinmeyin.", source: "Good Inside — Dr. Becky Kennedy" },
  { text: "Bebeğinizin ek gıdaya geçişinde acele etmeyin. Her yeni gıdayı 3 gün arayla verin, alerji takibi yapın.", source: "T.C. Sağlık Bakanlığı" },
  { text: "Çocuğunuzun boy ve kilosunu düzenli takip edin. Büyüme eğrisinde ani sapmaları doktorunuza danışın.", source: "WHO Büyüme Standartları" },
  { text: "Çocuğunuzla sessiz anlar yaşayın. Her anı doldurmak zorunda değilsiniz. Sessizlik de bir bağlanma biçimidir.", source: "L'età dei Miracoli — Hedvig Montgomery" },
];

export default function DashboardPage() {
  const [child, setChild] = useState<Child | null>(null);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [milestones, setMilestones] = useState<{ category: string; achieved: number; total: number }[]>([]);
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * tips.length));
  const [aiInput, setAiInput] = useState("");
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetch("/api/children")
      .then((r) => r.json())
      .then((data) => {
        if (data.children?.length > 0) {
          const c = data.children[0];
          setChild(c);
          return Promise.all([
            fetch(`/api/daily-logs?childId=${c.id}&date=${today}`).then(r => r.json()),
            fetch(`/api/milestones?childId=${c.id}`).then(r => r.json()),
          ]);
        }
        return null;
      })
      .then((result) => {
        if (!result) return;
        const [logsData, milestonesData] = result;
        setLogs(logsData || []);
        const cats = ["motor", "language", "cognitive", "social"];
        const labels = ["Motor Beceriler", "Dil & İletişim", "Bilişsel", "Sosyal"];
        const progress = cats.map((cat, i) => {
          const catMils = (milestonesData || []).filter((m: { category: string; achievedAt: string | null }) => m.category === cat);
          return { category: labels[i], achieved: catMils.filter((m: { achievedAt: string | null }) => m.achievedAt).length, total: catMils.length };
        });
        setMilestones(progress);
      })
      .catch(() => {});
  }, []);

  const sendAi = async () => {
    if (!aiInput.trim() || !child) return;
    setAiLoading(true);
    try {
      const res = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: [{ role: "user", content: aiInput }], childContext: { name: child.name, ageMonths: age ? parseInt(age) : 0 } }) });
      const d = await res.json();
      setAiReply(d.reply || "Yanıt alınamadı.");
    } catch { setAiReply("Bağlantı hatası."); }
    setAiLoading(false);
    setAiInput("");
  };

  const age = child ? getAge(new Date(child.birthDate)) : null;

  const lastFeeding = logs.find((l) => l.type === "feeding");
  const lastSleep = logs.find((l) => l.type === "sleep");

  const getLogSummaryDetail = (log: DailyLog): string => {
    const d = log.data;
    if (!d) return "";
    if (log.type === "feeding") {
      const ft = d.feedType as string;
      if (ft === "breast") {
        const left = Math.floor(((d.leftDuration as number) || 0) / 60000);
        const right = Math.floor(((d.rightDuration as number) || 0) / 60000);
        const parts: string[] = [];
        if (left > 0) parts.push(`Sol: ${left} dk`);
        if (right > 0) parts.push(`Sağ: ${right} dk`);
        return parts.length > 0 ? `Anne Sütü • ${parts.join(", ")}` : "Anne Sütü";
      }
      if (ft === "formula") return `Formül • ${d.amount || "—"} ml`;
      return `Ek Gıda • ${d.amount || "—"}`;
    }
    if (log.type === "sleep" && log.startedAt && log.endedAt) {
      const dur = new Date(log.endedAt).getTime() - new Date(log.startedAt).getTime();
      const q = d.quality as number || 3;
      const loc = d.location as string;
      const locLabels: Record<string, string> = { crib: "Beşik", parents_bed: "Ebeveyn yatağı", stroller: "Bebek arabası", car_seat: "Araba koltuğu" };
      const parts: string[] = [formatDuration(dur), "⭐".repeat(q)];
      if (loc) parts.push(locLabels[loc] || loc);
      return parts.join(" • ");
    }
    if (log.type === "diaper") {
      const dt = d.diaperType as string;
      return dt === "wet" ? "Islak" : dt === "dirty" ? "Kaka" : "Islak + Kaka";
    }
    if (log.type === "ec") {
      return (d.success as boolean) ? "✅ Başarılı" : "❌ Kaçırma";
    }
    return "";
  };

  return (
    <div className="space-y-6">
      <section className="bg-primary-container text-on-primary-container rounded-2xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -right-6 -top-6 opacity-10 pointer-events-none">
          <svg width="160" height="160" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
        </div>
        <div className="relative z-10">
          {child ? (
            <>
              <h2 className="font-serif text-xl md:text-2xl mb-1">
                {child.name} bugün {age}
              </h2>
              <p className="text-sm opacity-90">
                Harika gidiyorsun! Bugün neler yaptınız?
              </p>
            </>
          ) : (
            <>
              <h2 className="font-serif text-xl md:text-2xl mb-1">
                Ada&apos;nın Günlüğü&apos;ne Hoş Geldiniz
              </h2>
              <p className="text-sm opacity-90 mb-3">
                Başlamak için bir çocuk profili ekleyin.
              </p>
              <Link
                href="/children/new"
                className="inline-flex items-center gap-2 bg-surface text-primary px-4 py-2.5 rounded-full text-sm font-medium hover:bg-surface-container-low transition-colors"
              >
                <Plus size={16} />
                Çocuk Ekle
              </Link>
            </>
          )}
        </div>
      </section>

      {child && (
      <section>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction
            href="/timeline?log=feeding"
            icon={UtensilsCrossed}
            label="Beslenme"
            bg="bg-feeding text-feeding-text"
          />
          <QuickAction
            href="/timeline?log=sleep"
            icon={Moon}
            label="Uyku"
            bg="bg-sleep text-sleep-text"
          />
          <QuickAction
            href="/timeline?log=diaper"
            icon={Baby}
            label="Alt Değiştirme"
            bg="bg-diaper text-diaper-text"
          />
          <QuickAction
            href="/timeline?log=ec"
            icon={Droplets}
            label="Tuvalet"
            bg="bg-ec text-ec-text"
          />
        </div>
      </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <article className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg text-on-surface">
                Bugünün Özeti <span className="text-[10px] text-on-surface-variant/30 font-sans align-top">v2</span>
              </h3>
              <Link
                href="/timeline"
                className="text-primary text-sm font-medium hover:underline"
              >
                Tümünü Gör
              </Link>
            </div>
            {logs.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-sm text-on-surface-variant">
                  Henüz bugün için kayıt yok. İlk kaydınızı ekleyin!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {lastFeeding && (
                  <SummaryItem
                    bg="bg-feeding text-feeding-text"
                    icon={UtensilsCrossed}
                    title="Son Beslenme"
                    detail={getLogSummaryDetail(lastFeeding)}
                    time={formatTimeAgo(new Date(lastFeeding.startedAt))}
                  />
                )}
                {lastSleep && (
                  <SummaryItem
                    bg="bg-sleep text-sleep-text"
                    icon={Moon}
                    title="Son Uyku"
                    detail={getLogSummaryDetail(lastSleep)}
                    time={formatTimeAgo(new Date(lastSleep.startedAt))}
                  />
                )}
                {!lastFeeding && !lastSleep && (
                  <p className="text-sm text-center text-on-surface-variant py-3">
                    Beslenme veya uyku kaydı bulunamadı
                  </p>
                )}

                {logs.length > 0 && (
                  <div className="pt-3 border-t border-outline-variant/10 mt-3">
                    <h4 className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
                      Tüm Kayıtlar
                    </h4>
                    <div className="space-y-1.5">
                      {logs.map((log) => (
                        <div key={log.id} className="flex items-center gap-2 text-xs text-on-surface-variant py-1">
                          {log.type === "feeding" ? (
                            <UtensilsCrossed size={12} className="text-feeding-text shrink-0" />
                          ) : log.type === "sleep" ? (
                            <Moon size={12} className="text-sleep-text shrink-0" />
                          ) : log.type === "diaper" ? (
                            <Baby size={12} className="text-diaper-text shrink-0" />
                          ) : (
                            <Droplets size={12} className="text-ec-text shrink-0" />
                          )}
                          <span className="truncate">{getLogSummaryDetail(log)}</span>
                          <span className="ml-auto shrink-0 text-on-surface-variant/50">
                            {new Date(log.startedAt).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </article>

          <article className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <h3 className="font-serif text-lg text-on-surface mb-4">
              Haftalık Gelişim
            </h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-32 h-32 shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-high"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="text-primary"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray="70, 100"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-serif text-2xl text-on-surface">
                    {milestones.filter(m => m.total > 0).length > 0
                      ? Math.round(milestones.reduce((s, m) => s + (m.total > 0 ? m.achieved / m.total : 0), 0) / Math.max(milestones.filter(m => m.total > 0).length, 1) * 100)
                      : "—"}
                  </span>
                  <span className="text-xs text-on-surface-variant">
                    {milestones.filter(m => m.total > 0).length > 0 ? "%" : ""}
                  </span>
                </div>
              </div>
              <div className="flex-1 w-full space-y-3">
                {milestones.some(m => m.total > 0) ? milestones.map((m) => (
                  <ProgressBar key={m.category} label={m.category} value={m.total > 0 ? Math.round((m.achieved / m.total) * 100) : 0} />
                )) : (
                  <p className="text-sm text-on-surface-variant text-center py-2">
                    Gelişim verisi için çocuk profili oluşturun.
                  </p>
                )}
              </div>
            </div>
          </article>
        </div>

        <div className="space-y-6">
          <aside className="bg-amber-50/80 rounded-2xl p-6 shadow-sm border border-amber-900/5 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb size={20} className="text-amber-700" />
                <h3 className="font-serif text-lg text-amber-900">Bugünün Önerisi</h3>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setTipIndex((i) => (i - 1 + tips.length) % tips.length)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-amber-700/60 hover:text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setTipIndex((i) => (i + 1) % tips.length)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-amber-700/60 hover:text-amber-700 hover:bg-amber-100 transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <blockquote className="text-sm text-amber-900/80 italic leading-relaxed mb-3">
              &ldquo;{tips[tipIndex].text}&rdquo;
            </blockquote>
            <span className="text-xs text-amber-800/70 font-medium">
              {tips[tipIndex].source}
            </span>
          </aside>

          <aside className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-3">
              <Syringe size={20} className="text-primary" />
              <h3 className="font-serif text-lg text-on-surface">
                Yaklaşan Aşılar
              </h3>
            </div>
            <p className="text-sm text-on-surface-variant">
              Aşı takvimi çocuk profili oluşturulduktan sonra görüntülenecek.
            </p>
          </aside>

          {child && (
          <aside className="bg-surface rounded-2xl p-6 shadow-sm border border-outline-variant/10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={20} className="text-primary" />
              <h3 className="font-serif text-lg text-on-surface">AI Asistan</h3>
            </div>
            {aiReply && <p className="text-sm text-on-surface leading-relaxed bg-surface-container-low rounded-xl p-3 mb-3">{aiReply}</p>}
            <div className="flex gap-2">
              <input type="text" value={aiInput} onChange={(e) => setAiInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendAi()}
                placeholder="Bir soru sor..." disabled={aiLoading}
                className="flex-1 px-4 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest text-sm focus:outline-none focus:border-primary" />
              <button onClick={sendAi} disabled={aiLoading || !aiInput.trim()}
                className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-surface-tint disabled:opacity-50">
                <Send size={16} />
              </button>
            </div>
          </aside>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon: Icon,
  label,
  bg,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  bg: string;
}) {
  return (
    <Link
      href={href}
      className="bg-surface rounded-2xl p-4 shadow-sm flex flex-col items-center justify-center gap-2 hover:bg-surface-container-low transition-colors border border-transparent hover:border-primary/20 group"
    >
      <div
        className={`w-11 h-11 rounded-full ${bg} flex items-center justify-center group-hover:scale-105 transition-transform`}
      >
        <Icon size={20} />
      </div>
      <span className="text-sm font-medium text-on-surface">{label}</span>
    </Link>
  );
}

function SummaryItem({
  bg,
  icon: Icon,
  title,
  detail,
  time,
}: {
  bg: string;
  icon: React.ElementType;
  title: string;
  detail: React.ReactNode;
  time: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-container-low">
      <div
        className={`w-10 h-10 rounded-full ${bg} flex items-center justify-center shrink-0`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <h4 className="text-sm font-medium text-on-surface">{title}</h4>
        <p className="text-xs text-on-surface-variant">{detail}</p>
      </div>
      <span className="text-xs text-on-surface-variant">{time}</span>
    </div>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  const color = value >= 80 ? "bg-primary" : value >= 50 ? "bg-primary/70" : "bg-amber-400";
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs font-medium text-on-surface">{label}</span>
        <span className="text-xs text-on-surface-variant">{value}%</span>
      </div>
      <div className="w-full bg-surface-container-highest rounded-full h-2">
        <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function getAge(birthDate: Date): string {
  const now = new Date();
  let years = now.getFullYear() - birthDate.getFullYear();
  let months = now.getMonth() - birthDate.getMonth();
  const days = now.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  if (years > 0) {
    return `${years} yıl ${months} ay ${Math.abs(days)} günlük`;
  }
  if (months > 0) {
    return `${months} ay ${Math.abs(days)} günlük`;
  }
  return `${Math.abs(days)} günlük`;
}
