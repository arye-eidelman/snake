import { useEffect, useMemo } from 'react'
import _ from 'lodash'
import InputControls from './InputControls'

const VELOCITIES = {
  left: { x: -1, y: 0 },
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  down: { x: 0, y: 1 },
}

function Game({ game, setGame, getRandomEmptyPositions, restart }) {
  const board = useMemo(() => {
    const board = Array(game.boardSize).fill().map(() => Array(game.boardSize).fill({}))
    const { snake, foods } = game
    board[snake.head.y][snake.head.x] = { snake: true, head: true, alive: snake.alive }
    for (const food of foods) {
      board[food.y][food.x] = { food: true }
    }
    for (const limb of snake.body) {
      board[limb.y][limb.x] = { snake: true, body: true, alive: snake.alive }
    }
    return board
  }, [game])

  // moves snakes to next position each game tick
  useEffect(() => {
    const interval = setInterval(() => {
      setGame(game => {
        const { snake, foods, paused } = game
        if (paused) { return game }
        if (!snake.alive) { return game }
        const nextSnake = {
          ...snake,
          head: {
            x: snake.head.x + snake.velocity.x,
            y: snake.head.y + snake.velocity.y
          },
          body: [snake.head, ...snake.body.slice(0, -1)]
        }

        // kill if crashing into self
        for (const limb of nextSnake.body) {
          if (nextSnake.head.x === limb.x && nextSnake.head.y === limb.y) {
            return { ...game, over: true, snake: { ...snake, alive: false } }
          }
        }

        // handle wall collision - wrap around or kill
        if (game.wrapAround) {
          // wrap around walls
          if (nextSnake.head.x < 0) {
            nextSnake.head.x = game.boardSize - 1
          } else if (nextSnake.head.x >= game.boardSize) {
            nextSnake.head.x = 0
          }
          if (nextSnake.head.y < 0) {
            nextSnake.head.y = game.boardSize - 1
          } else if (nextSnake.head.y >= game.boardSize) {
            nextSnake.head.y = 0
          }
        } else {
          // kill if crashing into wall
          if (nextSnake.head.x < 0
            || nextSnake.head.x >= game.boardSize
            || nextSnake.head.y < 0
            || nextSnake.head.y >= game.boardSize
          ) {
            return { ...game, over: true, snake: { ...snake, alive: false } }
          }
        }

        // grow if eating food
        for (const food of foods) {
          if (nextSnake.head.x === food.x && nextSnake.head.y === food.y) {
            return {
              ...game,
              snake: { ...nextSnake, body: [snake.head, ...snake.body] },
              foods: [
                ...foods.filter(food => !_.isEqual(food, nextSnake.head)),
                getRandomEmptyPositions(game.boardSize, [snake.head, ...snake.body, ...foods])[0]
              ]
            }
          }
        }

        // move to next cell
        return { ...game, snake: nextSnake }
      })
    }, game.speed)
    return () => { clearInterval(interval) }
  }, [game.speed, game.paused, game.over, getRandomEmptyPositions, setGame])

  const handleDirectionChange = (direction) => {
    setGame(({ snake, started }) => {
      const velocity = VELOCITIES[direction]
      const xVelocityChange = Math.abs((snake.head.x - snake.body[0].x) - velocity.x)
      const yVelocityChange = Math.abs((snake.head.y - snake.body[0].y) - velocity.y)
      if (!velocity
        || xVelocityChange > 1
        || yVelocityChange > 1
        || (xVelocityChange === 0 && yVelocityChange === 0 && started)
        || (game.paused && game.started)) {
        return game
      }
      return { ...game, snake: { ...snake, velocity }, paused: false, started: true }
    })
  }

  const handlePause = () => {
    setGame(game => ({ ...game, paused: !game.paused, started: true }))
  }

  // tailwind keep: grid-cols-16 grid-cols-25 grid-cols-50
  return (
    <div className="game">
      <InputControls
        onDirectionChange={handleDirectionChange}
        onPause={handlePause}
        keyboardProfile={game.snake.inputControls}
      />
      <div className={`w-[100vmin] h-[100vmin] mx-auto grid grid-cols-${game.boardSize} grid-flow-row bg-gray-900` + ((game.paused && game.started) || game.over ? ' opacity-40' : '')} >
        {board && board.map((row, y) => row.map((cell, x) => {
          let className
          if (cell.food) {
            className = "border-gray-500 bg-yellow-300"
          } else if (cell.snake && cell.alive && cell.body) {
            className = "border-red-900 bg-red-400"
          } else if (cell.snake && cell.alive && cell.head) {
            className = "border-red-900 bg-red-600"
          } else if (cell.snake && !cell.alive && cell.body) {
            className = "border-gray-900 bg-gray-400"
          } else if (cell.snake && !cell.alive && cell.head) {
            className = "border-gray-900 bg-gray-600"
          } else {
            className = "border-gray-700 bg-gray-900"
          }
          return <div key={`${x}-${y}`} className={"border-2 border-opacity-25 " + className}></div>
        }))}
      </div>
    </div>
  )
}

export default Game
