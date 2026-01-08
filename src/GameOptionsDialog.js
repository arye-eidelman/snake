import { getAvailableInputTypes } from './utils/deviceDetection'

function GameOptionsDialog({ gameOptions, setGameOption, inputControlsProfiles }) {
  const availableInputs = getAvailableInputTypes(inputControlsProfiles)
  
  // Show error if no input methods available
  if (!availableInputs.hasAny) {
    return (
      <div className="m-4 p-4 bg-red-100 border-2 border-red-500 rounded-md">
        <p className="text-red-800 font-semibold">No input methods available</p>
        <p className="text-red-600 text-sm mt-2">
          Please connect a keyboard or use a touch-enabled device to play.
        </p>
      </div>
    )
  }

  return (
    <div>
      <fieldset className="m-4">
        <label className="m-2 inline-block">Controls:</label>
        
        {/* Keyboard options - only show if keyboard is available */}
        {availableInputs.keyboard.length > 0 && (
          <>
            {availableInputs.keyboard.map(profile => (
              <span key={profile.id} className="m-2">
                <input 
                  type="radio" 
                  id={`inputControls_${profile.id}`} 
                  name="inputControls" 
                  value={profile.id} 
                  checked={gameOptions.inputControls.id === profile.id}
                  onChange={e => setGameOption('inputControls', inputControlsProfiles.find(inputControls => inputControls.id === e.target.value))} 
                />
                <label className="mx-1" htmlFor={`inputControls_${profile.id}`}>
                  {profile.id === 'arrowKeys' ? 'Arrow Keys' : 'asdf Keys'}
                </label>
              </span>
            ))}
          </>
        )}
        
        {/* Joystick options - only show on touch screens */}
        {availableInputs.joystick.length > 0 && (
          <>
            {availableInputs.joystick.map(profile => (
              <span key={profile.id} className="m-2">
                <input 
                  type="radio" 
                  id={`inputControls_${profile.id}`} 
                  name="inputControls" 
                  value={profile.id} 
                  checked={gameOptions.inputControls.id === profile.id}
                  onChange={e => setGameOption('inputControls', inputControlsProfiles.find(inputControls => inputControls.id === e.target.value))} 
                />
                <label className="mx-1" htmlFor={`inputControls_${profile.id}`}>
                  Joystick {profile.position === 'left' ? 'Left' : 'Right'}
                </label>
              </span>
            ))}
          </>
        )}
      </fieldset>

      <fieldset className="m-4">
        <label className="m-2 inline-block">Board Size:</label>
        <span className="m-2">
          <input type="radio" id="boardSize_16" name="boardSize" checked={gameOptions.boardSize === 16} onChange={e => setGameOption('boardSize', 16)} />
          <label className="mx-1" htmlFor="boardSize_16">16</label>
        </span>
        <span className="m-2">
          <input type="radio" id="boardSize_25" name="boardSize" checked={gameOptions.boardSize === 25} onChange={e => setGameOption('boardSize', 25)} />
          <label className="mx-1" htmlFor="boardSize_25">25</label>
        </span>
        <span className="m-2">
          <input type="radio" id="boardSize_50" name="boardSize" checked={gameOptions.boardSize === 50} onChange={e => setGameOption('boardSize', 50)} />
          <label className="mx-1" htmlFor="boardSize_50">50</label>
        </span>
      </fieldset>

      <fieldset className="m-4">
        <label className="m-2 inline-block">Food Quantity:</label>
        <span className="m-2">
          <input type="radio" id="food_4" name="food" checked={gameOptions.foodAmount === 4} onChange={e => setGameOption('foodAmount', 4)} />
          <label className="mx-1" htmlFor="food_4">4</label>
        </span>
        <span className="m-2">
          <input type="radio" id="food_8" name="food" checked={gameOptions.foodAmount === 8} onChange={e => setGameOption('foodAmount', 8)} />
          <label className="mx-1" htmlFor="food_8">8</label>
        </span>
        <span className="m-2">
          <input type="radio" id="food_16" name="food" checked={gameOptions.foodAmount === 16} onChange={e => setGameOption('foodAmount', 16)} />
          <label className="mx-1" htmlFor="food_16">16</label>
        </span>
      </fieldset>

      <fieldset className="m-4">
        <label className="m-2 inline-block">Speed:</label>
        <span className="m-2">
          <input type="radio" id="speed_slow" name="speed" checked={gameOptions.speed === 165} onChange={e => setGameOption('speed', 165)} />
          <label className="mx-1" htmlFor="speed_slow">Slow</label>
        </span>
        <span className="m-2">
          <input type="radio" id="speed_medium" name="speed" checked={gameOptions.speed === 110} onChange={e => setGameOption('speed', 110)} />
          <label className="mx-1" htmlFor="speed_medium">Medium</label>
        </span>
        <span className="m-2">
          <input type="radio" id="speed_fast" name="speed" checked={gameOptions.speed === 75} onChange={e => setGameOption('speed', 75)} />
          <label className="mx-1" htmlFor="speed_fast">Fast</label>
        </span>
      </fieldset>

      <fieldset className="m-4">
        <span className="m-2">
          <input 
            type="checkbox" 
            id="wrapAround" 
            checked={gameOptions.wrapAround || false} 
            onChange={e => setGameOption('wrapAround', e.target.checked)} 
          />
          <label className="mx-1" htmlFor="wrapAround">Wrap Around Walls</label>
        </span>
      </fieldset>
    </div>
  )
}

export default GameOptionsDialog
