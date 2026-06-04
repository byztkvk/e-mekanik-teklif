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
  }
];
