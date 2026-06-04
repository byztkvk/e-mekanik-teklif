# 🛠️ E Mekanik - Profesyonel Tesisat Teklif Modülü

Bu proje, **E Mekanik** firması için özel olarak tasarlanmış, tamamen istemci tarafında (frontend-only) çalışan, modern ve yüksek performanslı bir mekanik teklif hazırlama ve PDF dönüştürme uygulamasıdır.

Uygulama; Sıhhi Tesisat, Isıtma Tesisatı ve Doğalgaz Tesisatı kalemlerini içeren zengin bir ürün veritabanını barındırır. Kullanıcının adet, birim fiyat, iskonto girerek teklifi anında hesaplamasını ve kurumsal PDF teklif formları üretmesini sağlar.

---

## ✨ Özellikler

- **Mekanik Veritabanı:** Excel formatından programatik olarak ayrıştırılmış, Sıhhi Tesisat, Isıtma Tesisatı ve Doğalgaz Tesisatı kategorilerinde 40+ hazır kalem.
- **Otomatik Montaj Bedeli Hesaplama:** Sektör standardı gereği boru montaj malzemesi bedellerini ilgili boru toplamlarından otomatik hesaplar:
  - **PPRC Montaj Bedeli:** Tüm PPRC boru kalemleri toplamının **%45**'i.
  - **PVC Montaj Bedeli:** Tüm PVC boru kalemleri toplamının **%65**'i.
  - **Doğalgaz Boru Montaj Bedeli:** Tüm Doğalgaz çelik boru kalemleri toplamının **%45**'i.
- **Dinamik Döviz ve KDV Yönetimi:**
  - TL (₺), USD ($) ve EUR (€) döviz birimleri arasında anında dönüşüm.
  - %0, %10, %20 KDV seçimi.
  - KDV Dahil veya KDV Hariç hesaplama seçeneği.
- **Kişiselleştirme ve Esneklik:**
  - Ürünlerin sorumluluk durumu (YÜKLENİCİ / İŞVEREN) seçimi.
  - Serbest marka girişi.
  - Dinamik olarak yeni özel ürün, işçilik veya malzeme ekleyebilme.
  - Teklif notlarını/şartlarını dinamik yönetme (ekleme/silme).
- **Şablon Sistemi (Local Storage):**
  - Hazırlanan teklifleri tarayıcı hafızasına (Local Storage) kaydedip daha sonra tek tıkla yükleme veya silme.
  - Otomatik kaydetme sayesinde sekme kapatılsa bile çalışmanın kaybolmaması.
- **Kurumsal A4 PDF Çıktısı (Çoklu Sayfa Sayfalama):**
  - **Kapak Sayfası:** Proje adı, müşteri, tarih, teklif numarası ve hazırlayan bilgileriyle profesyonel kapak tasarımı.
  - **Dinamik Sayfalama:** Teklifteki ürün sayısına göre tabloları taşma yapmayacak şekilde sayfalara (18 satır limitli) böler.
  - **Özet ve İmza Bloku:** Teklifin son sayfasında (veya sığmadığı durumda ayrı özet sayfasında) teklif koşulları, finansal hesaplamalar ve çift imza alanları (Teklifi Hazırlayan / Onaylayan) yer alır.
- **Premium Arayüz:** Modern glassmorphism kartları, göz alıcı koyu/açık tema seçeneği ve dinamik animasyonlar.

---

## 🚀 Yerel Kurulum & Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edin:

1. **Bağımlılıkları Yükleyin:**
   ```bash
   npm install
   ```

2. **Geliştirme Sunucusunu Başlatın:**
   ```bash
   npm run dev
   ```
   *Tarayıcınızda `http://localhost:5173` adresine giderek uygulamayı açabilirsiniz.*

3. **Üretim (Production) Derlemesi Alın:**
   ```bash
   npm run build
   ```
   *Derlenmiş çıktılar `dist/` klasöründe oluşacaktır.*

---

## 🌐 GitHub Pages'te Yayınlama (Backend Gerektirmez)

Bu uygulama tamamen sunucusuz ve statik bir web sitesi olduğu için GitHub Pages üzerinde ücretsiz olarak yayınlanabilir.

### Adım 1: GitHub'da Yeni Depo (Repository) Oluşturun
GitHub profilinizde `e-mekanik` adında yeni bir depo oluşturun ve kodları buraya yükleyin:
```bash
git init
git add .
git commit -m "ilk commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/e-mekanik.git
git push -u origin main
```

### Adım 2: Kolay Deploy (GitHub Actions ile)
Vite yapılandırmasında `base: './'` ayarlandığı için GitHub Pages üzerinde sub-domain altında sorunsuz çalışacaktır.

Projeyi deploy etmek için `.github/workflows/deploy.yml` dosyasını oluşturup aşağıdaki içeriği ekleyebilirsiniz (otomatik olarak projenizi derleyip yayınlar):

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

Bunu ekleyip push ettikten sonra, GitHub depo ayarlarınızda **Pages** bölümüne gidip Kaynak (Source) olarak **`gh-pages`** dalını seçmeniz yeterlidir. Uygulamanız birkaç dakika içinde `https://KULLANICI_ADINIZ.github.io/e-mekanik/` adresinde yayına girecektir.

---

## 📐 Hesaplama Detayları

Boru montaj kalemleri dışındaki tüm kalemler şu formülle hesaplanır:
$$\text{Toplam} = \text{Miktar} \times \text{Birim Fiyat} \times \left(1 - \frac{\text{İskonto}}{100}\right)$$

**Özel Tesisat Montaj Bedelleri:**
- **Sıhhi PPRC Tesisat Montaj Bedeli:** Sistem, Sıhhi Tesisat sayfasındaki PPRC boruların Ø20, Ø25, Ø32, Ø40 ve Ø50 çaplarındaki tüm dahil edilen hatlarının toplam tutarını hesaplar ve bu tutarı **0.45 (faktör %45)** ile çarparak montaj bedeli satırına otomatik yansıtır.
- **Sıhhi PVC Tesisat Montaj Bedeli:** PVC boruların Ø50, Ø70, Ø100, Ø125, Ø150 çaplarındaki dahil edilen hatlarının toplam tutarı hesaplanır ve **0.65 (faktör %65)** ile çarpılarak yansıtılır.
- **Doğalgaz Boru Montaj Bedeli:** Doğalgaz çelik borularının DN 25, DN 32, DN 40, DN 50 PE Kaplı çaplarının dahil edilen toplam tutarı hesaplanır ve **0.45 (faktör %45)** ile çarpılarak yansıtılır.

*Kullanıcı dilerse bu kalemlerin otomatik hesaplama durumunu bozmadan diğer tüm kalemlerin birim fiyatlarını değiştirerek teklifini anlık güncelleyebilir.*
