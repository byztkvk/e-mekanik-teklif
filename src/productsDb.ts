export interface ProductItem {
  id: string;
  name: string;
  unit: string;
  defaultQty: number;
  sorumlu: 'YÜKLENİCİ' | 'İŞVEREN' | string;
  marka: string;
  description?: string;
  isSubItem?: boolean;
  parentId?: string;
  factor?: number; // For "Boru montaj bedeli" type items
  fiyat?: number;
}

export interface Category {
  name: string;
  items: ProductItem[];
}

export interface SheetCategory {
  name: string; // "SIHHİ TESİSAT", "ISITMA TESİSATI", "DOĞALGAZ TESİSATI"
  categories: Category[];
}

export const productsDb: SheetCategory[] = [
  {
    name: "SIHHİ TESİSAT",
    categories: [
      {
        name: "VİTRİFİYE & MONTAJ ELEMANLARI",
        items: [
          {
            id: "sihhi-lavabo",
            name: "LAVABO MONTAJ MALZEMESİ",
            unit: "Takım",
            defaultQty: 1,
            sorumlu: "İŞVEREN",
            marka: "",
            description: "Gömme tip bataryalı, lavabo üzerine monte edilir, lavabo montajı dahil ve pirinçten kromajlı ara muslukları ve bağlantı boruları dahil, özel pirinçten borulu tip kumandalı sifonlu."
          },
          {
            id: "sihhi-klozet-gömme",
            name: "Gömme Rezervuar (Klozet bileşeni)",
            unit: "Adet",
            defaultQty: 34,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Gömme tip rezervuarlı asma klozet bileşeni."
          },
          {
            id: "sihhi-klozet-panel",
            name: "Kumanda Paneli (Klozet bileşeni)",
            unit: "Adet",
            defaultQty: 34,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Gömme tip rezervuarlı asma klozet bileşeni."
          },
          {
            id: "sihhi-klozet-asma",
            name: "Asma Klozet (Klozet bileşeni)",
            unit: "Adet",
            defaultQty: 34,
            sorumlu: "İŞVEREN",
            marka: "",
            description: "Gömme tip rezervuarlı asma klozet bileşeni."
          },
          {
            id: "sihhi-klozet-kapak",
            name: "Klozet Kapağı (Klozet bileşeni)",
            unit: "Adet",
            defaultQty: 34,
            sorumlu: "İŞVEREN",
            marka: "",
            description: "Gömme tip rezervuarlı asma klozet bileşeni."
          },
          {
            id: "sihhi-klozet-valf",
            name: "Ankastre Stop Valf (Klozet bileşeni)",
            unit: "Adet",
            defaultQty: 34,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Gömme tip rezervuarlı asma klozet bileşeni."
          },
          {
            id: "sihhi-dus-montaj",
            name: "DUŞ VE TESİSAT MONTAJI",
            unit: "Takım",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Duş bataryası, el duşu ve tepe duşu dahil."
          },
          {
            id: "sihhi-evye-montaj",
            name: "EVİYE MONTAJ MALZEMESİ",
            unit: "Takım",
            defaultQty: 1,
            sorumlu: "İŞVEREN",
            marka: "",
            description: "Evye, Evye bataryası, Ara musluk ve fleksleri, evye sifonu dahil."
          },
          {
            id: "sihhi-camasir-musluk",
            name: "ÇAMAŞIR MAKİNESİ MUSLUĞU",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "İŞVEREN",
            marka: ""
          },
          {
            id: "sihhi-bulasik-musluk",
            name: "BULAŞIK MAKİNESİ MUSLUĞU",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "İŞVEREN",
            marka: ""
          },
          {
            id: "sihhi-aksesuar-montaj",
            name: "AKSESUAR MONTAJI",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          }
        ]
      },
      {
        name: "TEMİZ SU HATLARI (PPRC)",
        items: [
          {
            id: "sihhi-pprc-20",
            name: "PPRC Boru Ø 20 mm",
            unit: "Metre",
            defaultQty: 200,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Polipropilen temiz su borusu (PN 20 Kompozit boru). Islak hacim içi temiz su hatları ve klima drenaj hatları için, DIN 8077, DIN 8078'e uygun, sağlık kuruluşlarından onaylı."
          },
          {
            id: "sihhi-pprc-25",
            name: "PPRC Boru Ø 25 mm",
            unit: "Metre",
            defaultQty: 400,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Polipropilen temiz su borusu (PN 20 Kompozit boru)."
          },
          {
            id: "sihhi-pprc-32",
            name: "PPRC Boru Ø 32 mm",
            unit: "Metre",
            defaultQty: 150,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Polipropilen temiz su borusu (PN 20 Kompozit boru)."
          },
          {
            id: "sihhi-pprc-40",
            name: "PPRC Boru Ø 40 mm",
            unit: "Metre",
            defaultQty: 100,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Polipropilen temiz su borusu (PN 20 Kompozit boru)."
          },
          {
            id: "sihhi-pprc-50",
            name: "PPRC Boru Ø 50 mm",
            unit: "Metre",
            defaultQty: 30,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Polipropilen temiz su borusu (PN 20 Kompozit boru)."
          },
          {
            id: "sihhi-pprc-montaj",
            name: "Boru montaj malzemesi bedeli (PPRC)",
            unit: "Faktör",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Temiz su boruları montaj malzemesi bedeli (Toplam boru tutarının %45'i olarak hesaplanabilir veya elle girilebilir).",
            factor: 0.45
          }
        ]
      },
      {
        name: "PİS SU HATLARI (PVC SESSİZ)",
        items: [
          {
            id: "sihhi-pvc-50",
            name: "PVC Sessiz Pis Su Borusu Ø 50 mm",
            unit: "Metre",
            defaultQty: 200,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Sert PVC pis su boruları (3.2 mm sessiz boru). Daire içlerinde duvar içi hatlarda, kolonlarda ve yağmur suyu inişlerinde."
          },
          {
            id: "sihhi-pvc-70",
            name: "PVC Sessiz Pis Su Borusu Ø 70 mm",
            unit: "Metre",
            defaultQty: 50,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Sert PVC pis su borusu."
          },
          {
            id: "sihhi-pvc-100",
            name: "PVC Sessiz Pis Su Borusu Ø 100 mm",
            unit: "Metre",
            defaultQty: 350,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Sert PVC pis su borusu."
          },
          {
            id: "sihhi-pvc-125",
            name: "PVC Sessiz Pis Su Borusu Ø 125 mm",
            unit: "Metre",
            defaultQty: 50,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Sert PVC pis su borusu."
          },
          {
            id: "sihhi-pvc-150",
            name: "PVC Sessiz Pis Su Borusu Ø 150 mm",
            unit: "Metre",
            defaultQty: 20,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ",
            description: "Sert PVC pis su borusu."
          },
          {
            id: "sihhi-pvc-montaj",
            name: "Boru montaj malzemesi bedeli (PVC)",
            unit: "Faktör",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Pis su boruları montaj malzemesi bedeli (Toplam boru tutarının %65'i olarak hesaplanabilir veya elle girilebilir).",
            factor: 0.65
          },
          {
            id: "sihhi-cekvalf-150",
            name: "PİS SU ÇEKVALF Ø 150 mm",
            unit: "Adet",
            defaultQty: 2,
            sorumlu: "YÜKLENİCİ",
            marka: "HAKAN, KALDE veya MUADİLİ"
          }
        ]
      },
      {
        name: "SAYAÇ & VANALAR",
        items: [
          {
            id: "sihhi-sayac-34",
            name: "Soğuk Su Sayacı 3/4\"",
            unit: "Adet",
            defaultQty: 13,
            sorumlu: "YÜKLENİCİ",
            marka: "KLAPSEN, TÜRKOĞLU"
          },
          {
            id: "sihhi-sayac-112",
            name: "Soğuk Su Sayacı 1 1/2\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "KLAPSEN, TÜRKOĞLU"
          },
          {
            id: "sihhi-vana-34",
            name: "Şiber Vana 3/4\"",
            unit: "Adet",
            defaultQty: 26,
            sorumlu: "YÜKLENİCİ",
            marka: "KLAPSEN, TÜRKOĞLU"
          },
          {
            id: "sihhi-vana-112",
            name: "Şiber Vana 1 1/2\"",
            unit: "Adet",
            defaultQty: 2,
            sorumlu: "YÜKLENİCİ",
            marka: "KLAPSEN, TÜRKOĞLU"
          }
        ]
      },
      {
        name: "SÜZGEÇLER & HİDROFORLAR & DİĞER",
        items: [
          {
            id: "sihhi-suzgec-yer",
            name: "YER SÜZGECİ (10x10 krom, alttan çıkışlı, koku klapeli)",
            unit: "Adet",
            defaultQty: 13,
            sorumlu: "İŞVEREN",
            marka: "",
            description: "Islak hacimler için koku önleyici klape sistemli paslanmaz ızgaralı yer süzgeci."
          },
          {
            id: "sihhi-suzgec-balkon",
            name: "BALKON SÜZGEÇLERİ (Ø 50 çıkışlı, yalıtım uyumlu)",
            unit: "Adet",
            defaultQty: 13,
            sorumlu: "İŞVEREN",
            marka: "",
            description: "Isı ve su izolasyonu uygulamasına imkan veren, yükseklik ayarlı, çakıl tutuculu."
          },
          {
            id: "sihhi-suzgec-liner",
            name: "LİNER SÜZGEÇ (40 x 20 cm yalıtımlı)",
            unit: "Adet",
            defaultQty: 13,
            sorumlu: "İŞVEREN",
            marka: ""
          },
          {
            id: "sihhi-hidrofor-temiz",
            name: "TEMİZ SU HİDROFORU (Set)",
            unit: "Set",
            defaultQty: 1,
            sorumlu: "İŞVEREN",
            marka: "ETNA, DAF"
          },
          {
            id: "sihhi-hidrofor-yagmur",
            name: "YAĞMUR SUYU HİDROFORU (Set)",
            unit: "Set",
            defaultQty: 1,
            sorumlu: "İŞVEREN",
            marka: "ETNA, DAF"
          },
          {
            id: "sihhi-karot",
            name: "KAROTLA DELİK DELME",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Mekanik tesisat geçişleri için betonarme karot delik delme işçiliği."
          }
        ]
      }
    ]
  },
  {
    name: "ISITMA TESİSAT",
    categories: [
      {
        name: "YERDEN ISITMA MALZEMELERİ",
        items: [
          {
            id: "isitma-boru",
            name: "16*2 Oksijen Bariyerli Yerden Isıtma Borusu",
            unit: "Metre",
            defaultQty: 7300,
            sorumlu: "YÜKLENİCİ",
            marka: "KALDE"
          },
          {
            id: "isitma-strafor",
            name: "Yerden Isıtma Straforu (26 DNS)",
            unit: "m²",
            defaultQty: 1600,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          },
          {
            id: "isitma-bant",
            name: "Kenar İzolasyon Bandı",
            unit: "Metre",
            defaultQty: 500,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          }
        ]
      },
      {
        name: "DAĞITIM KOLLEKTÖRLERİ",
        items: [
          {
            id: "isitma-kollektor-4",
            name: "4 Ağızlı Rekorlu Vana Bağlantılı Kollektör",
            unit: "Set",
            defaultQty: 13,
            sorumlu: "YÜKLENİCİ",
            marka: "KAS"
          },
          {
            id: "isitma-kollektor-6",
            name: "6 Ağızlı Rekorlu Vana Bağlantılı Kollektör",
            unit: "Set",
            defaultQty: 13,
            sorumlu: "YÜKLENİCİ",
            marka: "KAS"
          }
        ]
      }
    ]
  },
  {
    name: "DOĞALGAZ TESİSAT",
    categories: [
      {
        name: "DOĞALGAZ HATTI & BORULARI",
        items: [
          {
            id: "dogalgaz-boru-25",
            name: "Doğalgaz Borusu DN 25",
            unit: "Metre",
            defaultQty: 180,
            sorumlu: "YÜKLENİCİ",
            marka: "ÇAYIROVA",
            description: "Doğal gaz tesisatı çelik boru hattı."
          },
          {
            id: "dogalgaz-boru-32",
            name: "Doğalgaz Borusu DN 32",
            unit: "Metre",
            defaultQty: 70,
            sorumlu: "YÜKLENİCİ",
            marka: "ÇAYIROVA"
          },
          {
            id: "dogalgaz-boru-40",
            name: "Doğalgaz Borusu DN 40",
            unit: "Metre",
            defaultQty: 50,
            sorumlu: "YÜKLENİCİ",
            marka: "ÇAYIROVA"
          },
          {
            id: "dogalgaz-boru-50",
            name: "Doğalgaz Borusu DN 50 PE Kaplı",
            unit: "Metre",
            defaultQty: 10,
            sorumlu: "YÜKLENİCİ",
            marka: "ÇAYIROVA"
          },
          {
            id: "dogalgaz-boru-montaj",
            name: "Boru montaj bedeli (Doğalgaz)",
            unit: "Faktör",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Doğalgaz boruları montaj malzemesi bedeli (Toplam boru tutarının %45'i olarak hesaplanabilir veya elle girilebilir).",
            factor: 0.45
          }
        ]
      },
      {
        name: "DOĞALGAZ VANALARI & FLEKSLER",
        items: [
          {
            id: "dogalgaz-vana-25",
            name: "Doğalgaz Vanası DN 25 (Dişli)",
            unit: "Adet",
            defaultQty: 26,
            sorumlu: "YÜKLENİCİ",
            marka: "KALDE"
          },
          {
            id: "dogalgaz-vana-32",
            name: "Doğalgaz Vanası DN 32 (Dişli)",
            unit: "Adet",
            defaultQty: 13,
            sorumlu: "YÜKLENİCİ",
            marka: "KALDE"
          },
          {
            id: "dogalgaz-vana-40",
            name: "Doğalgaz Vanası DN 40 (Dişli)",
            unit: "Adet",
            defaultQty: 4,
            sorumlu: "YÜKLENİCİ",
            marka: "KALDE"
          },
          {
            id: "dogalgaz-fleks-114",
            name: "1 1/4\" Kutu Bağlantı Fleksi",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "KALDE"
          }
        ]
      },
      {
        name: "YARDIMCI EKİPMANLAR & CİHAZLAR",
        items: [
          {
            id: "dogalgaz-anot",
            name: "Magnezyum Anot",
            unit: "Adet",
            defaultQty: 4,
            sorumlu: "YÜKLENİCİ",
            marka: "ESKA & MUADİLİ"
          },
          {
            id: "dogalgaz-topraklama",
            name: "Topraklama Çubuğu",
            unit: "Adet",
            defaultQty: 4,
            sorumlu: "YÜKLENİCİ",
            marka: "ESKA & MUADİLİ"
          },
          {
            id: "dogalgaz-sargi",
            name: "Sıcak Sargı Bandı",
            unit: "Adet",
            defaultQty: 10,
            sorumlu: "YÜKLENİCİ",
            marka: "ESKA & MUADİLİ"
          },
          {
            id: "dogalgaz-ikaz",
            name: "İkaz Bandı",
            unit: "Adet",
            defaultQty: 30,
            sorumlu: "YÜKLENİCİ",
            marka: "ESKA & MUADİLİ"
          },
          {
            id: "dogalgaz-regulator-1",
            name: "1\" Shut-off Regülatör",
            unit: "Adet",
            defaultQty: 13,
            sorumlu: "YÜKLENİCİ",
            marka: "ESKA & MUADİLİ"
          },
          {
            id: "dogalgaz-deprem",
            name: "1\" Mekanik Deprem Vanası",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          },
          {
            id: "dogalgaz-izole-114",
            name: "1 1/4\" İzole Mafsal",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          },
          {
            id: "dogalgaz-mano-300",
            name: "0-300 Mbar Manometre",
            unit: "Adet",
            defaultQty: 2,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          },
          {
            id: "dogalgaz-mano-600",
            name: "0-600 Mbar Manometre",
            unit: "Adet",
            defaultQty: 2,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          },
          {
            id: "dogalgaz-kelepse-34",
            name: "3/4\" Trifonlu Gaz Kelepçesi",
            unit: "Adet",
            defaultQty: 50,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          },
          {
            id: "dogalgaz-kelepse-1",
            name: "1\" Trifonlu Gaz Kelepçesi",
            unit: "Adet",
            defaultQty: 50,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          },
          {
            id: "dogalgaz-sayac-takim",
            name: "DOĞALGAZ SAYAÇ TAKIMI",
            unit: "Adet",
            defaultQty: 13,
            sorumlu: "YÜKLENİCİ",
            marka: ""
          }
        ]
      }
    ]
  },
  {
    name: "YANGIN TESİSATI",
    categories: [
      {
        name: "SİYAH BORU-DİŞLİ VEYA KAYNAKLI İMALAT",
        items: [
          {
            id: "yangin-siyah-boru-genel",
            name: "Siyah Boru-Dişli Veya Kaynaklı İmalat",
            unit: "Takım",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır. Çaplar: 1\", 1 1/4\", 1 1/2\", 2\", 2 1/2\", 3\", 4\", 5\", 8\".",
            fiyat: 311700
          },
          {
            id: "yangin-boru-montaj-bedeli",
            name: "Bina içi vidalı döşenmiş boru montaj malzemesi bedeli",
            unit: "Takım",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Tüm askı elemanları, fittingsler ve boru taşıyıcı profilleri montajı için gerekli tüm sarf malzemeleri bedel olarak."
          },
          {
            id: "yangin-siyah-boru-1",
            name: "Siyah Boru 1\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          },
          {
            id: "yangin-siyah-boru-114",
            name: "Siyah Boru 1 1/4\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          },
          {
            id: "yangin-siyah-boru-112",
            name: "Siyah Boru 1 1/2\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          },
          {
            id: "yangin-siyah-boru-2",
            name: "Siyah Boru 2\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          },
          {
            id: "yangin-siyah-boru-212",
            name: "Siyah Boru 2 1/2\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          },
          {
            id: "yangin-siyah-boru-3",
            name: "Siyah Boru 3\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          },
          {
            id: "yangin-siyah-boru-4",
            name: "Siyah Boru 4\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          },
          {
            id: "yangin-siyah-boru-5",
            name: "Siyah Boru 5\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          },
          {
            id: "yangin-siyah-boru-8",
            name: "Siyah Boru 8\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Boru birleştirmeleri 2\" ve üstündeki çaplarda, kaynaklı ile yapılacaktır. Sprinkler branşman bağlantılarında özel mekanik 'T' ler kullanılacaktır. 1 kat antipas vurulmuş olarak gelmek zorundadır."
          }
        ]
      },
      {
        name: "BORU BOYANMASI",
        items: [
          {
            id: "yangin-boru-boyanmasi",
            name: "Boru Boyanması (Genel)",
            unit: "Takım",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "2 kat yağlı boya ile siyah boruların boyanması, antipas boya üzerine ve sadece izole edilmeyen borular için. (1/2\" - 2\" arası, 2 1/2\" - 4\" arası, 5\" - 8\")",
            fiyat: 75000
          }
        ]
      },
      {
        name: "DİLATASYON VE DEPREM KOMPANSATÖRLERİ",
        items: [
          {
            id: "yangin-dilatasyon-dn80",
            name: "Deprem Kompansatörü DN80",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Kaynak boyunlu veya flanşlı kardan mafsallı."
          },
          {
            id: "yangin-dilatasyon-dn100",
            name: "Deprem Kompansatörü DN100",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Kaynak boyunlu veya flanşlı kardan mafsallı."
          }
        ]
      },
      {
        name: "SPRİNK",
        items: [
          {
            id: "yangin-sprink-upright",
            name: "Sprink (Upright Normal Tepkimeli)",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "UPRIGHT NORMAL TEPKİMELİ 1/2\" Orifis, 1/2\" NPT 68 C pirinç K:80, TSE onaylı.",
            fiyat: 60000
          }
        ]
      },
      {
        name: "YANGIN DOLABI",
        items: [
          {
            id: "yangin-dolabi-tip",
            name: "Yangın Dolabı",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Sıva üstü veya sıva altı tip, gömme metal kapaklı, TS EN671-1. 2\" landing valfli. Hortum yuvarlak yarı sert TS EN 694 normuna uygun çapı 25 mm. Hortum boyu: 30 m.",
            fiyat: 225000
          }
        ]
      },
      {
        name: "İZLEME ANAHTARLI KELEBEK VANA",
        items: [
          {
            id: "yangin-izleme-vana-212",
            name: "İzleme Anahtarlı Kelebek Vana 2 1/2\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "UL, FM onaylı, açık, kapalı konum bilgisini otomasyon sistemine aktarabilen, yivli bağlantılı, redüktörlü pik döküm gövdeli, EPDM contalı tip kelebek vana PN 16. Çalışma basıncı: 12 bar, Max test basıncı: 24 bar, Çalışma sıcaklığı: 120 C."
          },
          {
            id: "yangin-izleme-vana-4",
            name: "İzleme Anahtarlı Kelebek Vana 4\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "UL, FM onaylı, açık, kapalı konum bilgisini otomasyon sistemine aktarabilen, yivli bağlantılı, redüktörlü pik döküm gövdeli, EPDM contalı tip kelebek vana PN 16. Çalışma basıncı: 12 bar, Max test basıncı: 24 bar, Çalışma sıcaklığı: 120 C."
          },
          {
            id: "yangin-izleme-vana-8",
            name: "İzleme Anahtarlı Kelebek Vana 8\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "UL, FM onaylı, açık, kapalı konum bilgisini otomasyon sistemine aktarabilen, yivli bağlantılı, redüktörlü pik döküm gövdeli, EPDM contalı tip kelebek vana PN 16. Çalışma basıncı: 12 bar, Max test basıncı: 24 bar, Çalışma sıcaklığı: 120 C."
          }
        ]
      },
      {
        name: "DISCO TİP ÇEK VALF",
        items: [
          {
            id: "yangin-disco-cek-valf-dn100",
            name: "Disco Tip Çek Valf DN100",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "İki flanş arasına sıkıştırılan yay geri itmeli ve tablalı tip DN 100 ve altı bronz gövdeli üstü pik döküm, PN 25."
          }
        ]
      },
      {
        name: "FLOWSWITCH (AKIŞ ANAHTARI)",
        items: [
          {
            id: "yangin-flowswitch-212",
            name: "Flowswitch (Akış Anahtarı) 2 1/2\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Yangın tesisatındaki su akışını algılayıp yangın alarm paneline ihbar göndermek amacıyla UL, FM onaylı."
          },
          {
            id: "yangin-flowswitch-5",
            name: "Flowswitch (Akış Anahtarı) 5\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Yangın tesisatındaki su akışını algılayıp yangın alarm paneline ihbar göndermek amacıyla UL, FM onaylı."
          },
          {
            id: "yangin-flowswitch-8",
            name: "Flowswitch (Akış Anahtarı) 8\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Yangın tesisatındaki su akışını algılayıp yangın alarm paneline ihbar göndermek amacıyla UL, FM onaylı."
          }
        ]
      },
      {
        name: "MANOMETRE",
        items: [
          {
            id: "yangin-manometre-komple",
            name: "Manometre Musluğu ile Komple Manometre",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "3 ağızlı manometre musluğu ile komple (demir tozlu) Ø125 MANOMETRE ALT ÇIKIŞLI (0-16 BAR) METAL GÖVDE METAL KAPAK."
          }
        ]
      },
      {
        name: "TEST VE DRENAJ VANASI",
        items: [
          {
            id: "yangin-test-drenaj-114",
            name: "Test ve Drenaj Vanası 1 1/4\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Test ve drenaj yapabilme özellikli gözetleme camlı, 1/2\" orifis çaplı, pirinç Gövdeli, UL LİSTELİ, FM ONAYLI."
          }
        ]
      },
      {
        name: "İTFAİYE BAĞLANTI AĞZI",
        items: [
          {
            id: "yangin-itfaiye-baglanti",
            name: "İtfaiye Bağlantı Ağzı",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Yangın tesisatında kullanılmak üzere, UL, FM onaylı yerel itfaiye normlarına uygun bronzdan 2 adet bağlantı ağzı, otomatik boşaltmalı tip çek valfi ile birlikte, arka plakası ve itfaiye bilgi levhası dahil (2 x 2 1/2\" ağızlı - DN 100).",
            fiyat: 144720
          }
        ]
      },
      {
        name: "İTFAİYE SU ALMA AĞZI",
        items: [
          {
            id: "yangin-itfaiye-su-alma-212",
            name: "İtfaiye Su Alma Ağzı 2 1/2\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "DIN normlarına uygun 2 1/2\" bağlantı ağızlı, storz kaplinli, ucunda 2 1/2\" x 2\" rakor ve kapatma kapaklı."
          }
        ]
      },
      {
        name: "YANGIN POMPA GRUBU",
        items: [
          {
            id: "yangin-pompa-grubu-set",
            name: "Yangın Pompa Grubu",
            unit: "Set",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "1 ASIL 1 YEDEK, ELEKTRİKLİ.",
            fiyat: 600000
          }
        ]
      },
      {
        name: "YÜKSELEN MİLLİ SÜRGÜLÜ VANA",
        items: [
          {
            id: "yangin-milli-surgulu-vana-8",
            name: "Yükselen Milli Sürgülü Vana 8\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Yangın tesisatı depo emişlerinde kullanılmak üzere, açık - kapalı konum bilgisini otomasyon sistemine aktarabilen ( izlemeli tip ) UL, FM onaylı, pik döküm gövdeli vana. Çalışma basıncı: 12 bar, Max test basıncı: 24 bar, Çalışma sıcaklığı: 120 C.",
            fiyat: 62000
          }
        ]
      },
      {
        name: "ISLAK ALARM VANA SİSTEMİ",
        items: [
          {
            id: "yangin-islak-alarm-8",
            name: "Islak Alarm Vana Sistemi 8\"",
            unit: "Set",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Çek valfi, geciktirme hücresi, mekanik alarm sistemi vb. ile komple, yivli bağlantılı, UL LİSTELİ, FM ONAYLI."
          }
        ]
      },
      {
        name: "KOLLEKTÖR İMALATI",
        items: [
          {
            id: "yangin-kollektor-10",
            name: "Kollektör İmalatı 10\"",
            unit: "Metre",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Siyah borudan, bombeli kollektör imalatı, kurt ağızları dahil."
          }
        ]
      },
      {
        name: "TEST SAYACI",
        items: [
          {
            id: "yangin-test-sayaci-dn150",
            name: "Test Sayacı DN150",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Yangın pompa debilerini test etmede kullanılmak üzere, UL, FM onaylı."
          }
        ]
      },
      {
        name: "RELIEF VANA",
        items: [
          {
            id: "yangin-relief-vana-8",
            name: "Relief Vana 8\"",
            unit: "Adet",
            defaultQty: 1,
            sorumlu: "YÜKLENİCİ",
            marka: "",
            description: "Yangın tesisatında pompa çıkışında kullanılmak üzere, UL, FM onaylı."
          }
        ]
      }
    ]
  }
];

