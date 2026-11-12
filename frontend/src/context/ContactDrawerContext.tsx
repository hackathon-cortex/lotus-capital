import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';

interface ContactDrawerContextType {
  isOpen: boolean;
  preselectedService?: string;
  openContactDrawer: (service?: string, triggerElement?: HTMLElement | null) => void;
  closeContactDrawer: () => void;
}

const ContactDrawerContext = createContext<ContactDrawerContextType | undefined>(undefined);

export const ContactDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);

  // Sync with URL deep link: ?contact=open
  useEffect(() => {
    const contactParam = searchParams.get('contact');
    const serviceParam = searchParams.get('service');

    if (contactParam === 'open') {
      setIsOpen(true);
      if (serviceParam) {
        setPreselectedService(serviceParam);
      }
    }
  }, [searchParams]);

  // Open drawer function
  const openContactDrawer = useCallback((service?: string, triggerElement?: HTMLElement | null) => {
    // Remember trigger for focus return
    if (triggerElement) {
      lastFocusedElementRef.current = triggerElement;
    } else if (document.activeElement instanceof HTMLElement) {
      lastFocusedElementRef.current = document.activeElement;
    }

    setPreselectedService(service);
    setIsOpen(true);

    // Update URL query without full navigation/page reload
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('contact', 'open');
    if (service) {
      currentUrl.searchParams.set('service', service);
    }
    window.history.replaceState({}, '', currentUrl.toString());
  }, []);

  // Close drawer function
  const closeContactDrawer = useCallback(() => {
    setIsOpen(false);

    // Remove contact from URL query without full navigation
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('contact');
    window.history.replaceState({}, '', currentUrl.toString());

    // Restore focus to the trigger element
    if (lastFocusedElementRef.current && typeof lastFocusedElementRef.current.focus === 'function') {
      setTimeout(() => {
        lastFocusedElementRef.current?.focus();
      }, 50);
    }
  }, []);

  return (
    <ContactDrawerContext.Provider
      value={{
        isOpen,
        preselectedService,
        openContactDrawer,
        closeContactDrawer,
      }}
    >
      {children}
    </ContactDrawerContext.Provider>
  );
};

export const useContactDrawer = (): ContactDrawerContextType => {
  const context = useContext(ContactDrawerContext);
  if (!context) {
    return {
      isOpen: false,
      preselectedService: undefined,
      openContactDrawer: () => {},
      closeContactDrawer: () => {},
    };
  }
  return context;
};
