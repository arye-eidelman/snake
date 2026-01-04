import { useState } from 'react'
import _ from 'lodash'
import './App.css'
import Game from './Game'
import GameOptionsDialog from './GameOptionsDialog'
import { getAvailableInputTypes } from './utils/deviceDetection'

const INPUT_CONTROLS_PROFILES = [
  { id: 'arrowKeys', keyMap: { left: 'left', up: 'up', right: 'right', down: 'down' }, type: 'keyboard' },
  { id: 'asdfKeys', keyMap: { a: 'left', w: 'up', d: 'right', s: 'down' }, type: 'keyboard' },
  { id: 'joystickLeft', keyMap: {}, type: 'joystick', position: 'left' },
  { id: 'joystickRight', keyMap: {}, type: 'joystick', position: 'right' },
]

function getDefaultInputControl() {
  const availableInputs = getAvailableInputTypes(INPUT_CONTROLS_PROFILES)
  // Prefer keyboard if available, otherwise use first available joystick
  if (availableInputs.keyboard.length > 0) {
    return availableInputs.keyboard[0]
  }
  if (availableInputs.joystick.length > 0) {
    return availableInputs.joystick[0]
  }
  // Fallback to first profile (shouldn't happen if error handling works)
  return INPUT_CONTROLS_PROFILES[0]
}

const BASIC_GAME_OPTIONS = { boardSize: 25, speed: 165, foodAmount: 4, inputControls: getDefaultInputControl() }

function generateNewGame(options) {
  const center = Math.ceil(options.boardSize / 2)
  const snake = {
    head: { x: center - 2, y: center - 1 },
    body: [
      { x: center - 3, y: center - 1 },
      { x: center - 4, y: center - 1 },
      { x: center - 5, y: center - 1 },
      { x: center - 6, y: center - 1 },
    ],
    velocity: { x: 1, y: 0 },
    inputControls: options.inputControls,
    alive: true
  }
  return {
    options: options,
    boardSize: options.boardSize,
    speed: options.speed,
    started: false,
    paused: true,
    over: false,
    foods: getRandomEmptyPositions(options.boardSize, [snake.head, ...snake.body], options.foodAmount),
    foodAmount: options.foodAmount,
    snake: snake,
  }
}
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function isTakenPosition(position, takenPositions) {
  return takenPositions.find(takenPosition => _.isEqual(takenPosition, position))
}

function getRandomPosition(boardSize) {
  return { x: getRandomInt(0, boardSize - 1), y: getRandomInt(0, boardSize - 1) }
}

function getRandomEmptyPositions(boardSize, takenPositions = [], amount = 1) {
  let tempTakenPositions = [...takenPositions]
  let positions = []
  for (let i = 0; i < amount; i++) {
    let position
    do {
      position = getRandomPosition(boardSize)
    } while (isTakenPosition(position, tempTakenPositions))
    tempTakenPositions.push(position)
    positions.push(position)
  }
  return positions
}

function App() {
  const [gameOptions, setGameOptions] = useState(BASIC_GAME_OPTIONS)
  const [game, setGame] = useState()
  const [optionsDialogIsOpen, setOptionsDialogIsOpen] = useState(true)

  const resetGameOptions = () => setGameOptions(BASIC_GAME_OPTIONS)
  const toggleOptionsDialog = () => setOptionsDialogIsOpen(isOpen => !isOpen)
  const startGame = () => { setGame(generateNewGame(gameOptions)) }
  const pauseGame = () => setGame(game => ({ ...game, paused: !game.paused }))
  const setGameOption = (option, value) => setGameOptions(options => ({ ...options, [option]: value }))

  const buttonClassNames = "bg-gray-300 rounded-md px-2 py-1 m-1 transition-colors hover:bg-gray-200 focus:bg-gray-200 outline-none focus:ring-1 focus:ring-gray-800 z-10"

  return (
    <div className="App text-center h-full overflow-hidden">
      <div className="inline-layered h-full w-full lanscape:w-96">

        {(!game || game.over) && <div className="self-center z-10 h-full w-full backdrop-filter backdrop-blur-sm">
          <h3 className="m-4 mt-10 text-4xl font-semibold">
            {game && game.over ? "GAME OVER" : "SNAKE GAME"}
          </h3>
          <div className="m-4">
            {!_.isEqual(gameOptions, BASIC_GAME_OPTIONS) && optionsDialogIsOpen &&
              <button className={buttonClassNames} onClick={resetGameOptions}>Reset</button>
            }
            <button className={buttonClassNames} onClick={toggleOptionsDialog}>Options</button>
            <button className={buttonClassNames + ' text-green-900 bg-green-200 hover:bg-green-100'}
              onClick={startGame}>Start Game</button>
          </div>
          {optionsDialogIsOpen && <GameOptionsDialog
            gameOptions={gameOptions}
            setGameOption={setGameOption}
            inputControlsProfiles={INPUT_CONTROLS_PROFILES}
          />}
        </div>}

        {game && game.paused && !game.over && game.started && <div className="self-center z-10 h-full">
          <h3 className="m-3 text-4xl font-semibold">PAUSED</h3>
          <button className={buttonClassNames + ' text-4xl opacity-60 px-4 py-2'} onClick={pauseGame}>
            Pause/Resume (p)
          </button>
        </div>}

        {game && <Game
          game={game}
          setGame={setGame}
          getRandomEmptyPositions={getRandomEmptyPositions}
        />}
      </div>

    </div>
  )
}

export default App
