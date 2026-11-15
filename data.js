// Her uzay aracı için çevrimdışı/file:// uyumlu detaylı vektör illüstrasyon üretici
function createDeviceSvgDataUri(type) {
  const skyAndGround = {
    moon: `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#020617"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#94a3b8"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="50%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill="url(#sky)"/>
      <circle cx="30" cy="24" r="1" fill="#fff" opacity="0.8"/>
      <circle cx="72" cy="18" r="1.2" fill="#e2e8f0" opacity="0.7"/>
      <circle cx="195" cy="26" r="1.1" fill="#fff" opacity="0.9"/>
      <circle cx="218" cy="44" r="0.9" fill="#cbd5e1" opacity="0.6"/>
      <circle cx="152" cy="16" r="0.9" fill="#fff" opacity="0.75"/>
      <path d="M0 118 Q60 108 120 115 T240 112 L240 160 L0 160 Z" fill="url(#ground)"/>
      <ellipse cx="48" cy="138" rx="18" ry="5" fill="#334155" opacity="0.55"/>
      <ellipse cx="198" cy="142" rx="22" ry="6" fill="#334155" opacity="0.5"/>
    `,
    mars: `
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#451a03"/>
          <stop offset="55%" stop-color="#9a3412"/>
          <stop offset="100%" stop-color="#ea580c"/>
        </linearGradient>
        <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#c2410c"/>
          <stop offset="100%" stop-color="#7c2d12"/>
        </linearGradient>
        <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#fde047"/>
          <stop offset="55%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="240" height="160" fill="url(#sky)"/>
      <path d="M0 105 L38 88 L76 98 L125 84 L178 96 L215 86 L240 94 L240 120 L0 120 Z" fill="#7c2d12" opacity="0.65"/>
      <path d="M0 116 Q70 109 145 116 T240 113 L240 160 L0 160 Z" fill="url(#ground)"/>
      <polygon points="24,142 36,133 48,143 31,147" fill="#5b210d"/>
      <polygon points="196,144 210,136 222,145 204,149" fill="#5b210d"/>
    `
  };

  const devices = {
    'apollo-lm': skyAndGround.moon + `
      <ellipse cx="120" cy="134" rx="48" ry="7" fill="#1e293b" opacity="0.55"/>
      <!-- İniş ayakları ve taban diskleri -->
      <line x1="94" y1="98" x2="72" y2="132" stroke="#e2e8f0" stroke-width="3.2" stroke-linecap="round"/>
      <line x1="146" y1="98" x2="168" y2="132" stroke="#e2e8f0" stroke-width="3.2" stroke-linecap="round"/>
      <line x1="120" y1="104" x2="120" y2="136" stroke="#cbd5e1" stroke-width="3" stroke-linecap="round"/>
      <line x1="88" y1="112" x2="105" y2="112" stroke="#94a3b8" stroke-width="2"/>
      <line x1="152" y1="112" x2="135" y2="112" stroke="#94a3b8" stroke-width="2"/>
      <ellipse cx="72" cy="133" rx="10" ry="3.5" fill="url(#gold)"/>
      <ellipse cx="168" cy="133" rx="10" ry="3.5" fill="url(#gold)"/>
      <ellipse cx="120" cy="137" rx="11" ry="3.8" fill="url(#gold)"/>
      <!-- Motor nozulu -->
      <polygon points="111,106 129,106 134,122 106,122" fill="#334155" stroke="#64748b" stroke-width="1"/>
      <!-- Altın Kapton iniş kademesi gövdesi -->
      <polygon points="88,78 152,78 158,105 82,105" fill="url(#gold)" stroke="#78350f" stroke-width="1.2"/>
      <rect x="103" y="80" width="34" height="23" fill="#d97706" opacity="0.55"/>
      <!-- Merdiven -->
      <line x1="116" y1="84" x2="116" y2="128" stroke="#f8fafc" stroke-width="1.5"/>
      <line x1="124" y1="84" x2="124" y2="128" stroke="#f8fafc" stroke-width="1.5"/>
      <line x1="116" y1="94" x2="124" y2="94" stroke="#f8fafc" stroke-width="1.3"/>
      <line x1="116" y1="104" x2="124" y2="104" stroke="#f8fafc" stroke-width="1.3"/>
      <line x1="116" y1="114" x2="124" y2="114" stroke="#f8fafc" stroke-width="1.3"/>
      <!-- Üst kademe anıtsal ayrım çerçevesi & anten -->
      <polygon points="95,52 145,52 151,78 89,78" fill="#475569" stroke="#cbd5e1" stroke-width="1.3"/>
      <polygon points="104,58 117,58 115,69 102,69" fill="#0f172a"/>
      <polygon points="123,58 136,58 138,69 125,69" fill="#0f172a"/>
      <rect x="113" y="69" width="14" height="8" fill="#1e293b"/>
      <line x1="120" y1="52" x2="120" y2="34" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="120" cy="34" rx="13" ry="5" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
    `,
    'lrv': skyAndGround.moon + `
      <ellipse cx="120" cy="133" rx="64" ry="7" fill="#1e293b" opacity="0.5"/>
      <!-- Tekerlek izleri -->
      <path d="M18 136 Q60 132 95 133" stroke="#475569" stroke-width="3" fill="none" stroke-dasharray="4 3"/>
      <!-- Şasi -->
      <polygon points="74,104 166,104 174,114 66,114" fill="#cbd5e1" stroke="#64748b" stroke-width="1.2"/>
      <rect x="150" y="96" width="22" height="10" rx="2" fill="url(#gold)"/>
      <!-- Koltuklar -->
      <path d="M104 104 L104 82 L117 82 L117 104" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>
      <path d="M124 104 L124 82 L137 82 L137 104" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>
      <rect x="103" y="96" width="15" height="6" fill="#475569"/>
      <rect x="123" y="96" width="15" height="6" fill="#475569"/>
      <!-- Yüksek kazançlı altın tel anten çanağı -->
      <line x1="86" y1="104" x2="82" y2="62" stroke="#f8fafc" stroke-width="2.2"/>
      <ellipse cx="80" cy="54" rx="20" ry="11" transform="rotate(-24 80 54)" fill="none" stroke="url(#gold)" stroke-width="2.4"/>
      <ellipse cx="80" cy="54" rx="19" ry="10" transform="rotate(-24 80 54)" fill="#f59e0b" opacity="0.18"/>
      <line x1="80" y1="54" x2="72" y2="42" stroke="#f8fafc" stroke-width="1.5"/>
      <!-- Ön TV kamerası -->
      <line x1="158" y1="96" x2="162" y2="74" stroke="#e2e8f0" stroke-width="2"/>
      <rect x="157" y="68" width="12" height="8" rx="1.5" fill="#f8fafc" stroke="#475569" stroke-width="1"/>
      <circle cx="168" cy="72" r="2.2" fill="#0f172a"/>
      <!-- 4 Tel örgü tekerlek + çamurluklar -->
      <path d="M63 102 Q79 88 95 102" fill="none" stroke="#f59e0b" stroke-width="3"/>
      <path d="M145 102 Q161 88 177 102" fill="none" stroke="#f59e0b" stroke-width="3"/>
      <circle cx="79" cy="118" r="15" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/>
      <circle cx="79" cy="118" r="6" fill="url(#gold)"/>
      <circle cx="161" cy="118" r="15" fill="#1e293b" stroke="#cbd5e1" stroke-width="3"/>
      <circle cx="161" cy="118" r="6" fill="url(#gold)"/>
    `,
    'alsep': skyAndGround.moon + `
      <!-- Regolit dokusu ve astronot ayak izleri -->
      <ellipse cx="120" cy="133" rx="82" ry="9" fill="#334155" opacity="0.48"/>
      <ellipse cx="48" cy="136" rx="6" ry="2.2" fill="#475569" opacity="0.7"/>
      <ellipse cx="62" cy="139" rx="6" ry="2.2" fill="#475569" opacity="0.65"/>
      <ellipse cx="182" cy="137" rx="5.5" ry="2" fill="#475569" opacity="0.65"/>
      <circle cx="90" cy="128" r="1.4" fill="#cbd5e1" opacity="0.5"/>
      <circle cx="152" cy="130" r="1.8" fill="#64748b" opacity="0.55"/>
      <!-- Yassı turuncu şerit kablolar -->
      <path d="M68 127 Q88 134 106 125" fill="none" stroke="#f59e0b" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M138 124 Q152 132 164 127" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
      <path d="M134 126 Q165 139 194 126" fill="none" stroke="#ea580c" stroke-width="1.8" stroke-linecap="round"/>
      <!-- SNAP-27 Nükleer RTG jeneratörü (soğutma kanatlı silindir) -->
      <rect x="44" y="96" width="22" height="31" rx="2" fill="#0f172a" stroke="#94a3b8" stroke-width="1.2"/>
      <rect x="48" y="99" width="14" height="25" fill="#1e293b"/>
      <line x1="39" y1="100" x2="71" y2="100" stroke="#94a3b8" stroke-width="2.2"/>
      <line x1="39" y1="106" x2="71" y2="106" stroke="#64748b" stroke-width="2.2"/>
      <line x1="39" y1="112" x2="71" y2="112" stroke="#94a3b8" stroke-width="2.2"/>
      <line x1="39" y1="118" x2="71" y2="118" stroke="#64748b" stroke-width="2.2"/>
      <line x1="39" y1="124" x2="71" y2="124" stroke="#94a3b8" stroke-width="2.2"/>
      <!-- ALSEP Merkez İstasyonu (çok katmanlı altın/beyaz yalıtım, güneş kalkanı ve sarmal anten direği) -->
      <polygon points="98,94 138,94 142,126 94,126" fill="#e2e8f0" stroke="#64748b" stroke-width="1.2"/>
      <polygon points="94,94 142,94 136,88 100,88" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
      <polygon points="101,99 135,99 137,121 99,121" fill="url(#gold)" stroke="#92400e" stroke-width="1"/>
      <line x1="108" y1="100" x2="108" y2="120" stroke="#fde047" stroke-width="0.9" opacity="0.65"/>
      <line x1="126" y1="100" x2="128" y2="120" stroke="#b45309" stroke-width="0.9" opacity="0.55"/>
      <line x1="118" y1="88" x2="118" y2="33" stroke="#f8fafc" stroke-width="2.6"/>
      <path d="M113 48 L123 45 L113 42 L123 39 L113 36" fill="none" stroke="#e2e8f0" stroke-width="1.3"/>
      <polygon points="110,33 126,33 122,25 114,25" fill="#cbd5e1" stroke="#64748b" stroke-width="1"/>
      <!-- Pasif Sismometre (PSE) buruşuk gümüş Mylar termal örtü eteği -->
      <path d="M148 128 Q154 113 166 112 Q178 113 183 128 Z" fill="#cbd5e1" stroke="#64748b" stroke-width="1.1"/>
      <path d="M153 127 L160 116 L165 126 L171 115 L178 127" fill="none" stroke="#f8fafc" stroke-width="1.2" opacity="0.8"/>
      <rect x="160" y="102" width="12" height="14" rx="1.5" fill="#f8fafc" stroke="#475569" stroke-width="1.1"/>
      <rect x="162" y="104" width="8" height="4" fill="#334155"/>
      <!-- Eğimli Lazer Retroreflektör Dizisi -->
      <polygon points="186,127 208,127 204,116 189,116" fill="#94a3b8" stroke="#475569" stroke-width="1"/>
      <polygon points="188,118 205,112 203,99 186,105" fill="#e2e8f0" stroke="#475569" stroke-width="1.2"/>
      <polygon points="190,115 203,110 201,102 188,107" fill="#0f172a"/>
      <circle cx="192" cy="109" r="1.4" fill="#38bdf8"/>
      <circle cx="196" cy="107" r="1.4" fill="#38bdf8"/>
      <circle cx="200" cy="105" r="1.4" fill="#38bdf8"/>
      <circle cx="193" cy="112" r="1.4" fill="#38bdf8"/>
      <circle cx="198" cy="110" r="1.4" fill="#38bdf8"/>
    `,
    'surveyor': skyAndGround.moon + `
      <ellipse cx="120" cy="133" rx="52" ry="6" fill="#1e293b" opacity="0.5"/>
      <!-- Üçlü boru iniş ayakları -->
      <line x1="108" y1="98" x2="76" y2="130" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/>
      <line x1="132" y1="98" x2="164" y2="130" stroke="#f1f5f9" stroke-width="3" stroke-linecap="round"/>
      <line x1="120" y1="100" x2="120" y2="134" stroke="#cbd5e1" stroke-width="2.8" stroke-linecap="round"/>
      <ellipse cx="76" cy="131" rx="9" ry="3" fill="#e2e8f0"/>
      <ellipse cx="164" cy="131" rx="9" ry="3" fill="#e2e8f0"/>
      <ellipse cx="120" cy="135" rx="9" ry="3" fill="#e2e8f0"/>
      <!-- Gövde kafesi ve altın elektronik kutu -->
      <line x1="104" y1="100" x2="136" y2="100" stroke="#e2e8f0" stroke-width="2.5"/>
      <line x1="104" y1="100" x2="120" y2="70" stroke="#e2e8f0" stroke-width="2.5"/>
      <line x1="136" y1="100" x2="120" y2="70" stroke="#e2e8f0" stroke-width="2.5"/>
      <rect x="109" y="88" width="22" height="16" rx="2" fill="url(#gold)" stroke="#78350f" stroke-width="1"/>
      <!-- Güneş paneli ve düzlemsel anten direği -->
      <line x1="120" y1="70" x2="120" y2="34" stroke="#f8fafc" stroke-width="2.5"/>
      <polygon points="88,48 116,38 118,52 90,62" fill="#1d4ed8" stroke="#93c5fd" stroke-width="1.2"/>
      <rect x="122" y="32" width="26" height="18" transform="rotate(-12 122 32)" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
      <!-- TV kamerası -->
      <rect x="134" y="68" width="10" height="20" rx="2" fill="#e2e8f0" stroke="#64748b" stroke-width="1"/>
      <circle cx="139" cy="72" r="3" fill="#0f172a"/>
    `,
    'sojourner': skyAndGround.mars + `
      <ellipse cx="120" cy="133" rx="50" ry="6" fill="#451a03" opacity="0.5"/>
      <!-- Rocker-bogie süspansiyon ve 6 küçük tekerlek -->
      <path d="M82 124 L98 106 L120 106 L142 124" fill="none" stroke="#e2e8f0" stroke-width="2.2"/>
      <line x1="120" y1="106" x2="120" y2="124" stroke="#cbd5e1" stroke-width="2.2"/>
      <circle cx="82" cy="126" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="120" cy="127" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="2.5"/>
      <circle cx="156" cy="126" r="9" fill="#1e293b" stroke="#94a3b8" stroke-width="2.5"/>
      <!-- Altın elektronik gövde ve üst güneş paneli -->
      <rect x="88" y="96" width="64" height="14" rx="2" fill="url(#gold)" stroke="#78350f" stroke-width="1"/>
      <polygon points="80,96 160,96 154,84 86,84" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1.2"/>
      <line x1="102" y1="84" x2="100" y2="96" stroke="#3b82f6" stroke-width="0.8"/>
      <line x1="120" y1="84" x2="120" y2="96" stroke="#3b82f6" stroke-width="0.8"/>
      <line x1="138" y1="84" x2="140" y2="96" stroke="#3b82f6" stroke-width="0.8"/>
      <!-- Anten ve APXS sensörü -->
      <line x1="94" y1="84" x2="94" y2="56" stroke="#f8fafc" stroke-width="1.8"/>
      <circle cx="94" cy="54" r="3" fill="#f59e0b"/>
      <polygon points="166,133 190,118 206,134" fill="#9a3412" stroke="#7c2d12" stroke-width="1"/>
      <line x1="152" y1="102" x2="174" y2="118" stroke="#cbd5e1" stroke-width="2"/>
      <rect x="172" y="114" width="9" height="9" fill="#eab308"/>
    `,
    'spirit-opportunity': skyAndGround.mars + `
      <ellipse cx="120" cy="135" rx="64" ry="7" fill="#451a03" opacity="0.5"/>
      <!-- Rocker-bogie ve 6 tekerlek -->
      <path d="M74 124 L94 102 L144 102 L166 124" fill="none" stroke="#cbd5e1" stroke-width="2.6"/>
      <line x1="120" y1="102" x2="120" y2="126" stroke="#cbd5e1" stroke-width="2.6"/>
      <circle cx="74" cy="126" r="11" fill="#0f172a" stroke="#94a3b8" stroke-width="2.6"/>
      <circle cx="120" cy="128" r="11" fill="#0f172a" stroke="#94a3b8" stroke-width="2.6"/>
      <circle cx="166" cy="126" r="11" fill="#0f172a" stroke="#94a3b8" stroke-width="2.6"/>
      <!-- Gövde ve geniş kanatlı güneş panelleri -->
      <rect x="96" y="90" width="48" height="16" rx="2" fill="url(#gold)" stroke="#78350f" stroke-width="1"/>
      <polygon points="64,90 176,90 162,76 78,76" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1.3"/>
      <!-- Pancam kamera direği -->
      <line x1="142" y1="84" x2="142" y2="44" stroke="#f8fafc" stroke-width="3"/>
      <rect x="130" y="37" width="24" height="9" rx="2" fill="#f8fafc" stroke="#475569" stroke-width="1.2"/>
      <circle cx="136" cy="41.5" r="2.2" fill="#0f172a"/>
      <circle cx="148" cy="41.5" r="2.2" fill="#0f172a"/>
      <!-- Yüksek kazançlı çanak anten -->
      <line x1="104" y1="84" x2="96" y2="62" stroke="#e2e8f0" stroke-width="2"/>
      <ellipse cx="94" cy="58" rx="13" ry="6" transform="rotate(-25 94 58)" fill="#f8fafc" stroke="#94a3b8" stroke-width="1"/>
    `,
    'viking': skyAndGround.mars + `
      <ellipse cx="120" cy="134" rx="60" ry="7" fill="#451a03" opacity="0.5"/>
      <!-- 3 İniş ayağı -->
      <line x1="90" y1="102" x2="70" y2="132" stroke="#cbd5e1" stroke-width="3.2"/>
      <line x1="150" y1="102" x2="170" y2="132" stroke="#cbd5e1" stroke-width="3.2"/>
      <line x1="120" y1="104" x2="120" y2="135" stroke="#94a3b8" stroke-width="3"/>
      <ellipse cx="70" cy="133" rx="9" ry="3" fill="#e2e8f0"/>
      <ellipse cx="170" cy="133" rx="9" ry="3" fill="#e2e8f0"/>
      <ellipse cx="120" cy="136" rx="9" ry="3" fill="#e2e8f0"/>
      <!-- Ana altıgen gövde ve ikiz RTG kalkanları -->
      <polygon points="82,86 158,86 164,104 76,104" fill="#f1f5f9" stroke="#64748b" stroke-width="1.3"/>
      <rect x="74" y="76" width="18" height="12" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1"/>
      <rect x="148" y="76" width="18" height="12" rx="2" fill="#94a3b8" stroke="#475569" stroke-width="1"/>
      <!-- Beyaz parabolik anten ve iki kamera kulesi -->
      <line x1="112" y1="86" x2="106" y2="54" stroke="#e2e8f0" stroke-width="2.2"/>
      <ellipse cx="104" cy="46" rx="18" ry="8" transform="rotate(-18 104 46)" fill="#f8fafc" stroke="#94a3b8" stroke-width="1.2"/>
      <rect x="128" y="64" width="7" height="22" fill="#cbd5e1"/>
      <rect x="139" y="68" width="7" height="18" fill="#cbd5e1"/>
      <!-- Toprak numune alma robotik kolu -->
      <path d="M158 98 L190 112 L202 128" fill="none" stroke="#e2e8f0" stroke-width="2.5"/>
      <rect x="199" y="125" width="8" height="6" fill="#f59e0b"/>
    `,
    'phoenix-insight': skyAndGround.mars + `
      <ellipse cx="120" cy="134" rx="58" ry="6" fill="#451a03" opacity="0.5"/>
      <!-- İki ikonik dairesel yelpaze güneş paneli -->
      <circle cx="58" cy="96" r="28" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1.5"/>
      <circle cx="182" cy="96" r="28" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1.5"/>
      <line x1="58" y1="68" x2="58" y2="124" stroke="#3b82f6" stroke-width="0.9"/>
      <line x1="30" y1="96" x2="86" y2="96" stroke="#3b82f6" stroke-width="0.9"/>
      <line x1="182" y1="68" x2="182" y2="124" stroke="#3b82f6" stroke-width="0.9"/>
      <line x1="154" y1="96" x2="210" y2="96" stroke="#3b82f6" stroke-width="0.9"/>
      <!-- İniş ayakları ve ana gövde -->
      <line x1="100" y1="106" x2="88" y2="132" stroke="#e2e8f0" stroke-width="2.8"/>
      <line x1="140" y1="106" x2="152" y2="132" stroke="#e2e8f0" stroke-width="2.8"/>
      <polygon points="94,90 146,90 152,107 88,107" fill="url(#gold)" stroke="#78350f" stroke-width="1.2"/>
      <!-- Robotik kol ve zemindeki bakır SEIS sismometre kubbesi -->
      <path d="M138 90 L156 76 L172 114" fill="none" stroke="#e2e8f0" stroke-width="2.2"/>
      <path d="M166 135 A14 14 0 0 1 194 135 Z" fill="#f8fafc" stroke="#f59e0b" stroke-width="1.5"/>
      <rect x="174" y="128" width="12" height="7" fill="#d97706"/>
    `,
    'ingenuity': skyAndGround.mars + `
      <ellipse cx="120" cy="134" rx="34" ry="5" fill="#451a03" opacity="0.45"/>
      <!-- 4 İnce karbon iniş ayağı -->
      <line x1="110" y1="92" x2="90" y2="130" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="130" y1="92" x2="150" y2="130" stroke="#334155" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="114" y1="92" x2="104" y2="126" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="126" y1="92" x2="136" y2="126" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/>
      <!-- Altın/gümüş folyo kaplı küp gövde -->
      <rect x="108" y="76" width="24" height="20" rx="2" fill="url(#gold)" stroke="#92400e" stroke-width="1.2"/>
      <rect x="114" y="80" width="12" height="10" fill="#e2e8f0" opacity="0.65"/>
      <!-- Koaksiyel rotor direği ve çift ters dönüşlü pervane kanatları -->
      <line x1="120" y1="76" x2="120" y2="38" stroke="#cbd5e1" stroke-width="2.5"/>
      <ellipse cx="120" cy="56" rx="54" ry="4.5" fill="#0f172a" stroke="#64748b" stroke-width="1"/>
      <ellipse cx="120" cy="47" rx="54" ry="4.5" fill="#1e293b" stroke="#94a3b8" stroke-width="1"/>
      <!-- Üst dikdörtgen güneş paneli -->
      <polygon points="94,38 146,38 140,30 100,30" fill="#1e3a8a" stroke="#60a5fa" stroke-width="1.2"/>
    `
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="28 18 184 126">${devices[type] || skyAndGround.moon}</svg>`;
  return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg).replace(/'/g, '%27');
}

// İlk fırlatıldığı gündeki temiz yedek görsel (gerçek NASA fotoğrafı yüklenemediğinde kullanılır)
function createPristineDeviceSvgDataUri(type) {
  return createDeviceSvgDataUri(type);
}

const SPACE_DATA = {
  moon: {
    id: 'moon',
    name: 'Ay (The Moon)',
    subtitle: 'İnsanlığın İlk Uzay Durağı',
    description:
      '1960’lardan bu yana cesur robotlar ve astronotlar Ay’a yolculuk yaptı! Astronotlar Dünya’ya geri döndü ama onları taşıyan uzay araçları, elektrikli ay arabaları ve bilimsel istasyonlar bugün hâlâ Ay tozlarının üzerinde sessiz kahramanlar olarak uyuyor. Birine tıkla ve geçmişten bugüne macerasını dinle!',
    equipment: [
      {
        id: 'apollo-lm',
        name: 'Apollo Lunar Modules (Eagle İniş Kademesi)',
        year: '1969 - 1972',
        location: 'Sükûnet Denizi (Mare Tranquillitatis)',
        status: 'Ay yüzeyinde sabit anıt',
        lat: 0.67,
        lon: 23.47,
        nasaId: 'AS11-40-5927',
        image: createDeviceSvgDataUri('apollo-lm'),
        imageCaption: 'Apollo 11 Eagle İniş Modülü — Sükûnet Denizi (NASA AS11-40-5927)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('apollo-lm'),
        thankYouMessage: "Harika iş! İniş kadememin altın folyolarını Ay tozundan temizledin; Eagle modülü fırlatıldığı günkü gibi pırıl pırıl parlıyor!",
        audioUrl: "audio2/Apollo Lunar Module.m4a",
        cardData: {
          rarity: 'EFSANEVİ',
          stats: { dayaniklilik: 94, bilimGucu: 96, cesaret: 99 },
          secretFact: "Gövdesindeki altın kapton folyo kağıt kadar incedir; uzayda rüzgâr olmadığı için yırtılmadan astronotları Güneş'in kavurucu ısısından korumuştur.",
          locks: [
            { title: "Gövde Zırhı", options: ["İnce Altın Folyo", "Kalın Çelik", "Titanyum Cam"], correctIndex: 0 },
            { title: "İniş Yeri", options: ["Sükûnet Denizi", "Olympus Dağı", "Tycho Krateri"], correctIndex: 0 }
          ]
        },
        story: `Merhaba genç kaşif! Ben Eagle, yani uzayın altın kanatlı Kartal’ıyım. Uzaktan bakınca parlayan altın yaldızlı bir uzay örümceğine benziyorum, değil mi? Üzerimdeki o altın örtüler süs olsun diye takılmadı; Güneş’in yakıcı sıcağından ve uzayın dondurucu soğuğundan beni koruyan özel bir ısı kalkanı! Gövdemin altında ince Ay tozuna batmamam için kocaman tepsi gibi ayakları olan dört örümcek bacağım, ön bacağımda da astronotların Ay’a inmesini sağlayan dokuz basamaklı merdivenim var. Aslında ben iki katlı bir uzay eviydim: Alt katım Ay’a iniş motorumu ve bilimsel eşyaları taşıyordu, üst katım ise astronotları evlerine götürecek mini bir roketti. Gövdemdeki altın folyo o kadar inceydi ki parmağınla bastırsan kâğıt gibi yırtılabilirdi; ama uzayda rüzgâr olmadığı için bana zırh gibi yetti!

Dünya’dan dev Satürn V roketinin içinde fırlatıldığımızda kalbim heyecanla atıyordu. Günler süren sessiz yolculuğun ardından Ay yörüngesine girdik ve 20 Temmuz 1969 akşamı inişe geçtik. İşte tam o anda bilgisayarım uyarı vermeye başladı: Otomatik pilot beni futbol sahası büyüklüğünde, dev kayalarla dolu tehlikeli bir kraterin tam ortasına indiriyordu! Tankımda sadece yirmi beş saniyelik yakıtım kalmıştı. Neyse ki komutan Neil Armstrong hemen dümeni devraldı, beni kayaların üzerinden süzülerek yandaki güvenli düzlüğe pamuk gibi indirdi. Ayaklarım Sükûnet Denizi’nin tozuna dokunduğu an Dünya’daki milyonlarca çocuk sevinçten havalara sıçradı.

İnişten birkaç saat sonra kapım aralandı ve Neil Armstrong ile Buzz Aldrin dokuz basamaklı merdivenimden ağır çekimde zıplayarak ilk kez başka bir gök cismine ayak bastılar. Saatler boyunca etrafımda yürüyüp gümüş renkli kaya örnekleri topladılar, deneyler kurdular ve tarihe geçen o meşhur ayak izlerini bıraktılar. Ayrılık vakti geldiğinde ise üst katım beni bir fırlatma rampası gibi kullanıp ateşlendi; ben aşağıdaki altın örümcek bacaklarımın üzerinde Ay’da kalarak onları yörüngeye uğurladım. Benden sonra gelen kardeşlerimle birlikte tam altı kez insanlığı Ay’a güvenle indirmeyi başardık.

İnsanlık o gün benim sayemde evrenin sadece Dünya’dan ibaret olmadığını gördü. Ay’dan eve taşınan taşlar sayesinde Ay’ın milyarlarca yıllık yaşını, nasıl oluştuğunu ve güneş sisteminin erken çocukluk dönemini öğrendik. Uzayın karanlığında iki kişilik minik bir evin başka bir dünyaya inip tekrar güvenle geri dönebilmesi, yarının uzay yolculuklarına açılan ilk büyük kapı oldu.

Bugün hâlâ 1969 yılında indiğim Sükûnet Denizi’nde, rüzgârın ve yağmurun uğramadığı o sonsuz sessizliğin içinde dimdik duruyorum. Etrafımda astronotların attığı ilk adımların izleri elli yılı aşkın süredir tek bir toz tanesi bile kıpırdamadan duruyor. Ne zaman gökyüzünde parlayan dolunaya baksan, orada insanlığın ilk büyük hayalini taşıyan altın örümceği ve seni selamlayan bir sessiz anıtı hatırlayabilirsin!`
      },
      {
        id: 'lrv',
        name: 'Lunar Roving Vehicles (LRV - Ay Arabaları)',
        year: '1971 - 1972',
        location: 'Hadley-Apennine, Descartes, Taurus-Littrow',
        status: '3 adet araç park halinde',
        lat: 26.13,
        lon: 3.63,
        nasaId: 'AS15-88-11901',
        image: createDeviceSvgDataUri('lrv'),
        imageCaption: 'Apollo 15 Ay Arabası (LRV) — Hadley-Apennine (NASA AS15-88-11901)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('lrv'),
        thankYouMessage: "Yaşasın! Ay Arabamın tel örgü tekerleklerindeki gri tozu süpürdün, akülerim %100 doldu! Krater kenarlarında yine keşfe hazırım!",
        audioUrl: "audio2/Lunar Roving Vehicles.m4a",
        cardData: {
          rarity: 'DESTANSI',
          stats: { dayaniklilik: 91, bilimGucu: 89, cesaret: 95 },
          secretFact: "Tekerlekleri kauçuktan değil, Ay'ın keskin taşlarında patlamaması için esnek piyano tellerinin örülmesiyle yapılmıştır ve uzay gemisine origami gibi katlanarak sığdırılmıştır.",
          locks: [
            { title: "Enerji Kaynağı", options: ["Elektrik Bataryası", "Güneş Paneli", "Dizel Motor"], correctIndex: 0 },
            { title: "Ay'daki Sayısı", options: ["3 Adet", "1 Adet", "7 Adet"], correctIndex: 0 }
          ]
        },
        story: `Vın vın! Merhaba küçük sürücü! Biz Ay’ın en havalı ve ilk elektrikli arazi arabalarıyız. İlk astronotlar kalın ve şişkin uzay kıyafetleriyle Ay tozunda yürümekte çok zorlanıp hemencecik yoruluyorlardı; bu yüzden NASA mühendisleri akıllarına süper bir fikir getirdi ve bizi tasarladı. Benzin yerine dev pillerle çalışan, saatte yaklaşık on üç kilometre hızla kum tepelerine tırmanabilen gerçek birer uzay cipiydik! Lastiklerimiz ise kauçuktan değil, esnek piyano tellerinin örülmesiyle yapılmıştı; çünkü Ay’ın keskin kayalarında lastik patlasaydı orada tamir edecek bir lastikçi bulamazdık! Önümde duran altın şemsiyeye benzer çanak antenim ise çektiğimiz görüntüleri canlı yayınla Dünya’daki ekranlara ulaştırıyordu.

Böylesine kocaman bir arabayı küçücük uzay gemisine sığdırmak kolay değildi. Mühendisler beni adeta bir origami kâğıdı gibi ortadan ikiye katlayıp tekerleklerimi içeri kıvırdılar ve iniş modülünün yan cebine gizlediler. 1971 yılında Apollo 15 ile Ay’a indiğimizde astronotlar gövdemdeki özel bir ipi çekti; işte o an yaylarım gevşedi, tekerleklerim açıldı ve sürpriz bir oyuncak gibi dört tekerleğimin üzerine sıçradım! Dünya’da iki yüz on kilogram geliyordum ama Ay’ın zayıf çekimi sayesinde orada sadece otuz beş kiloluk büyük bir okul çantası kadar hafifleştim.

Üç kardeş farklı Ay vadilerinde unutulmaz sürüşler yaptık, kraterlerin kenarlarından geçtik ve dev kayaların arasından süzüldük. En komik ve heyecanlı anımız ise 1972’de Apollo 17 görevinde yaşandı: Sert bir dönüş sırasında çamurluğum kırılınca tekerleklerim astronotların kasklarına ve kıyafetlerine boydan boya siyah Ay tozu fırlatmaya başladı! Her yer toz içinde kalınca astronotlar hemen çantalarından parlak kâğıt haritaları ve sağlam koli bantlarını çıkarıp bana yepyeni bir çamurluk dikti. O tamir sayesinde yolumuza devam edip kilometrelerce keşif yaptık.

Tekerleklerimiz sayesinde astronotlar yürüyerek asla gidemeyecekleri uzak dağ eteklerine ve eski lav yataklarına ulaştı. Toplamda doksan kilometreden fazla yol yaparak Ay’ın sönmüş yanardağlarla dolu ateşli geçmişini ve rengârenk cam tanecikleri saklayan toprağını bilim insanlarına armağan ettik. Bir gün gelecekteki Mars ve Ay araçlarının nasıl süreceğini ilk kez biz deneyip gösterdik.

Şimdi üçümüz de son görevimizi tamamladığımız Hadley, Descartes ve Taurus-Littrow vadilerinde yan yana değil ama aynı yıldızlı göğün altında sessizce park halindeyiz. Pillerimiz çoktan bitti, direksiyonlarımızı tutan kimse kalmadı; ama güneşin doğup batışını izleyerek ilk tekerlek izlerimizin başında nöbet tutmaya devam ediyoruz.`
      },
      {
        id: 'alsep',
        name: 'ALSEP Bilimsel Deney Paketleri',
        year: '1969 - 1977',
        location: 'Apollo 12, 14, 15, 16, 17 İniş Alanları',
        status: 'Pasif (Retroreflektörler hâlâ aktif)',
        lat: -3.01,
        lon: -23.42,
        nasaId: 'AS11-40-5948',
        photoCandidates: [
          'https://commons.wikimedia.org/wiki/Special:FilePath/Ap16_pse.jpg?width=640',
          'https://commons.wikimedia.org/wiki/Special:FilePath/AS14-67-9366.jpg?width=640',
          'https://commons.wikimedia.org/wiki/Special:FilePath/AS11-40-5948.jpg?width=640',
          'https://commons.wikimedia.org/wiki/Special:FilePath/ALSEP_AS17-134-20501.jpg?width=640'
        ],
        image: createDeviceSvgDataUri('alsep'),
        imageCaption: 'ALSEP Bilimsel Deney İstasyonu ve Sismometre Paketi — Ay Yüzeyi (NASA Apollo Arşivi)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('alsep'),
        thankYouMessage: "Süper temizlik! ALSEP bilim istasyonumun güneş sensörleri parladı; Ay'ın kalp atışlarını ilk günkü hassasiyetle ölçebilirim!",
        audioUrl: "audio2/ALSEP Bilimsel Deney İstasyonu.m4a",
        cardData: {
          rarity: 'EFSANEVİ',
          stats: { dayaniklilik: 98, bilimGucu: 99, cesaret: 90 },
          secretFact: "Üzerindeki lazer aynaları bugün bile Dünya'dan gönderilen lazerleri geri yansıtır ve Ay'ın her yıl bizden 3.8 cm uzaklaştığını kanıtlar.",
          locks: [
            { title: "Aktif Kalan Parça", options: ["Lazer Yansıtıcı Aynalar", "Radyo Anteni", "Kamera Lensi"], correctIndex: 0 },
            { title: "Ölçtüğü Olay", options: ["Ay Depremleri", "Yağmur Bulutları", "Okyanus Dalgaları"], correctIndex: 0 }
          ]
        },
        story: `Şşşt, kulak ver küçük kaşif! Ben Ay’ın sessiz doktoruyum. Adım ALSEP, yani Ay Yüzeyi Bilimsel Deney İstasyonu. Görüntüm biraz karmaşık kablolarla birbirine bağlı gümüş ve altın kutulardan oluşan bir bilim kampına benzer. Güneş battığında Ay’da geceler tam on dört gün sürer ve hava buz keser; normal piller orada donup kalır. Bu yüzden gövdemin yanında sıcak kalan özel bir nükleer pilim, toprağa yaslanmış stetoskop gibi hassas sismometrem ve Dünya’ya bakan yüzlerce minik cam prizmadan oluşan lazer aynalarım vardır.

Astronotlar Ay’daki son gezilerini tamamlarken beni tek tek parçalar halinde taşıyıp kurdular. Turuncu kablolarımı toprağın üzerine serdiler, incecik gümüş yorganlarımı soğuktan korunmam için örttüler ve uzun antenimi gökyüzündeki mavi Dünya’ya doğru çevirdiler. Sonra bana el sallayıp roketlerine bindiler. Ay yüzeyi bir anda tamamen boşaldığında herkes eve dönmüştü ama benim asıl görevim o ıssız sessizlikte yeni başlıyordu.

Tam sekiz yıl boyunca Ay’da yapayalnız nöbet tuttum! Kimse orada yokken gece gündüz uyumadan çalıştım ve Ay’ın derinliklerinden gelen kalp atışlarını dinledim. Meğer Ay hiç de taş gibi cansız değilmiş; tıpkı Dünya gibi onda da Ay depremleri oluyormuş! Binlerce minik titreşimi, göktaşı çarpmasını ve Güneş’ten esen görünmez uzay rüzgârlarını hiç yorulmadan kaydedip radyo dalgalarıyla Dünya’daki bilim insanlarına fısıldadım.

Dinlediğim o sinyaller sayesinde insanların Ay’a bakışı sonsuza dek değişti. Ay’ın tıpkı bir şeftali ya da Dünya gibi kabuğa, manto katmanına ve tam ortasında bir çekirdeğe sahip olduğunu ortaya çıkardım. Üstelik Dünya’daki gözlemevlerinden gönderilen lazer ışıklarını cam aynalarımla tam geldiği yere geri zıplatarak çok şaşırtıcı bir sırrı daha çözdük: Ay her yıl bizden yaklaşık üç buçuk santimetre, yani neredeyse bir tırnak boyu kadar yavaş yavaş uzaklaşıyor!

Radyo vericim 1977 yılında yorulup sustu ama öyküm hâlâ bitmedi! Çünkü üzerimdeki cam aynalar elektrik bile istemeden sonsuza dek çalışabiliyor. Dünya’dan gönderilen lazer ışınları bugün bile Ay tozunun üzerindeki aynalarıma çarpıp geri dönüyor ve gökyüzündeki en eski bilim nöbetçisinin hâlâ görevde olduğunu hatırlatıyor.`
      },
      {
        id: 'surveyor',
        name: 'Surveyor Robotik İniş Araçları',
        year: '1966 - 1968',
        location: 'Fırtınalar Okyanusu & Tycho Krateri',
        status: 'Görevini tamamladı, yüzeyde',
        lat: -40.86,
        lon: -11.22,
        nasaId: 'AS12-48-7121',
        image: createDeviceSvgDataUri('surveyor'),
        imageCaption: 'Surveyor 3 İniş Aracı — Fırtınalar Okyanusu (NASA AS12-48-7121)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('surveyor'),
        thankYouMessage: "Teşekkürler genç kaşif! Mavi güneş panelim ve üç iniş ayağım Ay tozundan kurtuldu; güvenli inişi dünyaya yeniden müjdeleyebilirim!",
        audioUrl: "audio2/Surveyor Robotik İniş Araçları.m4a",
        cardData: {
          rarity: 'DESTANSI',
          stats: { dayaniklilik: 86, bilimGucu: 91, cesaret: 96 },
          secretFact: "Surveyor 3 inişinden 2,5 yıl sonra Apollo 12 astronotları tarafından ziyaret edilmiş ve kamerası incelenmek üzere Dünya'ya geri getirilmiştir.",
          locks: [
            { title: "Ana Görevi", options: ["Yumuşak İnişi Kanıtlamak", "Su Aramak", "Astronot Taşımak"], correctIndex: 0 },
            { title: "Görev Yılı", options: ["1966 - 1968", "1997 - 1999", "2010 - 2012"], correctIndex: 0 }
          ]
        },
        story: `Merhaba cesur yolcu! Ben Surveyor, yani Ay’a insanlardan yıllar önce giden ilk öncü robotum. Dışarıdan bakınca beyaz borulardan yapılmış hafif bir üçayaklı iskeleye, tepesinde mavi bir güneş yelkeni ve etrafı merakla süzen bir televizyon kamerası taşıyan ince bir kâşife benzerim. Yan tarafımda ise küçük bir metal kepçem var. İnsanlar Ay’a yolculuk hayalleri kurarken herkesin aklında büyük bir korku vardı: Ya Ay’ın yüzeyi yüzlerce metre derinliğinde yumuşak bir toz bataklığıysa ve inen uzay gemileri içine gömülüp kaybolursa? İşte o büyük soruyu çözmek için tek başıma yola çıktım!

1966’dan itibaren beş kardeşimle birlikte roketlerin tepesinde Ay’a yollandık. Yere yaklaşırken iniş motorlarımızı ateşleyip yavaşladık ve büyük yaylı ayaklarımızla yumuşacık bir iniş yaptık. Kameralarımız açılıp da kendi ayak izlerimizi gösterdiğinde Dünya’daki tüm bilim odalarında derin bir oh çekildi! Ay yüzeyi bataklık değil, yürümeye ve ağır uzay gemilerini taşımaya yetecek kadar sağlam bir toz ve kaya tabakasıymış.

Görevim boyunca dönen kameramla etrafımın binlerce siyah-beyaz fotoğrafını çektim ve minik robot kepçemle Ay toprağını kazıp ne kadar sert olduğunu test ettim. Ama asıl sürpriz, benim uykuya dalmamdan tam iki buçuk yıl sonra yaşandı! Ben Surveyor 3, sessiz bir krater yamacında uyurken birdenbire gökyüzünden tanıdık bir uğultu geldi: Apollo 12 astronotları tam yanı başıma inmişti! Uzun süredir yalnız durduğum kraterde bana merhaba dediler, tozlu gövdemi incelediler ve kameramı hatıra olarak söküp Dünya’ya geri götürdüler.

Sayemde mühendisler Apollo uzay gemilerinin iniş ayaklarını güvenle tasarlayabildi ve astronotlar için en düz iniş noktaları seçildi. Üstelik Dünya’ya geri getirilen kameramı inceleyen bilim insanları, başka bir gök cisminde yıllarca kalmış bir makinenin uzay koşullarına nasıl dayandığını tarihte ilk kez canlı gözle görmüş oldu.

Bugün hâlâ Fırtınalar Okyanusu’ndaki küçük kraterin yamacında, ilk indiğim günkü pozumda sessizce oturuyorum. Kameram müzede insanlara o günleri anlatırken, ben burada benden sonra gelen tüm kahramanlara yolu açan ilk öncü anıt olarak güneşin ve yıldızların altında bekliyorum.`
      }
    ]
  },

  mars: {
    id: 'mars',
    name: 'Mars (Kızıl Gezegen)',
    subtitle: 'Robotik Kaşiflerin Masal Diyarı',
    description:
      'Kızıl gezegen Mars’ta hiç insan yürümedi ama onun yerine tekerlekli robotlar, kazıcı istasyonlar ve hatta minik bir helikopter gökyüzünde uçtu! Dev toz fırtınaları altında uykuya dalan bu cesur robot kaşiflerin birine tıkla ve maceralarını keşfet!',
    equipment: [
      {
        id: 'sojourner',
        name: 'Sojourner Rover (Mars Pathfinder)',
        year: '1997',
        location: 'Ares Vallis',
        status: 'İletişim kesildi, yüzeyde',
        lat: 19.13,
        lon: -33.22,
        nasaId: 'PIA01122',
        image: createDeviceSvgDataUri('sojourner'),
        imageCaption: 'Sojourner Gezgini — Ares Vallis Kayalıkları (NASA/JPL PIA01122)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('sojourner'),
        thankYouMessage: "Harikasın! Mikrodalga fırın boyutundaki minik gövdem ve güneş panelim tozdan arındı; Mars kayalarını incelemeye ilk günkü heyecanımla hazırım!",
        audioUrl: "audio2/Sojourner Rover.m4a",
        cardData: {
          rarity: 'DESTANSI',
          stats: { dayaniklilik: 88, bilimGucu: 90, cesaret: 97 },
          secretFact: "Mars'a paraşütten sonra dev hava yastıkları içinde bir top gibi 15 kez zıplayarak inmiş ve başka bir gezegende ilk tekerlek izini bırakmıştır.",
          locks: [
            { title: "Boyutu", options: ["Mikrodalga Fırın Kadar", "Otobüs Kadar", "Futbol Topu Kadar"], correctIndex: 0 },
            { title: "Çalışma Süresi", options: ["83 Gün", "7 Gün", "10 Yıl"], correctIndex: 0 }
          ]
        },
        story: `Bip bop, selam uzay dostu! Ben Sojourner, yani başka bir gezegende tekerlek izi bırakan tarihin ilk mini robot gezginiyim! Boyum neredeyse evdeki bir mikrodalga fırın kadardı, ağırlığım da sadece on buçuk kilogramdı; yani kollarının arasına alıp rahatça taşıyabileceğin kadar ufak tefektim. Ama küçücük gövdemde harika bir tasarım vardı: Üzerimdeki mavi güneş paneliyle enerjimi topluyor, özel yaylı altı tırmanıcı tekerleğimle kendi boyumdaki kayalara devrilmeden tırmanabiliyor ve arkamdaki küçük burun benzeri sensörü taşlara yaslayıp içindeki mineralleri koklayarak okuyabiliyordum!

Mars’a inişim tam bir lunapark macerası gibiydi! Pathfinder adlı ana istasyonum beni kızıl gezegenin taşlı zeminine kırmadan indirmek için dev hava yastıklarının içine sardı. 4 Temmuz 1997’de atmosfere girip paraşütümüzü açtık, sonra kocaman bir top gibi Mars kayalarının üzerinde tam on beş kez zıplayıp yuvarlandık! Durduğumuzda hava yastıkları söndü, metal yapraklar bir çiçek gibi açıldı ve ben küçük rampadan süzülerek Mars toprağına tarihin ilk tekerlek izlerini çizdim.

Mühendisler beni sadece yedi günlük kısa bir deneme için göndermişti. Ancak ben Mars’ı o kadar sevdim ki tam seksen üç gün boyunca yorulmadan gezdim! Bilim insanları benimle oyun oynar gibi etrafımda bulduğum kayalara çizgi film kahramanlarının adını veriyordu: “Yogi Ayı”, “Scooby-Doo” ve “Barnacle Bill” adlı kayaların yanına gidip tek tek inceleme yaptım ve fotoğraflarını yeni yeni yaygınlaşan internet sayesinde tüm dünyadaki çocuklara ulaştırdım.

Ben yola çıkana kadar başka bir gezegende tekerlekli bir robotun kendi başına dolaşabileceğine kimse emin değildi. İncelediğim yuvarlak ve pürüzsüz çakıl taşları ise bize çok büyük bir sır fısıldadı: Kızıl ve kuru gördüğümüz bu çöl vadisinde milyarlarca yıl önce gürül gürül nehirler ve dev sel suları akıyormuş! Benden sonra Mars’a gidecek tüm dev robot gezginlerin cesaretini ilk ben ateşledim.

Ana istasyonumun pilleri tükenince Dünya ile konuşmam sona erdi. Bugün hâlâ Ares Vallis vadisindeki eski kayaların arasında, etrafımda çizdiğim ilk tekerlek izlerinin yanında ufak ama dev yürekli bir kaşif anıtı olarak dinleniyorum.`
      },
      {
        id: 'spirit-opportunity',
        name: 'Spirit & Opportunity İkiz Gezginleri',
        year: '2004 - 2018',
        location: 'Gusev Krateri & Meridiani Planum',
        status: 'Batarya tükendi, yüzeyde anıt',
        lat: -1.95,
        lon: -5.53,
        nasaId: 'PIA03240',
        photoCandidates: ['spirit-opportunity.jpg'],
        image: 'spirit-opportunity.jpg',
        fallbackImage: createDeviceSvgDataUri('spirit-opportunity'),
        imageCaption: 'Spirit & Opportunity İkiz Mars Gezginleri (NASA/JPL PIA03240)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('spirit-opportunity'),
        thankYouMessage: "Sistemler aktif, teşekkürler! Kalın Mars tozunu temizlediğin için ikiz güneş kanatlarımız yeniden güneşle doldu; kızıl çölde kilometrelerce ilerleyebiliriz!",
        audioUrl: "audio2/Spirit & Opportunity İkiz Gezginleri.m4a",
        cardData: {
          rarity: 'EFSANEVİ',
          stats: { dayaniklilik: 99, bilimGucu: 98, cesaret: 99 },
          secretFact: "90 gün için gönderildi ama Mars rüzgârları güneş panellerini temizleyince tam 14 yıl boyunca Mars'ta yol aldı!",
          locks: [
            { title: "Uyuma Sebebi", options: ["Toz Fırtınası ve Güneş Paneli", "Uzaylı Saldırısı", "Yakıt Sızıntısı"], correctIndex: 0 },
            { title: "Büyük Keşfi", options: ["Geçmişte Sıvı Su İzleri", "Aktif Yanardağ", "Buzul Okyanusu"], correctIndex: 0 }
          ]
        },
        story: `Merhaba maceraperest! Biz Mars’ın ayrılmaz ikiz kardeşleri Spirit ve Opportunity’yiz. İkimiz de birbirimizin tıpatıp aynısıydık; kelebek kanadı gibi iki yana açılan lacivert güneş panellerimiz, altı güçlü alüminyum tekerleğimiz ve zürafaya benzeyen uzun bir kamera direğimiz vardı. Direğimizin tepesindeki çift gözümüz insan gözleri gibi etrafı üç boyutlu görüyor, robot kolumuzdaki tel fırça ve minik taş matkabımızla da Mars kayalarının üzerindeki tozu süpürüp altındaki gizli katmanlara bakıyorduk.

2004 yılının Ocak ayında birkaç hafta arayla iki farklı roketten ayrılıp dev hava yastıkları içinde zıplayarak Mars’ın tamamen zıt iki kıtasına indik! Spirit büyük bir kraterin içinde uyanırken, ben Opportunity doğrudan sığ bir krater çanağının içine yani tam bir bilim hazinesinin ortasına yuvarlanmıştım. Herkes sadece doksan gün çalışıp tozların altında donacağımızı düşünüyordu; çünkü güneş panellerimiz yakında kızıl tozla kaplanacaktı.

Ama Mars’ın bile beklemediği bir sürpriz oldu! Ara sıra esen minik Mars hortumları ve rüzgârlar ücretsiz araba yıkamacılar gibi üzerimizdeki tozları üfleyip panellerimizi pırıl pırıl temizledi! Böylece üç aylık gezi tam on dört yıllık akılalmaz bir uzay maratonuna dönüştü! Kardeşim Spirit altı yıl boyunca dağlara tırmandıktan sonra kış soğuğunda uykuya daldı. Ben Opportunity ise tam kırk beş kilometre yol yaparak başka bir gezegende en uzun mesafe giden gezgin rekorunu kırdım; ta ki 2018 yılında tüm gezegeni saran dev bir toz fırtınası güneşi günlerce kapatana kadar...

Mars’ı karış karış gezerken toprağın içinde minik yaban mersinlerine benzeyen parlak demir bilyeler bulduk! Bu küçücük taş boncuklar ancak ve ancak suyun içinde oluşabilirdi. Demek ki Mars bir zamanlar kurak bir çöl değil, kıyılarında dalgaların vurduğu gerçek göllere ve ıslak topraklara ev sahipliği yapmıştı.

2018’deki o büyük fırtınada gökyüzü karanlığa gömülünce mühendisler son sinyallerimi aldı ve bana şarkılar çalarak veda ettiler. Bugün Meridiani Ovası’nda bir kraterin kıyısında, tekerleklerimin çizdiği kırk beş kilometrelik izlerin sonunda huzurlu bir sessizlik içinde yatıyorum.`
      },
      {
        id: 'viking',
        name: 'Viking 1 & 2 İniş Araçları',
        year: '1976 - 1982',
        location: 'Chryse Planitia & Utopia Planitia',
        status: 'İndikleri noktada sabit',
        lat: 22.48,
        lon: -47.97,
        nasaId: 'PIA00381',
        photoCandidates: ['viking.png'],
        image: 'viking.png',
        fallbackImage: createDeviceSvgDataUri('viking'),
        imageCaption: 'Viking İniş Aracı — Chryse Planitia Yüzeyi (NASA/JPL PIA00381)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('viking'),
        thankYouMessage: "Çok teşekkürler! Viking kameralarım ve enerji sistemim Mars fırtınalarının tozundan arındı; pembe gökyüzünü ilk günkü netliğiyle çekebilirim!",
        audioUrl: "audio2/Viking 1 & 2 İniş Araçları.m4a",
        cardData: {
          rarity: 'EFSANEVİ',
          stats: { dayaniklilik: 95, bilimGucu: 97, cesaret: 96 },
          secretFact: "Toz fırtınalarında bile kapanmayan nükleer pilleri sayesinde 6 yıl boyunca Mars'tan ilk renkli fotoğrafları ve hava raporlarını gönderdi.",
          locks: [
            { title: "Tarihi Başarısı", options: ["Mars'tan İlk Renkli Fotoğraflar", "İlk Uçuş", "Asteroit İnişi"], correctIndex: 0 },
            { title: "İniş Yılı", options: ["1976", "1969", "2004"], correctIndex: 0 }
          ]
        },
        story: `Hoş geldin sevgili kaşif! Biz Mars’ın yaşlı bilgeleri ve ilk kahramanları Viking 1 ile Viking 2’yiz. Tekerleklerimiz yoktu, olduğumuz yerde dururduk ama görünüşümüz tam bir bilim kalesini andırırdı: Altıgen metal gövdemiz, üç sağlam iniş ayağımız, iki yanımızda toz fırtınalarında bile enerji veren sıcak nükleer kutularımız ve önümüzde kum kazıp gövdemizin içindeki minik kimya laboratuvarına taşıyan uzun bir robot kolumuz vardı. Tepemizdeki beyaz çanak antenimizle de uzak Dünya’ya her gün düzenli haberler yollardık.

1976 yılının Temmuz ayında Mars göklerine girdiğimizde kimse Mars toprağının yakından nasıl göründüğünü bilmiyordu. Kalkanlarımız ısıyı göğüsledi, dev paraşütümüz açıldı ve üç motorumuzun gücüyle Kızıl Gezegen’e güvenle indik. Yere değdikten sadece dakikalar sonra kameralarımız çalıştı ve Dünya’daki ekranlara Mars yüzeyinden gelen tarihin ilk net fotoğrafı düştü! Hatta ilk fotoğraf ayarları yapılmadığı için gökyüzü başta masmavi çıkmıştı; mühendisler renkleri düzeltince Mars’ın paslı turuncu kayaları ve pembe-turuncu gökyüzü tüm ihtişamıyla ortaya çıktı.

Tekerleğimiz olmadığı için yerimizden hiç kıpırdayamadık ama robot kolumuzu uzatıp etrafımızdaki kumları kazdık, içlerinde minik canlıların izi var mı diye laboratuvarımızda deneyler yaptık. Tam altı yıl boyunca incecik direğimizin tepesindeki sensörlerle her gün Mars’taki rüzgârı, basıncı ve sıcaklığı ölçerek Dünya’ya düzenli Mars hava durumu raporları sunduk; kış geldiğinde kayaların üzerine nasıl kırağı yağdığını bile ilk biz gördük.

Sayemizde Mars havasının neredeyse tamamen karbondioksitten oluştuğunu, güneş doğarken ve batarken yaşanan dondurucu sıcaklık farklarını ve mevsimlerin Kızıl Gezegen’de nasıl işlediğini doğrudan yüzeyden öğrenmiş olduk. On yıllar sonra gelecek olan tüm gezginlere ve iniş araçlarına güvenlik rehberi olan harika bilgiler topladık.

1982 yılında iletişimimiz kesildiğinden beri ikimiz de neredeyse yarım asırdır ilk indiğimiz noktalarda kıpırdamadan duruyoruz. Chryse ve Utopia düzlüklerinin kızıl rüzgârları altında, uzay tarihinin ilk Mars evleri olarak sessiz nöbetimizi sürdürüyoruz.`
      },
      {
        id: 'phoenix-insight',
        name: 'Phoenix & InSight İniş Araçları',
        year: '2008 & 2018 - 2022',
        location: 'Kuzey Kutbu (Vastitas Borealis) & Elysium Planitia',
        status: 'Güç kaybı nedeniyle devre dışı',
        lat: 4.5,
        lon: 135.62,
        nasaId: 'PIA22316',
        image: createDeviceSvgDataUri('phoenix-insight'),
        imageCaption: 'InSight & Phoenix İniş Araçları ve SEIS Sismometresi (NASA/JPL PIA22316)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('phoenix-insight'),
        thankYouMessage: "Harika! Geniş yuvarlak güneş panellerimizdeki Mars tozu gitti; kuzey kutbu buzlarını ve gezegenin derinliklerindeki depremleri yeniden dinliyoruz!",
        audioUrl: "audio2/Phoenix & InSight İniş Araçları.m4a",
        cardData: {
          rarity: 'DESTANSI',
          stats: { dayaniklilik: 89, bilimGucu: 96, cesaret: 92 },
          secretFact: "InSight'ın sismometresi o kadar hassastı ki bir atom çapından bile küçük yer titreşimlerini ve 1.300'den fazla Mars depremini duyabiliyordu.",
          locks: [
            { title: "Phoenix'in Keşfi", options: ["Yüzey Altı Su Buzu", "Altın Madeni", "Lav Nehri"], correctIndex: 0 },
            { title: "InSight'ın Görevi", options: ["Mars Depremlerini Dinlemek", "Uyduları Fotoğraflamak", "Hava Tahmini"], correctIndex: 0 }
          ]
        },
        story: `Merhaba meraklı gezgin! Biz birbirine çok benzeyen yelpaze kanatlı iki kardeşiz: Ablam Phoenix ve ben InSight. İkimizi de yanlarımızda şemsiye gibi açılan kocaman yuvarlak mavi güneş kanatlarımızdan hemen tanıyabilirsin! Tekerleklerimiz yerine uzun ve çevik robot kollarımız vardı. Ablam Phoenix kolunun ucunda donmuş toprakları kazan bir kepçe taşırken, ben InSight kolumun ucunda bakır bir kubbenin içine gizlenmiş süper hassas bir stetoskop ve toprağın derinliğini ölçmeye çalışan köstebek gibi bir sonda taşıyordum.

2008 yılında ablam Phoenix, Mars’ın dondurucu Kuzey Kutbu’na doğru heyecanlı bir iniş yaptı. Tam on yıl sonra, 2018’de ise sıra bana geldi ve Mars’ın ekvatora yakın sakin Elysium Ovası’na konup güneş kanatlarımı açtım. Kolumu uzatıp stetoskopumu toprağın üzerine bıraktığım an, tarih boyunca ilk kez başka bir gezegenin içini dinlemeye hazır bir kulak yerleştirmiş oldum.

Ablam Phoenix robot kepçesiyle buzul ovasını sadece beş santimetre kazdığında toprağın altında parıldayan bembeyaz bir katman buldu: Bu gerçek donmuş su buzuydu! Üstelik havadan düşen minik kar taneciklerini bile kamerasıyla yakaladı. Ben InSight ise dört yıl boyunca yerin metrelerce altını dinleyip tam bin üç yüzü aşkın Mars depremini kaydettim! Kulaklarım o kadar hassastı ki gövdemden esen Mars rüzgârlarının uğultusunu bile yakalayıp Dünya’daki çocukların dinlemesi için ses kaydına dönüştürdüm.

Birlikte çalıştığımız o yıllar insanlığa Mars’ın görünmeyen yüzünü gösterdi. Phoenix yüzeyin hemen altında astronotların gelecekte kullanabileceği gerçek su buzlarının saklandığını kanıtladı; ben ise dinlediğim depremler sayesinde Mars’ın kabuk kalınlığını, katmanlarını ve kalbindeki sıvı çekirdeğin büyüklüğünü ilk kez haritaladım.

Kış geldiğinde Phoenix’in üzeri beyaz karbondioksit buzlarıyla örtüldü ve derin bir kutup uykusuna yattı. Benim güneş kanatlarım da 2022’nin sonunda kalın kızıl toz tabakasıyla kaplanınca gücüm tükendi; Dünya’ya son fotoğrafımı ve veda mesajımı gönderip sessizce gözlerimi yumdum. Bugün ikimiz de buzların ve kızıl tozların arasında Mars’ın sırlarını çözmüş iki kardeş anıt olarak dinleniyoruz.`
      },
      {
        id: 'ingenuity',
        name: 'Ingenuity Mars Helikopteri',
        year: '2021 - 2024',
        location: 'Jezero Krateri (Valinor Hills)',
        status: 'Rotor hasarı sonrası sabit anıt',
        lat: 18.44,
        lon: 77.45,
        nasaId: 'PIA24449',
        image: createDeviceSvgDataUri('ingenuity'),
        imageCaption: 'Ingenuity Mars Helikopteri — Jezero Krateri (NASA/JPL PIA24449)',
        repairable: true,
        pristineImage: createPristineDeviceSvgDataUri('ingenuity'),
        thankYouMessage: "Vızır vızır uçuşa hazırım! Üstteki güneş panelimi parlattın ve narin ikiz pervanelerimi tozdan kurtardın; Mars gökyüzüne ilk günümdeki gibi kanat açıyorum!",
        audioUrl: "audio2/Ingenuity Mars Helikopteri.m4a",
        cardData: {
          rarity: 'EFSANEVİ',
          stats: { dayaniklilik: 93, bilimGucu: 95, cesaret: 99 },
          secretFact: "Gövdesinde 1903'te uçan ilk uçağın kanadından küçük bir kumaş parçası taşır ve incecik Mars havasında dakikada 2.500 devirle uçar.",
          locks: [
            { title: "Ağırlığı", options: ["1.8 kg - Bir Tavuk Kadar", "150 kg - Motosiklet Kadar", "1 Ton"], correctIndex: 0 },
            { title: "Toplam Uçuşu", options: ["72 Uçuş", "5 Uçuş", "12 Uçuş"], correctIndex: 0 }
          ]
        },
        story: `Vızzz! Selam küçük pilot! Ben Ginny, yani Ingenuity; başka bir gezegenin gökyüzünde kanat çırpan tarihin ilk helikopteriyim! Gövdem küçük bir kâğıt peçete kutusu kadar minik, ağırlığım da bir tavuktan bile hafif, sadece 1.8 kilogramdır. Dört ince karbon bacağımın üzerinde altın folyolu gövdem, tepemde ters yönlere çılgınca dönen iki uzun pervanem ve en üstte küçük bir güneş panelim vardır. Hatta gövdemin içinde çok özel ve gizli bir hazine taşırım: 1903 yılında Dünya’da ilk uçağı uçuran Wright Kardeşler’in uçağının kanadından koparılmış küçücük bir kumaş parçası!

Mars’a büyük abim Perseverance gezgininin karnının altında saklanarak ulaştım. İlk başlarda herkes bana biraz şüpheyle bakıyordu; çünkü Mars’taki hava Dünya’mızdakinin yüz katı kadar incedir, yani normal bir helikopter orada pervanesini çevirse bile yerinden milim kıpırdayamaz. Bu yüzden mühendisler pervanelerimi hafif karbon fiberden yapıp dakikada iki bin beş yüz kez dönecek kadar hızlandırdı! 19 Nisan 2021 sabahı abim beni toprağa bırakıp uzaklaştı, ben de nefesimi tutup pervanelerimi döndürdüm ve yerden üç metre havalanarak başka bir gezegende uçan ilk makine oldum!

Planımız sadece beş kısa deneme uçuşu yapmaktı. Ama o kadar çok sevildim ki tam üç yıl boyunca durmadan yetmiş iki kez havalandım! Altımdaki akıllı kameramla yerdeki kayaları izliyor, abim Perseverance’ın gideceği gizemli nehir yataklarını önden gözcülük yaparak keşfediyor ve geceleri eksi doksan dereceyi bulan dondurucu soğuklarda iç ısıtıcılarımla hayatta kalıyordum. Yetmiş ikinci uçuşumda kum tepelerinin üzerine inerken ne yazık ki pervane ucum kuma çarpıp kırıldı ve gökyüzündeki serüvenim sona erdi.

Kısa boyumla başardığım o yetmiş iki uçuş, uzay keşfinde yepyeni bir çağ başlattı! İnsanlar artık gelecekte diğer gezegenlere ve uydulara sadece tekerlekli robotlar değil, uçurumların üzerinden süzülen akıllı uzay dronları ve helikopterleri de gönderebileceklerini öğrendi.

Artık uçamasam da bilgisayarım hâlâ çalışıyor! Jezero Krateri’ndeki kum tepesinin ortasında, bir gün gelecekte Mars’a gidecek insanların müzeye dönüştüreceği ilk gökyüzü kaşifi olarak sonsuza dek etrafı izliyorum.`
      }
    ]
  }
};

const TIMELINE_EVENTS = [
  {
    year: 1966,
    planet: 'moon',
    eqId: 'surveyor',
    gazeteTipi: 'retro-60s',
    manşet: 'AY TOPRAĞI SAĞLAM ÇIKTI!',
    uzayYarisi:
      "NASA'nın Surveyor 1 sondası Ay'a yumuşak iniş yaparak astronotların yüzeye batmadan yürüyebileceğini kanıtladı.",
    dunyadaOYil:
      "1966'da ilk ticari haberleşme uyduları yörüngeye yerleşiyor ve dünya kıtalararası canlı televizyon yayınlarıyla tanışıyordu."
  },
  {
    year: 1969,
    planet: 'moon',
    eqId: 'apollo-lm',
    gazeteTipi: 'retro-60s',
    manşet: "İNSANLIK AY'DA! EAGLE SÜKÛNET DENİZİ'NDE",
    uzayYarisi:
      "Apollo 11 iniş modülü Eagle yüzeye kondu. Astronotlar ayrılırken iniş kademesi ve ALSEP istasyonu Ay'da kaldı.",
    dunyadaOYil:
      'Dünya genelinde 650 milyon insan siyah-beyaz televizyonlarının başında nefesini tutup bu tarihi adımı canlı izledi.'
  },
  {
    year: 1971,
    planet: 'moon',
    eqId: 'lrv',
    gazeteTipi: 'retro-70s',
    manşet: 'AY YOLLARINDA İLK ELEKTRİKLİ ARABA!',
    uzayYarisi:
      'Apollo 15 astronotları katlanabilir elektrikli Ay Arabası (LRV) ile krater kenarlarında ilk kez sürüş yaptı.',
    dunyadaOYil:
      'Dünyada ilk mikroişlemci icat ediliyor ve ilk e-posta gönderiliyordu; bilgisayar çağı henüz emekleme aşamasındaydı.'
  },
  {
    year: 1972,
    planet: 'moon',
    eqId: 'alsep',
    gazeteTipi: 'retro-70s',
    manşet: "AY'IN KALP ATIŞLARI DİNLENİYOR: ALSEP GÖREVDE!",
    uzayYarisi:
      "Apollo astronotlarının Ay'a kurduğu ALSEP bilimsel deney paketleri, Ay depremlerini ölçüp lazer aynalarıyla Dünya-Ay mesafesini hesaplamaya başladı.",
    dunyadaOYil:
      "1972'de ilk bilimsel cep hesap makineleri ve dijital oyunlar hayatımıza girerken, bilim insanları Ay'ın iç katmanlarını keşfediyordu."
  },
  {
    year: 1976,
    planet: 'mars',
    eqId: 'viking',
    gazeteTipi: 'retro-70s',
    manşet: 'KIZIL GEZEGENDEN İLK RENKLİ FOTOĞRAFLAR!',
    uzayYarisi:
      "Viking 1 ve 2 araçları Mars'a başarıyla indi; pas rengi kayalar ve pembe gökyüzü ilk kez görüntülendi.",
    dunyadaOYil:
      'Dünyada ilk kişisel ev bilgisayarları garajlarda üretilmeye başlanırken insanlık başka bir gezegenin toprağını analiz ediyordu.'
  },
  {
    year: 1997,
    planet: 'mars',
    eqId: 'sojourner',
    gazeteTipi: 'digital-90s',
    manşet: "MARS'TA İLK TEKERLEK İZİ: MİNİK KAŞİF SOJOURNER",
    uzayYarisi:
      'Mikrodalga fırın boyutundaki Sojourner, Pathfinder rampasından inerek Mars kayalarını inceleyen ilk gezgin oldu.',
    dunyadaOYil:
      "İnternet evlere yeni giriyor ve dünya halkı Mars'tan gelen fotoğrafları ilk kez web tarayıcılarından takip ediyordu."
  },
  {
    year: 2004,
    planet: 'mars',
    eqId: 'spirit-opportunity',
    gazeteTipi: 'digital-2000s',
    manşet: "İKİZ GEZGİNLER MARS'TA SU İZLERİ BULDU!",
    uzayYarisi:
      "Spirit ve Opportunity 90 günlük görev için indikleri Kızıl Gezegen'de yıllar sürecek destansı yolculuklarına başladı.",
    dunyadaOYil:
      'Sosyal ağların ve akıllı telefon devriminin temelleri atılırken ikiz robotlar Mars çöllerinde tek başlarına kilometreler aşıyordu.'
  },
  {
    year: 2008,
    planet: 'mars',
    eqId: 'phoenix-insight',
    gazeteTipi: 'modern-holo',
    manşet: 'MARS TOPRAĞININ ALTINDA GERÇEK SU BUZU!',
    uzayYarisi:
      'Phoenix kuzey kutbunda toprağı kazıp su buzuna ulaştı; yıllar sonra InSight ise Mars depremlerini dinledi.',
    dunyadaOYil:
      "Küresel iklim ve su kaynakları araştırmaları hız kazanırken Mars'ta su buzunun bulunması yaşam umutlarını yeşertti."
  },
  {
    year: 2021,
    planet: 'mars',
    eqId: 'ingenuity',
    gazeteTipi: 'modern-holo',
    manşet: 'BAŞKA BİR GEZEGENDEN İLK UÇUŞ GERÇEKLEŞTİ!',
    uzayYarisi:
      'Ingenuity helikopteri incecik Mars atmosferinde havalanarak havacılık tarihinin Wright Kardeşler anını yaşattı.',
    dunyadaOYil:
      'Dünya küresel salgının ardından bilimin gücüne odaklanırken, insanlık ilk kez başka bir gezegenin gökyüzüne kanat açtı.'
  }
];
