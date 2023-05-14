import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [size, setSize] = useState(15)
  const [field, setField] = useState([])
  const [game_over, setGame_over] = useState(false)
  function click(x, y) {
    if (game_over) {
      return
    }
    let new_field = field.slice()
    for (let i = 0; i < size; i++) {
      if (i == y) {
        for (let j = 0; j < size; j++) {
          if (j == x) {
            if (new_field[i][j].bomb) {
              for (let k = 0; k < size; k++) {
                for (let l = 0; l < size; l++) {
                  new_field[k][l].show = true
                  setGame_over(true)
                }
              }
            } else {
              new_field[i][j].show = true
            }
          }
        }
      }
    }
    setField(new_field)
  }
  function right_click(x, y) {
    if (game_over) {
      return
    }
    let new_field = field.slice()
    for (let i = 0; i < size; i++) {
      if (i == y) {
        for (let j = 0; j < size; j++) {
          if (j == x) {
            if (new_field[i][j].flag) {
              new_field[i][j].show = false
              new_field[i][j].flag = false
            } else {
              new_field[i][j].show = true
              new_field[i][j].flag = true
            }
          }
        }
      }
    }
    setField(new_field)
  }
  useEffect(() => {
    let mines = Math.round(size * 2.5)
    let trial_field = []
    let mines_positions = []
    let mine_position = []
    let mine_X
    let mine_Y
    let str = []
    for (let i = 0; i < mines; i++) {
      mine_X = Math.floor(Math.random() * size)
      mine_Y = Math.floor(Math.random() * size)
      mine_position = [mine_X, mine_Y]
      const hasBombs = mines_positions.findIndex((item) => {
        return item[0] === mine_position[0] && item[1] === mine_position[1]
      })
      if (hasBombs !== -1) {
        i--
      } else {
        mines_positions.push(mine_position)
      }
    }
    for (let i = 0; i < size; i++) {
      str = []
      for (let j = 0; j < size; j++) {
        const hasBombs = mines_positions.findIndex((item) => {
          return item[0] === j && item[1] === i
        })
        if (hasBombs !== -1) {
          str.push({
            X: j,
            Y: i,
            bomb: true,
            show: false,
            flag: false
          })
        } else {
          str.push({
            X: j,
            Y: i,
            bomb: false,
            show: false,
            flag: false,
            bombs_around: false
          })
        }
      }
      trial_field.push(str)
    }
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (!trial_field[i][j].bomb) {
          let bombsAround = 0
          if (i > 0 && j > 0) {
            if (trial_field[i - 1][j - 1].bomb) {
              bombsAround++
            }
          }
          if (i > 0) {
            if (trial_field[i - 1][j].bomb) {
              bombsAround++
            }
          }
          if (j > 0) {
            if (trial_field[i][j - 1].bomb) {
              bombsAround++
            }
          }
          if (i < (size - 1) && j < (size - 1)) {
            if (trial_field[i + 1][j + 1].bomb) {
              bombsAround++
            }
          }
          if (i < (size - 1)) {
            if (trial_field[i + 1][j].bomb) {
              bombsAround++
            }
          }
          if (j < (size - 1)) {
            if (trial_field[i][j + 1].bomb) {
              bombsAround++
            }
          }
          if (i < (size - 1) && j > 0) {
            if (trial_field[i + 1][j - 1].bomb) {
              bombsAround++
            }
          }
          if (i > 0 && j < (size - 1)) {
            if (trial_field[i - 1][j + 1].bomb) {
              bombsAround++
            }
          }
          if (bombsAround == 0) {
            trial_field[i][j].bombs_around = ""
          } else {
            trial_field[i][j].bombs_around = bombsAround
          }
        }
      }
    }
    setField(trial_field)
  }, [])
  const Pole = field.map((row) => {
    return (row.map((cell) => {
      if (cell.flag) {
        return (<div key={cell.X + '-' + cell.Y} onContextMenu={() => right_click(cell.X, cell.Y)} className={`Cell show_${cell.show}`}>
          <img src='https://cdn3.iconfinder.com/data/icons/flatastic-1/256/flag-1024.png'></img>
        </div>)
      } else {
        if (cell.bomb) {
          return (<div key={cell.X + '-' + cell.Y} onContextMenu={() => right_click(cell.X, cell.Y)} onClick={() => click(cell.X, cell.Y)} className={`Cell show_${cell.show}`}>
            <img src='https://www.freeiconspng.com/uploads/bomb-transparent-background-4.png'></img>
          </div>)
        } else {
          return (<div key={cell.X + '-' + cell.Y} onContextMenu={() => right_click(cell.X, cell.Y)} onClick={() => click(cell.X, cell.Y)} className={`Cell show_${cell.show}`}>
            <p>{cell.bombs_around}</p>
          </div>)
        }
      }
    }))
  })
  return (
    <div className="App">
      {Pole}
    </div>
  );
}

export default App;
