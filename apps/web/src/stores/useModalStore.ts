/**
 * Modal state management using Zustand
 */

import { create } from 'zustand';

interface ModalState {
  isBookingModalOpen: boolean;
  isContactModalOpen: boolean;
  bookingType: 'course' | 'dive' | null;
  preselectedId: string | null;
  contactSubject: string | null;

  openBookingModal: (type: 'course' | 'dive', id?: string) => void;
  closeBookingModal: () => void;

  openContactModal: (subject?: string) => void;
  closeContactModal: () => void;

  closeAllModals: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isBookingModalOpen: false,
  isContactModalOpen: false,
  bookingType: null,
  preselectedId: null,
  contactSubject: null,

  openBookingModal: (type, id) =>
    set({
      isBookingModalOpen: true,
      bookingType: type,
      preselectedId: id ?? null,
    }),

  closeBookingModal: () =>
    set({
      isBookingModalOpen: false,
      bookingType: null,
      preselectedId: null,
    }),

  openContactModal: (subject) =>
    set({
      isContactModalOpen: true,
      contactSubject: subject ?? null,
    }),

  closeContactModal: () =>
    set({
      isContactModalOpen: false,
      contactSubject: null,
    }),

  closeAllModals: () =>
    set({
      isBookingModalOpen: false,
      isContactModalOpen: false,
      bookingType: null,
      preselectedId: null,
      contactSubject: null,
    }),
}));
