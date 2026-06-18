# İpuçları & Alternatif İfadeler

## Temel fikrin alternatif ifadeleri

- **Tek cümleyle:** Context window sabit boyutlu bir token bütçesidir — girdi *ve* çıktı tarafından paylaşılır — ve her çağrı durumsuz olduğu için, modelin dikkate almasını istediğiniz kodu, spesifikasyonu ya da geçmişi yeniden göndermeniz gerekir.
- **Başka bir açıdan:** Modelin çağrılar arasında belleği yoktur. Çok dosyalı bir refactor'un ya da uzun bir BA görüşmesinin "belleği", uygulamanızın ilgili geçmişi sabit bir token tavanı içinde her isteğe yeniden yapıştırmasından ibarettir.
- **Strateji çerçevesi:** Bir refactor ya da görüşme sırasında pencere dolduğunda daha fazla alan kazanmazsınız — neyi tutacağınıza (kayan pencere), neyi sıkıştıracağınıza (diziyi özetle), neyi talep üzerine getireceğinize (ilgili dosyaları getir) ve neyi sonrası için kaydedeceğinize (planı kontrol noktasına al) karar verirsiniz.

## Kademeli ipucu yığını

- **H1:** Pencerenin girdi *ve* çıktıyı birlikte tuttuğunu ve modelin her çağrıya sıfırdan başladığını unutmayın. Bu yüzden ilk adım her zaman şudur: başarılı olması için bu istekte ne bulunmalı — hangi dosyalar, hangi kurallar?
- **H2:** Bir bağlam sınırına mantıklı bir sırayla yaklaşın — önce sınıra yaklaştığınızı *tespit edin*, sonra neyin esas olduğuna (refactor kuralları, kullanıcının hedefi) karşı neyin atılabilir olduğuna *karar verin*, sonra bir azaltma stratejisi *uygulayın*, sonra kırpılmış bağlamı *yeniden gönderin* ve devam edin. Sorunu ölçmeden bir strateji uygulamazsınız.
- **H3:** Stratejiyi içerik türüyle eşleştirin. Yakın zamanlı diyalog akışı → kayan pencere. Hâlâ özünü ihtiyaç duyduğunuz uzun önceki görüşme geçmişi → özetle. Büyük bir kod tabanı ya da doküman kümesi → yalnızca ilgili dosyaları getir. Bir oturum yeniden başlatmasını atlatması gereken uzun süreli refactor → yapılandırılmış bir özeti kontrol noktasına al.

## SSS

**S: Daha büyük bir context window'a sahip bir model kullanırsam sorun çözülür mü?**
C: Hafifler, çözülmez. Daha büyük bir pencere sınırı geciktirir ama daha pahalıdır ve çok uzun bağlamlar modelin gerçekten önemsediğiniz dosyaya odağını sulandırabilir. Yine de neyi dahil edeceğinize dair bir stratejiye ihtiyacınız vardır.

**S: Modelin çıktısı da pencereye sayılır mı?**
C: Evet. Girdi ve çıktı aynı bütçeyi paylaşır. Neredeyse dolu bir girdi (örneğin 30 yapıştırılmış dosya) yanıt için az yer bırakır, bu da üretilen kodu kesebilir.

**S: Asistan neden bir refactor'un ortasında bir kuralı "unutur"?**
C: Çünkü pencereye sığdırmak için eski içerik atıldı ya da hiç yeniden gönderilmedi (çağrılar durumsuzdur). Çözüm, esas kuralları özetlemek ya da sabitlemek ve her yeni isteğe dahil etmektir.
