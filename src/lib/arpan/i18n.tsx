import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'hi' | 'kn' | 'ta' | 'te' | 'mr' | 'bn';

const LanguageContext = createContext<{ 
  lang: Language; 
  setLang: (l: Language) => void; 
  t: (key: string) => string 
} | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // Inject Google Translate Script
    (window as any).googleTranslateElementInit = () => {
      new (window as any).google.translate.TranslateElement(
        { pageLanguage: 'en', includedLanguages: 'en,hi,kn,ta,te,mr,bn', autoDisplay: false },
        'google_translate_element'
      );
    };
    
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);

    // Brutally hide the Google Translate top bar and tooltips via CSS
    const style = document.createElement('style');
    style.innerHTML = `
      iframe.goog-te-banner-frame, .VIpgJd-ZVi9od-ORHb-OEVmcd { display: none !important; opacity: 0 !important; }
      body, html { top: 0px !important; position: static !important; }
      #goog-gt-tt, .goog-te-balloon-frame { display: none !important; }
      .goog-text-highlight { background-color: transparent !important; box-shadow: none !important; }
    `;
    document.head.appendChild(style);

    // Actively destroy the banner if it gets injected
    const observer = new MutationObserver(() => {
      const banner = document.querySelector('.goog-te-banner-frame') as HTMLElement;
      if (banner && banner.style.display !== 'none') {
        banner.style.setProperty('display', 'none', 'important');
      }
      
      const viBanner = document.querySelector('.VIpgJd-ZVi9od-ORHb-OEVmcd') as HTMLElement;
      if (viBanner && viBanner.style.display !== 'none') {
        viBanner.style.setProperty('display', 'none', 'important');
      }
      
      if (document.body.style.top !== '0px' && document.body.style.top !== '') {
        document.body.style.setProperty('top', '0px', 'important');
      }
    });
    
    observer.observe(document.body, { childList: true, attributes: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  const handleSetLang = (targetLang: Language) => {
    setLang(targetLang);
    
    // Find the hidden Google Translate dropdown and trigger it
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      select.value = targetLang;
      select.dispatchEvent(new Event('change'));
    }
    
    // Fallback: If 'en' is selected, sometimes clearing the cookie is required
    if (targetLang === 'en') {
      document.cookie = `googtrans=/en/en; path=/; domain=${location.hostname}`;
      document.cookie = `googtrans=/en/en; path=/;`;
      // Optional: window.location.reload(); if Google Translate refuses to revert
    }
  };

  const t = (key: string) => {
    const mockDict: Record<string, string> = {
      'nav.home': 'Home',
      'nav.explore': 'Explore',
      'nav.offer': 'Offer',
      'nav.ask': 'Ask',
      'nav.seva': 'Seva',
      'nav.institutions': 'Institutions',
      'nav.journey': 'Journey',
      'nav.chats': 'Chats',
      'nav.moderation': 'Moderation',
      'hero.title': 'Technology as Seva',
      'hero.subtitle': 'Offer yourself. Grow by serving. Give, receive and serve with dignity.',
      'action.start': 'Begin your journey',
      'sidebar.give': 'A place to give.',
      'sidebar.receive': 'A place to receive.',
      'sidebar.belong': 'A place to belong.',
      'sidebar.spirit': 'The spirit of ARPAN',
      'sidebar.mod': 'Community moderation',
    };
    return mockDict[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang: handleSetLang, t }}>
      <div id="google_translate_element" style={{ display: 'none' }}></div>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
