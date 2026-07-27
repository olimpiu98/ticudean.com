import React from 'react';
import { 
  Sun, Moon, Menu, X, ArrowRight, ExternalLink, Mail, Github, Linkedin, MonitorPlay, 
  Server, Terminal, HardDrive, Shield, Code, Cpu, Database, Cloud, Layout, Box, GraduationCap, Users, Search, Lock
} from 'lucide-react';
import { 
  SiReact, SiTypescript, SiJavascript, SiHtml5, SiCss, SiAngular, 
  SiNodedotjs, SiExpress, SiPython, SiGit, SiGithub, 
  SiPostgresql, SiDocker, SiTailwindcss, SiFirebase,
  SiCloudflare, SiLinux, SiFilezilla, SiMysql, SiNginx, SiNetlify, SiPostman, SiUbuntu,
  SiSass, SiBootstrap, SiRust, SiApache, SiSolana
} from 'react-icons/si';
import { FaAws, FaJava, FaMicrosoft, FaXTwitter } from 'react-icons/fa6';
import { useTheme } from '../contexts/ThemeContext';

const SunIcon = ({ size = 18, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const MoonIcon = ({ size = 18, className = "", ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

// UI Icons Mapping
export const Icon = ({ name, className = "", size = 20, ...props }) => {
  const icons = {
    Sun: SunIcon, Moon: MoonIcon, Menu, X, ArrowRight, ExternalLink, Mail, Github, Linkedin, MonitorPlay,
    GraduationCap, Code, Server, Cloud, Cpu, Database, Shield, Terminal, Users, Search, Lock,
    Twitter: FaXTwitter, XSocial: FaXTwitter
  };

  const Component = icons[name];
  return Component ? <Component size={size} className={className} {...props} /> : null;
};

// Tech Icons Component & Brand Color Mapping
export const TECH_BRAND_COLORS = {
  'HTML5': '#E34F26',
  'CSS3': '#1572B6',
  'JavaScript': '#F7DF1E',
  'TypeScript': '#3178C6',
  'React': '#61DAFB',
  'Angular': '#DD0031',
  'Sass': '#CC6699',
  'Bootstrap': '#7952B3',
  'Materialize': '#FF6F00',
  'XML': '#00599C',
  'Node.js': '#5FA04E',
  'Express.js': '#68A063',
  'Python': '#3776AB',
  'Java': '#5382A1',
  'Rust': '#DEA584',
  'Solana': '#14F195',
  'REST API': '#009688',
  'Git': '#F05032',
  'GitHub': '#181717',
  'PostgreSQL': '#4169E1',
  'MySQL': '#4479A1',
  'Oracle APEX': '#F80000',
  'Docker': '#2496ED',
  'Tailwind CSS': '#06B6D4',
  'Firebase': '#FFCA28',
  'AWS': '#FF9900',
  'Azure': '#0089D6',
  'Cloudflare': '#F38020',
  'Linux': '#FCC624',
  'Ubuntu': '#E95420',
  'WSL': '#4EAA25',
  'VirtualBox': '#183A61',
  'OVH': '#123F6D',
  'FileZilla': '#BF0000',
  'Nginx': '#009639',
  'Apache': '#D22128',
  'Netlify': '#00C7B7',
  'Postman': '#FF6C37',
  'VS Code': '#007ACC',
  'Navicat': '#3B82F6',
  'WinSCP': '#10B981'
};

export const TechIcon = ({ name, className = "", size = 24, useBrandColor = true, ...props }) => {
  const { theme } = useTheme();
  
  const techMap = {
    'HTML5': SiHtml5,
    'CSS3': SiCss,
    'JavaScript': SiJavascript,
    'TypeScript': SiTypescript,
    'React': SiReact,
    'Angular': SiAngular,
    'Sass': SiSass,
    'Bootstrap': SiBootstrap,
    'Materialize': Layout,
    'XML': Code,
    'Node.js': SiNodedotjs,
    'Express.js': SiExpress,
    'Python': SiPython,
    'Java': FaJava,
    'Rust': SiRust,
    'Solana': SiSolana,
    'REST API': Server,
    'Git': SiGit,
    'GitHub': SiGithub,
    'PostgreSQL': SiPostgresql,
    'MySQL': SiMysql,
    'Oracle APEX': Database,
    'Docker': SiDocker,
    'Tailwind CSS': SiTailwindcss,
    'Firebase': SiFirebase,
    'AWS': FaAws,
    'Azure': FaMicrosoft,
    'Cloudflare': SiCloudflare,
    'Linux': SiLinux,
    'Ubuntu': SiUbuntu,
    'WSL': Terminal,
    'VirtualBox': Box,
    'OVH': Cloud,
    'FileZilla': SiFilezilla,
    'Nginx': SiNginx,
    'Apache': SiApache,
    'Netlify': SiNetlify,
    'Postman': SiPostman,
    'VS Code': Code,
    'Navicat': Server,
    'WinSCP': HardDrive
  };

  const Component = techMap[name] || Cpu;
  let brandColor = useBrandColor ? TECH_BRAND_COLORS[name] : null;

  // Smart Contrast Adjustments for Theme Compatibility
  if (brandColor) {
    if ((brandColor === '#181717' || brandColor === '#000000') && theme === 'dark') {
      brandColor = '#FFFFFF';
    } 
    else if ((name === 'JavaScript' || name === 'Linux') && theme === 'light') {
      brandColor = '#D97706';
    }
  }

  return (
    <Component 
      size={size} 
      className={className} 
      style={brandColor ? { color: brandColor } : undefined} 
      {...props} 
    />
  );
};
