'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { MessageCircle, X, Send, Phone, Bot, Sparkles } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Knowledge Base untuk Kang Wira
const knowledgeBase = {
  // Layanan Desa
  'surat': 'Untuk membuat surat keterangan, Anda bisa menggunakan layanan surat online kami. Klik menu "Ajukan Surat Online" atau hubungi kantor desa pada jam kerja: Senin-Kamis 08.00-16.00, Jumat 08.00-11.30.',
  'keterangan': 'Untuk membuat surat keterangan, Anda bisa menggunakan layanan surat online kami. Klik menu "Ajukan Surat Online" atau hubungi kantor desa pada jam kerja: Senin-Kamis 08.00-16.00, Jumat 08.00-11.30.',
  'surat online': 'Layanan surat online tersedia 24/7 di website. Jenis surat: keterangan domisili, usaha, tidak mampu, belum menikah, dan lainnya. Proses 1-3 hari kerja.',
  'bansos': 'Informasi bantuan sosial terbaru: Pendaftaran PKH Tahap II dibuka hingga 31 Januari 2025. Untuk info lebih lanjut, hubungi kantor desa atau cek menu "Info Bansos".',
  'bantuan sosial': 'Program bansos aktif: PKH, BPNT, BLT Dana Desa, bantuan lansia, dan bantuan disabilitas. Pendaftaran melalui kantor desa dengan syarat KTP dan KK.',
  'pkh': 'Program Keluarga Harapan (PKH) untuk keluarga kurang mampu dengan anak sekolah atau ibu hamil. Bantuan Rp 550.000-2.400.000 per tahun.',
  'blt': 'Bantuan Langsung Tunai (BLT) Dana Desa tersedia untuk keluarga terdampak ekonomi. Info pendaftaran di kantor desa.',
  'jadwal': 'Jadwal pelayanan desa: Senin-Kamis 08.00-16.00, Jumat 08.00-11.30, Sabtu-Minggu tutup. Jam istirahat 12.00-13.00. Datang lebih awal untuk menghindari antrean.',
  'jam': 'Jadwal pelayanan desa: Senin-Kamis 08.00-16.00, Jumat 08.00-11.30, Sabtu-Minggu tutup. Jam istirahat 12.00-13.00. Datang lebih awal untuk menghindari antrean.',
  'pelayanan': 'Pelayanan desa meliputi: administrasi kependudukan, surat-menyurat, bantuan sosial, perizinan usaha, dan konsultasi pembangunan.',
  
  // UMKM dan Ekonomi
  'umkm': 'Desa Cilame memiliki 45+ UMKM aktif meliputi kuliner, kerajinan, pertanian, dan jasa. Direktori lengkap di menu "UMKM Desa" dengan sistem booking online.',
  'toko': 'Toko online desa tersedia untuk produk UMKM lokal. Kunjungi menu "Toko Online Desa" untuk berbelanja produk berkualitas dari warga Cilame.',
  'toko online': 'Platform e-commerce desa dengan 30+ produk lokal: makanan khas, kerajinan tangan, hasil pertanian. Pembayaran COD dan transfer.',
  'kerja': 'Pasar tenaga kerja lokal tersedia di menu "Pasar Kerja". Anda bisa mencari jasa tukang, pembantu rumah tangga, pertanian, dan lainnya dengan sistem booking yang aman.',
  'pekerja': 'Database pekerja lokal: tukang bangunan, cleaning service, baby sitter, driver, tukang kebun. Rating dan review tersedia.',
  'pasar kerja': 'Platform menghubungkan pencari kerja dan pemberi kerja lokal. 100+ profil pekerja terverifikasi dengan sistem rating.',
  'ekonomi': 'Pertumbuhan ekonomi desa 12.5% tahun ini didukung UMKM, pariwisata, dan sektor pertanian. Program pemberdayaan ekonomi aktif berjalan.',
  'bisnis': 'Dukungan bisnis: pelatihan UMKM, akses modal, perizinan mudah, dan promosi digital. Konsultasi gratis setiap Rabu.',
  
  // Data Desa dan Demografi
  'penduduk': 'Total penduduk Desa Cilame: 34.700 jiwa dengan 2.156 kepala keluarga. Komposisi: 17.350 laki-laki, 17.350 perempuan.',
  'populasi': 'Populasi Desa Cilame: 34.700 jiwa, kepadatan 1.029 jiwa/km². Pertumbuhan penduduk 1.2% per tahun.',
  'data': 'Data desa terkini: 34.700 jiwa penduduk, 2.156 KK, 45+ UMKM aktif, pertumbuhan ekonomi 12.5%, tingkat kemiskinan 8.3%.',
  'demografi': 'Demografi: Usia 0-14 tahun (28%), 15-64 tahun (65%), 65+ tahun (7%). Tingkat pendidikan: SD 35%, SMP 25%, SMA 30%, PT 10%.',
  'statistik': 'Statistik desa: Luas wilayah 33.7 km², 12 RW, 48 RT, rasio jenis kelamin 99.9, angka partisipasi sekolah 95.2%.',
  
  // Transparansi dan Keuangan
  'apbdes': 'APBDes 2024: Total anggaran Rp 2.8 miliar. Pendapatan desa Rp 2.1M, Dana Desa Rp 1.2M, ADD Rp 500jt. Realisasi 87.5%.',
  'keuangan': 'Laporan keuangan transparan: pendapatan, belanja, dan pembiayaan. Update bulanan di menu "Transparansi" dengan grafik interaktif.',
  'transparansi': 'Portal transparansi lengkap: APBDes, realisasi anggaran, laporan kegiatan, tender, dan pengadaan barang/jasa.',
  'anggaran': 'Anggaran 2024 fokus pada infrastruktur (40%), pemberdayaan (25%), pelayanan (20%), dan operasional (15%).',
  'dana desa': 'Dana Desa 2024: Rp 1.2 miliar untuk pembangunan jalan, MCK, posyandu, dan program pemberdayaan masyarakat.',
  
  // Kontak dan Lokasi
  'kontak': 'Kontak Desa Cilame: Telp (022) 6866789, WhatsApp 0812-3456-7890, Email: desacilame@bandungbarat.go.id',
  'alamat': 'Alamat: Jl. Raya Cilame No. 123, Kec. Ngamprah, Kab. Bandung Barat, Jawa Barat 40552. GPS: -6.8745, 107.4532',
  'lokasi': 'Desa Cilame terletak di Kecamatan Ngamprah, 15 km dari Bandung. Akses mudah via Tol Padaleunyi keluar Cimahi.',
  'peta': 'Peta interaktif tersedia di menu "Lokasi & Peta" dengan titik-titik penting: kantor desa, sekolah, puskesmas, masjid.',
  'transportasi': 'Akses transportasi: angkot jurusan Cimahi-Cilame, ojek online, dan bus DAMRI. Parkir luas tersedia di kantor desa.',
  
  // Informasi dan Berita
  'berita': 'Berita terkini: Festival Cilame 2024, program vaksinasi, pembangunan jalan, dan kegiatan UMKM. Update harian di website.',
  'pengumuman': 'Pengumuman penting: Pendaftaran bansos, jadwal posyandu, rapat RT/RW, dan kegiatan gotong royong. Cek rutin di website.',
  'informasi': 'Portal informasi lengkap: berita, pengumuman, jadwal layanan, dokumen publik, dan galeri kegiatan desa.',
  'acara': 'Agenda acara: Posyandu (setiap Selasa), senam sehat (Jumat), gotong royong (Minggu), dan rapat bulanan RT/RW.',
  'kegiatan': 'Kegiatan rutin: posyandu, senam lansia, pengajian, karang taruna, dan program pemberdayaan perempuan.',
  
  // Laporan dan Aduan
  'laporan': 'Sampaikan laporan melalui menu "Laporan Warga", WhatsApp, atau langsung ke kantor desa. Respon maksimal 2x24 jam.',
  'aduan': 'Sistem aduan online 24/7 untuk keluhan infrastruktur, pelayanan, atau masalah sosial. Tindak lanjut transparan.',
  'keluhan': 'Keluhan ditangani tim khusus dengan SOP jelas. Kategori: pelayanan, infrastruktur, sosial, dan lingkungan.',
  'aspirasi': 'Aspirasi warga ditampung melalui musrenbang, forum RT/RW, dan platform online. Semua masukan dipertimbangkan.',
  
  // Profil dan Sejarah Desa
  'sejarah': 'Desa Cilame berdiri tahun 1952, nama berasal dari "Ci" (air) dan "Lame" (dalam). Dulunya pusat perkebunan teh kolonial.',
  'profil': 'Profil Desa Cilame: Luas 33.7 km², ketinggian 650-1200 mdpl, iklim sejuk, tanah subur, dan pemandangan pegunungan indah.',
  'visi': 'Visi: "Terwujudnya Desa Cilame yang Maju, Mandiri, dan Sejahtera Berbasis Teknologi dan Kearifan Lokal".',
  'misi': 'Misi: Meningkatkan pelayanan digital, memberdayakan ekonomi lokal, melestarikan budaya, dan membangun infrastruktur berkelanjutan.',
  'struktur': 'Struktur organisasi: Kepala Desa, Sekretaris, 4 Kasi (Pemerintahan, Kesra, Pelayanan, Pembangunan), dan 12 Kepala Dusun.',
  'kepala desa': 'Kepala Desa: Bapak Asep Suryadi, S.Sos (periode 2019-2025). Pengalaman 15 tahun di pemerintahan desa.',
  'organisasi': 'Organisasi desa: BPD, PKK, Karang Taruna, LPMD, RT/RW, dan kelompok tani. Total 150+ pengurus aktif.',
  
  // Fasilitas dan Infrastruktur
  'fasilitas': 'Fasilitas desa: 3 sekolah, 1 puskesmas, 5 masjid, 2 gereja, balai desa, lapangan olahraga, dan pasar tradisional.',
  'sekolah': 'Pendidikan: 2 SD, 1 SMP, dan 1 SMK. Total 1.200 siswa dengan 85 guru. Program beasiswa untuk siswa berprestasi.',
  'kesehatan': 'Layanan kesehatan: Puskesmas Cilame, 3 posyandu, 1 polindes, dan 5 bidan desa. Pelayanan 24 jam untuk emergency.',
  'infrastruktur': 'Infrastruktur: Jalan beraspal 85%, listrik 98%, air bersih 92%, internet 4G 90%, dan drainase 70%.',
  'internet': 'Koneksi internet fiber optic tersedia di kantor desa dan sekolah. WiFi gratis di balai desa dan taman.',
  
  // Pariwisata dan Potensi
  'wisata': 'Objek wisata: Air Terjun Cilame, Kebun Teh Panorama, Camping Ground Bukit Hijau, dan Agrowisata Strawberry.',
  'pariwisata': 'Potensi wisata alam dan budaya. Paket wisata desa, homestay, dan kuliner khas. Kunjungan 5000+ wisatawan/tahun.',
  'kuliner': 'Kuliner khas: Nasi Liwet Cilame, Keripik Singkong, Dodol Susu, dan Kopi Robusta. Tersedia di toko online desa.',
  'pertanian': 'Sektor pertanian: padi, sayuran, strawberry, dan kopi. Luas lahan 1.200 ha dengan produktivitas tinggi.',
  'perkebunan': 'Perkebunan teh seluas 500 ha, kopi 200 ha, dan hortikultura 300 ha. Produk organik bersertifikat.',
  
  // Peraturan dan Dokumen
  'peraturan': 'Peraturan desa (Perdes) tersedia di menu "Peraturan Desa": tata tertib, retribusi, dan aturan pembangunan.',
  'perdes': 'Perdes aktif: No.1/2024 tentang APBDes, No.2/2024 tentang Retribusi, No.3/2024 tentang Tata Tertib.',
  'dokumen': 'Dokumen publik: RPJM Desa, RKP Desa, Perdes, SK Kepala Desa, dan laporan pertanggungjawaban.',
  'sk': 'Surat Keputusan (SK) Kepala Desa terbaru tentang pengangkatan perangkat, penetapan anggaran, dan kebijakan desa.',
  
  // Sapaan dan Penutup
  'halo': 'Halo! Saya Kang Wira, sahabat digital Desa Cilame. Ada yang bisa saya bantu hari ini? 😊',
  'hai': 'Hai! Saya Kang Wira, siap membantu Anda dengan informasi seputar Desa Cilame. Silakan bertanya! 👋',
  'selamat': 'Selamat datang di portal digital Desa Cilame! Saya Kang Wira siap membantu kebutuhan informasi Anda.',
  'terima kasih': 'Sama-sama! Senang bisa membantu. Jangan ragu untuk bertanya lagi jika ada yang perlu diketahui tentang Desa Cilame. 😊',
  'thanks': 'You\'re welcome! Jangan sungkan bertanya lagi ya. Saya selalu siap membantu! 🙏',
  'makasih': 'Sama-sama! Semoga informasinya bermanfaat. Ada lagi yang ingin ditanyakan? 😊'
};

