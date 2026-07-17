import type { Project, Certification, Skill, Education } from '@/types';

export const HERO_PHRASES = [
  'B.Tech CSE (AI & ML) @ Sharda University',
  'ML Engineer  |  Chess Enthusiast  |  Problem Solver',
  'Python • TensorFlow • C++  |  500+ DSA Problems',
  'Building Intelligent Systems, One Model at a Time',
];

export const NAV_LINKS = ['HOME', 'ABOUT', 'PROJECTS', 'CHESS', 'CERTS', 'CONTACT'];

export const ABOUT_SUMMARY =
  'B.Tech CSE (AI & ML) undergraduate with a strong foundation in Machine Learning, data analysis, and core computer science concepts. Actively solving DSA problems daily to strengthen problem-solving and algorithmic thinking. Hands-on experience building real-world ML-driven projects through hackathons and academic initiatives.';

export const SKILLS: Skill[] = [
  {
    category: 'Languages',
    items: ['Python', 'C++', 'C', 'Java', 'SQL', 'HTML'],
    color: '#00d4ff',
  },
  {
    category: 'ML / AI',
    items: ['Machine Learning', 'TensorFlow', 'Scikit-learn', 'NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'YOLO'],
    color: '#9b59ff',
  },
  {
    category: 'Core CS',
    items: ['DSA', 'OOP', 'DBMS', 'OS', 'CN', 'DAA'],
    color: '#00ffcc',
  },
  {
    category: 'Tools',
    items: ['Git', 'GitHub', 'Jupyter Notebook', 'VS Code', 'Power BI'],
    color: '#ff3cac',
  },
];

export const EDUCATION: Education[] = [
  {
    institution: 'Sharda University',
    degree: 'B.Tech CSE — Artificial Intelligence & Machine Learning',
    score: 'Pursuing',
    period: '2023 – Present',
    color: '#00d4ff',
  },
  {
    institution: 'Kendriya Vidhyalaya',
    degree: 'Senior Secondary (XII)',
    score: '75.5%',
    period: 'Apr 2022 – Mar 2023',
    color: '#9b59ff',
  },
  {
    institution: 'Kendriya Vidhyalaya',
    degree: 'Secondary (X)',
    score: '80.5%',
    period: 'Apr 2020 – Mar 2021',
    color: '#00ffcc',
  },
];

export const PROJECTS: Project[] = [
  {
    name: 'MITM Attack Detection & Prevention',
    desc: 'Designed a network security system to detect and mitigate Man-in-the-Middle attacks using IDS/IPS. Monitors network traffic for packet spoofing, ARP poisoning, and session hijacking with real-time automated response.',
    icon: '🛡️',
    color1: '#00d4ff',
    color2: '#9b59ff',
    tech: ['Python', 'IDS/IPS', 'Network Security', 'Anomaly Detection', 'Rule-based Systems'],
    gh: 'https://github.com/harshitmalik',
    demo: '#',
    period: 'Jan 2026 – Present',
  },
  {
    name: 'Sign Language → Sentence Converter',
    desc: 'Computer vision system that converts sign language gestures into meaningful text sentences using deep learning models. Recognizes hand gestures and sequential movements from live video for improved accessibility.',
    icon: '🤟',
    color1: '#9b59ff',
    color2: '#ff3cac',
    tech: ['Python', 'TensorFlow', 'OpenCV', 'Deep Learning', 'Computer Vision'],
    gh: 'https://github.com/harshitmalik',
    demo: '#',
    period: 'Jan 2025 – May 2025',
  },
  {
    name: 'Football Player Detection — YOLO',
    desc: 'Real-time football player detection system using YOLO object detection. Trained and tested the model to accurately detect and localize players in match footage for sports analytics and player tracking.',
    icon: '⚽',
    color1: '#00ffcc',
    color2: '#00d4ff',
    tech: ['Python', 'YOLO', 'PyTorch', 'Computer Vision', 'Sports Analytics'],
    gh: 'https://github.com/harshitmalik',
    demo: '#',
    period: 'Jun 2025 – Jul 2025',
  },
  {
    name: 'ChessMind AI Platform',
    desc: 'An adaptive AI-powered chess learning platform with Stockfish integration, interactive puzzle mode, ranked/casual game modes, post-game analysis with move annotations, and real-time coaching feedback.',
    icon: '♟️',
    color1: '#9b59ff',
    color2: '#00ffcc',
    tech: ['Next.js', 'TypeScript', 'Stockfish', 'Python', 'chess.js'],
    gh: 'https://github.com/harshitmalik',
    demo: '#',
    period: '2025',
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    title: 'Python Foundations',
    issuer: 'Sharda University',
    date: 'Sep 2024',
    color: '#00d4ff',
  },
  {
    title: 'Python Fundamentals',
    issuer: 'Oracle Academy',
    date: '2024',
    color: '#9b59ff',
  },
  {
    title: 'Machine Learning for Beginners',
    issuer: 'Skill Nation',
    date: 'Jul 2024',
    color: '#00ffcc',
  },
  {
    title: 'ML / Data Analytics Certification',
    issuer: 'Great Learning',
    date: 'Jul 2024',
    color: '#ff3cac',
  },
];

export const CHESS_PUZZLES = [
  {
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R',
    solution: ['f3e5', 'c6e5', 'c4f7'],
    hint: 'White to move — find the winning fork!',
    theme: 'Fork • Knight Tactic',
    rating: 1650,
  },
  {
    fen: '6k1/pp4pp/2p5/2bp4/5pP1/P1Pb4/1P2QPPP/R3R1K1',
    solution: ['d3f1', 'e2f1', 'd5g2'],
    hint: 'Black to move — find the checkmate!',
    theme: 'Checkmate • Sacrifice',
    rating: 1847,
  },
];

export const NOW_STATUS = {
  building: { label: 'Building', value: 'ChessMind AI Platform', emoji: '🔨', color: '#00d4ff' },
  reading:  { label: 'Reading',  value: 'Deep Learning — Goodfellow', emoji: '📖', color: '#9b59ff' },
  obsession:{ label: 'Obsession',value: 'Transformer Architectures', emoji: '🧠', color: '#00ffcc' },
  chess:    { label: 'Chess ELO', value: '1450 Blitz', emoji: '♟', color: '#ff3cac' },
  mood:     { label: 'Mood',      value: 'In the zone 🎯', emoji: '🎵', color: '#f5c542' },
};

export const SPOTIFY_MOCK = {
  isPlaying: true,
  title: 'Blinding Lights',
  artist: 'The Weeknd',
  album: 'After Hours',
  albumArt: 'https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874',
  progress: 62,
  duration: 200,
  spotifyUrl: 'https://open.spotify.com/track/0VjIjW4GlUZAMYd2vXMi3b',
};
