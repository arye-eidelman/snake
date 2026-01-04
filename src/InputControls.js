import { useMemo, useRef } from 'react'
import ReactNipple from 'react-nipple';
import KeyboardEventHandler from 'react-keyboard-event-handler'

function InputControls({
  onDirectionChange = angle => { },
  onPause = () => { },
  keyboardProfile = { id: 'arrowKeys', keyMap: { left: 'left', up: 'up', right: 'right', down: 'down' }, type: 'keyboard' },
  initialAngle = 'right'
}) {
  const isJoystick = keyboardProfile.type === 'joystick'
  const joystickPosition = keyboardProfile.position || 'right'
  const lastVibrationTime = useRef(0)
  const VIBRATION_THROTTLE_MS = 25 // Throttle vibrations to avoid too many calls

  // Calculate haptic intensity based on proximity to diagonal angles
  const calculateHapticIntensity = (angle) => {
    const diagonalAngles = [45, 135, 225, 315]

    // Find minimum distance to any diagonal angle
    const distances = diagonalAngles.map(diagonal => {
      // Calculate angular distance (handling wrap-around at 0/360)
      let diff = Math.abs(angle - diagonal)
      diff = Math.min(diff, 360 - diff)
      return diff
    })

    const minDistance = Math.min(...distances)

    // Intensity peaks at diagonal angles (0 distance) and decreases linearly
    // Maximum intensity at 0°, zero intensity at 15° away
    const maxDistance = 15
    const intensity = Math.max(0, 1 - (minDistance / maxDistance))

    return intensity
  }

  const triggerHapticFeedback = (intensity) => {
    // Check if vibration API is available
    if (!navigator.vibrate) return

    // Throttle vibrations to avoid too many calls
    const now = Date.now()
    if (now - lastVibrationTime.current < VIBRATION_THROTTLE_MS) return
    lastVibrationTime.current = now

    // Convert intensity (0-1) to vibration duration (0-20ms)
    // Use a non-linear curve for better feel (intensity^2)
    const duration = Math.round(intensity * intensity * 20)

    if (duration > 0) {
      navigator.vibrate(duration)
    }
  }

  const onNippleMove = (e, data) => {
    if (data && data.direction && data.direction.angle) {
      onDirectionChange(data.direction.angle)

      // Add haptic feedback based on angle
      // react-nipple provides angle in data.angle.degree (in degrees, 0-360)
      let angleInDegrees = null
      if (data.angle && typeof data.angle.degree === 'number') {
        angleInDegrees = data.angle.degree
      } else if (typeof data.angle === 'number') {
        angleInDegrees = data.angle
      }

      if (angleInDegrees !== null) {
        const intensity = calculateHapticIntensity(angleInDegrees)
        triggerHapticFeedback(intensity)
      }
    } else {
      console.log("missing data in InputControls", data)
    }
  }

  const handleKeyDown = (key, e) => {
    let plainKey = key.split('+').pop()
    if (Object.keys(keyboardProfile.keyMap).includes(plainKey)) {
      plainKey = keyboardProfile.keyMap[plainKey]
    }
    if (plainKey === 'p') {
      onPause()
    } else if (['left', 'up', 'right', 'down'].includes(plainKey)) {
      onDirectionChange(plainKey)
    }
  }


  const inputKeys = useMemo(() => {
    return ['p', ...Object.keys(keyboardProfile.keyMap)]
      .map(key => [key, 'ctrl+' + key, 'shift+' + key, 'meta+' + key, 'alt+' + key]).flat()
  }, [keyboardProfile.keyMap])

  return <>
    { /* show the input controls appropriate for the selected profile */}
    {isJoystick ? (
      <div className={`fixed bottom-24 ${joystickPosition === 'left' ? 'left-24' : 'right-24'}`}>
        <ReactNipple
          options={{
            mode: 'static',
            position: { top: '50%', left: '50%' }
          }}
          onMove={onNippleMove}
        />
      </div>
    ) : (
      <KeyboardEventHandler
        handleKeys={inputKeys}
        onKeyEvent={handleKeyDown}
      />
    )}

  </>
}

export default InputControls