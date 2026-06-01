export interface VaccineTemplate {
  key: string;
  name: string;
  doseNumber: number;
  ageMonth: number;
  description: string;
}

export const vaccineTemplates: VaccineTemplate[] = [
  { key: "hep_b_1", name: "Hepatit B", doseNumber: 1, ageMonth: 0, description: "Doğumda - ilk 24 saat içinde" },
  { key: "hep_b_2", name: "Hepatit B", doseNumber: 2, ageMonth: 1, description: "1. ayın sonunda" },
  { key: "bcg", name: "BCG (Verem)", doseNumber: 1, ageMonth: 2, description: "Sol omuza intradermal tek doz" },
  { key: "dapt_ipv_hib_1", name: "DaPT-IPV-Hib (5'li karma)", doseNumber: 1, ageMonth: 2, description: "Difteri, Boğmaca, Tetanoz, Çocuk Felci, Hib" },
  { key: "pcv_1", name: "KPA (Pnömokok)", doseNumber: 1, ageMonth: 2, description: "Zatürre aşısı 1. doz" },
  { key: "dapt_ipv_hib_2", name: "DaPT-IPV-Hib (5'li karma)", doseNumber: 2, ageMonth: 4, description: "4. ay 2. doz" },
  { key: "pcv_2", name: "KPA (Pnömokok)", doseNumber: 2, ageMonth: 4, description: "Zatürre aşısı 2. doz" },
  { key: "dapt_ipv_hib_3", name: "DaPT-IPV-Hib (5'li karma)", doseNumber: 3, ageMonth: 6, description: "6. ay 3. doz" },
  { key: "opv_1", name: "OPA (Ağızdan Çocuk Felci)", doseNumber: 1, ageMonth: 6, description: "Ağızdan damla" },
  { key: "pcv_3", name: "KPA (Pnömokok)", doseNumber: 3, ageMonth: 6, description: "Zatürre aşısı 3. doz" },
  { key: "kkk_1", name: "KKK (Kızamık-Kızamıkçık-Kabakulak)", doseNumber: 1, ageMonth: 12, description: "12. ay ilk doz" },
  { key: "varicella_1", name: "Suçiçeği (Varisella)", doseNumber: 1, ageMonth: 12, description: "12. ay tek doz" },
  { key: "hep_a_1", name: "Hepatit A", doseNumber: 1, ageMonth: 12, description: "12. ay ilk doz" },
  { key: "dapt_ipv_hib_r", name: "DaPT-IPV-Hib (5'li karma) Rapel", doseNumber: 4, ageMonth: 18, description: "18. ay pekiştirme dozu" },
  { key: "opv_r", name: "OPA (Ağızdan Çocuk Felci) Rapel", doseNumber: 2, ageMonth: 18, description: "18. ay pekiştirme" },
  { key: "hep_a_2", name: "Hepatit A", doseNumber: 2, ageMonth: 18, description: "18. ay ikinci doz" },
  { key: "kkk_2", name: "KKK (Kızamık-Kızamıkçık-Kabakulak)", doseNumber: 2, ageMonth: 48, description: "4 yaş (48. ay) ilkokul öncesi" },
  { key: "dapt_ipv_hib_r2", name: "DaBT-IPA (4'lü karma) Rapel", doseNumber: 5, ageMonth: 48, description: "4 yaş pekiştirme" },
];

export function getVaccinesByChildAge(birthDate: Date): {
  upcoming: typeof vaccineTemplates;
  past: typeof vaccineTemplates;
} {
  const now = new Date();
  const ageInDays = Math.floor((now.getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24));
  const ageInMonths = Math.floor(ageInDays / 30.44);

  const past: typeof vaccineTemplates = [];
  const upcoming: typeof vaccineTemplates = [];

  for (const v of vaccineTemplates) {
    const vaccineDate = new Date(birthDate);
    vaccineDate.setMonth(vaccineDate.getMonth() + v.ageMonth);

    if (vaccineDate <= now) {
      past.push(v);
    } else {
      upcoming.push(v);
    }
  }

  return { upcoming: upcoming.slice(0, 3), past };
}
