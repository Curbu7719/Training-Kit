# Derinlemesine AI Uygunluğu & Build vs Buy: Temin Etme Geri Alınabilir Bir Karar Olarak

L1'de bir problemin AI'ya uyup uymadığını sormayı, sonra build, buy, fine-tune ve
API-çağırma arasından seçmeyi öğrendiniz. L2'de soru *hangi seçenek*'ten *kararı nasıl titiz
verir ve geri alınabilir tutarsınız*'a kayar — çünkü yanlış temin etme kararını geri çevirmek
pahalıdır ve "doğru" karar hacminiz, veriniz ve doğruluk ihtiyaçlarınız büyüdükçe değişir.

**Uygunluk bir spektrumdur, evet/hayır değil.** Özelliği ayrıştırın. Çoğu "AI özelliği" kısmen
deterministik, kısmen olasılıksaldır: kesin bir arama, bir doğrulama ve gerçekten yargı
gerektiren *bir* belirsiz adım. Yapabildiğiniz her şeyi deterministik koda itin — daha ucuz,
test edilebilir ve her seferinde aynı yanıtı verir — ve modeli indirgenemez belirsiz çekirdeğe
ayırın. AI yüzeyi ne kadar dar olursa, tüm sistem o kadar ucuz, test edilebilir ve
değiştirilebilir olur.

**Doğruluk, non-determinizm toleransı ve maliyete karşı — birlikte — karar verin.** Bu üçü
birbirini dengeler. Neredeyse kusursuz doğruluk ve sıfır varyans gerektiren bir görev AI'ya
hiç uymayabilir ya da gecikme ve maliyeti yükselten bir insan-döngüde geçidi gerektirebilir.
Bir insanın çıktıyı düzenlediği bir görev non-determinizmi ucuza tolere edebilir. Her zaman
**gerçek hacimde** fiyatlandırın: çağrı başına bir kuruş, günde 1.000 çağrıda önemsiz, 10
milyonda yıkıcıdır.

**Temin etmeyi total cost of ownership olarak görün, etiket fiyatı olarak değil.** Seçenekleri
**TCO** üzerinden karşılaştırın — entegrasyon, prompt/eval mühendisliği, izleme, yeniden
eğitim ve onu işletecek personel — yalnızca çağrı başına API fiyatı veya SaaS aboneliği değil.
"Ucuz" bir API, değerlendirme düzenekleri ve nöbet sahipliği eklediğinizde yüksek TCO
taşıyabilir; "pahalı" bir buy, *tutmadığınız* ekibi saydığınızda daha ucuz olabilir.

**Lock-in ve switching cost'lar birinci sınıftır.** Her seçenek bunları taşır. Bir SaaS buy,
iş akışınızı bir sağlayıcının yol haritasına ve veri biçimine bağlar. Tescilli bir platformda
fine-tune edilmiş bir model, ağırlıklarınızı ve araçlarınızı bağlar. Bir API bile
sağlayıcıya-özgü prompt'lar ve özellikler aracılığıyla lock-in yaratır. Bir **soyutlama
katmanı**, taşınabilir prompt'lar/eval'lar ve gerçekten yürütebileceğiniz bir **çıkış planı**
ile azaltın.

**Karşı tasarım yapılacak başarısızlık modları.**

- **Deterministik işe AI'yı zorlamak:** bir formül veya aramanın ait olduğu yerde bir model —
  daha yavaş, daha pahalı, non-deterministik ve test edilmesi daha zor.
- **Erken build:** bir API'nin fikri haftalar içinde doğrulayabileceği yerde, AI'nın
  farklılaştırıcınız olduğu kanıtlanmadan şirket içinde build etmek.
- **Sessiz lock-in:** soyutlama veya çıkış planı olmadan elverişli sağlayıcıyı seçmek, böylece
  sonradan değiştirmek bir yeniden yazma demek olur.

## Her rol bunu nasıl kullanır

- **Portfolio Manager:** Build-vs-buy kararını, pazara çıkış süresine karşı bir TCO-ve-lock-in dengesi olarak sahiplenir ve hacim, veri ve farklılaşma geliştikçe roadmap genelinde yeniden ele alır.
- **Project Manager:** Her adımın ihtiyaç duyduğu doğruluğu ve toleransı belirtir, her temin seçeneğini bir gereksinime ve risk katmanına bağlar ve kararı planlar.
- **Enterprise Architect:** AI yüzeyini minimize eder, prompt/eval'ları bir soyutlama arkasında taşınabilir tutar ve taahhütten önce çıkış planını baskı testine sokar.
- **Developer:** Gerçek-hacimde maliyeti, gecikmeyi ve kaliteyi sürekli ölçer; böylece temin kararı sayılara dayalı kalır.