function searchKnowledgeBase(message: string): string | null {
  const query = message.toLowerCase();
  
  // Cari di knowledge base lokal dengan sistem scoring
  let bestMatch = '';
  let bestScore = 0;
  
  for (const [key, value] of Object.entries(knowledgeBase)) {
    if (query.includes(key)) {
      const score = key.length; // Skor berdasarkan panjang kata kunci
      if (score > bestScore) {
        bestScore = score;
        bestMatch = value;
      }
    }
  }
  
  return bestScore > 0 ? bestMatch : null;
}

async function getKangWiraResponse(message: string, conversationHistory: Message[] = []): Promise<string> {
  try {
    // Prioritaskan pencarian di knowledge base lokal
    const localResponse = searchKnowledgeBase(message);
    if (localResponse) {
      return localResponse;
    }

    // Fallback untuk sapaan dan ucapan terima kasih
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('halo') || lowerMessage.includes('hai') || lowerMessage.includes('selamat')) {
      return 'Halo! Saya Kang Wira, asisten virtual Desa Cilame. Ada yang bisa saya bantu mengenai informasi desa? 😊';
    }
    
    if (lowerMessage.includes('terima kasih') || lowerMessage.includes('makasih')) {
      return 'Sama-sama! Senang bisa membantu. Jika ada pertanyaan lain tentang Desa Cilame, jangan ragu untuk bertanya ya! 😊';
    }

    // Respons default untuk pertanyaan yang tidak ada di knowledge base
    return `Maaf, saya belum memiliki informasi spesifik tentang "${message}". Saya dapat membantu Anda dengan informasi tentang:\n\n• Profil dan sejarah Desa Cilame\n• Layanan administrasi desa\n• Berita dan pengumuman terkini\n• Informasi geografis dan demografis\n• Kontak pemerintah desa\n\nSilakan tanyakan hal-hal tersebut atau kunjungi kantor desa untuk informasi lebih lanjut. 😊`;
  } catch (error) {
    console.error('Error getting response:', error);
    return 'Maaf, terjadi kendala teknis. Silakan coba lagi nanti. 😊';
  }
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Halo! Saya Kang Wira, sahabat digital Desa Cilame. Ada yang bisa saya bantu hari ini? 😊',
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const { language } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'Bagaimana cara membuat surat keterangan?',
    'Info UMKM Desa Cilame',
    'Jadwal pelayanan desa',
    'Data penduduk terbaru'
  ];

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const userInput = inputMessage.trim();
      
      // Add user message
      const userMessage = {
        id: messages.length + 1,
        text: userInput,
        isBot: false,
        timestamp: new Date(),
      };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      setInputMessage('');

      // Generate Kang Wira response using knowledge base and AI with conversation history
      setTimeout(async () => {
        const responseText = await getKangWiraResponse(userInput, updatedMessages);
        const botResponse = {
          id: updatedMessages.length + 1,
          text: responseText,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleQuickReply = async (reply: string) => {
    const userMessage = {
      id: messages.length + 1,
      text: reply,
      isBot: false,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    // Generate Kang Wira response with conversation history
    setTimeout(async () => {
      const responseText = await getKangWiraResponse(reply, updatedMessages);
      const botResponse = {
        id: updatedMessages.length + 1,
        text: responseText,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <>
      {/* Chat Widget Button */}
       <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-50 flex items-end gap-0.5">

        
        {/* Chat Button - Always Visible */}
        <Image
         src="/Kang Wira - sahabat digital Cilame.png"
         alt="Kang Wira - Sahabat Digital Cilame"
         width={138}
         height={138}
         className="cursor-pointer transition-all duration-300 hover:scale-105 object-contain flex-shrink-0"
         onClick={() => setIsOpen(!isOpen)}
       />
      </div>
        
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 md:bottom-6 right-[calc(1rem+173px)] md:right-[calc(1.5rem+173px)] w-[calc(100vw-2rem)] max-w-sm md:w-80 h-[500px] max-h-[calc(100vh-8rem)] bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-200/60 z-50 flex flex-col overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-700 text-white rounded-t-2xl relative">
            {/* Background Pattern */}
             <div className="absolute inset-0 opacity-5">
               <div className="absolute top-2 left-4 w-6 h-6 md:w-8 md:h-8 border border-white/30 rounded-full"></div>
               <div className="absolute top-4 md:top-6 right-6 md:right-8 w-3 h-3 md:w-4 md:h-4 border border-white/20 rounded-full"></div>
               <div className="absolute bottom-2 left-6 md:left-8 w-4 h-4 md:w-6 md:h-6 border border-white/25 rounded-full"></div>
             </div>
            
            <div className="flex items-center space-x-2 md:space-x-3 relative z-10">
              <div>
                <h3 className="font-bold text-base md:text-lg flex items-center gap-1 md:gap-2">
                  Kang Wira
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-yellow-300 animate-pulse" />
                </h3>
                <p className="text-slate-200 text-xs md:text-sm font-medium">
                  Sahabat digital Desa Cilame
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 rounded-full relative z-10 h-7 w-7 md:h-8 md:w-8"
            >
              <X className="h-4 w-4 md:h-5 md:w-5" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-3 md:p-4 bg-gradient-to-br from-slate-50/40 to-slate-100/30">
            <div className="space-y-3 md:space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className="flex items-start gap-2 max-w-[85%]">
                    {message.isBot && (
                      <Image
                        src="/kang-wira-avatar.svg"
                        alt="Kang Wira"
                        width={24}
                        height={24}
                        className="rounded-full border border-slate-200 flex-shrink-0 mt-1 shadow-sm"
                      />
                    )}
                    <div
                      className={`max-w-[200px] md:max-w-[240px] px-3 md:px-4 py-2 md:py-3 rounded-2xl text-xs md:text-sm shadow-sm ${
                         message.isBot
                           ? 'bg-white/90 border border-slate-200 text-slate-800 rounded-bl-md backdrop-blur-sm'
                           : 'bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-br-md'
                       }`}
                    >
                      <p className="leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-1 opacity-70 ${
                         message.isBot ? 'text-slate-500' : 'text-slate-200'
                       }`}>
                        {message.timestamp.toLocaleTimeString('id-ID', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Quick Replies */}
              {messages.length === 1 && (
                <div className="bg-gradient-to-br from-slate-50/80 to-slate-100/60 rounded-xl p-3 md:p-4 border border-slate-200/60 shadow-sm backdrop-blur-sm">
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-slate-600" />
                    <h4 className="font-semibold text-slate-700 text-xs md:text-sm">
                      Pertanyaan populer
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {quickReplies.map((reply, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickReply(reply)}
                        className="text-xs md:text-sm h-8 md:h-9 px-2 md:px-3 justify-start border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 rounded-lg"
                      >
                        <span className="mr-1 md:mr-2">💬</span>
                        <span className="truncate">{reply}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Referensi untuk auto-scroll */}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>

          {/* Input Section */}
          <div className="p-3 md:p-4 border-t border-slate-200/60 bg-white/90 backdrop-blur-sm">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ketik pesan untuk Kang Wira..."
                className="flex-1 px-3 md:px-4 py-2 md:py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent text-xs md:text-sm bg-slate-50/50 placeholder-slate-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-3 md:px-4 py-2 md:py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
              >
                <Send className="h-3 w-3 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}