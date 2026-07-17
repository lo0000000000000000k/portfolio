export interface Project {
  name: string;
  desc: string;
  icon: string;
  color1: string;
  color2: string;
  tech: string[];
  gh: string;
  demo: string;
  period: string;
}

export interface Certification {
  title: string;
  issuer: string;
  date: string;
  color: string;
}

export interface Skill {
  category: string;
  items: string[];
  color: string;
}

export interface Education {
  institution: string;
  degree: string;
  score: string;
  period: string;
  color: string;
}

export interface NavLink {
  label: string;
  href: string;
}
