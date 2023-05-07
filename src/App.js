import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [size, setSize] = useState(15)
  const [field, setField] = useState([])
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
            show: false
          })
        } else {
          str.push({
            X: j,
            Y: i,
            bomb: false,
            show: false
          })
        }
      }
      trial_field.push(str)
    }
    setField(trial_field)
  }, [])
  let Pole = field.map(function (row) {
    return (row.map(function (cell) {
        if (cell.bomb) {
          return (<div onClick={() => cell.show = true} className={`Cell show_${cell.show}`}>
            <img src='https://www.freeiconspng.com/uploads/bomb-transparent-background-4.png'></img>
          </div>)
        } else {
          return (<div onClick={() => cell.show = true} className={`Cell show_${cell.show}`}></div>)
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
