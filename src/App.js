import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [size, setSize] = useState(20)
  const [field, setField] = useState([])
  const [game_over, setGame_over] = useState(false)
  const [max_flags, setMax_flags] = useState(62)
  const [flags, setFlags] = useState(0)
  function change_size(event) {
    let new_size = event.target.value
    if (new_size < 5 || new_size > 50) {
      alert("Ширина должна быть от 5 до 50 клеток")
    } else {
      setSize(new_size)
    }
  }
  function click(x, y) {
    if (game_over) {
      return
    }
    let new_field = field.slice()
    if (new_field[y][x].bomb) {
      setGame_over(true)
      alert("Вы проиграли")
      for (let k = 0; k < size; k++) {
        for (let l = 0; l < size; l++) {
          new_field[k][l].show = true
        }
      }
    } else {
      new_field[y][x].show = true
      if (new_field[y][x].bombs_around == "") {
        if (y > 0 && x > 0) {
          if (!new_field[y - 1][x - 1].show) {
            click(x - 1, y - 1)
          }
        }
        if (x < size - 1 && y < size - 1) {
          if (!new_field[y + 1][x + 1].show) {
            click(x + 1, y + 1)
          }
        }
        if (x < size - 1 && y > 0) {
          if (!new_field[y - 1][x + 1].show) {
            click(x + 1, y - 1)
          }
        }
        if (x > 0 && y < size - 1) {
          if (!new_field[y + 1][x - 1].show) {
            click(x - 1, y + 1)
          }
        }
        if (x < size - 1) {
          if (!new_field[y][x + 1].show) {
            click(x + 1, y)
          }
        }
        if (x > 0) {
          if (!new_field[y][x - 1].show) {
            click(x - 1, y)
          }
        }
        if (y < size - 1) {
          if (!new_field[y + 1][x].show) {
            click(x, y + 1)
          }
        }
        if (y > 0) {
          if (!new_field[y - 1][x].show) {
            click(x, y - 1)
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
    if (new_field[y][x].flag) {
      new_field[y][x].show = false
      new_field[y][x].flag = false
      setFlags(flags - 1)
    } else {
      if (flags < max_flags) {
        new_field[y][x].show = true
        new_field[y][x].flag = true
        setFlags(flags + 1)
      }
    }
    setField(new_field)
  }
  useEffect(() => {
    let mines = Math.floor(size * size * 10 / 64)
    setMax_flags(mines)
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
    setFlags(0)
    setGame_over(false)
    setField(trial_field)
  }, [size])
  if (field.length) {
    let n = 0
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (field.length == size && field[i][j].show) {
          n++
        }
      }
    }
    if (n == size * size) {
      if (!game_over) {
        alert("Вы победили")
      }
    }
  }
  const Pole = field.map((row) => {
    return (row.map((cell) => {
      if (cell.flag) {
        return (<div key={cell.X + '-' + cell.Y} style={{ height: 900 / size + "px" }} onContextMenu={() => right_click(cell.X, cell.Y)} className={`Cell show_${cell.show}`}>
          <img src='https://cdn3.iconfinder.com/data/icons/flatastic-1/256/flag-1024.png'></img>
        </div>)
      } else {
        if (cell.bomb) {
          return (<div key={cell.X + '-' + cell.Y} style={{ height: 900 / size + "px" }} onContextMenu={() => right_click(cell.X, cell.Y)} onClick={() => click(cell.X, cell.Y)} className={`Cell show_${cell.show}`}>
            <img src='https://www.freeiconspng.com/uploads/bomb-transparent-background-4.png'></img>
          </div>)
        } else {
          return (<div key={cell.X + '-' + cell.Y} style={{ height: 900 / size + "px" }} onContextMenu={() => right_click(cell.X, cell.Y)} onClick={() => click(cell.X, cell.Y)} className={`Cell show_${cell.show}`}>
            <p>{cell.bombs_around}</p>
          </div>)
        }
      }
    }))
  })
  return (
    <div>
      <input type='number' onChange={change_size} placeholder='Ширина поля от 5 до 50' value={size}></input>
      <div className="App">
        {Pole}
      </div>
    </div>
  );
}

export default App;
