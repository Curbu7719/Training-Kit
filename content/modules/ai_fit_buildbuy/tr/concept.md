# AI Uygunluğu & Build vs Buy

Bir özellik için AI'yı benimsemeden önce iki karar gelir: **AI bu problem için doğru araç
mı?** ve eğer öyleyse, **bunu nasıl temin etmelisiniz — build, buy, fine-tune mı yoksa bir
API mi çağırmalısınız?** Birkaç satır deterministik kodun yeterli olacağı yerde büyük bir
dil modeline uzanmak, modern yazılım işindeki en yaygın ve en pahalı hatalardan biridir.

**AI doğru araç mı?** AI; **belirsiz, yargı ağırlıklı veya dil/algı biçimli** problemlere
uygundur — serbest metni özetleme, dağınık destek talep'lerini sınıflandırma, çeşitli
belgelerden alan çıkarma. Kural **kesin ve bilinir** olduğunda kötü uyum sağlar: vergi
hesaplama, bir e-posta biçimini doğrulama, bir arama tablosuyla yönlendirme. Bunlar
deterministik kod ister; o daha ucuz, daha hızlı, test edilebilir ve **her seferinde aynı
yanıtı** verir. AI **non-deterministik**'tir — aynı girdi farklı çıktı verebilir — bu yüzden
onu yalnızca bu değişkenliği tolere edebildiğinizde ve **muhtemelen-doğru hiçten iyi**
olduğunda benimsersiniz. Üç şeyi tartın: görevin gerçekte ne kadar **doğruluk** gerektirdiği,
ne kadar **non-determinizm**'le yaşayabileceğiniz ve gerçek hacminizde çağrı başına **maliyet**.

**Analoji.** AI seçmek, akıllı ama ara sıra yanılan bir müteahhit tutmak ile bir hesap makinesi
satın almak arasında seçim yapmaya benzer. Vergi matematiği için hesap makinesini
istersiniz — kesin, anında, ücretsiz. "Bu 500 yorumu oku ve bana temaları söyle" için ise,
her seferinde farklı ifade edebileceğini bilseniz bile müteahhidi istersiniz.

**Build vs buy vs fine-tune vs API.** AI uygun olduğunda, temin etme bir spektrumdur. Hız ve
düşük ön maliyet için bir **API çağırın** (barındırılan bir model). Farklılaştırıcınız
olmayan bir şey için bitmiş bir SaaS özelliğini **satın alın (buy)**. Genel bir model yakın
ama alanınızın diline veya etiketlerine ihtiyaç duyduğunda bir modeli **fine-tune** edin.
Yalnızca AI ürününüzün çekirdeğiyse ve veri, yetenek ve bütçeniz varsa şirket içinde **build**
edin. **Vendor lock-in** ve **switching cost**'lara dikkat edin — tescilli biçimler ve
prompt'lar ayrılmayı pahalı yapar — ve gerçek **TCO**'yu (total cost of ownership) yargılayın:
yalnızca çağrı başına fiyat değil, entegrasyon, izleme, değerlendirme ve bakım. Sağlayıcıları
sonradan değiştirebilmek için bir **soyutlama katmanını** tercih edin.

## Her rol bunu nasıl kullanır

- **Geliştirici/Mühendis:** Deterministik kodun bir modeli ne zaman geçtiğini fark eder,
  herhangi bir AI'yı sağlayıcı değiştirilebilsin diye bir soyutlamanın arkasına sarar ve
  çağrı başına gerçek maliyeti ve gecikmeyi ölçer.
- **İş Analisti:** Görevin gerçekte ihtiyaç duyduğu doğruluğu ve build-vs-buy'ı hangi veri ve
  iş akışlarının kısıtladığını çerçeveler, her seçeneği bir gereksinime eşler.
- **PM/Ürün Sahibi:** AI'nın build edilmeye değer bir farklılaştırıcı mı yoksa satın alınacak
  bir meta mı olduğuna karar verir ve TCO ile lock-in dengesini pazara çıkış süresine karşı
  yönetir.
- **QA & Mimar:** Non-deterministik bir özelliğin nasıl test edilip kabul edileceğini tanımlar
  ve vendor switching cost'ları düşük kalsın diye entegrasyonu tasarlar.
