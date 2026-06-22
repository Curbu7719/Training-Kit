# İşlenmiş Örnek: Eyleme Geçen Bir Agent Filosunu İpin Ucunu Kaçırmadan İşlet

Tek bir on-call agent'ı izleyebilirsin. Bir *filo* — bir CI agent'ı, bir infra agent'ı, bir on-call agent'ı, birçok takımda — farklı bir sorundur: izinleri, kararları ve maliyetleri hep birikir ve altlarındaki modeller senden habersiz değişir. İşte filoyu yönetmek, yardımı hesabını veremeyeceğin bir yayılmaya dönüşmekten nasıl korur.

**Konsol değil, kod olarak izinler.** Filo ölçeğinde her agent'a tıklayarak erişim veremezsin. Her agent kendi **servis kimliğini**, en az ayrıcalıklı kapsamlarını ve ortam sınırlarını alır; hepsi de herhangi bir değişiklik gibi incelenen **policy-as-code**'dur. *Bu gününü neden kolaylaştırır?* Her agent'ın ne yapabileceğini tam olarak görüp diff'leyebilirsin — gücünü bir olay sırasında keşfetmek yerine.

**Tehlikeli sınıflara tekdüze kapılar.** Yüksek-patlamalı eylemler *her agent için* zorunlu onay taşır ve **change window'lar** geçerlidir — bir freeze sırasında otonom prod eylemi yok. *Agent'ları neden böyle kullan?* Tutarlılık, filo hakkında bir kez akıl yürütmek demektir — her takımın gelişigüzel kurallarını yeniden denetlemek değil.

**Olaylar artık iki çeşit gelir.** Agent'lar hem yanıtlayandır (oto-triyaj, runbook çalıştırma) hem de *nedendir* (bir agent kötü bir eylem aldı). *Bu neden önemli?* Olay sürecin "agent yanıldı"yı birinci sınıf bir durum olarak ele almalı — böylece biri kötü davrandığında, yalnızca insanların değil, onun eylemlerini de izleyip kontrol altına alıp geri alabilirsin.

**Zemin altından kayar.** Filonun altındaki model ve araçlar yükseltilir ve kullanımdan kaldırılır. *Hamle:* model değiştikçe agent'ları versiyonla ve değerlendir; böylece bir sağlayıcının sessiz güncellemesi elli agent'ın davranışını sessizce değiştirmesin. *Neden?* Temel kaydığında "geçen ay çalışıyordu" güvenlik değildir.

**Özet:** eyleme geçen bir agent filosu, yalnızca yönetilirse kaldıraçtır. Policy-as-code kimlikler, tehlikeli eylemlere tekdüze kapılar, agent'ları neden olarak gören bir olay süreci ve modeller değiştikçe yaşam döngüsü yönetimi — filonun kontrolünü aşmak yerine takımını ölçeklemesini sağlayan budur.
