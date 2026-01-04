// Utility functions for detecting device capabilities

export function isTouchScreen() {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

export function hasKeyboard() {
  // Check if keyboard is available
  // This is a heuristic - we can't perfectly detect keyboard presence
  // Desktop browsers always have keyboards available
  // For touch devices, we assume they don't have keyboards unless
  // they're hybrid devices (detected by having both touch and fine pointer)
  const hasTouch = isTouchScreen()
  const hasFinePointer = window.matchMedia('(pointer: fine)').matches
  
  // Desktop (no touch, fine pointer) = has keyboard
  if (!hasTouch && hasFinePointer) {
    return true
  }
  
  // Hybrid device (both touch and fine pointer) = likely has keyboard
  if (hasTouch && hasFinePointer) {
    return true
  }
  
  // Touch-only device = no keyboard
  return false
}

export function getAvailableInputTypes(profiles) {
  const hasTouch = isTouchScreen()
  const hasKbd = hasKeyboard()
  
  const keyboardProfiles = profiles.filter(p => p.type === 'keyboard')
  const joystickProfiles = profiles.filter(p => p.type === 'joystick')
  
  return {
    keyboard: hasKbd ? keyboardProfiles : [],
    joystick: hasTouch ? joystickProfiles : [],
    hasAny: (hasKbd && keyboardProfiles.length > 0) || (hasTouch && joystickProfiles.length > 0)
  }
}

