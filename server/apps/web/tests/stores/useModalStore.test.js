import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useModalStore } from '../../src/stores/useModalStore';

describe('useModalStore', () => {
  it('should initialize with all modals closed', () => {
    const { result } = renderHook(() => useModalStore());

    expect(result.current.isBookingModalOpen).toBe(false);
    expect(result.current.isContactModalOpen).toBe(false);
    expect(result.current.bookingType).toBeNull();
    expect(result.current.preselectedId).toBeNull();
    expect(result.current.contactSubject).toBeNull();
  });

  it('should open booking modal without preselected id', () => {
    const { result } = renderHook(() => useModalStore());

    act(() => {
      result.current.openBookingModal('course');
    });

    expect(result.current.isBookingModalOpen).toBe(true);
    expect(result.current.bookingType).toBe('course');
    expect(result.current.preselectedId).toBeNull();
  });

  it('should open booking modal with preselected id', () => {
    const { result } = renderHook(() => useModalStore());

    act(() => {
      result.current.openBookingModal('course', 'open-water');
    });

    expect(result.current.isBookingModalOpen).toBe(true);
    expect(result.current.bookingType).toBe('course');
    expect(result.current.preselectedId).toBe('open-water');
  });

  it('should close booking modal and clear data', () => {
    const { result } = renderHook(() => useModalStore());

    act(() => {
      result.current.openBookingModal('dive', 'site-123');
    });

    expect(result.current.isBookingModalOpen).toBe(true);
    expect(result.current.bookingType).toBe('dive');
    expect(result.current.preselectedId).toBe('site-123');

    act(() => {
      result.current.closeBookingModal();
    });

    expect(result.current.isBookingModalOpen).toBe(false);
    expect(result.current.bookingType).toBeNull();
    expect(result.current.preselectedId).toBeNull();
  });

  it('should open contact modal without subject', () => {
    const { result } = renderHook(() => useModalStore());

    act(() => {
      result.current.openContactModal();
    });

    expect(result.current.isContactModalOpen).toBe(true);
    expect(result.current.contactSubject).toBeNull();
  });

  it('should open contact modal with subject', () => {
    const { result } = renderHook(() => useModalStore());

    act(() => {
      result.current.openContactModal('Course Inquiry');
    });

    expect(result.current.isContactModalOpen).toBe(true);
    expect(result.current.contactSubject).toBe('Course Inquiry');
  });

  it('should close contact modal and clear subject', () => {
    const { result } = renderHook(() => useModalStore());

    act(() => {
      result.current.openContactModal('General Question');
    });

    expect(result.current.isContactModalOpen).toBe(true);
    expect(result.current.contactSubject).toBe('General Question');

    act(() => {
      result.current.closeContactModal();
    });

    expect(result.current.isContactModalOpen).toBe(false);
    expect(result.current.contactSubject).toBeNull();
  });

  it('should handle multiple modals independently', () => {
    const { result } = renderHook(() => useModalStore());

    act(() => {
      result.current.openBookingModal('course', 'rescue-diver');
      result.current.openContactModal('Question');
    });

    expect(result.current.isBookingModalOpen).toBe(true);
    expect(result.current.isContactModalOpen).toBe(true);
    expect(result.current.bookingType).toBe('course');
    expect(result.current.preselectedId).toBe('rescue-diver');
    expect(result.current.contactSubject).toBe('Question');

    act(() => {
      result.current.closeBookingModal();
    });

    expect(result.current.isBookingModalOpen).toBe(false);
    expect(result.current.isContactModalOpen).toBe(true);
  });

  it('should close all modals at once', () => {
    const { result } = renderHook(() => useModalStore());

    act(() => {
      result.current.openBookingModal('dive', 'site-1');
      result.current.openContactModal('Info');
    });

    expect(result.current.isBookingModalOpen).toBe(true);
    expect(result.current.isContactModalOpen).toBe(true);

    act(() => {
      result.current.closeAllModals();
    });

    expect(result.current.isBookingModalOpen).toBe(false);
    expect(result.current.isContactModalOpen).toBe(false);
    expect(result.current.bookingType).toBeNull();
    expect(result.current.preselectedId).toBeNull();
    expect(result.current.contactSubject).toBeNull();
  });
});
